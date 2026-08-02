'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function GlobalMobileStickyBar() {
  const pathname = usePathname()

  // 1. Only display on location routes (hide on home/utility pages)
  if (!pathname || !pathname.startsWith('/locations')) {
    return null
  }

  // 2. Parse current location path: /locations/[continent]/[country]/[city]
  const segments = pathname.split('/').filter(Boolean)
  
  const formatName = (slug: string) =>
    slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())

  const continentSlug = segments[1]
  const countrySlug = segments[2]
  const citySlug = segments[3]

  // Dynamic label based on deep routing
  let locationLabel = 'Destinations'
  if (citySlug) {
    locationLabel = formatName(citySlug)
  } else if (countrySlug) {
    locationLabel = formatName(countrySlug)
  } else if (continentSlug) {
    locationLabel = formatName(continentSlug)
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] transition-all">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Left Side: Active Location Context */}
        <div className="flex flex-col min-w-0 pr-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600 truncate">
            Exploring
          </span>
          <span className="text-xs font-semibold text-slate-900 truncate">
            {locationLabel}
          </span>
        </div>

        {/* Right Side: CTA Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/hotels"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition active:scale-95"
            style={{ backgroundColor: '#022135' }}
          >
            <span>🏨</span>
            <span>Hotels</span>
          </Link>

            <Link
            href="/flights"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition active:scale-95"
            style={{ backgroundColor: '#022135' }}
          >
            <span>✈️</span>
            <span>Flights</span>
          </Link>

          <Link
            href="/experiences"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition active:scale-95"
            style={{ backgroundColor: '#022135' }}
          >
            <span>🎟️</span>
            <span>Experiences</span>
          </Link>
        </div>
      </div>
    </div>
  )
}