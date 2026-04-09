'use client'

import { useState, useEffect } from 'react'

type Airport = {
  name: string
  city: string
  country: string
  iata_code: string
}

export default function FlightSearch() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [depart, setDepart] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [roundTrip, setRoundTrip] = useState(true)

  const [fromResults, setFromResults] = useState<Airport[]>([])
  const [toResults, setToResults] = useState<Airport[]>([])
  const [selectedFrom, setSelectedFrom] = useState<Airport | null>(null)
  const [selectedTo, setSelectedTo] = useState<Airport | null>(null)

  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]

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

  useEffect(() => {
    debouncedFromSearch(from)
  }, [from])

  useEffect(() => {
    debouncedToSearch(to)
  }, [to])

  const fetchKiwiSlug = async (iata: string) => {
    const res = await fetch(
      `https://api.skypicker.com/locations?term=${encodeURIComponent(
        iata
      )}&locale=en-US&location_types=airport&limit=1`
    )
    const data = await res.json()
    if (!data.locations?.length) return null
    return data.locations[0].slug as string
  }

  const buildKiwiUrl = async () => {
    if (!selectedFrom || !selectedTo || !depart) return ''

    const [originSlug, destinationSlug] = await Promise.all([
      fetchKiwiSlug(selectedFrom.iata_code),
      fetchKiwiSlug(selectedTo.iata_code),
    ])

    if (!originSlug || !destinationSlug) return ''

    const url = new URL('https://www.kiwi.com/en/')

    url.searchParams.set(
      'affilid',
      'travelpayoutsdeeplink_timmstravel.com_6bc7301798224d1cad7e3f320-714930'
    )

    url.searchParams.set('origin', originSlug)
    url.searchParams.set('destination', destinationSlug)
    url.searchParams.set('outboundDate', depart)

    if (roundTrip && returnDate) {
      url.searchParams.set('inboundDate', returnDate)
    } else {
      url.searchParams.set('inboundDate', 'no-return')
    }

    url.searchParams.set('adults', '1')
    url.searchParams.set('children', '0')
    url.searchParams.set('infants', '0')
    url.searchParams.set('cabinClass', 'economy')

    return url.toString()
  }

  const handleSearch = async () => {
    if (!selectedFrom || !selectedTo || !depart) {
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
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded ${
            roundTrip ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setRoundTrip(true)}
        >
          Return
        </button>
        <button
          className={`px-4 py-2 rounded ${
            !roundTrip ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setRoundTrip(false)}
        >
          One way
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <label className="block text-gray-600 text-sm mb-1">From</label>
          <input
            className="input-field bg-white text-gray-900"
            placeholder="City or airport"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value)
              setSelectedFrom(null)
            }}
          />
          {renderDropdown(fromResults, setFromResults, setFrom, setSelectedFrom)}
        </div>

        <div className="relative">
          <label className="block text-gray-600 text-sm mb-1">To</label>
          <input
            className="input-field bg-white text-gray-900"
            placeholder="City or airport"
            value={to}
            onChange={(e) => {
              setTo(e.target.value)
              setSelectedTo(null)
            }}
          />
          {renderDropdown(toResults, setToResults, setTo, setSelectedTo)}
        </div>

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
