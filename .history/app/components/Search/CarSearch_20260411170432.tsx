'use client'

import { useState, useEffect, useRef } from 'react'
import { useLocale } from '@/context/localeContext'
import airports from '@/data/airports.json'

type Airport = {
  name: string
  city: string
  country: string
  iata_code: string
}

const TIMES = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0')
  const m = i % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

const fmt = (d: Date) => d.toISOString().split('T')[0]

function AirportInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (iata: string, display: string) => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Airport[]>([])
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleInput = (val: string) => {
    setQuery(val)
    setSelected(false)
    onChange('', val)
    if (val.length < 1) { setResults([]); setOpen(false); return }
    const q = val.toLowerCase()
    const filtered = (airports as Airport[]).filter(a =>
      a.iata_code?.toLowerCase().startsWith(q) ||
      a.city?.toLowerCase().includes(q) ||
      a.name?.toLowerCase().includes(q)
    ).slice(0, 8)
    setResults(filtered)
    setOpen(filtered.length > 0)
  }

  const pick = (a: Airport) => {
    const display = `${a.city} (${a.iata_code})`
    setQuery(display)
    setSelected(true)
    setOpen(false)
    onChange(a.iata_code, display)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref}>
      <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          className="input-field w-full"
          placeholder="Search airport or city..."
          value={query}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => results.length > 0 && !selected && setOpen(true)}
          autoComplete="off"
        />
        {open && (
          <ul className="absolute z-50 top-full left-0 right-0 mt-0.5 bg-white border border-gray-200 rounded-lg shadow-sm max-h-56 overflow-y-auto">
            {results.map(a => (
              <li
                key={a.iata_code}
                className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-0"
                onMouseDown={() => pick(a)}
              >
                <span className="text-sm">
                  <span className="font-medium text-gray-900">{a.city}</span>
                  <span className="text-gray-400 ml-1.5 text-xs">{a.name}</span>
                </span>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded ml-2 shrink-0">
                  {a.iata_code}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function CarSearch() {
  const { language, currency } = useLocale()

  const [pickupIata, setPickupIata] = useState('')
  const [dropIata, setDropIata] = useState('')
  const [diffDropoff, setDiffDropoff] = useState(false)
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('10:00')
  const [dropoffDate, setDropoffDate] = useState('')
  const [dropoffTime, setDropoffTime] = useState('10:00')
  const [driverAge, setDriverAge] = useState('30')
  const [licenceCountry, setLicenceCountry] = useState('GB')
  const [error, setError] = useState(false)

  useEffect(() => {
    const t1 = new Date(); t1.setDate(t1.getDate() + 1)
    const t4 = new Date(); t4.setDate(t4.getDate() + 4)
    setPickupDate(fmt(t1))
    setDropoffDate(fmt(t4))
  }, [])

  const handlePickupDate = (val: string) => {
    setPickupDate(val)
    const d = new Date(val); d.setDate(d.getDate() + 3)
    setDropoffDate(fmt(d))
  }

  const handleSearch = () => {
    if (!pickupIata) { setError(true); return }
    setError(false)
    const dropQuery = diffDropoff && dropIata ? dropIata : pickupIata
    const params = new URLSearchParams({
      pickup_name: pickupIata,
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      dropoff_name: dropQuery,
      dropoff_date: dropoffDate,
      dropoff_time: dropoffTime,
      driver_age: driverAge,
      locale: language,
      curr: currency,
    })
    window.open(
      `https://www.trip.com/carhire/?Allianceid=8052073&SID=304662590&trip_sub1=&trip_sub3=D15170094&${params}`,
      '_blank'
    )
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <label className="flex items-center gap-2 mb-5 cursor-pointer text-sm text-gray-500">
        <input type="checkbox" checked={diffDropoff} onChange={e => setDiffDropoff(e.target.checked)} />
        Drop off at a different location
      </label>

      <div className="mb-4">
        <AirportInput
          label="Pick-up airport"
          value={pickupIata}
          onChange={(iata) => { setPickupIata(iata); setError(false) }}
        />
        {error && <p className="text-xs text-red-500 mt-1">Please select an airport from the list</p>}
      </div>

      {diffDropoff && (
        <div className="mb-4">
          <AirportInput label="Drop-off airport" value={dropIata} onChange={(iata) => setDropIata(iata)} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Pick-up date</label>
          <input type="date" className="input-field w-full" value={pickupDate} min={fmt(new Date())} onChange={e => handlePickupDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Pick-up time</label>
          <select className="input-field w-full" value={pickupTime} onChange={e => setPickupTime(e.target.value)}>
            {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Drop-off date</label>
          <input type="date" className="input-field w-full" value={dropoffDate} min={pickupDate} onChange={e => setDropoffDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Drop-off time</label>
          <select className="input-field w-full" value={dropoffTime} onChange={e => setDropoffTime(e.target.value)}>
            {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <hr className="border-gray-100 my-4" />

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Driver age</label>
          <select className="input-field w-full" value={driverAge} onChange={e => setDriverAge(e.target.value)}>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="21">21–24</option>
            <option value="25">25–29</option>
            <option value="30">30–65</option>
            <option value="66">66–69</option>
            <option value="70">70+</option>
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Licence country</label>
          <select className="input-field w-full" value={licenceCountry} onChange={e => setLicenceCountry(e.target.value)}>
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <option value="AU">Australia</option>
            <option value="CA">Canada</option>
            <option value="IE">Ireland</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="ES">Spain</option>
            <option value="IT">Italy</option>
            <option value="NL">Netherlands</option>
            <option value="PT">Portugal</option>
            <option value="SE">Sweden</option>
            <option value="NZ">New Zealand</option>
            <option value="ZA">South Africa</option>
            <option value="IN">India</option>
            <option value="JP">Japan</option>
            <option value="AE">UAE</option>
          </select>
        </div>
      </div>

      <button onClick={handleSearch} className="btn-primary w-full py-3">
        Search car hire
      </button>
    </div>
  )
}