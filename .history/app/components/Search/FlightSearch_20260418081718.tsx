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

  const [loading, setLoading] = useState(false)
  const today = new Date().toISOString().split('T')[0]
  const travellerRef = useRef<HTMLDivElement>(null)

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

  const fetchKiwiSlug = async (iata: string) => {
    const url = `https://api.skypicker.com/locations?term=${encodeURIComponent(iata)}&locale=en&location_types=airport&limit=1&_=${Date.now()}`
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    return data?.locations?.[0]?.slug || null
  }

  const buildKiwiUrl = async () => {
    const selectedFrom = selectedFromRef.current
    const selectedTo = selectedToRef.current
    if (!selectedFrom || !selectedTo || !depart) return ''

    const fromCode = selectedFrom.iata_code
    const toCode = selectedTo.iata_code

    const kiwiDeep = new URL('https://www.kiwi.com/deep')
    kiwiDeep.searchParams.set('from', fromCode)
    kiwiDeep.searchParams.set('to', toCode)
    kiwiDeep.searchParams.set('departure', depart)
    if (roundTrip && returnDate) {
      kiwiDeep.searchParams.set('return', returnDate)
    }
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
    if (!url) {
      alert('Could not build a valid Kiwi link.')
      return
    }
    console.log('FINAL URL:', url)
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
      <div className="absolute left-0 right-0 z-30 bg-white border border-gray-200 rounded-xl shadow-xl mt-2 max-h-72 overflow-y-auto">
        {results.map((a) => (
          <div
            key={`${a.iata_code}-${a.name}`}
            className="px-4 py-3 cursor-pointer hover:bg-blue-50 active:bg-blue-100 transition flex flex-col"
            onClick={() => {
              console.log('SELECTED AIRPORT:', a)
              inputSetter(`${a.city} (${a.iata_code})`)
              selectSetter(a)
              setter([])
            }}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900 text-base">
                {a.city}, {a.country}
              </span>
              <span className="text-blue-600 font-bold text-sm">{a.iata_code}</span>
            </div>
            <span className="text-gray-500 text-sm mt-1">{a.name}</span>
          </div>
        ))}
      </div>
    )
  }

return (
    <div className="card space-y-3">

      {/* Trip type toggle */}
      <div className="flex gap-2">
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${roundTrip ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
          onClick={() => setRoundTrip(true)}
        >
          Return
        </button>
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${!roundTrip ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
          onClick={() => setRoundTrip(false)}
        >
          One way
        </button>
      </div>

      {/* Main search bar */}
      <div className="flex items-stretch border border-gray-300 rounded-xl overflow-visible bg-white">

        {/* FROM */}
        <div className="relative flex-1 min-w-0">
          <div className="flex flex-col px-4 py-3 h-full cursor-text">
            <label className="text-xs text-gray-500 font-medium mb-0.5">From</label>
            <input
              className="text-gray-900 text-sm font-medium bg-transparent outline-none placeholder-gray-400 w-full"
              placeholder="City or airport"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          {renderDropdown(fromResults, setFromResults, setFrom, (a) => { selectedFromRef.current = a })}
        </div>

        {/* SWAP */}
        <div className="flex items-center justify-center px-1 border-l border-r border-gray-200">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 transition text-base"
            onClick={handleSwap}
            aria-label="Swap"
          >
            ⇄
          </button>
        </div>

        {/* TO */}
        <div className="relative flex-1 min-w-0 border-r border-gray-200">
          <div className="flex flex-col px-4 py-3 h-full cursor-text">
            <label className="text-xs text-gray-500 font-medium mb-0.5">To</label>
            <input
              className="text-gray-900 text-sm font-medium bg-transparent outline-none placeholder-gray-400 w-full"
              placeholder="City or airport"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          {renderDropdown(toResults, setToResults, setTo, (a) => { selectedToRef.current = a })}
        </div>

        {/* DEPART */}
        <div className="flex-1 min-w-0 border-r border-gray-200">
          <div className="flex flex-col px-4 py-3 h-full">
            <label className="text-xs text-gray-500 font-medium mb-0.5">Depart</label>
            <input
              type="date"
              className="text-gray-900 text-sm font-medium bg-transparent outline-none w-full"
              value={depart}
              min={today}
              onChange={(e) => {
                const newDepart = e.target.value
                setDepart(newDepart)
                if (returnDate && returnDate < newDepart) setReturnDate(newDepart)
              }}
            />
          </div>
        </div>

        {/* RETURN */}
        {roundTrip && (
          <div className="flex-1 min-w-0 border-r border-gray-200">
            <div className="flex flex-col px-4 py-3 h-full">
              <label className="text-xs text-gray-500 font-medium mb-0.5">Return</label>
              <input
                type="date"
                className="text-gray-900 text-sm font-medium bg-transparent outline-none w-full"
                value={returnDate}
                min={depart || today}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* TRAVELLERS */}
        <div className="relative flex-1 min-w-0 border-r border-gray-200" ref={travellerRef}>
          <button
            className="w-full h-full flex flex-col px-4 py-3 text-left"
            onClick={() => setTravellerOpen(!travellerOpen)}
          >
            <span className="text-xs text-gray-500 font-medium mb-0.5">Travellers</span>
            <span className="text-gray-900 text-sm font-medium truncate">
              {adults} Adult{adults > 1 ? 's' : ''}
              {children > 0 ? `, ${children} Child` : ''}
              {infants > 0 ? `, ${infants} Infant` : ''}, {cabin.charAt(0).toUpperCase() + cabin.slice(1)}
            </span>
          </button>

          {travellerOpen && (
            <div className="absolute left-0 z-40 bg-white border border-gray-200 rounded-xl shadow-xl mt-2 p-4 space-y-4 w-72">
              <div>
                <div className="font-semibold text-gray-800 mb-2 text-sm">Cabin class</div>
                <select
                  className="input-field bg-white text-gray-900 w-full text-sm"
                  value={cabin}
                  onChange={(e) => setCabin(e.target.value)}
                >
                  <option value="economy">Economy</option>
                  <option value="premium">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First</option>
                </select>
              </div>

              {[
                { label: 'Adults', sub: 'Aged 18+', val: adults, set: setAdults, min: 1 },
                { label: 'Children', sub: 'Aged 0–17', val: children, set: setChildren, min: 0 },
                { label: 'Infants', sub: 'Under 2', val: infants, set: setInfants, min: 0 },
              ].map(({ label, sub, val, set, min }) => (
                <div key={label} className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{label}</div>
                    <div className="text-gray-500 text-xs">{sub}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-3 py-1 bg-gray-200 rounded text-sm" disabled={val <= min} onClick={() => set(val - 1)}>-</button>
                    <span className="w-6 text-center text-sm">{val}</span>
                    <button className="px-3 py-1 bg-gray-200 rounded text-sm" onClick={() => set(val + 1)}>+</button>
                  </div>
                </div>
              ))}

              <button className="btn-primary w-full mt-2 text-sm" onClick={() => setTravellerOpen(false)}>
                Apply
              </button>
            </div>
          )}
        </div>

        {/* SEARCH */}
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 rounded-r-xl transition disabled:opacity-60 whitespace-nowrap"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>

      </div>

      {/* Popular routes */}
      
        href="/flights/popular-routes"
        className="w-full block text-center px-4 py-3 rounded-lg border border-[#03989e] text-[#03989e] bg-white font-semibold hover:bg-[#e6f7f7] transition text-sm"
      >
        View popular routes
      </a>

    </div>
  )
}