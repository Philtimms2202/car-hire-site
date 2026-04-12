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

type Room = {
  adults: number
  children: number[]
}

export default function HotelSearch() {
  const { language, currency } = useLocale()

  const [query, setQuery] = useState('')
  const [cityResults, setCityResults] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const [rooms, setRooms] = useState<Room[]>([
    { adults: 2, children: [] }
  ])

  const [travellerOpen, setTravellerOpen] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)
  const travellerRef = useRef<HTMLDivElement>(null)

  const PID = 'UK.DIRECT.PHG.1011l428377'
  const today = format(new Date(), 'yyyy-MM-dd')

  const baseUrl = EXPEDIA_DOMAIN_MAP[currency] || EXPEDIA_DOMAIN_MAP.GBP

  /* ---------------- CITY SEARCH ---------------- */

  useEffect(() => {
    if (!query || selectedCity) return

    const t = setTimeout(async () => {
      const res = await fetch(`/api/hotel-cities?q=${query}`)
      const data = await res.json()
      setCityResults(data)
    }, 250)

    return () => clearTimeout(t)
  }, [query, selectedCity])

  /* ---------------- ROOM LOGIC ---------------- */

  const addRoom = () => {
    if (rooms.length >= 5) return
    setRooms([...rooms, { adults: 2, children: [] }])
  }

  const removeRoom = (index: number) => {
    if (rooms.length === 1) return
    setRooms(rooms.filter((_, i) => i !== index))
  }

  const updateAdults = (index: number, value: number) => {
    const copy = [...rooms]
    copy[index].adults = Math.max(1, value)
    setRooms(copy)
  }

  const addChild = (index: number) => {
    const copy = [...rooms]
    if (copy[index].children.length < 2) {
      copy[index].children.push(7)
    }
    setRooms(copy)
  }

  const removeChild = (index: number) => {
    const copy = [...rooms]
    copy[index].children.pop()
    setRooms(copy)
  }

  const updateChildAge = (roomIndex: number, childIndex: number, age: number) => {
    const copy = [...rooms]
    copy[roomIndex].children[childIndex] = age
    setRooms(copy)
  }

  /* ---------------- EXPEDIA FIX ---------------- */

  const handleSearch = () => {
    if (!selectedCity) return

    const params = new URLSearchParams({
      destination: `${selectedCity.name}, ${selectedCity.country}`,
      affcid: PID,
      lang: language,
      sort: 'RECOMMENDED'
    })

    if (checkIn) {
      params.append('d1', checkIn)
      params.append('startDate', checkIn)
    }

    if (checkOut) {
      params.append('d2', checkOut)
      params.append('endDate', checkOut)
    }

    // Adults per room
    params.append(
      'adults',
      rooms.map(r => r.adults).join(',')
    )

    // FIXED children format (stable Expedia format)
    const childrenParam = rooms
      .map(room =>
        room.children.length > 0
          ? `${room.children.length}_${room.children.join('_')}`
          : '0'
      )
      .join(',')

    params.append('children', childrenParam)
    params.append('rooms', String(rooms.length))

    const url = `${baseUrl}/Hotel-Search?${params.toString()}`
    window.open(url, '_blank')
  }

  /* ---------------- UI LABEL ---------------- */

  const totalAdults = rooms.reduce((s, r) => s + r.adults, 0)
  const totalChildren = rooms.reduce((s, r) => s + r.children.length, 0)

  const label =
    `${totalAdults} adult${totalAdults !== 1 ? 's' : ''}` +
    (totalChildren ? `, ${totalChildren} child${totalChildren !== 1 ? 'ren' : ''}` : '') +
    `, ${rooms.length} room${rooms.length !== 1 ? 's' : ''}`

  /* ---------------- UI (UNCHANGED STRUCTURE) ---------------- */

  return (
    <div className="w-full max-w-[900px] bg-white shadow-lg rounded-xl p-6">

      {/* CITY */}
      <div ref={resultsRef} className="relative mb-4">
        <input
          value={selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedCity(null)
          }}
          placeholder="Where to?"
          className="w-full border rounded-lg px-4 py-3"
        />

        {cityResults.length > 0 && !selectedCity && (
          <div className="absolute bg-white border w-full mt-1 rounded-lg z-30">
            {cityResults.map(c => (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedCity(c)
                  setCityResults([])
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {c.name}, {c.country}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DATES */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="border p-3 rounded-lg" />
        <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="border p-3 rounded-lg" />
      </div>

      {/* ROOMS */}
      <div ref={travellerRef}>
        <button
          onClick={() => setTravellerOpen(!travellerOpen)}
          className="w-full border rounded-lg px-4 py-3 text-left"
        >
          {label}
        </button>

        {travellerOpen && (
          <div className="mt-3 border rounded-lg p-4 space-y-4">

            {rooms.map((room, i) => (
              <div key={i} className="border-b pb-3">

                <div className="flex justify-between">
                  <strong>Room {i + 1}</strong>
                  {rooms.length > 1 && (
                    <button onClick={() => removeRoom(i)}>Remove</button>
                  )}
                </div>

                {/* adults */}
                <div className="flex justify-between mt-2">
                  Adults
                  <div>
                    <button onClick={() => updateAdults(i, room.adults - 1)}>-</button>
                    <span className="mx-2">{room.adults}</span>
                    <button onClick={() => updateAdults(i, room.adults + 1)}>+</button>
                  </div>
                </div>

                {/* children */}
                <div className="mt-2">
                  <div className="flex justify-between">
                    Children
                    <button onClick={() => addChild(i)}>+ Add</button>
                  </div>

                  {room.children.map((age, ci) => (
                    <select
                      key={ci}
                      value={age}
                      onChange={(e) =>
                        updateChildAge(i, ci, Number(e.target.value))
                      }
                      className="mt-2 w-full border rounded p-2"
                    >
                      {Array.from({ length: 17 }, (_, n) => (
                        <option key={n} value={n}>
                          Child {ci + 1} age {n}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>

              </div>
            ))}

            <button onClick={addRoom} className="text-blue-600">
              + Add room
            </button>
          </div>
        )}
      </div>

      {/* SEARCH */}
      <button
        onClick={handleSearch}
        className="w-full mt-4 bg-teal-600 text-white py-3 rounded-lg"
      >
        Search hotels
      </button>

    </div>
  )
}