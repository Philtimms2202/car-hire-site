'use client'

import { useState } from 'react'
import Script from 'next/script'

const categories = [
  { label: 'All Experiences', query: '' },
  { label: 'Nightlife', query: 'nightlife' },
  { label: 'Food & Drink', query: 'food drink' },
  { label: 'Tours', query: 'tours' },
  { label: 'Museums', query: 'museums' },
  { label: 'Adventure', query: 'adventure' },
  { label: 'Family', query: 'family' },
  { label: 'Day Trips', query: 'day trips' },
]

export default function ThingsToDoSearch({ cityName }: { cityName: string }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [widgetKey, setWidgetKey] = useState(0)

  const activeQuery = search.trim() || activeCategory
  const fullQuery = activeQuery ? `${activeQuery} ${cityName}` : cityName

  const handleSearch = () => {
    setWidgetKey((k) => k + 1)
  }

  const handleCategory = (query: string) => {
    setActiveCategory(query)
    setSearch('')
    setWidgetKey((k) => k + 1)
  }

  return (
    <>
      <Script
        src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
        data-gyg-partner-id="P7B7GRH"
        strategy="afterInteractive"
      />

      {/* Search Box */}
      <div className="max-w-2xl mx-auto flex gap-3 mt-10">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={`e.g. nightlife in ${cityName}, food tours...`}
          className="flex-1 px-5 py-4 rounded-xl text-black text-base focus:outline-none shadow-lg"
        />
        <button
          onClick={handleSearch}
          className="btn-primary px-6 py-4 rounded-xl font-semibold"
        >
          Search
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => handleCategory(cat.query)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
              activeCategory === cat.query && !search
                ? 'text-white border-transparent'
                : 'bg-white bg-opacity-10 border-white border-opacity-30 text-white hover:bg-opacity-20'
            }`}
            style={
              activeCategory === cat.query && !search
                ? { backgroundColor: '#2f797c' }
                : {}
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* GYG Widget */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            {activeQuery
              ? `${activeQuery.charAt(0).toUpperCase() + activeQuery.slice(1)} in ${cityName}`
              : `Top Experiences in ${cityName}`}
          </h2>
          <p className="text-center text-gray-500 mb-10">
            {activeQuery
              ? `Showing results for "${activeQuery}" in ${cityName}`
              : `Browse the best things to do in ${cityName}`}
          </p>

          <div
            key={widgetKey}
            data-gyg-widget="activities"
            data-gyg-partner-id="P7B7GRH"
            data-gyg-q={fullQuery}
            data-gyg-number-of-items="8"
          />
        </div>
      </section>
    </>
  )
}