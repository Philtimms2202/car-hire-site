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
    <div className="card space-y-6">

      {/* Trip type */}
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded ${roundTrip ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setRoundTrip(true)}
        >
          Return
        </button>
        <button
          className={`px-4 py-2 rounded ${!roundTrip ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setRoundTrip(false)}
        >
          One way
        </button>
      </div>

      {/* Row 1: From / Swap / To */}
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <label className="block text-gray-600 text-sm mb-1">From</label>
          <input
            className="input-field bg-white text-gray-900 w-full"
            placeholder="City or airport"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          {renderDropdown(fromResults, setFromResults, setFrom, (a) => { selectedFromRef.current = a })}
        </div>

        <button
          className="flex-shrink-0 mb-[1px] w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition"
          onClick={handleSwap}
          aria-label="Swap origin and destination"
        >
          ⇄
        </button>

        <div className="relative flex-1">
          <label className="block text-gray-600 text-sm mb-1">To</label>
          <input
            className="input-field bg-white text-gray-900 w-full"
            placeholder="City or airport"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          {renderDropdown(toResults, setToResults, setTo, (a) => { selectedToRef.current = a })}
        </div>
      </div>

      {/* Row 2: Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-600 text-sm mb-1">Departure</label>
          <input
            type="date"
            className="input-field bg-white text-gray-900 w-full"
            value={depart}
            min={today}
            onChange={(e) => {
              const newDepart = e.target.value
              setDepart(newDepart)
              if (returnDate && returnDate < newDepart) {
                setReturnDate(newDepart)
              }
            }}
          />
        </div>
        {roundTrip && (
          <div>
            <label className="block text-gray-600 text-sm mb-1">Return</label>
            <input
              type="date"
              className="input-field bg-white text-gray-900 w-full"
              value={returnDate}
              min={depart || today}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Row 3: Travellers & cabin */}
      <div className="relative" ref={travellerRef}>
        <label className="block text-gray-600 text-sm mb-1">Travellers & cabin</label>
        <button
          className="input-field bg-white text-gray-900 w-full text-left"
          onClick={() => setTravellerOpen(!travellerOpen)}
        >
          {adults} Adult{adults > 1 ? 's' : ''}
          {children > 0 ? `, ${children} Child` : ''}
          {infants > 0 ? `, ${infants} Infant` : ''} · {cabin.replace('_', ' ')}
        </button>

        {travellerOpen && (
          <div className="absolute left-0 right-0 z-40 bg-white border border-gray-200 rounded-xl shadow-xl mt-2 p-4 space-y-4">
            <div>
              <div className="font-semibold text-gray-800 mb-2">Cabin class</div>
              <select
                className="input-field bg-white text-gray-900 w-full"
                value={cabin}
                onChange={(e) => setCabin(e.target.value)}
              >
                <option value="economy">Economy</option>
                <option value="premium">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </select>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-800">Adults</div>
                <div className="text-gray-500 text-sm">Aged 18+</div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1 bg-gray-200 rounded" disabled={adults <= 1} onClick={() => setAdults(adults - 1)}>-</button>
                <span className="w-6 text-center">{adults}</span>
                <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setAdults(adults + 1)}>+</button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-800">Children</div>
                <div className="text-gray-500 text-sm">Aged 0–17</div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1 bg-gray-200 rounded" disabled={children <= 0} onClick={() => setChildren(children - 1)}>-</button>
                <span className="w-6 text-center">{children}</span>
                <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setChildren(children + 1)}>+</button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-800">Infants</div>
                <div className="text-gray-500 text-sm">Under 2</div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1 bg-gray-200 rounded" disabled={infants <= 0} onClick={() => setInfants(infants - 1)}>-</button>
                <span className="w-6 text-center">{infants}</span>
                <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setInfants(infants + 1)}>+</button>
              </div>
            </div>

            <button className="btn-primary w-full mt-2" onClick={() => setTravellerOpen(false)}>
              Apply
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleSearch}
        className="btn-primary w-full disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Searching…' : 'Search flights'}
      </button>

      
        href="/flights/popular-routes"
        className="w-full block text-center mt-2 px-4 py-3 rounded-lg border border-[#03989e] text-[#03989e] bg-white font-semibold hover:bg-[#e6f7f7] transition"
      >
        View popular routes
      </a>

    </div>
  )
}