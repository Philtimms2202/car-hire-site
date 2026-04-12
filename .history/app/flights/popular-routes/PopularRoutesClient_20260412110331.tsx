'use client'

import { useState, useMemo } from 'react'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import type { RegionGroup, OriginGroup, RouteLink } from './page'

type Props = {
  regionGroups: RegionGroup[]
  totalRoutes: number
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
            {route.destCountry}
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
      {/* Origin header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ backgroundColor: '#232e4e' }}
        >
          {origin.iata}
        </div>
        <div>
          <p className="font-bold text-gray-900">{origin.city}</p>
          <p className="text-xs text-gray-400">{origin.country}</p>
        </div>
        <span className="ml-auto text-xs text-gray-400 bg-white px-2 py-1 rounded-lg border border-gray-200">
          {origin.routes.length} routes
        </span>
      </div>

      {/* Route links */}
      <div className="flex flex-col gap-2">
        {visible.map(route => (
          <RouteCard key={`${route.originIATA}-${route.destIATA}`} route={route} />
        ))}
      </div>

      {/* Expand / collapse */}
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
// REGION SECTION
// ─────────────────────────────────────────────
function RegionSection({ group }: { group: RegionGroup }) {
  const [expanded, setExpanded] = useState(false)
  const visibleOrigins = expanded ? group.origins : group.origins.slice(0, 4)

  return (
    <section id={group.continent.toLowerCase().replace(/\s+/g, '-')}>
      {/* Region header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{group.emoji}</span>
        <h2 className="text-2xl font-bold" style={{ color: '#232e4e' }}>
          {group.region}
        </h2>
        <span className="ml-2 text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {group.origins.length} departure cities
        </span>
      </div>

      {/* Origins grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {visibleOrigins.map(origin => (
          <OriginBlock key={`${origin.city}-${origin.iata}`} origin={origin} />
        ))}
      </div>

      {/* Show more origins */}
      {group.origins.length > 4 && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-5 w-full py-3 rounded-2xl border-2 font-semibold transition hover:bg-gray-50"
          style={{ borderColor: '#232e4e', color: '#232e4e' }}
        >
          {expanded
            ? `Show fewer cities in ${group.region} ↑`
            : `Show all ${group.origins.length} departure cities in ${group.region} ↓`}
        </button>
      )}
    </section>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE CLIENT
// ─────────────────────────────────────────────
export default function PopularRoutesClient({ regionGroups, totalRoutes }: Props) {
  const [search, setSearch] = useState('')
  const [activeRegion, setActiveRegion] = useState<string | null>(null)

  // Filter by search query
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q && !activeRegion) return regionGroups

    return regionGroups
      .filter(r => !activeRegion || r.region === activeRegion)
      .map(r => ({
        ...r,
        origins: r.origins
          .map(o => ({
            ...o,
            routes: q
              ? o.routes.filter(
                  rt =>
                    rt.destCity.toLowerCase().includes(q) ||
                    rt.originCity.toLowerCase().includes(q) ||
                    rt.destIATA.toLowerCase().includes(q) ||
                    rt.originIATA.toLowerCase().includes(q) ||
                    rt.destCountry.toLowerCase().includes(q)
                )
              : o.routes,
          }))
          .filter(o => o.routes.length > 0),
      }))
      .filter(r => r.origins.length > 0)
  }, [search, activeRegion, regionGroups])

const filteredCount = (Array.isArray(filtered) ? filtered : []).reduce(
  (acc, r) => {
    const safeOrigins = Array.isArray(r.origins) ? r.origins : []
    return acc + safeOrigins.reduce((o, a) => {
      const safeRoutes = Array.isArray(a.routes) ? a.routes : []
      return o + safeRoutes.length
    }, 0)
  },
  0
)


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
          Browse {totalRoutes.toLocaleString()}+ flight routes across{' '}
          {Array.isArray(regionGroups) ? regionGroups.length : 0} regions worldwide. Click any route to compare
          prices and book instantly.
        </p>

        {/* Search */}
        <div className="max-w-lg mx-auto mt-8">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by city, country or IATA code…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-4 rounded-2xl text-gray-900 text-base shadow-xl focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#03989e' } as React.CSSProperties}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            )}
          </div>
          {search && (
            <p className="text-sm text-gray-400 mt-2">
              {filteredCount.toLocaleString()} routes match &ldquo;{search}&rdquo;
            </p>
          )}
        </div>
      </section>

      {/* ── REGION TABS ──────────────────────── */}
      <div
        className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 py-3 min-w-max">
            <button
              onClick={() => setActiveRegion(null)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                activeRegion === null
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={activeRegion === null ? { backgroundColor: '#232e4e' } : {}}
            >
              All Regions
            </button>
            {(Array.isArray(regionGroups) ? regionGroups : []).map(r => (
           <button
           key={r.continent}
           onClick={() =>
          setActiveRegion(r.continent === activeRegion ? null : r.continent)
    }


                className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                  activeRegion === r.region
                    ? 'text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                style={activeRegion === r.region ? { backgroundColor: '#03989e' } : {}}
              >
                {r.emoji} {r.region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROUTE CONTENT ────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {(Array.isArray(filtered) ? filtered : []).length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">✈️</p>
            <p className="text-xl font-semibold text-gray-600 mb-2">No routes found</p>
            <p className="text-sm">Try a different city name, country or IATA code</p>
            <button
              onClick={() => { setSearch(''); setActiveRegion(null) }}
              className="mt-6 px-6 py-3 rounded-xl text-white font-semibold"
              style={{ backgroundColor: '#232e4e' }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map(group => (
            <RegionSection key={group.continent} group={group} />
          ))
        )}
      </div>

      {/* ── SEO FOOTER TEXT ──────────────────── */}
      <section className="bg-gray-50 border-t border-gray-100 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center text-gray-500 text-sm leading-relaxed space-y-3">
          <p>
            Timms Travel compares hundreds of airlines and booking options across{' '}
            {totalRoutes.toLocaleString()}+ flight routes worldwide. Whether you&apos;re
            looking for cheap flights from the UK to Europe, long-haul deals to Asia or
            the Americas, or island-hopping routes in the Caribbean — we&apos;ve got you covered.
          </p>
          <p>
            All routes connect through to live search results . Prices
            are updated in real time with no hidden fees and no price mark-ups.
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