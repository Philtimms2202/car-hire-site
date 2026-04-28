'use client'

import { useState } from 'react'

const AIRPORTS: Record<string, { lat: number; lon: number }> = {
  'london':{lat:51.477,lon:-0.461},'heathrow':{lat:51.477,lon:-0.461},'lhr':{lat:51.477,lon:-0.461},
  'new york':{lat:40.639,lon:-73.779},'jfk':{lat:40.639,lon:-73.779},'nyc':{lat:40.639,lon:-73.779},
  'paris':{lat:49.009,lon:2.547},'cdg':{lat:49.009,lon:2.547},
  'dubai':{lat:25.253,lon:55.364},'dxb':{lat:25.253,lon:55.364},
  'singapore':{lat:1.359,lon:103.989},'sin':{lat:1.359,lon:103.989},
  'tokyo':{lat:35.553,lon:139.781},'nrt':{lat:35.553,lon:139.781},
  'sydney':{lat:-33.946,lon:151.177},'syd':{lat:-33.946,lon:151.177},
  'los angeles':{lat:33.942,lon:-118.408},'lax':{lat:33.942,lon:-118.408},
  'amsterdam':{lat:52.309,lon:4.764},'ams':{lat:52.309,lon:4.764},
  'frankfurt':{lat:50.037,lon:8.562},'fra':{lat:50.037,lon:8.562},
  'barcelona':{lat:41.297,lon:2.078},'bcn':{lat:41.297,lon:2.078},
  'rome':{lat:41.804,lon:12.251},'fco':{lat:41.804,lon:12.251},
  'istanbul':{lat:40.976,lon:28.814},'ist':{lat:40.976,lon:28.814},
  'toronto':{lat:43.677,lon:-79.630},'yyz':{lat:43.677,lon:-79.630},
  'chicago':{lat:41.978,lon:-87.904},'ord':{lat:41.978,lon:-87.904},
  'bangkok':{lat:13.681,lon:100.747},'bkk':{lat:13.681,lon:100.747},
  'hong kong':{lat:22.308,lon:113.914},'hkg':{lat:22.308,lon:113.914},
  'cape town':{lat:-33.964,lon:18.602},'cpt':{lat:-33.964,lon:18.602},
  'miami':{lat:25.796,lon:-80.287},'mia':{lat:25.796,lon:-80.287},
  'madrid':{lat:40.472,lon:-3.561},'mad':{lat:40.472,lon:-3.561},
  'lisbon':{lat:38.774,lon:-9.134},'lis':{lat:38.774,lon:-9.134},
  'munich':{lat:48.354,lon:11.786},'muc':{lat:48.354,lon:11.786},
  'zurich':{lat:47.464,lon:8.549},'zrh':{lat:47.464,lon:8.549},
  'vienna':{lat:48.110,lon:16.570},'vie':{lat:48.110,lon:16.570},
  'prague':{lat:50.101,lon:14.260},'prg':{lat:50.101,lon:14.260},
  'athens':{lat:37.936,lon:23.944},'ath':{lat:37.936,lon:23.944},
  'delhi':{lat:28.556,lon:77.100},'del':{lat:28.556,lon:77.100},
  'mumbai':{lat:19.088,lon:72.867},'bom':{lat:19.088,lon:72.867},
  'seoul':{lat:37.460,lon:126.440},'icn':{lat:37.460,lon:126.440},
  'beijing':{lat:40.080,lon:116.584},'pek':{lat:40.080,lon:116.584},
  'johannesburg':{lat:-26.133,lon:28.242},'jnb':{lat:-26.133,lon:28.242},
  'nairobi':{lat:-1.319,lon:36.927},'nbo':{lat:-1.319,lon:36.927},
  'faro':{lat:37.014,lon:-7.966},'fao':{lat:37.014,lon:-7.966},
  'manchester':{lat:53.365,lon:-2.273},'man':{lat:53.365,lon:-2.273},
  'edinburgh':{lat:55.950,lon:-3.372},'edi':{lat:55.950,lon:-3.372},
  'dublin':{lat:53.421,lon:-6.270},'dub':{lat:53.421,lon:-6.270},
  'tenerife':{lat:28.045,lon:-16.572},'tfs':{lat:28.045,lon:-16.572},
  'malaga':{lat:36.675,lon:-4.499},'agp':{lat:36.675,lon:-4.499},
  'palma':{lat:39.551,lon:2.739},'pmi':{lat:39.551,lon:2.739},
  'milan':{lat:45.445,lon:9.276},'mxp':{lat:45.445,lon:9.276},
  'auckland':{lat:-37.008,lon:174.791},'akl':{lat:-37.008,lon:174.791},
  'kuala lumpur':{lat:2.745,lon:101.709},'kul':{lat:2.745,lon:101.709},
  'abu dhabi':{lat:24.443,lon:54.651},'auh':{lat:24.443,lon:54.651},
  'doha':{lat:25.273,lon:51.608},'doh':{lat:25.273,lon:51.608},
  'reykjavik':{lat:63.985,lon:-22.605},'kef':{lat:63.985,lon:-22.605},
  'casablanca':{lat:33.367,lon:-7.590},'cmn':{lat:33.367,lon:-7.590},
  'glasgow':{lat:55.872,lon:-4.433},'gla':{lat:55.872,lon:-4.433},
  'brussels':{lat:50.901,lon:4.484},'bru':{lat:50.901,lon:4.484},
  'copenhagen':{lat:55.618,lon:12.656},'cph':{lat:55.618,lon:12.656},
  'oslo':{lat:60.193,lon:11.100},'osl':{lat:60.193,lon:11.100},
  'stockholm':{lat:59.651,lon:17.919},'arn':{lat:59.651,lon:17.919},
  'helsinki':{lat:60.317,lon:24.963},'hel':{lat:60.317,lon:24.963},
  'venice':{lat:45.505,lon:12.352},'vce':{lat:45.505,lon:12.352},
  'sao paulo':{lat:-23.435,lon:-46.473},'gru':{lat:-23.435,lon:-46.473},
  'alicante':{lat:38.282,lon:-0.558},'alc':{lat:38.282,lon:-0.558},
}

