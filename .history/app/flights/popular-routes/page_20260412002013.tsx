// app/flights/popular-routes/page.tsx
// Server component — no 'use client' needed, all data resolved at build/request time

import { buildMetadata } from '@/app/metadata'
import PopularRoutesClient from './PopularRoutesClient'
import airports from '@/data/airports.json'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type RawAirport = {
  name: string
  city: string
  country: string
  iata_code: string
  _geoloc?: { lat: number; lng: number }
  links_count?: number
  objectID: string
}

export type RouteLink = {
  originCity: string
  originIATA: string
  originCountry: string
  destCity: string
  destIATA: string
  destCountry: string
  slug: string
}

export type RegionGroup = {
  region: string
  emoji: string
  origins: OriginGroup[]
}

export type OriginGroup = {
  city: string
  iata: string
  country: string
  routes: RouteLink[]
}

// ─────────────────────────────────────────────
// REGION MAP
// Assigns each country to a region + emoji
// ─────────────────────────────────────────────
const COUNTRY_REGION: Record<string, { region: string; emoji: string }> = {
  // UK & Ireland
  'United Kingdom': { region: 'UK & Ireland', emoji: '🇬🇧' },
  'Ireland':        { region: 'UK & Ireland', emoji: '🇬🇧' },

  // Western Europe
  'France':         { region: 'Western Europe', emoji: '🌍' },
  'Germany':        { region: 'Western Europe', emoji: '🌍' },
  'Netherlands':    { region: 'Western Europe', emoji: '🌍' },
  'Belgium':        { region: 'Western Europe', emoji: '🌍' },
  'Switzerland':    { region: 'Western Europe', emoji: '🌍' },
  'Austria':        { region: 'Western Europe', emoji: '🌍' },
  'Luxembourg':     { region: 'Western Europe', emoji: '🌍' },

  // Southern Europe
  'Spain':          { region: 'Southern Europe', emoji: '☀️' },
  'Portugal':       { region: 'Southern Europe', emoji: '☀️' },
  'Italy':          { region: 'Southern Europe', emoji: '☀️' },
  'Greece':         { region: 'Southern Europe', emoji: '☀️' },
  'Croatia':        { region: 'Southern Europe', emoji: '☀️' },
  'Malta':          { region: 'Southern Europe', emoji: '☀️' },
  'Cyprus':         { region: 'Southern Europe', emoji: '☀️' },

  // Northern Europe
  'Denmark':        { region: 'Northern Europe', emoji: '❄️' },
  'Sweden':         { region: 'Northern Europe', emoji: '❄️' },
  'Norway':         { region: 'Northern Europe', emoji: '❄️' },
  'Finland':        { region: 'Northern Europe', emoji: '❄️' },
  'Iceland':        { region: 'Northern Europe', emoji: '❄️' },

  // Eastern Europe
  'Poland':         { region: 'Eastern Europe', emoji: '🏰' },
  'Czech Republic': { region: 'Eastern Europe', emoji: '🏰' },
  'Hungary':        { region: 'Eastern Europe', emoji: '🏰' },
  'Romania':        { region: 'Eastern Europe', emoji: '🏰' },
  'Bulgaria':       { region: 'Eastern Europe', emoji: '🏰' },
  'Slovakia':       { region: 'Eastern Europe', emoji: '🏰' },
  'Serbia':         { region: 'Eastern Europe', emoji: '🏰' },

  // Turkey & Middle East
  'Turkey':         { region: 'Turkey & Middle East', emoji: '🕌' },
  'UAE':            { region: 'Turkey & Middle East', emoji: '🕌' },
  'Qatar':          { region: 'Turkey & Middle East', emoji: '🕌' },
  'Saudi Arabia':   { region: 'Turkey & Middle East', emoji: '🕌' },
  'Kuwait':         { region: 'Turkey & Middle East', emoji: '🕌' },
  'Bahrain':        { region: 'Turkey & Middle East', emoji: '🕌' },
  'Oman':           { region: 'Turkey & Middle East', emoji: '🕌' },
  'Jordan':         { region: 'Turkey & Middle East', emoji: '🕌' },
  'Israel':         { region: 'Turkey & Middle East', emoji: '🕌' },
  'Lebanon':        { region: 'Turkey & Middle East', emoji: '🕌' },

  // Africa
  'Egypt':          { region: 'Africa', emoji: '🌅' },
  'Morocco':        { region: 'Africa', emoji: '🌅' },
  'Tunisia':        { region: 'Africa', emoji: '🌅' },
  'South Africa':   { region: 'Africa', emoji: '🌅' },
  'Kenya':          { region: 'Africa', emoji: '🌅' },
  'Tanzania':       { region: 'Africa', emoji: '🌅' },
  'Ethiopia':       { region: 'Africa', emoji: '🌅' },
  'Ghana':          { region: 'Africa', emoji: '🌅' },
  'Nigeria':        { region: 'Africa', emoji: '🌅' },
  'Cape Verde':     { region: 'Africa', emoji: '🌅' },
  'Gambia':         { region: 'Africa', emoji: '🌅' },
  'Senegal':        { region: 'Africa', emoji: '🌅' },

  // North America
  'USA':            { region: 'North America', emoji: '🗽' },
  'Canada':         { region: 'North America', emoji: '🗽' },
  'Mexico':         { region: 'North America', emoji: '🗽' },

  // Caribbean & Central America
  'Cuba':           { region: 'Caribbean', emoji: '🏝️' },
  'Jamaica':        { region: 'Caribbean', emoji: '🏝️' },
  'Dominican Republic': { region: 'Caribbean', emoji: '🏝️' },
  'Barbados':       { region: 'Caribbean', emoji: '🏝️' },
  'Trinidad and Tobago': { region: 'Caribbean', emoji: '🏝️' },
  'Antigua and Barbuda': { region: 'Caribbean', emoji: '🏝️' },
  'Saint Lucia':    { region: 'Caribbean', emoji: '🏝️' },

  // South America
  'Brazil':         { region: 'South America', emoji: '🌿' },
  'Argentina':      { region: 'South America', emoji: '🌿' },
  'Colombia':       { region: 'South America', emoji: '🌿' },
  'Peru':           { region: 'South America', emoji: '🌿' },
  'Chile':          { region: 'South America', emoji: '🌿' },

  // South Asia
  'India':          { region: 'South Asia', emoji: '🛕' },
  'Pakistan':       { region: 'South Asia', emoji: '🛕' },
  'Sri Lanka':      { region: 'South Asia', emoji: '🛕' },
  'Bangladesh':     { region: 'South Asia', emoji: '🛕' },
  'Nepal':          { region: 'South Asia', emoji: '🛕' },

  // Southeast Asia
  'Thailand':       { region: 'Southeast Asia', emoji: '🏖️' },
  'Singapore':      { region: 'Southeast Asia', emoji: '🏖️' },
  'Malaysia':       { region: 'Southeast Asia', emoji: '🏖️' },
  'Indonesia':      { region: 'Southeast Asia', emoji: '🏖️' },
  'Vietnam':        { region: 'Southeast Asia', emoji: '🏖️' },
  'Philippines':    { region: 'Southeast Asia', emoji: '🏖️' },
  'Cambodia':       { region: 'Southeast Asia', emoji: '🏖️' },
  'Myanmar':        { region: 'Southeast Asia', emoji: '🏖️' },

  // East Asia
  'China':          { region: 'East Asia', emoji: '🏯' },
  'Japan':          { region: 'East Asia', emoji: '🏯' },
  'South Korea':    { region: 'East Asia', emoji: '🏯' },
  'Hong Kong':      { region: 'East Asia', emoji: '🏯' },
  'Taiwan':         { region: 'East Asia', emoji: '🏯' },

  // Pacific & Australasia
  'Australia':      { region: 'Australia & Pacific', emoji: '🦘' },
  'New Zealand':    { region: 'Australia & Pacific', emoji: '🦘' },
  'Fiji':           { region: 'Australia & Pacific', emoji: '🦘' },
}

