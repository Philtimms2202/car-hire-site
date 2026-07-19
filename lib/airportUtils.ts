// lib/airportUtils.ts
import airportsData from '@/data/airports.json'

type AirportItem = {
  name: string
  city: string
  country: string
  iata_code: string
  links_count?: number
}

// Multi-airport cities where TravelPayouts expects the IATA CITY code,
// which differs from any individual airport's IATA code in airports.json.
// Add more here as you find gaps (e.g. via the London/Orlando issue).
const METACITY_OVERRIDES: Record<string, { city: string; name: string }> = {
  LON: { city: 'London', name: 'All Airports' },
  NYC: { city: 'New York', name: 'All Airports' },
  PAR: { city: 'Paris', name: 'All Airports' },
  ROM: { city: 'Rome', name: 'All Airports' },
  MIL: { city: 'Milan', name: 'All Airports' },
  CHI: { city: 'Chicago', name: 'All Airports' },
  WAS: { city: 'Washington', name: 'All Airports' },
  TYO: { city: 'Tokyo', name: 'All Airports' },
  MOW: { city: 'Moscow', name: 'All Airports' },
  BJS: { city: 'Beijing', name: 'All Airports' },
  SAO: { city: 'São Paulo', name: 'All Airports' },
  ORL: { city: 'Orlando', name: 'All Airports' },
  BUE: { city: 'Buenos Aires', name: 'All Airports' },
  RIO: { city: 'Rio de Janeiro', name: 'All Airports' },
  OSA: { city: 'Osaka', name: 'All Airports' },
  SEL: { city: 'Seoul', name: 'All Airports' },
  STO: { city: 'Stockholm', name: 'All Airports' },
  IST: { city: 'Istanbul', name: 'All Airports' },
  YTO: { city: 'Toronto', name: 'All Airports' },
}

export const ALL_AIRPORTS = airportsData as AirportItem[]

// Kept for anywhere you still want a UK-only shortlist (e.g. a "popular UK" quick-pick row)
export const UK_AIRPORTS = ALL_AIRPORTS.filter(
  (a) => a.country?.toLowerCase() === 'united kingdom'
)

export function slugifyCity(city: string): string {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// airport/city URL slug -> IATA code, e.g. "manchester" -> "MAN", "orlando" -> "ORL"
// Checks metacity overrides first (multi-airport cities), then falls back to
// airport-level lookup, preferring the most-connected airport on ties.
export function resolveAirportSlugToIata(slug: string): string | null {
  const normalizedSlug = slug.toLowerCase()

  const overrideMatch = Object.entries(METACITY_OVERRIDES).find(
    ([, v]) => slugifyCity(v.city) === normalizedSlug
  )
  if (overrideMatch) return overrideMatch[0]

  const matches = ALL_AIRPORTS.filter((a) => slugifyCity(a.city) === normalizedSlug)
  if (matches.length === 0) return null
  if (matches.length === 1) return matches[0].iata_code?.toUpperCase() ?? null

  const best = matches.reduce((top, current) =>
    (current.links_count ?? 0) > (top.links_count ?? 0) ? current : top
  )
  return best.iata_code?.toUpperCase() ?? null
}

// IATA -> display label, e.g. "MAN" -> "Manchester", "ORL" -> "Orlando"
export function resolveIataToLabel(iata: string): string {
  const code = iata.toUpperCase().trim()
  if (METACITY_OVERRIDES[code]) return METACITY_OVERRIDES[code].city
  const match = ALL_AIRPORTS.find((a) => a.iata_code?.toUpperCase() === code)
  return match?.city ?? code
}

// Full resolver with metacity + full/short formatting — used by deal cards
// to render both origin and destination labels consistently across the site.
export function resolveLocationLabel(iata: string, format: 'full' | 'short' = 'short'): string {
  if (!iata) return ''
  const code = iata.toUpperCase().trim()

  if (METACITY_OVERRIDES[code]) {
    const override = METACITY_OVERRIDES[code]
    return format === 'full' ? `${override.city} (${override.name})` : override.city
  }

  let foundAirport = ALL_AIRPORTS.find(
    (airport) => airport.iata_code?.toUpperCase().trim() === code
  )

  if (!foundAirport) {
    foundAirport = ALL_AIRPORTS.find(
      (airport) => airport.city?.toUpperCase().trim() === code ||
                   airport.name?.toUpperCase().trim().includes(code)
    )
  }

  if (!foundAirport) return code

  if (format === 'full') {
    if (foundAirport.name.toLowerCase().includes(foundAirport.city.toLowerCase())) {
      return foundAirport.name
    }
    return `${foundAirport.city} (${foundAirport.name})`
  }

  return foundAirport.city || foundAirport.name
}

// Curated global hub list for generateStaticParams — pre-builds the airports
// worth statically generating; anything else still resolves fine on-demand
export function getPrimaryAirportSlugs(): { slug: string; label: string; iata: string }[] {
  const priority = [
    'MAN', 'LHR', 'LGW', 'BHX', 'EDI', 'GLA', 'BRS', 'LBA', 'NCL', 'LPL', // UK
    'JFK', 'LAX', 'CDG', 'AMS', 'DXB', 'SIN', 'HKG', 'SYD', 'FRA', 'MAD', // global hubs
  ]
  const seen = new Set<string>()
  const result: { slug: string; label: string; iata: string }[] = []

  for (const code of priority) {
    const airport = ALL_AIRPORTS.find((a) => a.iata_code?.toUpperCase() === code)
    if (airport && !seen.has(code)) {
      seen.add(code)
      result.push({ slug: slugifyCity(airport.city), label: airport.city, iata: code })
    }
  }
  return result
}