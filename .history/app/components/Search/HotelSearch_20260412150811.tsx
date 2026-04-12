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

  const baseUrl =
    EXPEDIA_DOMAIN_MAP[currency] || EXPEDIA_DOMAIN_MAP.GBP

  // mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // autocomplete
  useEffect(() => {
    if (!query || selectedCity) return

    const t = setTimeout(async () => {
      const res = await fetch(`/api/hotel-cities?q=${query}`)
      const data = await res.json()
      setCityResults(data)
    }, 250)

    return () => clearTimeout(t)
  }, [query, selectedCity])

  // close dropdowns
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

  // checkout fix
  useEffect(() => {
    if (!checkIn) return
    if (!checkOut || checkOut < checkIn) {
      setCheckOut(checkIn)
    }
  }, [checkIn])

  // room controls
  const addRoom = () => {
    if (rooms.length >= 5) return
    setRooms([...rooms, { adults: 1, children: 0 }])
  }

  const removeRoom = (index: number) => {
    if (rooms.length === 1) return
    setRooms(rooms.filter((_, i) => i !== index))
  }

  const updateRoom = (
    index: number,
    field: 'adults' | 'children',
    value: number
  ) => {
    const updated = [...rooms]
    updated[index][field] = value
    setRooms(updated)
  }

  // ✅ EXPEDIA FIXED BUILDER
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

    // adults per room
    params.append(
      'adults',
      rooms.map(r => r.adults).join(',')
    )

    // ✅ CRITICAL FIX: stable room-by-room encoding
    const childrenParam = rooms
      .map(room => {
        if (room.children === 0) return '0_0'

        const ages = Array(room.children).fill(7).join('_')
        return `${room.children}_${ages}`
      })
      .join(',')

    params.append('children', childrenParam)

    params.append('rooms', String(rooms.length))
    params.append('sort', 'RECOMMENDED')

    const url = `${baseUrl}/Hotel-Search?${params.toString()}`
    console.log('Expedia URL:', url)

    window.open(url, '_blank')
  }

  // label
  const totalAdults = rooms.reduce((s, r) => s + r.adults, 0)
  const totalChildren = rooms.reduce((s, r) => s + r.children, 0)

  const label = `${totalAdults} adult${totalAdults !== 1 ? 's' : ''}${
    totalChildren > 0 ? `, ${totalChildren} child${totalChildren !== 1 ? 'ren' : ''}` : ''
  }, ${rooms.length} room${rooms.length !== 1 ? 's' : ''}`

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <div className="w-full max-w-[900px] bg-white shadow-lg rounded-xl p-6 border">

        {/* destination */}
        <div className="mb-4 relative" ref={resultsRef}>
          <input
            className="w-full border rounded-lg px-4 py-3 text-sm"
            placeholder="City, region or landmark"
            value={
              selectedCity
                ? `${selectedCity.name}, ${selectedCity.country}`
                : query
            }
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedCity(null)
            }}
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
                  {c.name}, {c.country}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border rounded-lg px-4 py-3 text-sm"
          />

          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="border rounded-lg px-4 py-3 text-sm"
          />

          {/* travellers */}
          <div className="relative" ref={travellerRef}>
            <button
              onClick={() => setTravellerOpen(true)}
              className="w-full border rounded-lg px-4 py-3 text-left text-sm"
            >
              {label}
            </button>

            {!isMobile && travellerOpen && (
              <div className="absolute z-30 mt-2 w-80 bg-white border rounded-xl shadow-xl p-4 right-0">
                {rooms.map((room, i) => (
                  <div key={i} className="mb-4 border-b pb-3">

                    <div className="flex justify-between mb-2">
                      <span>Room {i + 1}</span>
                      {rooms.length > 1 && (
                        <button
                          onClick={() => removeRoom(i)}
                          className="text-red-500 text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <span>Adults</span>
                      <div className="flex gap-2">
                        <button onClick={() => updateRoom(i,'adults',Math.max(1,room.adults-1))}>-</button>
                        <span>{room.adults}</span>
                        <button onClick={() => updateRoom(i,'adults',room.adults+1)}>+</button>
                      </div>
                    </div>

                    <div className="flex justify-between mt-2">
                      <span>Children</span>
                      <div className="flex gap-2">
                        <button onClick={() => updateRoom(i,'children',Math.max(0,room.children-1))}>-</button>
                        <span>{room.children}</span>
                        <button onClick={() => updateRoom(i,'children',Math.min(6,room.children+1))}>+</button>
                      </div>
                    </div>

                  </div>
                ))}

                <button onClick={addRoom} className="text-[#03989e] text-sm mb-3">
                  + Add room
                </button>

                <button
                  onClick={() => setTravellerOpen(false)}
                  className="w-full bg-[#03989e] text-white py-2 rounded-lg"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="bg-[#03989e] text-white rounded-lg px-4 py-3"
          >
            Search hotels
          </button>

        </div>

        <p className="text-xs text-gray-500 mt-3">
          Child ages will be confirmed on the next page.
        </p>

      </div>
    </div>
  )
}