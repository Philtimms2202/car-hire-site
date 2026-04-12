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

type Tab = 'hotels' | 'flights' | 'cars' | 'experiences'

export default function SearchWidget() {
  const { language, currency } = useLocale()

  const [tab, setTab] = useState<Tab>('hotels')

  const [query, setQuery] = useState('')
  const [cityResults, setCityResults] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const [rooms, setRooms] = useState([
    { adults: 2, children: 0, ages: [] as number[] }
  ])

  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const PID = 'UK.DIRECT.PHG.1011l428377'
  const today = format(new Date(), 'yyyy-MM-dd')

  const baseUrl =
    EXPEDIA_DOMAIN_MAP[currency] || EXPEDIA_DOMAIN_MAP.GBP

  const ref = useRef<HTMLDivElement>(null)

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

  const addRoom = () => {
    if (rooms.length >= 5) return
    setRooms([...rooms, { adults: 1, children: 0, ages: [] }])
  }

  const updateRoom = (i: number, field: 'adults' | 'children', value: number) => {
    const copy = [...rooms]
    copy[i][field] = value

    if (field === 'children') {
      const diff = value - copy[i].ages.length
      if (diff > 0) {
        copy[i].ages.push(...Array(diff).fill(7))
      } else {
        copy[i].ages.length = value
      }
    }

    setRooms(copy)
  }

  // ✅ CORRECT Expedia builder (this is the only reliable format)
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

    // ✅ FIXED children format (THIS is the working Expedia format)
    const childrenParam = rooms
      .map(room => {
        if (room.children === 0) return '0'
        return `${room.children}_${room.ages.map(a => a || 7).join('_')}`
      })
      .join(',')

    params.append('children', childrenParam)

    params.append('rooms', String(rooms.length))

    const url = `${baseUrl}/Hotel-Search?${params.toString()}`
    window.open(url, '_blank')
  }

  const totalAdults = rooms.reduce((s, r) => s + r.adults, 0)
  const totalChildren = rooms.reduce((s, r) => s + r.children, 0)

  const label = `${totalAdults} adult${totalAdults !== 1 ? 's' : ''}${
    totalChildren ? `, ${totalChildren} child${totalChildren !== 1 ? 'ren' : ''}` : ''
  }, ${rooms.length} room${rooms.length !== 1 ? 's' : ''}`

  return (
    <div className="w-full flex justify-center px-4 py-6">

      <div className="w-full max-w-[900px] bg-white shadow-lg rounded-xl p-6">

        {/* 🔥 TABS (RESTORED) */}
        <div className="flex gap-4 mb-4 border-b pb-2 text-sm font-medium">
          <button onClick={() => setTab('flights')}>Flights</button>
          <button onClick={() => setTab('hotels')}>Hotels</button>
          <button onClick={() => setTab('cars')}>Car hire</button>
          <button onClick={() => setTab('experiences')}>Things to do</button>
        </div>

        {/* ONLY HOTELS ACTIVE */}
        {tab === 'hotels' && (
          <>
            {/* destination */}
            <div className="relative mb-4" ref={ref}>
              <input
                className="w-full border rounded-lg px-4 py-3 text-sm"
                placeholder="City or hotel"
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
            </div>

            {/* dates + travellers */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <input type="date" min={today} value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="border rounded-lg px-4 py-3 text-sm"
              />

              <input type="date" min={checkIn || today} value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="border rounded-lg px-4 py-3 text-sm"
              />

              <div className="border rounded-lg px-4 py-3 text-sm">
                {label}
              </div>

              <button
                onClick={handleSearch}
                className="bg-[#03989e] text-white rounded-lg px-4 py-3"
              >
                Search
              </button>
            </div>

          </>
        )}

      </div>
    </div>
  )
}