function haversine(a:{lat:number;lon:number}, b:{lat:number;lon:number}) {
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLon = (b.lon - a.lon) * Math.PI / 180
  const x = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x))
}

function fmtTime(mins: number) {
  const h = Math.floor(mins / 60)
  const m = Math.round(mins % 60)
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`
}

function lookup(name: string) {
  return AIRPORTS[name.trim().toLowerCase()] ?? null
}

export default function FlightTimeCalculator() {
  const [origin, setOrigin] = useState('')
  const [dest, setDest] = useState('')
  const [unit, setUnit] = useState<'km'|'mi'>('km')
  const [layover, setLayover] = useState('')
  const [stops, setStops] = useState<string[]>([])
  const [error, setError] = useState('')
  const [result, setResult] = useState<null | {
    totalKm: number
    totalFlightMins: number
    totalWithLayovers: number
    legs: { from:string; to:string; km:number; flightMins:number; layover:number }[]
  }>(null)

  function addStop() { setStops(s => [...s, '']) }
  function removeStop(i: number) { setStops(s => s.filter((_,idx)=>idx!==i)) }
  function updateStop(i: number, val: string) { setStops(s => s.map((v,idx)=>idx===i?val:v)) }

  function calculate() {
    setError('')
    const oCoord = lookup(origin)
    const dCoord = lookup(dest)
    if (!oCoord) { setError(`"${origin}" wasn't recognised. Try a city name or IATA code.`); return }
    if (!dCoord) { setError(`"${dest}" wasn't recognised. Try a city name or IATA code.`); return }

    const waypoints = [{ name: origin.trim(), coord: oCoord }]
    for (const s of stops) {
      if (!s.trim()) continue
      const c = lookup(s)
      if (!c) { setError(`Stop "${s}" wasn't recognised.`); return }
      waypoints.push({ name: s.trim(), coord: c })
    }
    waypoints.push({ name: dest.trim(), coord: dCoord })

    const SPEED = 900
    const layoverMins = parseInt(layover) || 0
    let totalKm = 0, totalFlight = 0
    const legs: { from:string; to:string; km:number; flightMins:number; layover:number }[] = []

    for (let i = 0; i < waypoints.length - 1; i++) {
      const km = haversine(waypoints[i].coord, waypoints[i+1].coord)
      const flightMins = (km / SPEED) * 60
      const isLast = i === waypoints.length - 2
      totalKm += km
      totalFlight += flightMins
      legs.push({ from: waypoints[i].name, to: waypoints[i+1].name, km, flightMins, layover: isLast ? 0 : layoverMins })
    }

    setResult({
      totalKm,
      totalFlightMins: totalFlight,
      totalWithLayovers: totalFlight + (stops.filter(s=>s.trim()).length * layoverMins),
      legs,
    })
  }

  const sym = unit === 'km' ? 'km' : 'mi'
  const conv = (km: number) => unit === 'km' ? Math.round(km) : Math.round(km * 0.621371)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Origin</label>
          <input
            type="text" value={origin} onChange={e=>setOrigin(e.target.value)}
            placeholder="e.g. London or LHR"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#03989e]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Destination</label>
          <input
            type="text" value={dest} onChange={e=>setDest(e.target.value)}
            placeholder="e.g. New York or JFK"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#03989e]"
          />
        </div>
      </div>

      {stops.map((s, i) => (
        <div key={i} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-500 mb-1">Stop {i+1}</label>
            <input
              type="text" value={s} onChange={e=>updateStop(i,e.target.value)}
              placeholder="e.g. Dubai"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#03989e]"
            />
          </div>
          <button onClick={()=>removeStop(i)}
            className="px-3 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm hover:bg-red-50 transition">
            Remove
          </button>
        </div>
      ))}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Layover per stop (mins)</label>
          <input
            type="number" value={layover} onChange={e=>setLayover(e.target.value)}
            placeholder="e.g. 90" min="0"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#03989e]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Distance unit</label>
          <div className="flex gap-2">
            {(['km','mi'] as const).map(u => (
              <button key={u} onClick={()=>setUnit(u)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition ${unit===u ? 'border-[#03989e] text-[#03989e] bg-teal-50' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
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

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Distance', value: `${conv(result.totalKm).toLocaleString()} ${sym}` },
              { label: 'Flight time', value: fmtTime(Math.round(result.totalFlightMins)) },
              ...(stops.filter(s=>s.trim()).length ? [{ label: 'With layovers', value: fmtTime(Math.round(result.totalWithLayovers)) }] : []),
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
                  <p className="text-sm font-medium" style={{ color: '#022135' }}>
                    {leg.from} → {leg.to}
                  </p>
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
            Calculated using the haversine formula at 900 km/h cruising speed. Actual times vary by aircraft, route and wind conditions.
          </p>
        </div>
      )}
    </div>
  )
}