'use client'

import { useState, useEffect, useRef } from 'react'
import { useLocale } from '@/context/localeContext'

type Airport = {
  name: string
  city: string
  country: string
  iata_code: string
}

export default function FlightSearch() {
  const { language, currency } = useLocale()

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [depart, setDepart] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [roundTrip, setRoundTrip] = useState(true)

  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [cabin, setCabin] = useState('economy')
  const [travellerOpen, setTravellerOpen] = useState(false)

  const [fromResults, setFromResults] = useState<Airport[]>([])
  const [toResults, setToResults] = useState<Airport[]>([])

  const selectedFromRef = useRef<Airport | null>(null)
  const selectedToRef = useRef<Airport | null>(null)
  const travellerRef = useRef<HTMLDivElement>(null)

  const today = new Date().toISOString().split('T')[0]

  // close traveller dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (travellerRef.current && !travellerRef.current.contains(e.target as Node)) {
        setTravellerOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const debounce = (fn: (...args: any[]) => void, delay = 300) => {
    let timer: any
    return (...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  }

  const fetchAirports = async (query: string, setter: (data: Airport[]) => void) => {
    if (!query || query.length < 2) return setter([])
    const res = await fetch(`/api/airports?q=${encodeURIComponent(query)}`)
    const data = await res.json()
    setter(data)
  }

  const debouncedFromSearch = debounce((q: string) => fetchAirports(q, setFromResults))
  const debouncedToSearch = debounce((q: string) => fetchAirports(q, setToResults))

  useEffect(() => { debouncedFromSearch(from) }, [from])
  useEffect(() => { debouncedToSearch(to) }, [to])

  const formatDate = (dateStr: string) => {
    // YYYY-MM-DD -> DDMMYY
    const [y, m, d] = dateStr.split('-')
    return `${d}${m}${y.slice(-2)}`
  }

  const buildFlightSearchCode = () => {
    const fromCode = selectedFromRef.current?.iata_code
    const toCode = selectedToRef.current?.iata_code

    if (!fromCode || !toCode || !depart) return null

    const departCode = formatDate(depart)

    // outbound segment
    let code = `${fromCode}${departCode}${toCode}`

    // return segment (if round trip)
    if (roundTrip && returnDate) {
      const returnCode = formatDate(returnDate)
      code += `${returnCode}${fromCode}`
    }

    // pax encoding (211 style)
    code += `${adults}${children}${infants}`

    return code
  }

  const handleSearch = () => {
    const code = buildFlightSearchCode()

    if (!code) {
      alert('Please select valid airports and dates')
      return
    }

    const url = new URL('https://flights.timmstravel.com/')
    url.searchParams.set('flightSearch', code)
    url.searchParams.set('destination_airports', '0')
    url.searchParams.set('origin_airports', '1')

    window.location.href = url.toString()
  }

  const handleSwap = () => {
    const temp = from
    const tempRef = selectedFromRef.current

    setFrom(to)
    setTo(temp)

    selectedFromRef.current = selectedToRef.current
    selectedToRef.current = tempRef
  }

  const renderDropdown = (
    results: Airport[],
    setter: (data: Airport[]) => void,
    inputSetter: (value: string) => void,
    selectSetter: (airport: Airport) => void
  ) => {
    if (!results.length) return null

    return (
      <div className="absolute left-0 right-0 z-30 bg-white border border-gray-200 rounded-xl shadow-xl mt-1 max-h-72 overflow-y-auto">
        {results.map((a) => (
          <div
            key={`${a.iata_code}-${a.name}`}
            className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition flex flex-col"
            onClick={() => {
              inputSetter(`${a.city} (${a.iata_code})`)
              selectSetter(a)
              setter([])
            }}
          >
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">{a.city}, {a.country}</span>
              <span className="text-blue-600 font-bold text-sm">{a.iata_code}</span>
            </div>
            <span className="text-gray-500 text-sm">{a.name}</span>
          </div>
        ))}
      </div>
    )
  }

  const cabinLabels: Record<string, string> = {
    economy: 'Economy',
    business: 'Business',
  }

  const travellerSummary =
    `${adults + children + infants} passenger${adults + children + infants > 1 ? 's' : ''} · ${cabinLabels[cabin]}`

  return (
    <div className="space-y-3">

      {/* Trip type toggle */}
      <div className="flex gap-2">
        {['Return', 'One way'].map((label) => (
          <button
            key={label}
            onClick={() => setRoundTrip(label === 'Return')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              (label === 'Return') === roundTrip
                ? 'bg-[#232e4e] text-white border-[#232e4e]'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ROW (UNCHANGED STYLE) */}
      <div className="flex flex-col lg:flex-row items-stretch gap-2">

        {/* FROM */}
        <div className="relative flex-[2] min-w-0">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">From</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="City or airport"
          />
          {renderDropdown(fromResults, setFromResults, setFrom, (a) => selectedFromRef.current = a)}
        </div>

        {/* SWAP */}
        <button onClick={handleSwap} className="w-9 h-9 flex items-center justify-center rounded-full border">
          ⇄
        </button>

        {/* TO */}
        <div className="relative flex-[2] min-w-0">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">To</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="City or airport"
          />
          {renderDropdown(toResults, setToResults, setTo, (a) => selectedToRef.current = a)}
        </div>

        {/* DEPART */}
        <div className="flex-[1.2]">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Depart</label>
          <input
            type="date"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
            value={depart}
            min={today}
            onChange={(e) => setDepart(e.target.value)}
          />
        </div>

        {/* RETURN */}
        {roundTrip && (
          <div className="flex-[1.2]">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Return</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
              value={returnDate}
              min={depart || today}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        )}

        {/* PASSENGERS */}
        <div ref={travellerRef} className="flex-[1.5]">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Passengers</label>
          <button
            onClick={() => setTravellerOpen(!travellerOpen)}
            className="w-full border rounded-xl px-3 py-2.5 text-sm text-left"
          >
            {travellerSummary}
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="px-6 py-2.5 rounded-xl text-white font-bold"
            style={{ backgroundColor: '#03989e' }}
          >
            Search flights
          </button>
        </div>
      </div>

    </div>
  )
}