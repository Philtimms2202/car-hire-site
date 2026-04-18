'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '6ogv1wx8',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

type Location = {
  city: string
  citySlug: string
  country: string
  countrySlug: string
  continent: string
  continentSlug: string
  continentEmoji: string
}

export default function LocationSearch() {
  const [query, setQuery] = useState('')
  const [locations, setLocations] = useState<Location[]>([])
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    client.fetch(`
      *[_type == "location"]{
        city,
        "citySlug": citySlug.current,
        country,
        "countrySlug": countrySlug.current,
        continent,
        "continentSlug": continentSlug.current,
        continentEmoji
      }
    `).then(setLocations)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const q = query.trim().toLowerCase()
  const results = q.length >= 2
    ? locations.filter(l =>
        l.city?.toLowerCase().includes(q) ||
        l.country?.toLowerCase().includes(q) ||
        l.continent?.toLowerCase().includes(q)
      ).slice(0, 8)
    : []

  return (
    <div ref={wrapperRef} className="relative max-w-xl mx-auto">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search by country or city…"
          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/20 bg-white/10 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2f797c] focus:border-transparent"
        />
      </div>

      {open && q.length >= 2 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-5 py-4 text-sm text-gray-400">
              No destinations found — try a different search.
            </p>
          ) : (
            results.map(l => (
              <Link
                key={`${l.continentSlug}-${l.countrySlug}-${l.citySlug}`}
                href={`/locations/${l.continentSlug}/${l.countrySlug}/${l.citySlug}`}
                onClick={() => { setOpen(false); setQuery('') }}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <span className="text-xl">{l.continentEmoji}</span>
                <div>
                  <p className="text-sm font-semibold text-[#232e4e]">{l.city}</p>
                  <p className="text-xs text-gray-400">{l.country} · {l.continent}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}