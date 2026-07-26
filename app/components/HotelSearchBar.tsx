'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Result = { city: string; country: string; slug: string }

export default function HotelSearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    setLoading(true)
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/hotels/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results || [])
        setOpen(true)
        setActiveIndex(-1)
      } catch (err) {
        console.error('Hotel search error:', err)
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function goToCity(slug: string) {
    setOpen(false)
    router.push(`/hotels/${slug}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const pick = activeIndex >= 0 ? results[activeIndex] : results[0]
      if (pick) goToCity(pick.slug)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search for a city, e.g. Barcelona, Manchester, Lisbon..."
          className="flex-1 px-5 py-4 text-sm md:text-base text-gray-800 outline-none placeholder:text-gray-400"
        />
        {loading && (
          <div className="pr-4">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-[#03989e] rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-80 overflow-y-auto">
          {results.map((r, i) => (
            <li key={r.slug}>
              <button
                onClick={() => goToCity(r.slug)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full text-left px-5 py-3 flex items-center justify-between transition-colors ${
                  activeIndex === i ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <span className="font-semibold text-sm text-gray-800">{r.city}</span>
                <span className="text-xs text-gray-400">{r.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && !loading && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 px-5 py-4 text-sm text-gray-500">
          No cities found for "{query}".
        </div>
      )}
    </div>
  )
}