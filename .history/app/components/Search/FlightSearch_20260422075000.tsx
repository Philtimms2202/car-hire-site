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

  const debounce = useCallback((fn: (...args: any[]) => void, delay = 300) => {
    let timer: any
    return (...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  }, [])

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

    const url = `https://flights.timmstravel.com/?flightSearch=${flightSearch}&destination_airports=0&origin_airports=1`

    window.location.href = url
  }

  const renderDropdown = (
    results: Airport[],
    setter: (data: Airport[]) => void,
    inputSetter: (value: string) => void,
    selectSetter: (airport: Airport) => void
  ) => {
    if (!results.length) return null

    return (
      <div className="absolute left-0 right-0 z-30 bg-white border border-gray-200 rounded-xl shadow-xl mt-1 max-h-80 overflow-y-auto">
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
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto space-y-4">

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

      {/* Inputs row */}
      <div className="flex flex-col lg:flex-row items-stretch gap-3">

        {/* FROM */}
        <div className="relative flex-1">
          <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">
            From
          </label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:border-gray-400"
            placeholder="Enter origin airport"
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
        <div className="relative flex-1">
          <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">
            To
          </label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:border-gray-400"
            placeholder="Enter destination airport"
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

        {/* DEPART */}
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">
            Depart
          </label>
          <input
            type="date"
            value={depart}
            min={today}
            onChange={(e) => setDepart(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* RETURN */}
        {roundTrip && (
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">
              Return
            </label>
            <input
              type="date"
              value={returnDate}
              min={depart || today}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:border-gray-400"
            />
          </div>
        )}

        {/* PASSENGERS */}
        <div className="relative flex-1" ref={travellerRef}>
          <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">
            Passengers
          </label>

          <button
            type="button"
            onClick={() => setTravellerOpen(!travellerOpen)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 font-medium text-left flex justify-between items-center hover:border-gray-300 transition"
          >
            <span>{travellerSummary}</span>
            <span className="text-gray-400 text-xs">{travellerOpen ? '▲' : '▼'}</span>
          </button>

          {travellerOpen && (
            <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl p-5 z-50 w-72">

              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cabin</p>
              <div className="flex gap-2 mb-4">
                {['economy', 'business'].map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setCabin(cls)}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-semibold border transition ${
                      cabin === cls
                        ? 'bg-[#232e4e] text-white border-[#232e4e]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {cls.charAt(0).toUpperCase() + cls.slice(1)}
                  </button>
                ))}
              </div>

              {[{ label: 'Adults', sub: '16+', val: adults, set: setAdults, min: 1 },
                { label: 'Children', sub: '2–15', val: children, set: setChildren, min: 0 },
                { label: 'Infants', sub: 'Under 2', val: infants, set: setInfants, min: 0 }
              ].map((p) => (
                <div key={p.label} className="flex justify-between items-center py-2 border-t border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{p.label}</p>
                    <p className="text-xs text-gray-400">{p.sub}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => p.set(Math.max(p.min, p.val - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 font-bold hover:border-gray-500 transition flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-4 text-center font-semibold text-gray-800">{p.val}</span>
                    <button
                      type="button"
                      onClick={() => p.set(p.val + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 font-bold hover:border-gray-500 transition flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setTravellerOpen(false)}
                className="w-full mt-4 py-2 rounded-xl text-white font-semibold text-sm"
                style={{ backgroundColor: '#232e4e' }}
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* SEARCH BUTTON */}
        <div className="flex flex-col justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSearch}
            className="px-8 py-3 rounded-xl text-white font-bold text-lg transition hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: '#03989e' }}
          >
            Search Flights →
          </button>
        </div>
      </div>

      <a
        href="/flights/popular-routes"
        className="px-8 py-2 rounded-xl font-semibold text-sm text-center transition border whitespace-nowrap hover:bg-gray-50 block"
        style={{ borderColor: '#03989e', color: '#03989e' }}
      >
        Search Popular Routes
      </a>

      <p className="text-center text-xs text-gray-400">
        · Prices updated in real time · No hidden fees · Powered by Timms Travel
      </p>
    </div>
  )
}
