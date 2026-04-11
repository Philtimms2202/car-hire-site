'use client'

import { useState, useEffect } from 'react'
import { useLocale } from '@/app/context/localecontext'

type City = {
  id: string
  name: string
  country: string
}

export default function HotelSearch() {
  const { language, currency } = useLocale()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')
  const [rooms, setRooms] = useState(1)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  const today = new Date().toISOString().split('T')[0]

  // Debounce helper
  const debounce = (fn: (...args: any[]) => void, delay = 300) => {
    let timer: any
    return (...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  }

  // Fetch cities from your API
  const fetchCities = async (q: string) => {
    if (!q || q.length < 2) {
      setResults([])
      return
    }

    const res = await fetch(`/api/hotel-cities?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setResults(data)
  }

  const debouncedSearch = debounce(fetchCities)

  useEffect(() => {
    debouncedSearch(query)
  }, [query])

  const handleSearch = () => {
    if (!selectedCity || !checkin || !checkout) {
      alert('Please select a city and dates.')
      return
    }

    const url = new URL('https://www.trip.com/hotels/list')

    url.searchParams.set('allianceId', '8052073')
    url.searchParams.set('sid', '304662590')
    url.searchParams.set('trip_sub1', '')
    url.searchParams.set('trip_sub3', 'S15169730')

    url.searchParams.set('checkin', checkin.replace(/-/g, '/'))
    url.searchParams.set('checkout', checkout.replace(/-/g, '/'))

    url.searchParams.set('city', selectedCity.id)
    url.searchParams.set('display', selectedCity.name)
    url.searchParams.set('optionName', selectedCity.name)
    url.searchParams.set('optionId', selectedCity.id)
    url.searchParams.set('optionType', 'City')

    url.searchParams.set('crn', rooms.toString())
    url.searchParams.set('adult', adults.toString())
    url.searchParams.set('children', children.toString())

    // Locale + currency (Trip.com respects these on deep links)
    url.searchParams.set('locale', language)
    url.searchParams.set('curr', currency)

    window.open(url.toString(), '_blank')
  }

  return (
    <div className="card space-y-4">

      {/* City Search */}
      <div className="relative">
        <label className="block text-sm text-gray-600 mb-1">Destination</label>
        <input
          className="input-field bg-white text-gray-900 w-full"
          placeholder="Search city..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedCity(null)
          }}
        />

        {results.length > 0 && (
          <div className="absolute left-0 right-0 bg-white border rounded-xl shadow-xl mt-2 max-h-64 overflow-y-auto z-50">
            {results.map((city) => (
              <div
                key={city.id}
                className="px-4 py-3 cursor-pointer hover:bg-blue-50"
                onClick={() => {
                  setSelectedCity(city)
                  setQuery(`${city.name}, ${city.country}`)
                  setResults([])
                }}
              >
                <div className="font-semibold">{city.name}</div>
                <div className="text-sm text-gray-500">{city.country}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Check-in</label>
          <input
            type="date"
            className="input-field bg-white text-gray-900 w-full"
            value={checkin}
            min={today}
            onChange={(e) => setCheckin(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Check-out</label>
          <input
            type="date"
            className="input-field bg-white text-gray-900 w-full"
            value={checkout}
            min={checkin || today}
            onChange={(e) => setCheckout(e.target.value)}
          />
        </div>
      </div>

      {/* Guests */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Rooms</label>
          <input
            type="number"
            min={1}
            className="input-field bg-white text-gray-900 w-full"
            value={rooms}
            onChange={(e) => setRooms(Number(e.target.value) || 1)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Adults</label>
          <input
            type="number"
            min={1}
            className="input-field bg-white text-gray-900 w-full"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value) || 1)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Children</label>
          <input
            type="number"
            min={0}
            className="input-field bg-white text-gray-900 w-full"
            value={children}
            onChange={(e) => setChildren(Number(e.target.value) || 0)}
          />
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="btn-primary w-full"
      >
        Search hotels
      </button>
    </div>
  )
}
