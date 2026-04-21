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

  // debounce
  const debounce = (fn: (...args: any[]) => void, delay = 300) => {
    let timer: any
    return (...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  }

  const fetchAirports = async (query: string, setter: (data: Airport[]) => void) => {
    if (!query || query.length < 2) {
      setter([])
      return
    }
    const res = await fetch(`/api/airports?q=${encodeURIComponent(query)}`)
    const data = await res.json()
    setter(data)
  }

  const debouncedFromSearch = debounce((q: string) => fetchAirports(q, setFromResults))
  const debouncedToSearch = debounce((q: string) => fetchAirports(q, setToResults))

  useEffect(() => debouncedFromSearch(from), [from])
  useEffect(() => debouncedToSearch(to), [to])

  // ---------------------------------------
  // 🔥 FIXED REDIRECT LOGIC
  // ---------------------------------------
  const handleSearch = () => {
    const origin = selectedFromRef.current
    const destination = selectedToRef.current

    if (!origin || !destination || !depart) {
      alert('Please select valid airports and a departure date.')
      return
    }

    // SAFE date formatting (no timezone shift bugs)
    const formatDate = (dateStr: string) => {
      const [y, m, d] = dateStr.split('-')
      return `${d}${m}${y.slice(2)}`
    }

    const departFormatted = formatDate(depart)
    const returnFormatted =
      roundTrip && returnDate ? formatDate(returnDate) : ''

    // passenger encoding
    const paxCode = `${adults}${children}${infants}`

    const flightSearch =
      `${origin.iata_code}${departFormatted}${destination.iata_code}` +
      (returnFormatted ? returnFormatted : '') +
      paxCode

    const url = new URL('https://flights.timmstravel.com/')

    url.searchParams.set('flightSearch', flightSearch)
    url.searchParams.set('destination_airports', '0')
    url.searchParams.set('origin_airports', '1')

    window.location.href = url.toString()
  }

  const handleSwap = () => {
    const tempFrom = from
    const tempFromRef = selectedFromRef.current

    setFrom(to)
    selectedFromRef.current = selectedToRef.current

    setTo(tempFrom)
    selectedToRef.current = tempFromRef
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
              <span className="font-semibold">
                {a.city}, {a.country}
              </span>
              <span className="text-blue-600 font-bold">{a.iata_code}</span>
            </div>
            <span className="text-sm text-gray-500">{a.name}</span>
          </div>
        ))}
      </div>
    )
  }

  const cabinLabels: Record<string, string> = {
    economy: 'Economy',
    business: 'Business',
  }

  const travellerSummary = `${adults + children + infants} passenger${
    adults + children + infants > 1 ? 's' : ''
  } · ${cabinLabels[cabin]}`

  return (
    <div className="space-y-3">

      {/* Trip type */}
      <div className="flex gap-2">
        {['Return', 'One way'].map((label) => (
          <button
            key={label}
            onClick={() => setRoundTrip(label === 'Return')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
              (label === 'Return') === roundTrip
                ? 'bg-[#232e4e] text-white'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* SEARCH ROW */}
      <div className="flex flex-col lg:flex-row gap-2">

        {/* FROM */}
        <div className="relative flex-[2]">
          <label className="text-xs font-bold text-gray-400">From</label>
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="City or airport"
            className="w-full border rounded-xl px-4 py-2.5"
          />
          {renderDropdown(fromResults, setFromResults, setFrom, (a) => {
            selectedFromRef.current = a
          })}
        </div>

        {/* TO */}
        <div className="relative flex-[2]">
          <label className="text-xs font-bold text-gray-400">To</label>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="City or airport"
            className="w-full border rounded-xl px-4 py-2.5"
          />
          {renderDropdown(toResults, setToResults, setTo, (a) => {
            selectedToRef.current = a
          })}
        </div>

        {/* SWAP */}
        <button
          onClick={handleSwap}
          className="px-3 py-2 border rounded-xl"
        >
          ⇄
        </button>

        {/* DEPART */}
        <input
          type="date"
          value={depart}
          min={today}
          onChange={(e) => setDepart(e.target.value)}
          className="border rounded-xl px-3 py-2.5"
        />

        {/* RETURN */}
        {roundTrip && (
          <input
            type="date"
            value={returnDate}
            min={depart || today}
            onChange={(e) => setReturnDate(e.target.value)}
            className="border rounded-xl px-3 py-2.5"
          />
        )}

        {/* PASSENGERS */}
        <div ref={travellerRef} className="relative flex-[1.5]">
          <button
            onClick={() => setTravellerOpen(!travellerOpen)}
            className="w-full border rounded-xl px-3 py-2.5 text-left"
          >
            {travellerSummary}
          </button>

          {travellerOpen && (
            <div className="absolute z-40 bg-white border rounded-xl p-4 w-72">
              <p className="font-semibold mb-2">Cabin</p>
              <select
                value={cabin}
                onChange={(e) => setCabin(e.target.value)}
                className="w-full border rounded-lg p-2 mb-3"
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
              </select>

              <p className="text-sm">Passengers editing stays same as your original UI</p>

              <button
                onClick={() => setTravellerOpen(false)}
                className="mt-3 w-full bg-[#232e4e] text-white rounded-xl py-2"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* SEARCH */}
        <button
          onClick={handleSearch}
          className="px-6 py-2.5 rounded-xl text-white font-bold"
          style={{ backgroundColor: '#03989e' }}
        >
          Search flights
        </button>
      </div>
    </div>
  )
}