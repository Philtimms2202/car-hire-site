'use client'
import { useState } from 'react'

export default function ExperienceSearch() {
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')

  const handleSearch = () => {
    if (!location) return

    const url = `https://www.getyourguide.com/s/?q=${encodeURIComponent(
      location
    )}&partner_id=P7B7GRH`

    window.open(url, '_blank')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-gray-500 text-sm mb-1">Location</label>
        <input
          type="text"
          placeholder="City or country"
          className="input-field"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-gray-500 text-sm mb-1">Date (optional)</label>
        <input
          type="date"
          className="input-field"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <button onClick={handleSearch} className="btn-primary mt-5 w-full">
        Search Experiences
      </button>
    </div>
  )
}