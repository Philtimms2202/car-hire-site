'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from '@/context/localeContext'
import { format } from 'date-fns'
import SearchTabs from '@/app/components/search/SearchTabs'

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

type Room = {
  adults: number
  children: number
  ages: number[]
}

export default function HotelSearch() {
  const { language, currency } = useLocale()

  const [query, setQuery] = useState('')
  const [cityResults, setCityResults] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const [rooms, setRooms] = useState<Room[]>([
    { adults: 2, children: 0, ages: [] }
  ])

  const [travellerOpen, setTravellerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)
  const travellerRef = useRef<HTMLDivElement>(null)

  const PID = 'UK.DIRECT.PHG.1011l428377'
  const today = format(new Date(), 'yyyy-MM-dd')

  const supportedCurrency = EXPEDIA_DOMAIN_MAP[currency] ? currency : 'GBP'
  const baseUrl = EXPEDIA_DOMAIN_MAP[supportedCurrency]

  // MOBILE DETECT
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // AUTOCOMPLETE
  useEffect(() => {
    if (!query || selectedCity) return

    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/hotel-cities?q=${query}`)
      const data = await res.json()
      setCityResults(data)
    }, 250)

    return () => clearTimeout(timeout)
  }, [query, selectedCity])

  // CLOSE DROPDOWNS
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

  // AUTO FIX DATES
  useEffect(() => {
    if (!checkIn) return
    if (!checkOut || checkOut < checkIn) {
      setCheckOut(checkIn)
    }
  }, [checkIn])

  // ROOM HANDLERS
  const addRoom = () => {
    if (rooms.length >= 5) return
    setRooms([...rooms, { adults: 1, children: 0, ages: [] }])
  }

  const removeRoom = (index: number) => {
    if (rooms.length === 1) return
    setRooms(rooms.filter((_, i) => i !== index))
  }

  const updateRoom = (index: number, field: 'adults' | 'children', value: number) => {
    setRooms(prev => {
      const copy = [...prev]
      const room = { ...copy[index] }

      if (field === 'children') {
        room.children = value

        // FIX: keep ages array synced properly per room
        const newAges = [...room.ages]

        if (value > newAges.length) {
          while (newAges.length < value) newAges.push(7)
        } else {
          newAges.length = value
        }

        room.ages = newAges
      }

      if (field === 'adults') {
        room.adults = value
      }

      copy[index] = room
      return copy
    })
  }

  const updateChildAge = (roomIndex: number, childIndex: number, age: number) => {
    setRooms(prev => {
      const copy = [...prev]
      const room = { ...copy[roomIndex] }
      const ages = [...room.ages]

      ages[childIndex] = age
      room.ages = ages
      copy[roomIndex] = room

      return copy
    })
  }

  // EXPEDIA BUILDER (FIXED MULTI ROOM FORMAT)
  const handleSearch = () => {
    if (!selectedCity) return

    const params = new URLSearchParams({
      destination: `${selectedCity.name}, ${selectedCity.country}`,
      affcid: PID,
      lang: language,
      rooms: String(rooms.length),
    })

    if (checkIn) {
      params.append('d1', checkIn)
      params.append('startDate', checkIn)
    }

    if (checkOut) {
      params.append('d2', checkOut)
      params.append('endDate', checkOut)
    }

    // IMPORTANT FIX: Expedia expects per-room encoding
    params.append('adults', rooms.map(r => r.adults).join(','))

    const childrenParam = rooms
      .map(r => {
        if (r.children === 0) return '0'
        return `${r.children}_${r.ages.join('_')}`
      })
      .join(',')

    params.append('children', childrenParam)

    const url = `${baseUrl}/Hotel-Search?${params.toString()}`
    window.open(url, '_blank')
  }

  const totalAdults = rooms.reduce((s, r) => s + r.adults, 0)
  const totalChildren = rooms.reduce((s, r) => s + r.children, 0)

  const travellersLabel = `${totalAdults} adult${totalAdults !== 1 ? 's' : ''}${
    totalChildren > 0 ? `, ${totalChildren} child${totalChildren !== 1 ? 'ren' : ''}` : ''
  }, ${rooms.length} room${rooms.length !== 1 ? 's' : ''}`

  const childAgeOptions = [
    { label: 'Under 1', value: 0 },
    ...Array.from({ length: 17 }, (_, i) => ({
      label: String(i + 1),
      value: i + 1,
    })),
  ]

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <div className="w-full max-w-[900px] bg-white shadow-lg rounded-xl p-6 border border-gray-100">

        {/* WHERE TO */}
        <div className="mb-4 relative" ref={resultsRef}>
          <label className="block text-xs font-semibold text-[#022135] mb-1">
            Where to?
          </label>

          <input
            type="text"
            placeholder="City, region, or landmark"
            value={selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedCity(null)
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#03989e]"
          />

          {cityResults.length > 0 && !selectedCity && (
            <div className="absolute z-30 bg-white border rounded-lg mt-1 w-full max-h-60 overflow-y-auto shadow-xl">
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

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* CHECK IN */}
          <div>
            <label className="block text-xs font-semibold text-[#022135] mb-1">
              Check-in
            </label>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
            />
          </div>

          {/* CHECK OUT */}
          <div>
            <label className="block text-xs font-semibold text-[#022135] mb-1">
              Check-out
            </label>
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
            />
          </div>

          {/* TRAVELLERS */}
          <div className="relative" ref={travellerRef}>
            <label className="block text-xs font-semibold text-[#022135] mb-1">
              Travellers
            </label>

            <button
              type="button"
              onClick={() => setTravellerOpen(true)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-left text-sm"
            >
              {travellersLabel}
            </button>

            {travellerOpen && (
              <div className="absolute z-40 mt-2 w-80 bg-white border rounded-xl shadow-xl p-4 right-0">
                {rooms.map((room, i) => (
                  <div key={i} className="mb-4 border-b pb-3">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Room {i + 1}</span>
                      {rooms.length > 1 && (
                        <button
                          onClick={() => removeRoom(i)}
                          className="text-red-500 text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="flex justify-between mb-2">
                      <span>Adults</span>
                      <div className="flex gap-2">
                        <button onClick={() => updateRoom(i, 'adults', Math.max(1, room.adults - 1))}>-</button>
                        {room.adults}
                        <button onClick={() => updateRoom(i, 'adults', room.adults + 1)}>+</button>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span>Children</span>
                      <div className="flex gap-2">
                        <button onClick={() => updateRoom(i, 'children', Math.max(0, room.children - 1))}>-</button>
                        {room.children}
                        <button onClick={() => updateRoom(i, 'children', room.children + 1)}>+</button>
                      </div>
                    </div>

                    {room.children > 0 && (
                      <div className="mt-2 space-y-1">
                        {room.ages.map((age, ci) => (
                          <select
  value={age}
  onChange={(e) => updateChildAge(index, childIndex, Number(e.target.value))}
  className="
    w-24 px-3 py-2
    text-sm font-medium text-[#022135]
    bg-white
    border border-gray-200
    rounded-lg
    shadow-sm
    focus:outline-none
    focus:ring-2 focus:ring-[#03989e]
    focus:border-[#03989e]
    transition
  "
>
  {childAgeOptions.map((opt) => (
    <option key={opt.value} value={opt.value}>
      {opt.label}
    </option>
  ))}
</select>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {rooms.length < 5 && (
                  <button
                    onClick={addRoom}
                    className="text-[#03989e] text-sm"
                  >
                    + Add room
                  </button>
                )}

                <button
                  onClick={() => setTravellerOpen(false)}
                  className="w-full mt-3 bg-[#03989e] text-white py-2 rounded-lg"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* SEARCH */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-[#03989e] text-white px-6 py-3 rounded-lg"
            >
              Search hotels
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}