const DEFAULT_REGION = { region: 'Other', emoji: '✈️' }

// ─────────────────────────────────────────────
// SLUG BUILDER
// e.g. "Manchester" + "New York" → "manchester-to-new-york"
// ─────────────────────────────────────────────
function buildSlug(originCity: string, destCity: string): string {
  const slugify = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  return `${slugify(originCity)}-to-${slugify(destCity)}`
}

// ─────────────────────────────────────────────
// DATA PROCESSING
// ─────────────────────────────────────────────
function buildRegionGroups(): RegionGroup[] {
  const allAirports = (airports as RawAirport[]).filter(
    a => a.iata_code && a.city && a.country && (a.links_count ?? 0) >= 20
  )

  // Deduplicate: one airport per city (busiest by links_count)
  const bestByCity = new Map<string, RawAirport>()
  for (const a of allAirports) {
    const key = `${a.city}||${a.country}`
    const existing = bestByCity.get(key)
    if (!existing || (a.links_count ?? 0) > (existing.links_count ?? 0)) {
      bestByCity.set(key, a)
    }
  }

  const uniqueAirports = Array.from(bestByCity.values()).sort(
    (a, b) => (b.links_count ?? 0) - (a.links_count ?? 0)
  )

  // Group origins by region
  const regionMap = new Map<string, { emoji: string; origins: Map<string, OriginGroup> }>()

  for (const origin of uniqueAirports) {
    const { region, emoji } = COUNTRY_REGION[origin.country] ?? DEFAULT_REGION

    if (!regionMap.has(region)) {
      regionMap.set(region, { emoji, origins: new Map() })
    }

    const originKey = `${origin.city}||${origin.iata_code}`
    const regionData = regionMap.get(region)!

    if (!regionData.origins.has(originKey)) {
      regionData.origins.set(originKey, {
        city: origin.city,
        iata: origin.iata_code,
        country: origin.country,
        routes: [],
      })
    }

    const originGroup = regionData.origins.get(originKey)!

    // Add routes to all other airports (different city, max 30 per origin to keep page manageable)
    for (const dest of uniqueAirports) {
      if (dest.city === origin.city && dest.country === origin.country) continue
      if (originGroup.routes.length >= 30) break

      originGroup.routes.push({
        originCity: origin.city,
        originIATA: origin.iata_code,
        originCountry: origin.country,
        destCity: dest.city,
        destIATA: dest.iata_code,
        destCountry: dest.country,
        slug: buildSlug(origin.city, dest.city),
      })
    }
  }

  // Convert to array, sort regions by a preferred order
  const REGION_ORDER = [
    'UK & Ireland',
    'Western Europe',
    'Southern Europe',
    'Northern Europe',
    'Eastern Europe',
    'Turkey & Middle East',
    'Africa',
    'North America',
    'Caribbean',
    'South America',
    'South Asia',
    'Southeast Asia',
    'East Asia',
    'Australia & Pacific',
    'Other',
  ]

  return REGION_ORDER.flatMap(regionName => {
    const data = regionMap.get(regionName)
    if (!data) return []
    return [{
      region: regionName,
      emoji: data.emoji,
      origins: Array.from(data.origins.values()).filter(o => o.routes.length > 0),
    }]
  }).filter(r => r.origins.length > 0)
}

// ─────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────
export async function generateMetadata() {
  return buildMetadata({
    title: 'Popular Flight Routes | Timms Travel',
    description:
      'Browse hundreds of popular flight routes worldwide. Find cheap flights between cities across Europe, America, Asia, Africa and more — book instantly with Timms Travel.',
  })
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function PopularRoutesPage() {
  const regionGroups = buildRegionGroups()

  const totalRoutes = regionGroups.reduce(
    (acc, r) => acc + r.origins.reduce((a, o) => a + o.routes.length, 0),
    0
  )

  return (
    <PopularRoutesClient
      regionGroups={regionGroups}
      totalRoutes={totalRoutes}
    />
  )
}
