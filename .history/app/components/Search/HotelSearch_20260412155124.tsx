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

  const [fromResults, setFromResults] = useState<Airport[]>([])
  const [toResults, setToResults] = useState<Airport[]>([])

  const selectedFrom = useRef<Airport | null>(null)
  const selectedTo = useRef<Airport | null>(null)

  const travellerRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (travellerRef.current && !travellerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchAirports = async (q: string, setter: any) => {
    if (q.length < 2) return setter([])
    const res = await fetch(`/api/airports?q=${q}`)
    setter(await res.json())
  }

  useEffect(() => {
    const t = setTimeout(() => fetchAirports(from, setFromResults), 250)
    return () => clearTimeout(t)
  }, [from])

  useEffect(() => {
    const t = setTimeout(() => fetchAirports(to, setToResults), 250)
    return () => clearTimeout(t)
  }, [to])

  const buildUrl = () => {
    if (!selectedFrom.current || !selectedTo.current) return null

    const url = new URL(
      `https://www.kiwi.com/en/search/results/${selectedFrom.current.iata_code}/${selectedTo.current.iata_code}/${depart}`
    )

    if (roundTrip && returnDate) url.pathname += `/${returnDate}`

    url.searchParams.set('adults', String(adults))
    url.searchParams.set('children', String(children))
    url.searchParams.set('infants', String(infants))
    url.searchParams.set('currency', currency)

    return url.toString()
  }

  const search = () => {
    const url = buildUrl()
    if (!url) return
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-4 relative">

      {/* FROM */}
      <input
        className="w-full border p-3 rounded"
        placeholder="From"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />

      {fromResults.length > 0 && (
        <div className="absolute bg-white border w-full z-50 pointer-events-auto">
          {fromResults.map((a) => (
            <div
              key={a.iata_code}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setFrom(`${a.city} (${a.iata_code})`)
                selectedFrom.current = a
                setFromResults([])
              }}
            >
              {a.city} {a.iata_code}
            </div>
          ))}
        </div>
      )}

      {/* TO */}
      <input
        className="w-full border p-3 rounded"
        placeholder="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      {toResults.length > 0 && (
        <div className="absolute bg-white border w-full z-50 pointer-events-auto">
          {toResults.map((a) => (
            <div
              key={a.iata_code}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setTo(`${a.city} (${a.iata_code})`)
                selectedTo.current = a
                setToResults([])
              }}
            >
              {a.city} {a.iata_code}
            </div>
          ))}
        </div>
      )}

      {/* DATE */}
      <input type="date" value={depart} min={today} onChange={(e) => setDepart(e.target.value)} />

      {roundTrip && (
        <input type="date" value={returnDate} min={depart} onChange={(e) => setReturnDate(e.target.value)} />
      )}

      {/* TRAVELLERS */}
      <div ref={travellerRef}>
        <button onClick={() => setOpen(!open)} className="border p-3 w-full text-left">
          {adults} adults · {children} children · {infants} infants
        </button>

        {open && (
          <div className="border p-4 bg-white z-50 relative">
            <button onClick={() => setAdults(Math.max(1, adults - 1))}>-</button>
            {adults}
            <button onClick={() => setAdults(adults + 1)}>+</button>

            <button onClick={() => setChildren(Math.max(0, children - 1))}>-</button>
            {children}
            <button onClick={() => setChildren(children + 1)}>+</button>

            <button onClick={() => setInfants(Math.max(0, infants - 1))}>-</button>
            {infants}
            <button onClick={() => setInfants(infants + 1)}>+</button>
          </div>
        )}
      </div>

      <button onClick={search} className="bg-blue-600 text-white p-3 w-full">
        Search
      </button>
    </div>
  )
}