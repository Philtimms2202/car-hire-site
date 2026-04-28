'use client'

import { useState, useEffect, useRef } from 'react'

type Airport = {
  name: string
  city: string
  country: string
  iata_code: string
  _geoloc: { lat: number; lng: number }
}

// ─── Utils ───────────────────────────────────────────────────────────

function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - a.lng) * Math.PI / 180
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * Math.PI / 180) *
    Math.cos(b.lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

function fmtTime(mins: number) {
  const h = Math.floor(mins / 60)
  const m = Math.round(mins % 60)
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`
}

// 🔥 SIMPLIFIED + MORE ROBUST SEARCH
function searchAirports(airports: Airport[], query: string, limit = 6): Airport[] {
  if (!query || query.trim().length < 1) return []

  const q = query.toLowerCase().trim()

  return airports
    .filter(a => {
      const city = a.city?.toLowerCase() || ''
      const name = a.name?.toLowerCase() || ''
      const iata = a.iata_code?.toLowerCase() || ''
      const country = a.country?.toLowerCase() || ''

      return (
        city.includes(q) ||
        name.includes(q) ||
        iata.includes(q) ||
        country.includes(q)
      )
    })
    .slice(0, limit)
}

// ─── Input ───────────────────────────────────────────────────────────

function AirportInput({
  label,
  airports,
  value,
  onChange,
  onSelect,
  placeholder,
}: {
  label: string
  airports: Airport[]
  value: string
  onChange: (v: string) => void
  onSelect: (a: Airport) => void
  placeholder?: string
}) {
  const [suggestions, setSuggestions] = useState<Airport[]>([])
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const results = searchAirports(airports, value)
    setSuggestions(results)
    setOpen(value.length > 0) // always open if typing
  }, [value, airports])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={wrapRef}>
      <label className="block text-sm text-gray-500 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#03989e]"
        autoComplete="off"
      />

      {open && (
        <ul className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.length === 0 && (
            <li className="px-4 py-2 text-gray-400 text-sm">
              No airports found
            </li>
          )}

          {suggestions.map(a => (
            <li
              key={a.iata_code}
              onMouseDown={() => {
                onSelect(a)
                onChange(`${a.city} (${a.iata_code})`)
                setOpen(false)
              }}
              className="flex justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-0"
            >
              <div>
                <span className="font-medium">{a.city}</span>
                <span className="text-gray-400 ml-1 text-xs">{a.name}</span>
              </div>
              <span className="text-xs text-gray-500">{a.iata_code}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Main ───────────────────────────────────────────────────────────

export default function FlightTimeCalculator() {
  const [airports, setAirports] = useState<Airport[]>([])
  const [loading, setLoading] = useState(true)

  const [originText, setOriginText] = useState('')
  const [destText, setDestText] = useState('')

  const [originAirport, setOriginAirport] = useState<Airport | null>(null)
  const [destAirport, setDestAirport] = useState<Airport | null>(null)

  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  // ✅ CLEAN DATA LOAD
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/data/airports.json')
        const data = await res.json()

        // minimal filtering only
        const valid = data.filter((a: Airport) =>
          a.iata_code && a._geoloc
        )

        console.log('Airports loaded:', valid.length)

        setAirports(valid)
      } catch (e) {
        console.error('Failed to load airports', e)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  function calculate() {
    setError('')
    if (!originAirport || !destAirport) {
      setError('Please select airports from the dropdown')
      return
    }

    const km = haversine(originAirport._geoloc, destAirport._geoloc)
    const mins = (km / 900) * 60

    setResult({
      km,
      mins,
    })
  }

  if (loading) return <div>Loading airports…</div>

  return (
    <div className="space-y-4">
      <AirportInput
        label="Origin"
        airports={airports}
        value={originText}
        onChange={setOriginText}
        onSelect={setOriginAirport}
      />

      <AirportInput
        label="Destination"
        airports={airports}
        value={destText}
        onChange={setDestText}
        onSelect={setDestAirport}
      />

      <button
        onClick={calculate}
        className="w-full py-2 bg-black text-white rounded-lg"
      >
        Calculate
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {result && (
        <div className="p-4 border rounded-lg">
          <p>Distance: {Math.round(result.km)} km</p>
          <p>Flight time: {fmtTime(result.mins)}</p>
        </div>
      )}
    </div>
  )
}