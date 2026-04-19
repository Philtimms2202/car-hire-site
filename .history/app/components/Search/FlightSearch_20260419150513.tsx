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
  const [loading, setLoading] = useState(false)
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
    if (!query || query.length < 2) { setter([]); return }
    const res = await fetch(`/api/airports?q=${encodeURIComponent(query)}`)
    const data = await res.json()
    setter(data)
  }

  const debouncedFromSearch = debounce((q: string) => fetchAirports(q, setFromResults))
  const debouncedToSearch = debounce((q: string) => fetchAirports(q, setToResults))

  useEffect(() => debouncedFromSearch(from), [from])
  useEffect(() => debouncedToSearch(to), [to])

  const buildKiwiUrl = async () => {
    const selectedFrom = selectedFromRef.current
    const selectedTo = selectedToRef.current
    if (!selectedFrom || !selectedTo || !depart) return ''

    const kiwiDeep = new URL('https://www.kiwi.com/deep')
    kiwiDeep.searchParams.set('from', selectedFrom.iata_code)
    kiwiDeep.searchParams.set('to', selectedTo.iata_code)
    kiwiDeep.searchParams.set('departure', depart)
    if (roundTrip && returnDate) kiwiDeep.searchParams.set('return', returnDate)
    kiwiDeep.searchParams.set('adults', adults.toString())
    kiwiDeep.searchParams.set('children', children.toString())
    kiwiDeep.searchParams.set('infants', infants.toString())
    kiwiDeep.searchParams.set('currency', currency)
    kiwiDeep.searchParams.set('lang', 'en')

    const tracked = new URL('https://c111.travelpayouts.com/click')
    tracked.searchParams.set('shmarker', '714930')
    tracked.searchParams.set('promo_id', '3791')
    tracked.searchParams.set('source_type', 'customlink')
    tracked.searchParams.set('type', 'click')
    tracked.searchParams.set('custom_url', kiwiDeep.toString())
    return tracked.toString()
  }

  const handleSearch = async () => {
    if (!selectedFromRef.current || !selectedToRef.current || !depart) {
      alert('Please select valid airports and a departure date.')
      return
    }
    setLoading(true)
    const url = await buildKiwiUrl()
    setLoading(false)
    if (!url) { alert('Could not build a valid search link.'); return }
    window.open(url, '_blank', 'noopener')
  }

  const handleSwap = () => {
    const tempVal = from
    const tempAirport = selectedFromRef.current
    setFrom(to)
    selectedFromRef.current = selectedToRef.current
    setTo(tempVal)
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
    premium: 'Premium',
    business: 'Business',
    first: 'First',
  }

  const travellerSummary = `${adults + children + infants} passenger${adults + children + infants > 1 ? 's' : ''} · ${cabinLabels[cabin]}`

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

      {/* ── SINGLE LINE ROW ── */}
      <div className="flex flex-col lg:flex-row items-stretch gap-2">

        {/* FROM */}
        <div className="relative flex-1 min-w-0">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">From</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#03989e] focus:border-transparent placeholder-gray-400"
            placeholder="City or airport"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          {renderDropdown(fromResults, setFromResults, setFrom, (a) => { selectedFromRef.current = a })}
        </div>

        {/* SWAP */}
        <button
          onClick={handleSwap}
          className="self-end mb-0.5 lg:self-center w-9 h-9 shrink-0 mx-auto flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition text-base"
          aria-label="Swap airports"
        >
          ⇄
        </button>

        {/* TO */}
        <div className="relative flex-1 min-w-10">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">To</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#03989e] focus:border-transparent placeholder-gray-400"
            placeholder="City or airport"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          {renderDropdown(toResults, setToResults, setTo, (a) => { selectedToRef.current = a })}
        </div>

        {/* DEPART */}
        <div className="flex-1 min-w-10">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Depart</label>
          <input
            type="date"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#03989e] focus:border-transparent"
            value={depart}
            min={today}
            onChange={(e) => {
              setDepart(e.target.value)
              if (returnDate && returnDate < e.target.value) setReturnDate(e.target.value)
            }}
          />
        </div>

        {/* RETURN — only shown for round trip */}
        {roundTrip && (
          <div className="flex-1 min-w-0">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Return</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#03989e] focus:border-transparent"
              value={returnDate}
              min={depart || today}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        )}

        {/* TRAVELLERS */}
        <div className="relative flex-1 min-w-0" ref={travellerRef}>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Passengers</label>
          <button
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white text-left focus:outline-none focus:ring-2 focus:ring-[#03989e] hover:border-gray-300 transition whitespace-nowrap"
            onClick={() => setTravellerOpen(!travellerOpen)}
          >
            {travellerSummary}
          </button>

          {travellerOpen && (
            <div className="absolute right-0 z-40 bg-white border border-gray-200 rounded-2xl shadow-xl mt-1 p-4 space-y-4 w-72">
              {/* Cabin */}
              <div>
                <p className="font-semibold text-gray-800 text-sm mb-2">Cabin class</p>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#03989e]"
                  value={cabin}
                  onChange={(e) => setCabin(e.target.value)}
                >
                  <option value="economy">Economy</option>
                  <option value="premium">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First</option>
                </select>
              </div>

              {/* Passenger counters */}
              {[
                { label: 'Adults', sub: 'Aged 18+', val: adults, set: setAdults, min: 1 },
                { label: 'Children', sub: 'Aged 2–17', val: children, set: setChildren, min: 0 },
                { label: 'Infants', sub: 'Under 2', val: infants, set: setInfants, min: 0 },
              ].map(({ label, sub, val, set, min }) => (
                <div key={label} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{label}</p>
                    <p className="text-gray-400 text-xs">{sub}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className="w-8 h-8 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition text-lg leading-none"
                      disabled={val <= min}
                      onClick={() => set(val - 1)}
                    >−</button>
                    <span className="w-5 text-center text-sm font-semibold">{val}</span>
                    <button
                      className="w-8 h-8 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-lg leading-none"
                      onClick={() => set(val + 1)}
                    >+</button>
                  </div>
                </div>
              ))}

              <button
                className="w-full py-2 rounded-xl text-white text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: '#232e4e' }}
                onClick={() => setTravellerOpen(false)}
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* SEARCH BUTTON */}
        <div className="flex flex-col justify-end">
          <label className="block text-[11px] font-bold text-transparent uppercase tracking-wider mb-1 px-1 select-none">Search</label>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-bold transition hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
            style={{ backgroundColor: '#03989e' }}
          >
            {loading ? 'Searching…' : 'Search flights'}
          </button>
        </div>

      </div>

      {/* Popular routes link */}
      <a
        href="/flights/popular-routes"
        className="w-full block text-center px-4 py-2.5 rounded-xl border border-[#03989e] text-[#03989e] text-sm font-semibold bg-white hover:bg-[#e6f7f7] transition"
      >
        View popular routes
      </a>

    </div>
  )
}