'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ALL_AIRPORTS, slugifyCity } from '@/lib/airportUtils'

export default function AirportSelector({
  slug,
  currentIata,
  size = 'default',
}: {
  slug: string
  currentIata?: string
  size?: 'default' | 'large'
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return ALL_AIRPORTS.filter(
      (a) =>
        a.city?.toLowerCase().includes(q) ||
        a.name?.toLowerCase().includes(q) ||
        a.iata_code?.toLowerCase() === q
    )
      .sort((a, b) => (b.links_count ?? 0) - (a.links_count ?? 0))
      .slice(0, 8)
  }, [query])

  const handleSelect = (city: string) => {
    setQuery('')
    setOpen(false)
    router.push(`/deals/${slug}/${slugifyCity(city)}`)
  }

  const inputClasses =
    size === 'large'
      ? 'w-full px-5 py-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-teal-100 focus:outline-none focus:ring-2 focus:ring-white/50 text-base'
      : 'w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-teal-100 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm'

  return (
    <div className="relative max-w-md mx-auto mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        placeholder={currentIata ? `Flying from ${currentIata}... search another airport` : 'Search your departure airport or city...'}
        className={inputClasses}
      />
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-h-72 overflow-y-auto">
          {results.map((a) => (
            <li key={a.iata_code + a.name}>
              <button
                onClick={() => handleSelect(a.city)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-teal-50 transition-colors flex justify-between items-center"
                style={{ color: '#232e4e' }}
              >
                <span>
                  <span className="font-semibold">{a.city}</span>
                  <span className="text-gray-400 ml-2 text-xs">{a.name} ({a.iata_code})</span>
                </span>
                <span className="text-gray-300 text-xs">{a.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}