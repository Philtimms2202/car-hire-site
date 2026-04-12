'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import type { ContinentGroup, OriginGroup, RouteLink } from './page'

type CityOption = {
  city: string
  iata: string
  country: string
  continent: string
}

type Props = {
  continentGroups: ContinentGroup[]
  totalRoutes: number
  allCities: CityOption[]
}

// ─────────────────────────────────────────────
// AUTOCOMPLETE SEARCH BAR
// ─────────────────────────────────────────────
function AutocompleteSearch({
  allCities,
  onSelect,
  onClear,
  value,
}: {
  allCities: CityOption[]
  onSelect: (city: CityOption | null) => void
  onClear: () => void
  value: string
}) {
  const [input, setInput] = useState(value)
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const suggestions = useMemo(() => {
    const q = input.toLowerCase().trim()
    if (!q) return []
    return allCities
      .filter(
        c =>
          c.city.toLowerCase().includes(q) ||
          c.iata.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q)
      )
      .slice(0, 8)
  }, [input, allCities])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setHighlighted(h => Math.min(h + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && suggestions[highlighted]) {
      pick(suggestions[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const pick = (city: CityOption) => {
    setInput(`${city.city} (${city.iata})`)
    setOpen(false)
    setHighlighted(0)
    onSelect(city)
  }

  const clear = () => {
    setInput('')
    setOpen(false)
    onSelect(null)
    onClear()
  }

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          value={input}
          onChange={e => {
            setInput(e.target.value)
            setOpen(true)
            setHighlighted(0)
            if (!e.target.value) onClear()
          }}
          onFocus={() => { if (input) setOpen(true) }}
          onKeyDown={handleKey}
          placeholder="Search city, country or IATA code…"
          className="w-full bg-white text-gray-900 placeholder-gray-400 pl-11 pr-10 py-4 rounded-2xl text-base shadow-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        {input && (
          <button
            onClick={clear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {suggestions.map((c, i) => (
            <button
              key={`${c.iata}-${i}`}
              onMouseDown={() => pick(c)}
              onMouseEnter={() => setHighlighted(i)}
              className={`w-full text-left px-5 py-3 flex items-center justify-between transition ${
                highlighted === i ? 'bg-teal-50' : 'hover:bg-gray-50'
              }`}
            >
              <div>
                <span className="font-semibold text-gray-900">{c.city}</span>
                <span className="text-gray-400 text-sm ml-2">{c.country}</span>
              </div>
              <span
                className="font-mono text-xs font-bold px-2 py-1 rounded-lg"
                style={{ backgroundColor: '#f0fafa', color: '#03989e' }}
              >
                {c.iata}
              </span>
            </button>
          ))}
          <div className="px-5 py-2 bg-gray-50 text-xs text-gray-400 border-t border-gray-100">
            Showing departure cities — select to filter routes
          </div>
        </div>
      )}

      {open && input.length > 1 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 px-5 py-4 text-gray-400 text-sm">
          No cities found for &ldquo;{input}&rdquo;
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// ROUTE CARD
// ─────────────────────────────────────────────
function RouteCard({ route }: { route: RouteLink }) {
  const href = `/flights/${route.originIATA.toLowerCase()}/${route.destIATA.toLowerCase()}/${route.slug}`

  return (
    <a
      href={href}
      className="group flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-white hover:border-teal-300 hover:shadow-md transition-all duration-150"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="font-mono text-xs px-2 py-0.5 rounded font-bold shrink-0"
          style={{ backgroundColor: '#f0fafa', color: '#03989e' }}
        >
          {route.originIATA}
        </span>
        <span className="text-gray-400 text-xs shrink-0">→</span>
        <span
          className="font-mono text-xs px-2 py-0.5 rounded font-bold shrink-0"
          style={{ backgroundColor: '#f0fafa', color: '#03989e' }}
        >
          {route.destIATA}
        </span>
        <span className="text-gray-700 text-sm truncate ml-1">
          {route.destCity}
          <span className="text-gray-400 text-xs ml-1 hidden sm:inline">
            · {route.destCountry}
          </span>
        </span>
      </div>
      <span
        className="text-xs font-semibold shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: '#03989e' }}
      >
        View →
      </span>
    </a>
  )
}

// ─────────────────────────────────────────────
// ORIGIN BLOCK
// ─────────────────────────────────────────────
function OriginBlock({ origin }: { origin: OriginGroup }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? origin.routes : origin.routes.slice(0, 12)

  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
          style={{ backgroundColor: '#232e4e' }}
        >
          {origin.iata}
        </div>
        <div>
          <p className="font-bold text-gray-900">{origin.city}</p>
          <p className="text-xs text-gray-400">{origin.country}</p>
        </div>
        <span className="ml-auto text-xs text-gray-400 bg-white px-2 py-1 rounded-lg border border-gray-200 shrink-0">
          {origin.routes.length} routes
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {visible.map(route => (
          <RouteCard key={`${route.originIATA}-${route.destIATA}`} route={route} />
        ))}
      </div>

      {origin.routes.length > 12 && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-3 w-full text-center text-sm font-semibold py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
          style={{ color: '#03989e' }}
        >
          {expanded
            ? 'Show fewer routes ↑'
            : `Show all ${origin.routes.length} routes from ${origin.city} ↓`}
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// CONTINENT SECTION
// ─────────────────────────────────────────────
function ContinentSection({ group }: { group: ContinentGroup }) {
  const [expanded, setExpanded] = useState(false)
  const visibleOrigins = expanded ? group.origins : group.origins.slice(0, 4)
  const totalRoutes = group.origins.reduce((a, o) => a + o.routes.length, 0)

  return (
    <section
      id={group.continentSlug}
      className="mb-16 scroll-mt-20"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{group.emoji}</span>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#232e4e' }}>
            {group.continent}
          </h2>
          <p className="text-sm text-gray-400">
            {group.origins.length} departure cities · {totalRoutes.toLocaleString()} routes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {visibleOrigins.map(origin => (
          <OriginBlock key={`${origin.city}-${origin.iata}`} origin={origin} />
        ))}
      </div>

      {group.origins.length > 4 && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-5 w-full py-3 rounded-2xl border-2 font-semibold transition hover:bg-gray-50"
          style={{ borderColor: '#232e4e', color: '#232e4e' }}
        >
          {expanded
            ? `Show fewer cities in ${group.continent} ↑`
            : `Show all ${group.origins.length} departure cities in ${group.continent} ↓`}
        </button>
      )}
    </section>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE CLIENT
// ─────────────────────────────────────────────
export default function PopularRoutesClient({ continentGroups, totalRoutes, allCities }: Props) {
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null)
  const [activeContinent, setActiveContinent] = useState<string | null>(null)

  // Filter groups by selected city or active continent tab
  const filtered = useMemo(() => {
    return continentGroups
      .filter(g => !activeContinent || g.continent === activeContinent)
      .map(g => ({
        ...g,
        origins: g.origins
          .filter(o => !selectedCity || o.iata === selectedCity.iata)
          .map(o => ({ ...o })),
      }))
      .filter(g => g.origins.length > 0)
  }, [selectedCity, activeContinent, continentGroups])

  const filteredCount = filtered.reduce(
    (acc, g) => acc + g.origins.reduce((a, o) => a + o.routes.length, 0),
    0
  )

  const handleContinentClick = (continent: string) => {
    if (activeContinent === continent) {
      setActiveContinent(null)
    } else {
      setActiveContinent(continent)
      // Scroll to section
      setTimeout(() => {
        const slug = continent.toLowerCase().replace(/\s+/g, '-')
        document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ─────────────────────────────── */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <nav className="flex justify-center gap-2 text-sm mb-6 text-gray-400">
          <a href="/" className="hover:text-white transition">Home</a>
          <span>/</span>
          <a href="/flights" className="hover:text-white transition">Flights</a>
          <span>/</span>
          <span className="text-white">Popular Routes</span>
        </nav>

        <p
          className="text-sm uppercase tracking-widest mb-3 font-semibold"
          style={{ color: '#03989e' }}
        >
          Explore
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Popular Flight Routes
        </h1>

        <p className="text-gray-300 mb-3 max-w-2xl mx-auto text-lg">
          Browse {totalRoutes.toLocaleString()}+ routes across{' '}
          {continentGroups.length} continents. Click any route to compare
          prices and book instantly.
        </p>

        {/* Autocomplete search */}
        <div className="mt-8">
          <AutocompleteSearch
            allCities={allCities}
            value=""
            onSelect={city => {
              setSelectedCity(city)
              setActiveContinent(null)
            }}
            onClear={() => setSelectedCity(null)}
          />
          {selectedCity && (
            <p className="text-sm text-teal-300 mt-3">
              Showing all routes departing from {selectedCity.city} ({selectedCity.iata})
              &nbsp;·&nbsp;
              <button
                onClick={() => setSelectedCity(null)}
                className="underline hover:text-white transition"
              >
                Clear
              </button>
            </p>
          )}
          {!selectedCity && (
            <p className="text-xs text-gray-500 mt-3">
              Search a departure city to filter, or browse by continent below
            </p>
          )}
        </div>
      </section>

      {/* ── CONTINENT TABS ───────────────────── */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 py-3 min-w-max">
            {/* All */}
            <button
              onClick={() => { setActiveContinent(null); setSelectedCity(null) }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                activeContinent === null && !selectedCity
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={
                activeContinent === null && !selectedCity
                  ? { backgroundColor: '#232e4e' }
                  : {}
              }
            >
              ✈️ All Continents
            </button>

            {continentGroups.map(g => {
              const isActive = activeContinent === g.continent
              return (
                <button
                  key={g.continent}
                  onClick={() => handleContinentClick(g.continent)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={isActive ? { backgroundColor: '#03989e' } : {}}
                >
                  {g.emoji} {g.continent}
                  <span className={`ml-1.5 text-xs ${isActive ? 'text-teal-100' : 'text-gray-400'}`}>
                    ({g.origins.length})
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── RESULTS COUNT ────────────────────── */}
      {(activeContinent || selectedCity) && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <p className="text-sm text-gray-500">
            {filteredCount.toLocaleString()} routes
            {selectedCity ? ` from ${selectedCity.city}` : ''}
            {activeContinent ? ` in ${activeContinent}` : ''}
            &nbsp;·&nbsp;
            <button
              onClick={() => { setActiveContinent(null); setSelectedCity(null) }}
              className="font-semibold hover:underline"
              style={{ color: '#03989e' }}
            >
              Clear filters
            </button>
          </p>
        </div>
      )}

      {/* ── ROUTE CONTENT ────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">✈️</p>
            <p className="text-xl font-semibold text-gray-600 mb-2">No routes found</p>
            <p className="text-sm">Try a different city or select a different continent</p>
            <button
              onClick={() => { setActiveContinent(null); setSelectedCity(null) }}
              className="mt-6 px-6 py-3 rounded-xl text-white font-semibold"
              style={{ backgroundColor: '#232e4e' }}
            >
              Show all routes
            </button>
          </div>
        ) : (
          filtered.map(group => (
            <ContinentSection key={group.continent} group={group} />
          ))
        )}
      </div>

      {/* ── SEO FOOTER ───────────────────────── */}
      <section className="bg-gray-50 border-t border-gray-100 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center text-gray-500 text-sm leading-relaxed space-y-3">
          <p>
            Timms Travel compares hundreds of airlines across {totalRoutes.toLocaleString()}+ flight
            routes worldwide. Whether you&apos;re after cheap flights from the UK to Europe,
            long-haul deals to Asia or the Americas, or sun routes to Africa and the Middle East
            — we&apos;ve got you covered.
          </p>
          <p>
            All routes link through to live search results . Prices updated in
            real time, no hidden fees, no mark-ups.
          </p>
          <div className="pt-4">
            <a
              href="/flights"
              className="inline-block px-8 py-3 rounded-xl text-white font-bold transition hover:opacity-90"
              style={{ backgroundColor: '#03989e' }}
            >
              Search flights →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}