'use client'
import { useState, useEffect } from 'react'

export default function ExperienceSearch() {
  const [location, setLocation] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Re-run widget engine when searchTerm changes
  useEffect(() => {
    if (!searchTerm) return

    // Wait for DOM to update, then reinitialize widgets
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.gyg) {
        window.gyg.init()
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleSearch = () => {
    if (!location) return
    setSearchTerm(location)
  }

  return (
    <>
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

        <div></div>

        <button onClick={handleSearch} className="btn-primary mt-5 w-full">
          Search Experiences
        </button>
      </div>

      {searchTerm && (
        <div
          key={searchTerm} // forces React to remount the widget
          className="mt-10"
          data-gyg-widget="search"
          data-query={searchTerm}
          data-partner-id="P7B7GRH"
        ></div>
      )}
    </>
  )
}