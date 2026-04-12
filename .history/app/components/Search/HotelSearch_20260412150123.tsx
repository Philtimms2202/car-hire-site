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
    { adults: 2, children: 0 }
  ])

  const [travellerOpen, setTravellerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)
  const travellerRef = useRef<HTMLDivElement>(null)

  const PID = 'UK.DIRECT.PHG.1011l428377'
  const today = format(new Date(), 'yyyy-MM-dd')

  const supportedCurrency = EXPEDIA_DOMAIN_MAP[currency] ? currency : 'GBP'
  const baseUrl = EXPEDIA_DOMAIN_MAP[supportedCurrency]

  // Mobile detect
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

  // Room controls
  const addRoom = () => {
    if (rooms.length >= 5) return
    setRooms([...rooms, { adults: 1, children: 0 }])
  }

  const removeRoom = (index: number) => {
    if (rooms.length === 1) return
    setRooms(rooms.filter((_, i) => i !== index))
  }

  const updateRoom = (index: number, field: 'adults' | 'children', value: number) => {
    const updated = [...rooms]
    updated[index][field] = value
    setRooms(updated)
  }

  // ✅ FIXED EXPEDIA LINK
const handleSearch = () => {
  if (!selectedCity) return

  const params = new URLSearchParams({
    destination: `${selectedCity.name}, ${selectedCity.country}`,
    affcid: PID,
    lang: language,
  })

  if (checkIn) {
    params.append('d1', checkIn)
    params.append('startDate', checkIn)
  }

  if (checkOut) {
    params.append('d2', checkOut)
    params.append('endDate', checkOut)
  }

  // ✅ NEW APPROACH — room-based params (MOST RELIABLE)
  rooms.forEach((room, i) => {
    const roomIndex = i + 1

    params.append(`rm${roomIndex}`, `${room.adults}-${room.children}`)
  })

  params.append('rooms', String(rooms.length))

  const url = `${baseUrl}/Hotel-Search?${params.toString()}`
  console.log('Expedia URL:', url)

  window.open(url, '_blank')
}

  const totalAdults = rooms.reduce((sum, r) => sum + r.adults, 0)
  const totalChildren = rooms.reduce((sum, r) => sum + r.children, 0)

  const travellersLabel = `${totalAdults} adult${totalAdults !== 1 ? 's' : ''}${
    totalChildren > 0 ? `, ${totalChildren} child${totalChildren !== 1 ? 'ren' : ''}` : ''
  }, ${rooms.length} room${rooms.length !== 1 ? 's' : ''}`

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <div className="w-full max-w-[900px] bg-white shadow-lg rounded-xl p-6 border border-gray-100">

        {/* WHERE TO */}
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
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
          />

          {cityResults.length > 0 && !selectedCity && (
            <div className="absolute z-20 bg-white border rounded-lg mt-1 w-full shadow-xl">
              {cityResults.map((c) => (
                <div
                  key={c.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
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

        {/* ROW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div>
            <label className="text-xs font-semibold text-[#022135]">Check-in</label>
            <input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full border rounded-lg px-4 py-3 text-sm" />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#022135]">Check-out</label>
            <input type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full border rounded-lg px-4 py-3 text-sm" />
          </div>

          <div className="relative" ref={travellerRef}>
            <label className="text-xs font-semibold text-[#022135]">Travellers</label>
            <button onClick={() => setTravellerOpen(true)} className="w-full border rounded-lg px-4 py-3 text-left text-sm">
              {travellersLabel}
            </button>

            {!isMobile && travellerOpen && (
              <div className="absolute z-30 mt-2 w-80 bg-white border rounded-xl shadow-xl p-4 right-0">
                {rooms.map((room, index) => (
                  <div key={index} className="mb-4 border-b pb-3">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Room {index + 1}</span>
                      {rooms.length > 1 && (
                        <button onClick={() => removeRoom(index)} className="text-red-500 text-xs">Remove</button>
                      )}
                    </div>

                    {/* Adults */}
                    <div className="flex justify-between mb-2">
                      <span>Adults</span>
                      <div className="flex gap-2">
                        <button onClick={() => updateRoom(index, 'adults', Math.max(1, room.adults - 1))}>-</button>
                        <span>{room.adults}</span>
                        <button onClick={() => updateRoom(index, 'adults', room.adults + 1)}>+</button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex justify-between">
                      <span>Children</span>
                      <div className="flex gap-2">
                        <button onClick={() => updateRoom(index, 'children', Math.max(0, room.children - 1))}>-</button>
                        <span>{room.children}</span>
                        <button onClick={() => updateRoom(index, 'children', Math.min(6, room.children + 1))}>+</button>
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={addRoom} className="text-[#03989e] text-sm mb-3">+ Add room</button>

                <button onClick={() => setTravellerOpen(false)} className="w-full bg-[#03989e] text-white py-2 rounded-lg">
                  Done
                </button>
              </div>
            )}
          </div>

          <div className="flex items-end">
            <button onClick={handleSearch} className="w-full bg-[#03989e] text-white py-3 rounded-lg">
              Search hotels
            </button>
          </div>
        </div>

        {/* ✅ UX NOTE */}
        <p className="text-xs text-gray-500 mt-3">
          Child ages can be selected on the next page.
        </p>

      </div>
    </div>
  )
}