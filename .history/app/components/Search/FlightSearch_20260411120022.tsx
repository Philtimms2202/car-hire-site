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

  // Inputs (text)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [depart, setDepart] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [roundTrip, setRoundTrip] = useState(true)

  // Traveller state
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [cabin, setCabin] = useState('economy')
  const [travellerOpen, setTravellerOpen] = useState(false)

  // Airport results
  const [fromResults, setFromResults] = useState<Airport[]>([])
  const [toResults, setToResults] = useState<Airport[]>([])

  // ⭐ Selected airports stored in refs so they NEVER reset on locale change
  const selectedFromRef = useRef<Airport | null>(null)
  const selectedToRef = useRef<Airport | null>(null)

  const [loading, setLoading] = useState(false)
  const today = new Date().toISOString().split('T')[0]
  const travellerRef = useRef<HTMLDivElement>(null)

  // Close traveller dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (travellerRef.current && !travellerRef.current.contains(e.target as Node)) {
        setTravellerOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Debounce helper
  const debounce = (fn: (...args: any[]) => void, delay = 300) => {
    let timer: any
    return (...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  }

  // Airport search
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

  // ⭐ Fetch Kiwi slug — ALWAYS use English to avoid Tenerife bug
  const fetchKiwiSlug = async (iata: string) => {
    const res = await fetch(
      `https://api.skypicker.com/locations?term=${encodeURIComponent(
        iata
      )}&locale=en&location_types=airport&limit=1`
    )
    const data = await res.json()
    if (!data.locations?.length) return null
    return data.locations[0].slug as string
  }

  // Build Kiwi URL
  const buildKiwiUrl = async () => {
    const selectedFrom = selectedFromRef.current
    const selectedTo = selectedToRef.current

    if (!selectedFrom || !selectedTo || !depart) return ''

    const [originSlug, destinationSlug] = await Promise.all([
      fetchKiwiSlug(selectedFrom.iata_code),
      fetchKiwiSlug(selectedTo.iata_code),
    ])

    if (!originSlug || !destinationSlug) return ''

    let path = `https://www.kiwi.com/${language}/search/results/${originSlug}/${destinationSlug}/${depart}`

    if (roundTrip && returnDate) {
      path += `/${returnDate}`
    }

    const url = new URL(path)

    url.searchParams.set(
      'affilid',
      'travelpayoutsdeeplink_timmstravel.com_6bc7301798224d1cad7e3f320-714930'
    )

    url.searchParams.set('adults', adults.toString())
    url.searchParams.set('children', children.toString())
    url.searchParams.set('infants', infants.toString())
    url.searchParams.set('cabinClass', cabin)

    url.searchParams.set('locale', language)
    url.searchParams.set('curr', currency)
    url.searchParams.set('reset_currency', '1')

    return url.toString()
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

    window.open(url, '_blank')
  }

  // Dropdown renderer
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

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* FROM */}
        <div className="relative">
          <label className="block text-gray-600 text-sm mb-1">From</label>
          <input
            className="input-field bg-white text-gray-900"
            placeholder="City or airport"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          {renderDropdown(fromResults, setFromResults, setFrom, (a) => {
            selectedFromRef.current = a
          })}
        </div>

        {/* TO */}
        <div className="relative">
          <label className="block text-gray-600 text-sm mb-1">To</label>
          <input
            className="input-field bg-white text-gray-900"
            placeholder="City or airport"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          {renderDropdown(toResults, setToResults, setTo, (a) => {
            selectedToRef.current = a
          })}
        </div>

        {/* DEPART */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Departure</label>
          <input
            type="date"
            className="input-field bg-white text-gray-900"
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

        {/* RETURN */}
        {roundTrip && (
          <div>
            <label className="block text-gray-600 text-sm mb-1">Return</label>
            <input
              type="date"
              className="input-field bg-white text-gray-900"
              value={returnDate}
              min={depart || today}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Travellers */}
      <div className="relative" ref={travellerRef}>
        <label className="block text-gray-600 text-sm mb-1">Travellers & cabin</label>

        <button
          className="input-field bg-white text-gray-900 w-full text-left"
          onClick={() => setTravellerOpen(!travellerOpen)}
        >
          {adults} Adult{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} Child` : ''}{infants > 0 ? `, ${infants} Infant` : ''} · {cabin.replace('_', ' ')}
        </button>

        {travellerOpen && (
          <div className="absolute left-0 right-0 z-40 bg-white border border-gray-200 rounded-xl shadow-xl mt-2 p-4 space-y-4">

            {/* Cabin */}
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

            {/* Adults */}
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-800">Adults</div>
                <div className="text-gray-500 text-sm">Aged 18+</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  disabled={adults <= 1}
                  onClick={() => setAdults(adults - 1)}
                >
                  -
                </button>
                <span className="w-6 text-center">{adults}</span>
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => setAdults(adults + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-800">Children</div>
                <div className="text-gray-500 text-sm">Aged 0–17</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  disabled={children <= 0}
                  onClick={() => setChildren(children - 1)}
                >
                  -
                </button>
                <span className="w-6 text-center">{children}</span>
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => setChildren(children + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-800">Infants</div>
                <div className="text-gray-500 text-sm">Under 2</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  disabled={infants <= 0}
                  onClick={() => setInfants(infants - 1)}
                >
                  -
                </button>
                <span className="w-6 text-center">{infants}</span>
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => setInfants(infants + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="btn-primary w-full mt-2"
              onClick={() => setTravellerOpen(false)}
            >
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
    </div>
  )
}
