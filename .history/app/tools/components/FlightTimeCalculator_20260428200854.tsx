'use client'

import { useState, useEffect, useRef } from 'react'

type Airport = {
  name: string
  city: string
  country: string
  iata_code: string
  _geoloc: { lat: number; lng: number }
}

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

function searchAirports(airports: Airport[], query: string, limit = 6): Airport[] {
  if (!query || query.trim().length < 2) return []
  const q = query.trim().toLowerCase()

  // Exact IATA match first
  const iataMatch = airports.find(a => a.iata_code?.toLowerCase() === q)
  if (iataMatch) return [iataMatch]

  // Score-based search: city name match scores highest, then airport name, then country
  const scored = airports
    .map(a => {
      const city    = a.city?.toLowerCase() ?? ''
      const name    = a.name?.toLowerCase() ?? ''
      const iata    = a.iata_code?.toLowerCase() ?? ''
      const country = a.country?.toLowerCase() ?? ''
      let score = 0
      if (city === q)            score += 100
      if (iata === q)            score += 90
      if (city.startsWith(q))    score += 60
      if (iata.startsWith(q))    score += 50
      if (city.includes(q))      score += 30
      if (name.includes(q))      score += 20
      if (country.includes(q))   score += 5
      return { airport: a, score }
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map(r => r.airport)
}

// ─── Autocomplete input ───────────────────────────────────────────────────────

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
    setOpen(results.length > 0 && value.length >= 2)
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
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#03989e]"
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map(a => (
            <li key={a.objectID ?? a.iata_code}
              onMouseDown={() => {
                onSelect(a)
                onChange(`${a.city} (${a.iata_code})`)
                setOpen(false)
              }}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-0"
            >
              <div>
                <span className="font-medium" style={{ color: '#022135' }}>{a.city}</span>
                <span className="text-gray-400 ml-1.5 text-xs">{a.name}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <span className="text-xs text-gray-400">{a.country}</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: '#e0f5f5', color: '#03989e' }}>
                  {a.iata_code}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FlightTimeCalculator() {
  const [airports, setAirports] = useState<Airport[]>([])
  const [loading, setLoading]   = useState(true)

  const [originText, setOriginText]     = useState('')
  const [destText, setDestText]         = useState('')
  const [stopTexts, setStopTexts]       = useState<string[]>([])

  const [originAirport, setOriginAirport]   = useState<Airport | null>(null)
  const [destAirport, setDestAirport]       = useState<Airport | null>(null)
  const [stopAirports, setStopAirports]     = useState<(Airport | null)[]>([])

  const [layover, setLayover] = useState('')
  const [unit, setUnit]       = useState<'km' | 'mi'>('km')
  const [error, setError]     = useState('')

  const [result, setResult] = useState<null | {
    totalKm: number
    totalFlightMins: number
    totalWithLayovers: number
    legs: { from: string; to: string; km: number; flightMins: number; layover: number }[]
  }>(null)

useEffect(() => {
  async function loadAirports() {
    try {
      const res = await fetch('/data/airports.json')

      if (!res.ok) {
        throw new Error(`Failed to fetch airports: ${res.status}`)
      }

      const data: Airport[] = await res.json()

      // Keep only valid airports (don’t exclude 0 coords)
      const validAirports = data.filter(a =>
        a.iata_code &&
        a._geoloc &&
        typeof a._geoloc.lat === 'number' &&
        typeof a._geoloc.lng === 'number'
      )

      setAirports(validAirports)

      // Debug (remove later)
      console.log('Loaded airports:', validAirports.length)

    } catch (err) {
      console.error('Error loading airports:', err)
    } finally {
      setLoading(false)
    }
  }

  loadAirports()
}, [])

  function addStop() {
    setStopTexts(t => [...t, ''])
    setStopAirports(a => [...a, null])
  }

  function removeStop(i: number) {
    setStopTexts(t => t.filter((_, idx) => idx !== i))
    setStopAirports(a => a.filter((_, idx) => idx !== i))
  }

  function updateStopText(i: number, val: string) {
    setStopTexts(t => t.map((v, idx) => idx === i ? val : v))
  }

  function updateStopAirport(i: number, a: Airport) {
    setStopAirports(prev => prev.map((v, idx) => idx === i ? a : v))
  }

  function calculate() {
    setError('')

    if (!originAirport) { setError('Please select a valid origin airport from the suggestions.'); return }
    if (!destAirport)   { setError('Please select a valid destination airport from the suggestions.'); return }

    const waypoints: { name: string; coord: { lat: number; lng: number } }[] = [
      { name: `${originAirport.city} (${originAirport.iata_code})`, coord: originAirport._geoloc },
    ]

    for (let i = 0; i < stopAirports.length; i++) {
      const s = stopAirports[i]
      if (!s) { setError(`Please select a valid airport for stop ${i + 1} from the suggestions.`); return }
      waypoints.push({ name: `${s.city} (${s.iata_code})`, coord: s._geoloc })
    }

    waypoints.push({ name: `${destAirport.city} (${destAirport.iata_code})`, coord: destAirport._geoloc })

    const SPEED = 900
    const layoverMins = parseInt(layover) || 0
    let totalKm = 0, totalFlight = 0
    const legs: { from: string; to: string; km: number; flightMins: number; layover: number }[] = []

    for (let i = 0; i < waypoints.length - 1; i++) {
      const km = haversine(waypoints[i].coord, waypoints[i + 1].coord)
      const flightMins = (km / SPEED) * 60
      const isLast = i === waypoints.length - 2
      totalKm += km
      totalFlight += flightMins
      legs.push({
        from: waypoints[i].name,
        to: waypoints[i + 1].name,
        km, flightMins,
        layover: isLast ? 0 : layoverMins,
      })
    }

    const activeStops = stopAirports.filter(Boolean).length

    setResult({
      totalKm,
      totalFlightMins: totalFlight,
      totalWithLayovers: totalFlight + (activeStops * layoverMins),
      legs,
    })
  }

  const conv  = (km: number) => unit === 'km' ? Math.round(km) : Math.round(km * 0.621371)
  const sym   = unit === 'km' ? 'km' : 'mi'

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-400">
        Loading airport data…
      </div>
    )
  }

  return (
    <div className="space-y-5">

      {/* Origin + Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AirportInput
          label="Origin"
          airports={airports}
          value={originText}
          onChange={v => { setOriginText(v); setOriginAirport(null) }}
          onSelect={a => setOriginAirport(a)}
          placeholder="City name or IATA code"
        />
        <AirportInput
          label="Destination"
          airports={airports}
          value={destText}
          onChange={v => { setDestText(v); setDestAirport(null) }}
          onSelect={a => setDestAirport(a)}
          placeholder="City name or IATA code"
        />
      </div>

      {/* Stops */}
      {stopTexts.map((text, i) => (
        <div key={i} className="flex gap-3 items-end">
          <div className="flex-1">
            <AirportInput
              label={`Stop ${i + 1}`}
              airports={airports}
              value={text}
              onChange={v => { updateStopText(i, v); updateStopAirport(i, null as any) }}
              onSelect={a => updateStopAirport(i, a)}
              placeholder="City name or IATA code"
            />
          </div>
          <button onClick={() => removeStop(i)}
            className="mb-0.5 px-3 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm hover:bg-red-50 transition">
            Remove
          </button>
        </div>
      ))}

      {/* Options row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Layover per stop (mins)</label>
          <input
            type="number" value={layover} min={0}
            onChange={e => setLayover(e.target.value)}
            placeholder="e.g. 90"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#03989e]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Distance unit</label>
          <div className="flex gap-2">
            {(['km', 'mi'] as const).map(u => (
              <button key={u} onClick={() => setUnit(u)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition ${
                  unit === u
                    ? 'border-[#03989e] text-[#03989e] bg-teal-50'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}>
                {u === 'km' ? 'Kilometres' : 'Miles'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-2">
          <button onClick={addStop}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-300 transition">
            + Add stop
          </button>
          <button onClick={calculate}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: '#022135' }}>
            Calculate
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Distance',     value: `${conv(result.totalKm).toLocaleString()} ${sym}` },
              { label: 'Flight time',  value: fmtTime(Math.round(result.totalFlightMins)) },
              ...(stopAirports.filter(Boolean).length
                ? [{ label: 'With layovers', value: fmtTime(Math.round(result.totalWithLayovers)) }]
                : []),
              { label: 'Legs', value: String(result.legs.length) },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-3">
                <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                <p className="text-lg font-semibold" style={{ color: '#022135' }}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {result.legs.map((leg, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#022135' }}>{leg.from} → {leg.to}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {conv(leg.km).toLocaleString()} {sym}
                    {leg.layover ? ` · Layover: ${fmtTime(leg.layover)}` : ''}
                  </p>
                </div>
                <p className="text-sm font-semibold" style={{ color: '#03989e' }}>
                  {fmtTime(Math.round(leg.flightMins))}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 pt-1">
            Calculated using the haversine formula at 900 km/h cruising speed. Actual times vary by aircraft, route and wind.
          </p>
        </div>
      )}
    </div>
  )
}