"use client"

import { useState } from "react"
import { useLocale } from "@/app/context/localeContext"

export default function ExperienceSearch({ defaultLocation }: { defaultLocation: string }) {
  const [location, setLocation] = useState(defaultLocation)

  // Pull language + currency from your global locale system
  const { language, currency } = useLocale()

  const handleSearch = () => {
    if (!location) return

    const url = `https://www.getyourguide.com/s/?q=${encodeURIComponent(
      location
    )}&partner_id=P7B7GRH&locale=${language}&currency=${currency}&forceLocale=1&_v=${Date.now()}`

    window.open(url, "_blank")
  }

  return (
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
  )
}
