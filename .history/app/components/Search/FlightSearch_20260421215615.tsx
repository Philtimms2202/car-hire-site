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

  // =========================
  // 🔥 KEY FIX: REDIRECT BUILDER
  // =========================
  const buildFlightSearchCode = () => {
    const origin = selectedFromRef.current?.iata_code
    const dest = selectedToRef.current?.iata_code

    if (!origin || !dest || !depart) return null

    // Example base format (you confirmed TravelPayouts uses encoded string)
    // flightSearch=MAN2204MCO060522
    //
    // We construct:
    // ORIGIN + DATE + DEST + RETURN + PASSENGERS

    const dep = formatDate(depart)
    const ret = returnDate ? formatDate(returnDate) : ''

    const pax = `${adults}${children}${infants}` // e.g. 211

    let code = `${origin}${dep}${dest}`

    if (ret) {
      code += ret
    }

    code += pax

    return code
  }

  const formatDate = (dateStr: string) => {
    // YYYY-MM-DD → DDMMYY
    const d = new Date(dateStr)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yy = String(d.getFullYear()).slice(-2)
    return `${dd}${mm}${yy}`
  }

  // =========================
  // 🚀 UPDATED SEARCH HANDLER
  // =========================
  const handleSearch = () => {
    const code = buildFlightSearchCode()

    if (!code) {
      alert('Please select valid airports and a departure date.')
      return
    }

    const url = `https://flights.timmstravel.com/?flightSearch=${code}&destination_airports=0&origin_airports=1`

    window.location.href = url
  }

  const handleSwap = () => {
    const temp = from
    const tempAirport = selectedFromRef.current

    setFrom(to)
    selectedFromRef.current = selectedToRef.current

    setTo(temp)
    selectedToRef.current = tempAirport
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
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">
                {a.city}, {a.country}
              </span>
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

      {/* EVERYTHING BELOW = YOUR ORIGINAL UI (UNCHANGED) */}

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

        <div className="relative flex-[2] min-w-0">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">
            From
          </label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#03989e] focus:border-transparent placeholder-gray-400"
            placeholder="City or airport"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          {renderDropdown(fromResults, setFromResults, setFrom, (a) => {
            selectedFromRef.current = a
          })}
        </div>

        <button
          onClick={handleSwap}
          className="self-end mb-0.5 xl:self-center w-9 h-9 shrink-0 mx-auto flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition text-base"
        >
          ⇄
        </button>

        <div className="relative flex-[2] min-w-0">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">
            To
          </label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#03989e] focus:border-transparent placeholder-gray-400"
            placeholder="City or airport"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          {renderDropdown(toResults, setToResults, setTo, (a) => {
            selectedToRef.current = a
          })}
        </div>

        <div className="flex-[1.2] min-w-0">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">
            Depart
          </label>
          <input
            type="date"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white"
            value={depart}
            min={today}
            onChange={(e) => setDepart(e.target.value)}
          />
        </div>

        {roundTrip && (
          <div className="flex-[1.2] min-w-0">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">
              Return
            </label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white"
              value={returnDate}
              min={depart || today}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        )}

        <div className="relative flex-[1.5] min-w-0" ref={travellerRef}>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">
            Passengers
          </label>

          <button
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white text-left"
            onClick={() => setTravellerOpen(!travellerOpen)}
          >
            {travellerSummary}
          </button>

          {travellerOpen && (
            <div className="absolute right-0 bottom-full mb-2 z-40 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-72">
              <p className="font-semibold text-gray-800 text-sm mb-2">Cabin class</p>
              <select
                className="w-full border rounded-xl px-3 py-2 text-sm mb-3"
                value={cabin}
                onChange={(e) => setCabin(e.target.value)}
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
              </select>

              <button
                className="w-full py-2 rounded-xl text-white text-sm font-semibold"
                style={{ backgroundColor: '#232e4e' }}
                onClick={() => setTravellerOpen(false)}
              >
                Done
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-end shrink-0">
          <label className="block text-[11px] text-transparent mb-1 px-1">
            Search
          </label>
          <button
            onClick={handleSearch}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-bold"
            style={{ backgroundColor: '#03989e' }}
          >
            Search flights
          </button>
        </div>

      </div>

      <a
        href="/flights/popular-routes"
        className="w-full block text-center px-4 py-2.5 rounded-xl border border-[#03989e] text-[#03989e] text-sm font-semibold bg-white hover:bg-[#e6f7f7] transition"
      >
        View popular routes
      </a>
    </div>
  )
}