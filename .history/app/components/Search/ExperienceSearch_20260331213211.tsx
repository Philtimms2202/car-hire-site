'use client'
import { useState } from 'react'

export default function ExperienceSearch({ data }) {
  // data = { Europe: { "United Kingdom": ["London", "Manchester"], ... } }

  const [continent, setContinent] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')

  const handleSearch = () => {
    if (!city) return

    const url = `https://www.getyourguide.com/s/?q=${encodeURIComponent(
      city
    )}&partner_id=P7B7GRH`

    window.open(url, '_blank')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      {/* Continent */}
      <div>
        <label className="block text-gray-500 text-sm mb-1">Continent</label>
        <select
          className="input-field"
          value={continent}
          onChange={(e) => {
            setContinent(e.target.value)
            setCountry('')
            setCity('')
          }}
        >
          <option value="">Select continent</option>
          {Object.keys(data).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Country */}
      <div>
        <label className="block text-gray-500 text-sm mb-1">Country</label>
        <select
          className="input-field"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value)
            setCity('')
          }}
          disabled={!continent}
        >
          <option value="">Select country</option>
          {continent &&
            Object.keys(data[continent]).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="block text-gray-500 text-sm mb-1">City</label>
        <select
          className="input-field"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={!country}
        >
          <option value="">Select city</option>
          {country &&
            data[continent][country].map((cityName) => (
              <option key={cityName} value={cityName}>{cityName}</option>
            ))}
        </select>
      </div>

      {/* Search */}
      <button onClick={handleSearch} className="btn-primary mt-5 w-full">
        Search Experiences
      </button>
    </div>
  )
}