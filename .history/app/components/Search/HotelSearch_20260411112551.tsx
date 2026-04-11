'use client'

import { useState } from 'react'
import { useLocale } from '@/app/context/localecontext'

type CityOption = {
  id: string
  name: string
  display: string
}

const CITIES: CityOption[] = [
  { id: '347', name: 'Los Angeles', display: 'Los Angeles' },
  { id: '2', name: 'London', display: 'London' },
  { id: '1', name: 'New York', display: 'New York' },
  // add more as needed
]

export default function HotelSearch() {
  const { language, currency } = useLocale()

  const [cityId, setCityId] = useState('347')
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')
  const [rooms, setRooms] = useState(1)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const handleSearch = () => {
    if (!cityId || !checkin || !checkout) {
      alert('Please select a city and dates.')
      return
    }

    const city = CITIES.find(c => c.id === cityId)
    if (!city) return

    setLoading(true)

    const url = new URL('https://www.trip.com/hotels/list')

    url.searchParams.set('allianceId', '8052073')
    url.searchParams.set('sid', '304662590')
    url.searchParams.set('trip_sub1', '')
    url.searchParams.set('trip_sub3', 'S15169730')

    url.searchParams.set('checkin', checkin.replace(/-/g, '/'))
    url.searchParams.set('checkout', checkout.replace(/-/g, '/'))

    url.searchParams.set('city', city.id)
    url.searchParams.set('display', city.display)
    url.searchParams.set('optionName', city.display)
    url.searchParams.set('optionId', city.id)
    url.searchParams.set('optionType', 'City')

    url.searchParams.set('crn', rooms.toString())
    url.searchParams.set('adult', adults.toString())
    url.searchParams.set('children', children.toString())

    // locale + currency (Trip.com respects these on normal URLs)
    url.searchParams.set('locale', language)
    url.searchParams.set('curr', currency)

    setLoading(false)
    window.open(url.toString(), '_blank')
  }

  return (
    <div className="card space-y-4">
      {/* City */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Destination</label>
        <select
          className="input-field bg-white text-gray-900 w-full"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
        >
          {CITIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.display}
            </option>
          ))}
        </select>
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
        className="btn-primary w-full disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Searching…' : 'Search hotels'}
      </button>
    </div>
  )
}
