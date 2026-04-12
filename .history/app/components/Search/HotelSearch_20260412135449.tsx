'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from '@/context/localeContext'
import { format } from 'date-fns'

interface City {
  name: string
  country: string
  id: string
}

const EXPEDIA_DOMAIN_MAP: Record<string, string> = {
  GBP: 'https://www.expedia.co.uk',
  USD: 'https://www.expedia.com',
  EUR: 'https://www.expedia.de',
  AUD: 'https://www.expedia.com.au',
  CAD: 'https://www.expedia.ca',
  NZD: 'https://www.expedia.co.nz',
  SGD: 'https://www.expedia.com.sg',
  JPY: 'https://www.expedia.co.jp',
}

export default function HotelSearch() {
  const { language, currency } = useLocale()

  const [query, setQuery] = useState('')
  const [cityResults, setCityResults] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const [rooms, setRooms] = useState([
    { adults: 2, children: 0, ages: [] as number[] }
  ])

  const [travellerOpen, setTravellerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)
  const travellerRef = useRef<HTMLDivElement>(null)

  const PID = 'UK.DIRECT.PHG.1011l428377'
  const today = format(new Date(), 'yyyy-MM-dd')

  const supportedCurrency = EXPEDIA_DOMAIN_MAP[currency] ? currency : 'GBP'
  const baseUrl = EXPEDIA_DOMAIN_MAP[supportedCurrency]

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Autocomplete
  useEffect(() => {
    if (!query || selectedCity) return

    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/hotel-cities?q=${query}`)
      const data = await res.json()
      setCityResults(data)
    }, 250)

    return () => clearTimeout(timeout)
  }, [query, selectedCity])

  // Close dropdowns
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target as Node)) {
        setCityResults([])
      }
      if (!isMobile && travellerRef.current && !travellerRef.current.contains(e.target as Node)) {
        setTravellerOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isMobile])

  // Auto-fix checkout
  useEffect(() => {
    if (!checkIn) return
    if (!checkOut || checkOut < checkIn) {
      setCheckOut(checkIn)
    }
  }, [checkIn])

  // Add room
  const addRoom = () => {
    if (rooms.length >= 5) return
    setRooms([...rooms, { adults: 1, children: 0, ages: [] }])
  }

  // Remove room
  const removeRoom = (index: number) => {
    if (rooms.length === 1) return
    setRooms(rooms.filter((_, i) => i !== index))
  }

  // Update room adults/children
  const updateRoom = (index: number, field: 'adults' | 'children', value: number) => {
    const updated = [...rooms]
    updated[index][field] = value

    if (field === 'children') {
      const diff = value - updated[index].ages.length
      if (diff > 0) {
        updated[index].ages.push(...Array(diff).fill(5))
      } else if (diff < 0) {
        updated[index].ages.length = value
      }
    }

    setRooms(updated)
  }

  const updateChildAge = (roomIndex: number, childIndex: number, age: number) => {
    const updated = [...rooms]
    updated[roomIndex].ages[childIndex] = age
    setRooms(updated)
  }

// FINAL EXPEDIA UK DEEP LINK BUILDER
const handleSearch = () => {
  if (!selectedCity) return

  const params = new URLSearchParams({
    destination: `${selectedCity.name}, ${selectedCity.country}`,
    affcid: PID,
    lang: language,
    rooms: rooms.length.toString(),
  })

  // Dates
  if (checkIn) {
    params.append('d1', checkIn)
    params.append('startDate', checkIn)
  }
  if (checkOut) {
    params.append('d2', checkOut)
    params.append('endDate', checkOut)
  }

  // --- TRAVELLER PARAMS (EXPEDIA UK FORMAT — RELIABLE) ---

 // Adults (comma-separated)
params.append(
  "adults",
  rooms.map(r => r.adults).join(",")
)

// Children (underscore-separated)
params.append(
  "children",
  rooms.map(r => r.children).join("_")
)

// Expedia UK requires at least childAge1 if children > 0
const firstRoomWithChildren = rooms.find(r => r.children > 0)
if (firstRoomWithChildren && firstRoomWithChildren.ages.length > 0) {
  params.append("childAge1", String(firstRoomWithChildren.ages[0]))
}

// Number of rooms
params.append("rooms", String(rooms.length))

// Build URL + open
const url = `${baseUrl}/Hotel-Search?${params.toString()}`
console.log('Expedia URL:', url)
window.open(url, '_blank')


// --- TRAVELLER LABELS ---

const totalAdults = rooms.reduce((sum, r) => sum + r.adults, 0)
const totalChildren = rooms.reduce((sum, r) => sum + r.children, 0)

const travellersLabel = `${totalAdults} adult${totalAdults !== 1 ? 's' : ''}${
  totalChildren > 0 ? `, ${totalChildren} child${totalChildren !== 1 ? 'ren' : ''}` : ''
}, ${rooms.length} room${rooms.length !== 1 ? 's' : ''}`

const childAgeOptions = [
  { label: 'Under 1', value: 0 },
  ...Array.from({ length: 17 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 })),
]

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <div className="w-full max-w-[900px] bg-white shadow-lg rounded-xl p-6 border border-gray-100">

        {/* WHERE TO — FULL WIDTH */}
        <div className="mb-4 relative" ref={resultsRef}>
          <label className="block text-xs font-semibold text-[#022135] mb-1">Where to?</label>
          <input
            type="text"
            placeholder="City, region, or landmark"
            value={selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedCity(null)
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#03989e] focus:border-[#03989e] transition"
          />

          {cityResults.length > 0 && !selectedCity && (
            <div className="absolute z-20 bg-white border rounded-lg mt-1 w-full max-h-60 overflow-y-auto shadow-xl">
              {cityResults.map((c) => (
                <div
                  key={c.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition text-sm"
                  onClick={() => {
                    setSelectedCity(c)
                    setCityResults([])
                  }}
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-gray-500">, {c.country}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECOND ROW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* CHECK-IN */}
          <div>
            <label className="block text-xs font-semibold text-[#022135] mb-1">Check-in</label>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#03989e] focus:border-[#03989e] transition"
            />
          </div>

          {/* CHECK-OUT */}
          <div>
            <label className="block text-xs font-semibold text-[#022135] mb-1">Check-out</label>
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#03989e] focus:border-[#03989e] transition"
            />
          </div>

          {/* TRAVELLERS */}
          <div className="relative" ref={travellerRef}>
            <label className="block text-xs font-semibold text-[#022135] mb-1">Travellers</label>
            <button
              type="button"
              onClick={() => setTravellerOpen(true)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-left text-sm flex justify-between items-center focus:ring-2 focus:ring-[#03989e] focus:border-[#03989e] transition"
            >
              <span>{travellersLabel}</span>
              <span className="text-gray-500 text-xs">Edit</span>
            </button>

            {/* DESKTOP POPOVER */}
            {!isMobile && travellerOpen && (
              <div className="absolute z-30 mt-2 w-80 bg-white border rounded-xl shadow-xl p-4 text-sm right-0">
                {rooms.map((room, index) => (
                  <div key={index} className="mb-4 border-b pb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-[#022135]">Room {index + 1}</span>
                      {rooms.length > 1 && (
                        <button
                          onClick={() => removeRoom(index)}
                          className="text-red-500 text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Adults */}
                    <div className="flex items-center justify-between mb-3">
                      <span>Adults</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateRoom(index, 'adults', Math.max(1, room.adults - 1))}
                          className="w-7 h-7 border rounded-full flex items-center justify-center"
                        >-</button>
                        <span>{room.adults}</span>
                        <button
                          onClick={() => updateRoom(index, 'adults', room.adults + 1)}
                          className="w-7 h-7 border rounded-full flex items-center justify-center"
                        >+</button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between mb-3">
                      <span>Children</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateRoom(index, 'children', Math.max(0, room.children - 1))}
                          className="w-7 h-7 border rounded-full flex items-center justify-center"
                        >-</button>
                        <span>{room.children}</span>
                        <button
                          onClick={() => updateRoom(index, 'children', Math.min(6, room.children + 1))}
                          className="w-7 h-7 border rounded-full flex items-center justify-center"
                        >+</button>
                      </div>
                    </div>

                    {/* Child ages */}
                    {room.children > 0 && (
                      <div className="space-y-2">
                        {room.ages.map((age, childIndex) => (
                          <div key={childIndex} className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Child {childIndex + 1} age</span>
                            <select
                              value={age}
                              onChange={(e) => updateChildAge(index, childIndex, Number(e.target.value))}
                              className="border border-gray-300 rounded-lg px-2 py-1 text-xs"
                            >
                              {childAgeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add room */}
                {rooms.length < 5 && (
                  <button
                    onClick={addRoom}
                    className="text-[#03989e] font-medium text-sm mb-3"
                  >
                    + Add room
                  </button>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setTravellerOpen(false)}
                    className="bg-[#03989e] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#027b82] transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SEARCH BUTTON */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-[#03989e] text-white px-6 py-3 rounded-lg hover:bg-[#027b82] transition shadow-sm text-sm font-medium"
            >
              Search hotels
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET */}
      {isMobile && travellerOpen && (
        <div className="fixed inset-0 z-40">
          {/* Dimmed background */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setTravellerOpen(false)}
          />

          {/* Bottom sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl p-6 max-h-[80vh] overflow-y-auto transition-transform duration-300">
            <h3 className="text-lg font-semibold text-[#022135] mb-4">Travellers & Rooms</h3>

            {rooms.map((room, index) => (
              <div key={index} className="mb-6 border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#022135]">Room {index + 1}</span>
                  {rooms.length > 1 && (
                    <button
                      onClick={() => removeRoom(index)}
                      className="text-red-500 text-xs"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Adults */}
                <div className="flex items-center justify-between mb-4">
                  <span>Adults</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateRoom(index, 'adults', Math.max(1, room.adults - 1))}
                      className="w-8 h-8 border rounded-full flex items-center justify-center"
                    >-</button>
                    <span>{room.adults}</span>
                    <button
                      onClick={() => updateRoom(index, 'adults', room.adults + 1)}
                      className="w-8 h-8 border rounded-full flex items-center justify-center"
                    >+</button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between mb-4">
                  <span>Children</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateRoom(index, 'children', Math.max(0, room.children - 1))}
                      className="w-8 h-8 border rounded-full flex items-center justify-center"
                    >-</button>
                    <span>{room.children}</span>
                    <button
                      onClick={() => updateRoom(index, 'children', Math.min(6, room.children + 1))}
                      className="w-8 h-8 border rounded-full flex items-center justify-center"
                    >+</button>
                  </div>
                </div>

                {/* Child ages */}
                {room.children > 0 && (
                  <div className="space-y-3">
                    {room.ages.map((age, childIndex) => (
                      <div key={childIndex} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Child {childIndex + 1} age</span>
                        <select
                          value={age}
                          onChange={(e) => updateChildAge(index, childIndex, Number(e.target.value))}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                          {childAgeOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Add room */}
            {rooms.length < 5 && (
              <button
                onClick={addRoom}
                className="text-[#03989e] font-medium text-sm mb-6"
              >
                + Add room
              </button>
            )}

            {/* Sticky Done button */}
            <div className="sticky bottom-0 bg-white pt-4 pb-2">
              <button
                onClick={() => setTravellerOpen(false)}
                className="w-full bg-[#03989e] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#027b82] transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
