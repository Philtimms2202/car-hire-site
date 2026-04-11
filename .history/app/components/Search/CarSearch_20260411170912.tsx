'use client'

import { useState, useEffect, useRef } from 'react'
import { useLocale } from '@/context/localeContext'

const AFFILIATE = 'Allianceid=8052073&SID=304662590&trip_sub1=&trip_sub3=D15170094'
const CHANNEL = '235728'

type TripAirport = {
  iata: string
  name: string
  city: string
  country: string
  pcity: number
  scountry: number
  lat: number
  lon: number
  timezone: number
}

// Trip.com internal IDs extracted from their URL slugs and the sample URL you provided.
// pcity = Trip.com city ID, scountry = Trip.com country ID, timezone = UTC offset
const TRIP_AIRPORTS: TripAirport[] = [
  // United Kingdom (scountry: 109)
  { iata: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', pcity: 57, scountry: 109, lat: 51.4775, lon: -0.4614, timezone: 0 },
  { iata: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'United Kingdom', pcity: 57, scountry: 109, lat: 51.1481, lon: -0.1903, timezone: 0 },
  { iata: 'STN', name: 'Stansted Airport', city: 'London', country: 'United Kingdom', pcity: 57, scountry: 109, lat: 51.885, lon: 0.235, timezone: 0 },
  { iata: 'LTN', name: 'Luton Airport', city: 'London', country: 'United Kingdom', pcity: 57, scountry: 109, lat: 51.8747, lon: -0.3683, timezone: 0 },
  { iata: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom', pcity: 722, scountry: 109, lat: 53.3537, lon: -2.275, timezone: 0 },
  { iata: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', country: 'United Kingdom', pcity: 602, scountry: 109, lat: 55.9508, lon: -3.3725, timezone: 0 },
  { iata: 'BHX', name: 'Birmingham Airport', city: 'Birmingham', country: 'United Kingdom', pcity: 566, scountry: 109, lat: 52.4539, lon: -1.7480, timezone: 0 },
  { iata: 'GLA', name: 'Glasgow Airport', city: 'Glasgow', country: 'United Kingdom', pcity: 626, scountry: 109, lat: 55.8719, lon: -4.4331, timezone: 0 },
  { iata: 'BRS', name: 'Bristol Airport', city: 'Bristol', country: 'United Kingdom', pcity: 572, scountry: 109, lat: 51.3827, lon: -2.7191, timezone: 0 },
  { iata: 'NCL', name: 'Newcastle Airport', city: 'Newcastle', country: 'United Kingdom', pcity: 748, scountry: 109, lat: 55.0375, lon: -1.6917, timezone: 0 },
  { iata: 'LBA', name: 'Leeds Bradford Airport', city: 'Leeds', country: 'United Kingdom', pcity: 692, scountry: 109, lat: 53.8659, lon: -1.6606, timezone: 0 },
  { iata: 'ABZ', name: 'Aberdeen Airport', city: 'Aberdeen', country: 'United Kingdom', pcity: 549, scountry: 109, lat: 57.2019, lon: -2.1978, timezone: 0 },

  // United States (scountry: 66)
  { iata: 'LAX', name: 'Los Angeles Intl Airport', city: 'Los Angeles', country: 'United States', pcity: 347, scountry: 66, lat: 33.9425, lon: -118.4081, timezone: -8 },
  { iata: 'JFK', name: 'John F Kennedy Intl Airport', city: 'New York', country: 'United States', pcity: 400, scountry: 66, lat: 40.6413, lon: -73.7781, timezone: -5 },
  { iata: 'EWR', name: 'Newark Liberty Intl Airport', city: 'New York', country: 'United States', pcity: 400, scountry: 66, lat: 40.6895, lon: -74.1745, timezone: -5 },
  { iata: 'ORD', name: "O'Hare Intl Airport", city: 'Chicago', country: 'United States', pcity: 294, scountry: 66, lat: 41.9742, lon: -87.9073, timezone: -6 },
  { iata: 'MDW', name: 'Midway Airport', city: 'Chicago', country: 'United States', pcity: 294, scountry: 66, lat: 41.7868, lon: -87.7522, timezone: -6 },
  { iata: 'MIA', name: 'Miami Intl Airport', city: 'Miami', country: 'United States', pcity: 359, scountry: 66, lat: 25.7959, lon: -80.2870, timezone: -5 },
  { iata: 'FLL', name: 'Fort Lauderdale Airport', city: 'Fort Lauderdale', country: 'United States', pcity: 359, scountry: 66, lat: 26.0726, lon: -80.1527, timezone: -5 },
  { iata: 'LAS', name: 'Harry Reid Intl Airport', city: 'Las Vegas', country: 'United States', pcity: 340, scountry: 66, lat: 36.0840, lon: -115.1537, timezone: -8 },
  { iata: 'SFO', name: 'San Francisco Intl Airport', city: 'San Francisco', country: 'United States', pcity: 449, scountry: 66, lat: 37.6213, lon: -122.3790, timezone: -8 },
  { iata: 'SEA', name: 'Seattle-Tacoma Intl Airport', city: 'Seattle', country: 'United States', pcity: 455, scountry: 66, lat: 47.4502, lon: -122.3088, timezone: -8 },
  { iata: 'DFW', name: 'Dallas Fort Worth Intl Airport', city: 'Dallas', country: 'United States', pcity: 303, scountry: 66, lat: 32.8998, lon: -97.0403, timezone: -6 },
  { iata: 'ATL', name: 'Hartsfield-Jackson Atlanta Airport', city: 'Atlanta', country: 'United States', pcity: 264, scountry: 66, lat: 33.6407, lon: -84.4277, timezone: -5 },
  { iata: 'DEN', name: 'Denver Intl Airport', city: 'Denver', country: 'United States', pcity: 308, scountry: 66, lat: 39.8561, lon: -104.6737, timezone: -7 },
  { iata: 'BOS', name: 'Boston Logan Intl Airport', city: 'Boston', country: 'United States', pcity: 276, scountry: 66, lat: 42.3656, lon: -71.0096, timezone: -5 },
  { iata: 'PHX', name: 'Phoenix Sky Harbor Airport', city: 'Phoenix', country: 'United States', pcity: 427, scountry: 66, lat: 33.4373, lon: -112.0078, timezone: -7 },
  { iata: 'MCO', name: 'Orlando Intl Airport', city: 'Orlando', country: 'United States', pcity: 413, scountry: 66, lat: 28.4312, lon: -81.3081, timezone: -5 },
  { iata: 'HNL', name: 'Honolulu Intl Airport', city: 'Honolulu', country: 'United States', pcity: 328, scountry: 66, lat: 21.3187, lon: -157.9224, timezone: -10 },

  // Europe
  { iata: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', pcity: 71, scountry: 75, lat: 49.0097, lon: 2.5479, timezone: 1 },
  { iata: 'ORY', name: 'Orly Airport', city: 'Paris', country: 'France', pcity: 71, scountry: 75, lat: 48.7262, lon: 2.3652, timezone: 1 },
  { iata: 'AMS', name: 'Schiphol Airport', city: 'Amsterdam', country: 'Netherlands', pcity: 5, scountry: 146, lat: 52.3086, lon: 4.7639, timezone: 1 },
  { iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', pcity: 207, scountry: 78, lat: 50.0379, lon: 8.5622, timezone: 1 },
  { iata: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', pcity: 219, scountry: 78, lat: 48.3537, lon: 11.7750, timezone: 1 },
  { iata: 'MAD', name: 'Adolfo Suarez Madrid Airport', city: 'Madrid', country: 'Spain', pcity: 269, scountry: 182, lat: 40.4936, lon: -3.5668, timezone: 1 },
  { iata: 'BCN', name: 'El Prat Airport', city: 'Barcelona', country: 'Spain', pcity: 235, scountry: 182, lat: 41.2974, lon: 2.0833, timezone: 1 },
  { iata: 'FCO', name: 'Fiumicino Airport', city: 'Rome', country: 'Italy', pcity: 130, scountry: 110, lat: 41.8003, lon: 12.2389, timezone: 1 },
  { iata: 'MXP', name: 'Malpensa Airport', city: 'Milan', country: 'Italy', pcity: 122, scountry: 110, lat: 45.6306, lon: 8.7281, timezone: 1 },
  { iata: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', pcity: 429, scountry: 189, lat: 47.4647, lon: 8.5492, timezone: 1 },
  { iata: 'VIE', name: 'Vienna Intl Airport', city: 'Vienna', country: 'Austria', pcity: 26, scountry: 24, lat: 48.1103, lon: 16.5697, timezone: 1 },
  { iata: 'LIS', name: 'Lisbon Airport', city: 'Lisbon', country: 'Portugal', pcity: 259, scountry: 167, lat: 38.7813, lon: -9.1359, timezone: 0 },
  { iata: 'AGP', name: 'Malaga Airport', city: 'Malaga', country: 'Spain', pcity: 271, scountry: 182, lat: 36.6749, lon: -4.4991, timezone: 1 },
  { iata: 'PMI', name: 'Palma de Mallorca Airport', city: 'Palma', country: 'Spain', pcity: 280, scountry: 182, lat: 39.5517, lon: 2.7388, timezone: 1 },
  { iata: 'ATH', name: 'Athens Intl Airport', city: 'Athens', country: 'Greece', pcity: 17, scountry: 85, lat: 37.9364, lon: 23.9445, timezone: 2 },
  { iata: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark', pcity: 51, scountry: 59, lat: 55.6181, lon: 12.6560, timezone: 1 },
  { iata: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'Sweden', pcity: 192, scountry: 188, lat: 59.6519, lon: 17.9186, timezone: 1 },
  { iata: 'OSL', name: 'Oslo Gardermoen Airport', city: 'Oslo', country: 'Norway', pcity: 159, scountry: 154, lat: 60.1976, lon: 11.1004, timezone: 1 },
  { iata: 'HEL', name: 'Helsinki Vantaa Airport', city: 'Helsinki', country: 'Finland', pcity: 88, scountry: 74, lat: 60.3172, lon: 24.9633, timezone: 2 },
  { iata: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland', pcity: 68, scountry: 108, lat: 53.4213, lon: -6.2701, timezone: 0 },

  // Middle East & Asia
  { iata: 'DXB', name: 'Dubai Intl Airport', city: 'Dubai', country: 'UAE', pcity: 381, scountry: 207, lat: 25.2532, lon: 55.3657, timezone: 4 },
  { iata: 'AUH', name: 'Abu Dhabi Intl Airport', city: 'Abu Dhabi', country: 'UAE', pcity: 376, scountry: 207, lat: 24.4330, lon: 54.6511, timezone: 4 },
  { iata: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore', pcity: 178, scountry: 176, lat: 1.3644, lon: 103.9915, timezone: 8 },
  { iata: 'HKG', name: 'Hong Kong Intl Airport', city: 'Hong Kong', country: 'Hong Kong', pcity: 96, scountry: 96, lat: 22.3080, lon: 113.9185, timezone: 8 },
  { iata: 'NRT', name: 'Narita Intl Airport', city: 'Tokyo', country: 'Japan', pcity: 201, scountry: 114, lat: 35.7720, lon: 140.3929, timezone: 9 },
  { iata: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan', pcity: 201, scountry: 114, lat: 35.5494, lon: 139.7798, timezone: 9 },
  { iata: 'ICN', name: 'Incheon Intl Airport', city: 'Seoul', country: 'South Korea', pcity: 174, scountry: 175, lat: 37.4602, lon: 126.4407, timezone: 9 },
  { iata: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', pcity: 30, scountry: 193, lat: 13.6900, lon: 100.7501, timezone: 7 },
  { iata: 'KUL', name: 'Kuala Lumpur Intl Airport', city: 'Kuala Lumpur', country: 'Malaysia', pcity: 136, scountry: 131, lat: 2.7456, lon: 101.7099, timezone: 8 },

  // Australia & NZ
  { iata: 'SYD', name: 'Kingsford Smith Airport', city: 'Sydney', country: 'Australia', pcity: 196, scountry: 23, lat: -33.9399, lon: 151.1753, timezone: 10 },
  { iata: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', pcity: 143, scountry: 23, lat: -37.6690, lon: 144.8410, timezone: 10 },
  { iata: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia', pcity: 33, scountry: 23, lat: -27.3842, lon: 153.1175, timezone: 10 },
  { iata: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australia', pcity: 164, scountry: 23, lat: -31.9403, lon: 115.9669, timezone: 8 },
  { iata: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', pcity: 18, scountry: 149, lat: -37.0082, lon: 174.7850, timezone: 12 },

  // Canada
  { iata: 'YYZ', name: 'Toronto Pearson Airport', city: 'Toronto', country: 'Canada', pcity: 204, scountry: 38, lat: 43.6777, lon: -79.6248, timezone: -5 },
  { iata: 'YVR', name: 'Vancouver Intl Airport', city: 'Vancouver', country: 'Canada', pcity: 211, scountry: 38, lat: 49.1967, lon: -123.1815, timezone: -8 },
  { iata: 'YUL', name: 'Montreal Trudeau Airport', city: 'Montreal', country: 'Canada', pcity: 152, scountry: 38, lat: 45.4706, lon: -73.7408, timezone: -5 },

  // South Africa
  { iata: 'JNB', name: 'O.R. Tambo Intl Airport', city: 'Johannesburg', country: 'South Africa', pcity: 117, scountry: 178, lat: -26.1367, lon: 28.2411, timezone: 2 },
  { iata: 'CPT', name: 'Cape Town Intl Airport', city: 'Cape Town', country: 'South Africa', pcity: 39, scountry: 178, lat: -33.9648, lon: 18.6017, timezone: 2 },
]

const TIMES = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0')
  const m = i % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

const fmt = (d: Date) => d.toISOString().split('T')[0]
const fmtTrip = (date: string, time: string) =>
  `${date.replace(/-/g, '/')} ${time}`

function AirportInput({
  label,
  onSelect,
  error,
}: {
  label: string
  onSelect: (airport: TripAirport | null) => void
  error?: boolean
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TripAirport[]>([])
  const [open, setOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleInput = (val: string) => {
    setQuery(val)
    setConfirmed(false)
    onSelect(null)
    if (val.length < 1) { setResults([]); setOpen(false); return }
    const q = val.toLowerCase()
    const filtered = TRIP_AIRPORTS.filter(a =>
      a.iata.toLowerCase().startsWith(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
    ).slice(0, 8)
    setResults(filtered)
    setOpen(filtered.length > 0)
  }

  const pick = (a: TripAirport) => {
    setQuery(`${a.city} — ${a.name} (${a.iata})`)
    setConfirmed(true)
    setOpen(false)
    onSelect(a)
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
          className={`input-field w-full ${error && !confirmed ? 'border-red-400' : ''}`}
          placeholder="Search city or airport…"
          value={query}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => { if (results.length > 0 && !confirmed) setOpen(true) }}
          autoComplete="off"
        />
        {open && (
          <ul className="absolute z-50 top-full left-0 right-0 mt-0.5 bg-white border border-gray-200 rounded-lg overflow-y-auto max-h-60">
            {results.map(a => (
              <li
                key={a.iata}
                className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-0"
                onMouseDown={() => pick(a)}
              >
                <span className="text-sm min-w-0 mr-2">
                  <span className="font-medium text-gray-900">{a.city}</span>
                  <span className="text-gray-400 ml-1.5 text-xs truncate">{a.name}</span>
                </span>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                  {a.iata}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && !confirmed && (
        <p className="text-xs text-red-500 mt-1">Please select an airport from the list</p>
      )}
    </div>
  )
}

export default function CarSearch() {
  const { language, currency } = useLocale()

  const [pickupAirport, setPickupAirport] = useState<TripAirport | null>(null)
  const [dropAirport, setDropAirport] = useState<TripAirport | null>(null)
  const [diffDropoff, setDiffDropoff] = useState(false)
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('10:00')
  const [dropoffDate, setDropoffDate] = useState('')
  const [dropoffTime, setDropoffTime] = useState('10:00')
  const [driverAge, setDriverAge] = useState('30-60')
  const [showError, setShowError] = useState(false)

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

  const buildLocationParams = (airport: TripAirport, prefix: 'p' | 'r') => ({
    [`${prefix}city`]: airport.pcity,
    [`${prefix}cityName`]: `${airport.name}`,
    [`${prefix}cityname`]: `${airport.name}`,
    [`${prefix}code`]: airport.iata,
    [`${prefix}type`]: 1,
    [`${prefix}lat`]: airport.lat,
    [`${prefix}lon`]: airport.lon,
    [`${prefix}address`]: `${airport.name} (${airport.iata})`,
    [`${prefix}timezone`]: airport.timezone,
  })

  const handleSearch = () => {
    if (!pickupAirport) { setShowError(true); return }
    if (diffDropoff && !dropAirport) { setShowError(true); return }
    setShowError(false)

    const returnAirport = diffDropoff && dropAirport ? dropAirport : pickupAirport

    const params = new URLSearchParams({
      ...Object.fromEntries(
        Object.entries(buildLocationParams(pickupAirport, 'p')).map(([k, v]) => [k, String(v)])
      ),
      ...Object.fromEntries(
        Object.entries(buildLocationParams(returnAirport, 'r')).map(([k, v]) => [k, String(v)])
      ),
      ptime: fmtTrip(pickupDate, pickupTime),
      rtime: fmtTrip(dropoffDate, dropoffTime),
      scountry: String(pickupAirport.scountry),
      age: driverAge,
      channelid: CHANNEL,
      locale: language === 'en' ? 'en-XX' : language,
    })

    const url = `https://www.trip.com/carhire/online/list?${params.toString()}&${AFFILIATE}`
    window.open(url, '_blank')
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <label className="flex items-center gap-2 mb-5 cursor-pointer text-sm text-gray-500 select-none">
        <input
          type="checkbox"
          checked={diffDropoff}
          onChange={e => setDiffDropoff(e.target.checked)}
        />
        Drop off at a different location
      </label>

      <div className="mb-4">
        <AirportInput
          label="Pick-up airport"
          onSelect={setPickupAirport}
          error={showError && !pickupAirport}
        />
      </div>

      {diffDropoff && (
        <div className="mb-4">
          <AirportInput
            label="Drop-off airport"
            onSelect={setDropAirport}
            error={showError && !dropAirport}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Pick-up date</label>
          <input
            type="date"
            className="input-field w-full"
            value={pickupDate}
            min={fmt(new Date())}
            onChange={e => handlePickupDate(e.target.value)}
          />
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
          <input
            type="date"
            className="input-field w-full"
            value={dropoffDate}
            min={pickupDate}
            onChange={e => setDropoffDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Drop-off time</label>
          <select className="input-field w-full" value={dropoffTime} onChange={e => setDropoffTime(e.target.value)}>
            {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <hr className="border-gray-100 my-4" />

      <div className="mb-5">
        <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Driver age</label>
        <select className="input-field w-full" value={driverAge} onChange={e => setDriverAge(e.target.value)}>
          <option value="18-29">18–29</option>
          <option value="30-60">30–60</option>
          <option value="61-99">61+</option>
        </select>
      </div>

      <button onClick={handleSearch} className="btn-primary w-full py-3">
        Search car hire
      </button>
    </div>
  )
}
