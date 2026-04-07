'use client'

import { useState } from 'react'
import Script from 'next/script'

const categories = [
  { label: '✨ All', query: '' },
  { label: '🌙 Nightlife', query: 'nightlife' },
  { label: '🍽️ Food & Drink', query: 'food drink' },
  { label: '🗺️ Tours', query: 'tours' },
  { label: '🏛️ Museums', query: 'museums' },
  { label: '🧗 Adventure', query: 'adventure' },
  { label: '👨‍👩‍👧 Family', query: 'family' },
  { label: '🚌 Day Trips', query: 'day trips' },
  { label: '🎭 Arts & Culture', query: 'arts culture' },
  { label: '🛥️ Water Sports', query: 'water sports' },
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
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. nightlife, food tours, museums..."
            className="
              flex-1 px-5 py-4 rounded-xl 
              bg-white text-black 
              text-base shadow-md border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-[#2f797c]
            "
          />

          <button
            onClick={handleSearch}
            className="
              px-6 py-4 rounded-xl font-semibold 
              bg-[#2f797c] text-white 
              shadow-md hover:opacity-90 transition
              sm:w-auto w-full
            "
          >
            Search
          </button>
        </div>
      </div>

{/* Category Pills — Mobile Slider */}
<div className="mt-6 max-w-4xl mx-auto">
  <div
    className="
      flex gap-3 overflow-x-auto scrollbar-hide 
      whitespace-nowrap 
      snap-x snap-mandatory 
      px-4 py-2 
      -mx-4
    "
    style={{ WebkitOverflowScrolling: 'touch' }}
  >
    {categories.map((cat) => {
      const isActive = activeCategory === cat.query && !search

      return (
        <button
          key={cat.label}
          onClick={() => handleCategory(cat.query)}
          className="
            px-4 py-2 rounded-full text-sm font-semibold border 
            flex-shrink-0 snap-start transition
          "
          style={
            isActive
              ? {
                  backgroundColor: '#2f797c',
                  color: 'white',
                  borderColor: '#2f797c',
                }
              : {
                  backgroundColor: 'white',
                  color: '#232e4e',
                  borderColor: '#e5e7eb',
                }
          }
        >
          {cat.label}
        </button>
      )
    })}
  </div>
</div>

      {/* GYG Widget */}
      <section className="py-16 px-6 bg-gray-50 mt-8">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
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