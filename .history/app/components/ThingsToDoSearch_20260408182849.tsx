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

interface Props {
  cityName: string
}

export default function ThingsToDoSearch({ cityName }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [widgetKey, setWidgetKey] = useState(0)
  const [date, setDate] = useState('')

  const activeQuery = search.trim() || activeCategory
  const fullQuery = activeQuery ? `${activeQuery} ${cityName}` : cityName

  const handleSearch = () => setWidgetKey((k) => k + 1)

  const handleCategory = (query: string) => {
    setActiveCategory(query)
    setSearch('')
    setWidgetKey((k) => k + 1)
  }

  // ⭐ ALWAYS WORKS — no slug needed, no 404s
  const cityLink = `https://www.getyourguide.com/s/?q=${encodeURIComponent(
    cityName
  )}&partner_id=P7B7GRH&searchSource=7`

  return (
    <>
      <Script
        src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
        data-gyg-partner-id="P7B7GRH"
        strategy="afterInteractive"
      />

      {/* Search + Date */}
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="flex flex-col gap-4 w-full">

          {/* Search Label */}
          <label className="block text-sm font-medium text-white mb-1">
            Search
          </label>

          {/* Search Input */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. nightlife, food tours, museums..."
            className="
              w-full px-5 py-4 rounded-xl 
              bg-white text-black 
              text-base shadow-md border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-[#2f797c]
            "
          />

          {/* Clean Date Selector */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white mb-1">
                Date
              </label>

              <div
                className="
                  relative flex items-center 
                  bg-white border border-gray-300 
                  rounded-xl shadow-sm 
                  px-4 py-3 
                  focus-within:ring-2 focus-within:ring-[#2f797c]
                  transition
                "
              >


                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="
                    w-full pl-12 pr-2 py-1 
                    bg-transparent text-black 
                    focus:outline-none
                    appearance-none
                  "
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="
              w-full py-4 rounded-xl font-semibold 
              bg-[#2f797c] text-white 
              shadow-md hover:opacity-90 transition
            "
          >
            Search
          </button>
        </div>
      </div>

      {/* Category Pills — Desktop Only */}
      <div className="mt-8 px-4 max-w-4xl mx-auto hidden md:block">
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
                  px-5 py-2.0
                  rounded-full 
                  text-sm font-semibold 
                  border flex-shrink-0 snap-start 
                  transition-all duration-200
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
                        borderColor: '#d1d5db',
                      }
                }
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Widget + Bottom Button */}
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
            data-gyg-number-of-items="12"
          />

          {/* View All Experiences Button */}
          <div className="mt-10 text-center">
            <a
              href={cityLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center justify-center 
                px-6 py-3 rounded-xl font-semibold 
                bg-[#232e4e] text-white 
                shadow-md hover:opacity-90 transition
              "
            >
              View All Experiences in {cityName}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}