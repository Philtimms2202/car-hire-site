'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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

  // ✅ FIX 1: stable debounce (prevents recreation every render)
  const debounce = useCallback((fn: (...args: any[]) => void, delay = 300) => {
    let timer: any
    return (...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  }, [])

  // ✅ FIX 2: stable fetch function
  const fetchAirports = useCallback(async (query: string, setter: (data: Airport[]) => void) => {
    if (!query || query.length < 2) {
      setter([])
      return
    }

    try {
      const res = await fetch(`/api/airports?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setter(data)
    } catch {
      setter([])
    }
  }, [])

  const debouncedFromSearch = useRef(
    debounce((q: string) => fetchAirports(q, setFromResults), 300)
  ).current

  const debouncedToSearch = useRef(
    debounce((q: string) => fetchAirports(q, setToResults), 300)
  ).current

  useEffect(() => {
    debouncedFromSearch(from)
  }, [from, debouncedFromSearch])

  useEffect(() => {
    debouncedToSearch(to)
  }, [to, debouncedToSearch])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (travellerRef.current && !travellerRef.current.contains(e.target as Node)) {
        setTravellerOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    return `${dd}${mm}`
  }

const buildPassengerCode = () => {
  let code = ''

  if (cabin === 'business') code += 'c'

  code += String(adults)
  code += String(children)
  code += String(infants)

  return code
}

  const handleSearch = () => {
    const fromAirport = selectedFromRef.current
    const toAirport = selectedToRef.current

    if (!fromAirport || !toAirport || !depart) {
      alert('Please select valid airports and departure date.')
      return
    }

    const dep = formatDate(depart)
    const ret = returnDate ? formatDate(returnDate) : ''
    const passengerCode = buildPassengerCode()

    let flightSearch = `${fromAirport.iata_code}${dep}${toAirport.iata_code}${ret}`

    if (passengerCode) {
      flightSearch += passengerCode
    }

    const params = new URLSearchParams({
  flightSearch,
  destination_airports: '0',
  origin_airports: '1',
})

window.location.assign(`https://flights.timmstravel.com/?${params.toString()}`)
}

  const handleSwap = () => {
    const temp = from
    const tempRef = selectedFromRef.current

    setFrom(to)
    selectedFromRef.current = selectedToRef.current

    setTo(temp)
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
      <div className="absolute left-0 right-0 md:min-w-[420px] z-30 bg-white border border-gray-200 rounded-xl shadow-xl mt-1 max-h-80 overflow-y-auto">
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
              <span className="font-semibold text-gray-900">
                {a.city}, {a.country}
              </span>
              <span className="text-blue-600 font-bold text-sm">
                {a.iata_code}
              </span>
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

  const travellerSummary = `${adults + children + infants} passenger${
    adults + children + infants > 1 ? 's' : ''
  } · ${cabinLabels[cabin]}`

  return (
    <div className="space-y-3">

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

      <div className="flex flex-col lg:flex-row items-stretch gap-2">

        {/* FROM */}
        <div className="relative flex-[2] min-w-0">
          <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1 px-1">
            From
          </label>

          <input
            className="w-full border rounded-xl px-4 py-2.5 text-sm"
            placeholder="City/Airport"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value)
              selectedFromRef.current = null
            }}
          />

          {renderDropdown(fromResults, setFromResults, setFrom, (a) => {
            selectedFromRef.current = a
          })}
        </div>

        {/* TO */}
        <div className="relative flex-[2] min-w-0">
          <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1 px-1">
            To
          </label>

          <input
            className="w-full border rounded-xl px-4 py-2.5 text-sm"
            placeholder="City/Airport"
            value={to}
            onChange={(e) => {
              setTo(e.target.value)
              selectedToRef.current = null
            }}
          />

          {renderDropdown(toResults, setToResults, setTo, (a) => {
            selectedToRef.current = a
          })}
        </div>

        {/* DATE */}
        <div className="flex-[1.2]">
          <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1 px-1">
            Depart
          </label>
          <input
            type="date"
            className="w-full border rounded-xl px-3 py-2.5 text-sm"
            value={depart}
            min={today}
            onChange={(e) => setDepart(e.target.value)}
          />
        </div>

        {roundTrip && (
          <div className="flex-[1.2]">
            <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1 px-1">
              Return
            </label>
            <input
              type="date"
              className="w-full border rounded-xl px-3 py-2.5 text-sm"
              value={returnDate}
              min={depart || today}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        )}

        {/* PASSENGERS */}
        <div className="relative flex-[2] min-w-[180px]" ref={travellerRef}>
          <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1 px-1">
            Passengers
          </label>

          <button
            className="w-full border rounded-xl px-3 py-2.5 text-sm text-left"
            onClick={() => setTravellerOpen(!travellerOpen)}
          >
            {travellerSummary}
          </button>

          {travellerOpen && (
            <div className="absolute right-0 bottom-full mb-2 bg-white border rounded-xl shadow-xl p-4 w-72 z-40">
              <div className="mb-2 font-semibold">Cabin</div>

              <select
                className="w-full border rounded-lg px-2 py-1 mb-4"
                value={cabin}
                onChange={(e) => setCabin(e.target.value)}
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
              </select>

              {[{ label: 'Adults', val: adults, set: setAdults, min: 1 },
                { label: 'Children', val: children, set: setChildren, min: 0 },
                { label: 'Infants', val: infants, set: setInfants, min: 0 }
              ].map((p) => (
                <div key={p.label} className="flex justify-between mb-2">
                  <span>{p.label}</span>
                  <div className="flex gap-2">
                    <button onClick={() => p.set(Math.max(p.min, p.val - 1))}>-</button>
                    <span>{p.val}</span>
                    <button onClick={() => p.set(p.val + 1)}>+</button>
                  </div>
                </div>
              ))}

              <button
                className="w-full mt-3 bg-[#232e4e] text-white py-2 rounded-lg"
                onClick={() => setTravellerOpen(false)}
              >
                Done
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-end">
          <label className="text-[11px] text-transparent mb-1">Search</label>
          <button
            onClick={handleSearch}
            className="px-6 py-2.5 rounded-xl text-white font-bold"
            style={{ backgroundColor: '#03989e' }}
          >
            Search flights
          </button>
        </div>

      </div>

      <a
        href="/flights/popular-routes"
        className="block text-center border border-[#03989e] text-[#03989e] rounded-xl py-2.5"
      >
        View popular routes
      </a>
    </div>
  )
}
