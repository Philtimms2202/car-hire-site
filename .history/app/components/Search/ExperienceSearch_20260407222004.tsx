"use client"

import { useState, useEffect } from "react"

export default function ExperienceSearch({ defaultLocation }: { defaultLocation: string }) {
  const [location, setLocation] = useState(defaultLocation)
  const [searchTerm, setSearchTerm] = useState(defaultLocation)

  const handleSearch = () => {
    if (!location) return
    setSearchTerm(location)
  }

  useEffect(() => {
    // Re-render GetYourGuide widget when searchTerm changes
    if (window && (window as any).GYG) {
      (window as any).GYG.refresh()
    }
  }, [searchTerm])

  return (
    <div className="space-y-6">

      {/* Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-left md:col-span-3">
          <label className="block text-gray-500 text-sm mb-1">Location</label>
          <input
            type="text"
            placeholder="City or destination"
            className="input-field"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button
          onClick={handleSearch}
          className="btn-primary mt-5 w-full"
        >
          Search Experiences
        </button>
      </div>

      {/* GetYourGuide Widget */}
      <div
        data-gyg-widget="activities"
        data-gyg-locale="en-GB"
        data-gyg-currency="GBP"
        data-gyg-q={searchTerm}
        data-gyg-show-prices="true"
        data-gyg-partner-id="P7B7GRH"
      ></div>
    </div>
  )
}