'use client'

import { useState } from 'react'
import Link from 'next/link'

type City = {
  _id: string
  name: string
  slug: string
  emoji?: string
  countryName?: string
  countrySlug?: string
  continentSlug?: string
}

export default function CityGuidesGrid({ cities }: { cities: City[] }) {
  const [showAll, setShowAll] = useState(false)
  const visibleCities = showAll ? cities : cities.slice(0, 8)

  return (
    <div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {visibleCities.map((city) => (
          <li key={city._id} className="list-none">
            <Link
              href={`/locations/${city.continentSlug}/${city.countrySlug}/${city.slug}`}
              className="group flex flex-col items-center justify-center p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-lg hover:border-teal-200 transition-all text-center h-full"
            >
              <span className="text-3xl mb-2">{city.emoji || '🏙️'}</span>
              <span className="font-bold text-sm text-slate-800 group-hover:text-teal-600 transition-colors">
                {city.name}
              </span>
              {city.countryName && (
                <span className="text-xs text-gray-400 mt-0.5">
                  {city.countryName}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {!showAll && cities.length > 8 && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border transition-all hover:bg-gray-50"
            style={{ borderColor: '#03989e', color: '#03989e' }}
          >
            View all {cities.length} destinations →
          </button>
        </div>
      )}
    </div>
  )
}