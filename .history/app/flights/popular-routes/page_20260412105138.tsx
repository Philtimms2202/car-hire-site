// app/flights/popular-routes/page.tsx

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
  destContinent: string
  slug: string
}

export type OriginGroup = {
  city: string
  iata: string
  country: string
  continent: string
  routes: RouteLink[]
}

export type ContinentGroup = {
  continent: string
  continentSlug: string
  emoji: string
  origins: OriginGroup[]
}

// ─────────────────────────────────────────────
// CONTINENT MAP — exactly matches your Sanity schema
// Europe | Asia | North America | South America | Africa | Middle East | Oceania
// ─────────────────────────────────────────────
const COUNTRY_CONTINENT: Record<string, { continent: string; emoji: string }> = {
  // ── Europe ──────────────────────────────────
  'United Kingdom':   { continent: 'Europe', emoji: '🌍' },
  'Ireland':          { continent: 'Europe', emoji: '🌍' },
  'France':           { continent: 'Europe', emoji: '🌍' },
  'Germany':          { continent: 'Europe', emoji: '🌍' },
  'Netherlands':      { continent: 'Europe', emoji: '🌍' },
  'Belgium':          { continent: 'Europe', emoji: '🌍' },
  'Switzerland':      { continent: 'Europe', emoji: '🌍' },
  'Austria':          { continent: 'Europe', emoji: '🌍' },
  'Luxembourg':       { continent: 'Europe', emoji: '🌍' },
  'Spain':            { continent: 'Europe', emoji: '🌍' },
  'Portugal':         { continent: 'Europe', emoji: '🌍' },
  'Italy':            { continent: 'Europe', emoji: '🌍' },
  'Greece':           { continent: 'Europe', emoji: '🌍' },
  'Croatia':          { continent: 'Europe', emoji: '🌍' },
  'Malta':            { continent: 'Europe', emoji: '🌍' },
  'Cyprus':           { continent: 'Europe', emoji: '🌍' },
  'Denmark':          { continent: 'Europe', emoji: '🌍' },
  'Sweden':           { continent: 'Europe', emoji: '🌍' },
  'Norway':           { continent: 'Europe', emoji: '🌍' },
  'Finland':          { continent: 'Europe', emoji: '🌍' },
  'Iceland':          { continent: 'Europe', emoji: '🌍' },
  'Poland':           { continent: 'Europe', emoji: '🌍' },
  'Czech Republic':   { continent: 'Europe', emoji: '🌍' },
  'Hungary':          { continent: 'Europe', emoji: '🌍' },
  'Romania':          { continent: 'Europe', emoji: '🌍' },
  'Bulgaria':         { continent: 'Europe', emoji: '🌍' },
  'Slovakia':         { continent: 'Europe', emoji: '🌍' },
  'Serbia':           { continent: 'Europe', emoji: '🌍' },
  'Albania':          { continent: 'Europe', emoji: '🌍' },
  'Slovenia':         { continent: 'Europe', emoji: '🌍' },
  'Bosnia and Herzegovina': { continent: 'Europe', emoji: '🌍' },
  'Montenegro':       { continent: 'Europe', emoji: '🌍' },
  'North Macedonia':  { continent: 'Europe', emoji: '🌍' },
  'Kosovo':           { continent: 'Europe', emoji: '🌍' },
  'Ukraine':          { continent: 'Europe', emoji: '🌍' },
  'Moldova':          { continent: 'Europe', emoji: '🌍' },
  'Belarus':          { continent: 'Europe', emoji: '🌍' },
  'Lithuania':        { continent: 'Europe', emoji: '🌍' },
  'Latvia':           { continent: 'Europe', emoji: '🌍' },
  'Estonia':          { continent: 'Europe', emoji: '🌍' },
  'Russia':           { continent: 'Europe', emoji: '🌍' },

  // ── Middle East ──────────────────────────────
  'Turkey':           { continent: 'Middle East', emoji: '🕌' },
  'UAE':              { continent: 'Middle East', emoji: '🕌' },
  'Qatar':            { continent: 'Middle East', emoji: '🕌' },
  'Saudi Arabia':     { continent: 'Middle East', emoji: '🕌' },
  'Kuwait':           { continent: 'Middle East', emoji: '🕌' },
  'Bahrain':          { continent: 'Middle East', emoji: '🕌' },
  'Oman':             { continent: 'Middle East', emoji: '🕌' },
  'Jordan':           { continent: 'Middle East', emoji: '🕌' },
  'Israel':           { continent: 'Middle East', emoji: '🕌' },
  'Lebanon':          { continent: 'Middle East', emoji: '🕌' },
  'Iraq':             { continent: 'Middle East', emoji: '🕌' },
  'Iran':             { continent: 'Middle East', emoji: '🕌' },
  'Yemen':            { continent: 'Middle East', emoji: '🕌' },
  'Syria':            { continent: 'Middle East', emoji: '🕌' },
  'Palestine':        { continent: 'Middle East', emoji: '🕌' },

  // ── Africa ───────────────────────────────────
  'Egypt':            { continent: 'Africa', emoji: '🌅' },
  'Morocco':          { continent: 'Africa', emoji: '🌅' },
  'Tunisia':          { continent: 'Africa', emoji: '🌅' },
  'Algeria':          { continent: 'Africa', emoji: '🌅' },
  'Libya':            { continent: 'Africa', emoji: '🌅' },
  'South Africa':     { continent: 'Africa', emoji: '🌅' },
  'Kenya':            { continent: 'Africa', emoji: '🌅' },
  'Tanzania':         { continent: 'Africa', emoji: '🌅' },
  'Ethiopia':         { continent: 'Africa', emoji: '🌅' },
  'Ghana':            { continent: 'Africa', emoji: '🌅' },
  'Nigeria':          { continent: 'Africa', emoji: '🌅' },
  'Cape Verde':       { continent: 'Africa', emoji: '🌅' },
  'Gambia':           { continent: 'Africa', emoji: '🌅' },
  'Senegal':          { continent: 'Africa', emoji: '🌅' },
  'Uganda':           { continent: 'Africa', emoji: '🌅' },
  'Rwanda':           { continent: 'Africa', emoji: '🌅' },
  'Mozambique':       { continent: 'Africa', emoji: '🌅' },
  'Zimbabwe':         { continent: 'Africa', emoji: '🌅' },
  'Zambia':           { continent: 'Africa', emoji: '🌅' },
  'Mauritius':        { continent: 'Africa', emoji: '🌅' },
  'Seychelles':       { continent: 'Africa', emoji: '🌅' },
  'Madagascar':       { continent: 'Africa', emoji: '🌅' },
  'Namibia':          { continent: 'Africa', emoji: '🌅' },
  'Botswana':         { continent: 'Africa', emoji: '🌅' },
  "Ivory Coast":      { continent: 'Africa', emoji: '🌅' },
  "Cameroon":         { continent: 'Africa', emoji: '🌅' },

  // ── North America ────────────────────────────
  'USA':              { continent: 'North America', emoji: '🗽' },
  'Canada':           { continent: 'North America', emoji: '🗽' },
  'Mexico':           { continent: 'North America', emoji: '🗽' },
  'Cuba':             { continent: 'North America', emoji: '🗽' },
  'Jamaica':          { continent: 'North America', emoji: '🗽' },
  'Dominican Republic': { continent: 'North America', emoji: '🗽' },
  'Barbados':         { continent: 'North America', emoji: '🗽' },
  'Trinidad and Tobago': { continent: 'North America', emoji: '🗽' },
  'Antigua and Barbuda': { continent: 'North America', emoji: '🗽' },
  'Saint Lucia':      { continent: 'North America', emoji: '🗽' },
  'Bahamas':          { continent: 'North America', emoji: '🗽' },
  'Cayman Islands':   { continent: 'North America', emoji: '🗽' },
  'Turks and Caicos Islands': { continent: 'North America', emoji: '🗽' },
  'Costa Rica':       { continent: 'North America', emoji: '🗽' },
  'Panama':           { continent: 'North America', emoji: '🗽' },
  'Guatemala':        { continent: 'North America', emoji: '🗽' },
  'Honduras':         { continent: 'North America', emoji: '🗽' },
  'El Salvador':      { continent: 'North America', emoji: '🗽' },
  'Nicaragua':        { continent: 'North America', emoji: '🗽' },

  // ── South America ────────────────────────────
  'Brazil':           { continent: 'South America', emoji: '🌿' },
  'Argentina':        { continent: 'South America', emoji: '🌿' },
  'Colombia':         { continent: 'South America', emoji: '🌿' },
  'Peru':             { continent: 'South America', emoji: '🌿' },
  'Chile':            { continent: 'South America', emoji: '🌿' },
  'Venezuela':        { continent: 'South America', emoji: '🌿' },
  'Ecuador':          { continent: 'South America', emoji: '🌿' },
  'Bolivia':          { continent: 'South America', emoji: '🌿' },
  'Paraguay':         { continent: 'South America', emoji: '🌿' },
  'Uruguay':          { continent: 'South America', emoji: '🌿' },
  'Guyana':           { continent: 'South America', emoji: '🌿' },
  'Suriname':         { continent: 'South America', emoji: '🌿' },

  // ── Asia ─────────────────────────────────────
  'India':            { continent: 'Asia', emoji: '🛕' },
  'Pakistan':         { continent: 'Asia', emoji: '🛕' },
  'Sri Lanka':        { continent: 'Asia', emoji: '🛕' },
  'Bangladesh':       { continent: 'Asia', emoji: '🛕' },
  'Nepal':            { continent: 'Asia', emoji: '🛕' },
  'Maldives':         { continent: 'Asia', emoji: '🛕' },
  'Thailand':         { continent: 'Asia', emoji: '🛕' },
  'Singapore':        { continent: 'Asia', emoji: '🛕' },
  'Malaysia':         { continent: 'Asia', emoji: '🛕' },
  'Indonesia':        { continent: 'Asia', emoji: '🛕' },
  'Vietnam':          { continent: 'Asia', emoji: '🛕' },
  'Philippines':      { continent: 'Asia', emoji: '🛕' },
  'Cambodia':         { continent: 'Asia', emoji: '🛕' },
  'Myanmar':          { continent: 'Asia', emoji: '🛕' },
  'Laos':             { continent: 'Asia', emoji: '🛕' },
  'China':            { continent: 'Asia', emoji: '🛕' },
  'Japan':            { continent: 'Asia', emoji: '🛕' },
  'South Korea':      { continent: 'Asia', emoji: '🛕' },
  'Hong Kong':        { continent: 'Asia', emoji: '🛕' },
  'Taiwan':           { continent: 'Asia', emoji: '🛕' },
  'Mongolia':         { continent: 'Asia', emoji: '🛕' },
  'Kazakhstan':       { continent: 'Asia', emoji: '🛕' },
  'Uzbekistan':       { continent: 'Asia', emoji: '🛕' },
  'Georgia':          { continent: 'Asia', emoji: '🛕' },
  'Armenia':          { continent: 'Asia', emoji: '🛕' },
  'Azerbaijan':       { continent: 'Asia', emoji: '🛕' },

  // ── Oceania ──────────────────────────────────
  'Australia':        { continent: 'Oceania', emoji: '🦘' },
  'New Zealand':      { continent: 'Oceania', emoji: '🦘' },
  'Fiji':             { continent: 'Oceania', emoji: '🦘' },
  'Papua New Guinea': { continent: 'Oceania', emoji: '🦘' },
  'Vanuatu':          { continent: 'Oceania', emoji: '🦘' },
  'Samoa':            { continent: 'Oceania', emoji: '🦘' },
  'Tonga':            { continent: 'Oceania', emoji: '🦘' },
}

// Matches your Sanity continentSlug format exactly
function toContinentSlug(continent: string): string {
  return continent.toLowerCase().replace(/\s+/g, '-')
}

// e.g. "Manchester" + "New York" → "manchester-to-new-york"
function buildSlug(originCity: string, destCity: string): string {
  const slugify = (s: string) =>
    s.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${slugify(originCity)}-to-${slugify(destCity)}`
}

// ─────────────────────────────────────────────
// DATA PROCESSING
// ─────────────────────────────────────────────
function buildContinentGroups(): ContinentGroup[] {
  const allAirports = (airports as RawAirport[]).filter(
    a => a.iata_code && a.city && a.country && (a.links_count ?? 0) >= 20
  )

  // One airport per city — pick busiest by links_count
  const bestByCity = new Map<string, RawAirport>()
  for (const a of allAirports) {
    const key = `${a.city}||${a.country}`
    const existing = bestByCity.get(key)
    if (!existing || (a.links_count ?? 0) > (existing.links_count ?? 0)) {
      bestByCity.set(key, a)
    }
  }

  const unique = Array.from(bestByCity.values())
    .sort((a, b) => (b.links_count ?? 0) - (a.links_count ?? 0))

  // Build continent → origin → routes
  const continentMap = new Map<string, { emoji: string; origins: Map<string, OriginGroup> }>()

  for (const origin of unique) {
    const meta = COUNTRY_CONTINENT[origin.country]
    if (!meta) continue // skip unmapped countries

    const { continent, emoji } = meta

    if (!continentMap.has(continent)) {
      continentMap.set(continent, { emoji, origins: new Map() })
    }

    const originKey = `${origin.city}||${origin.iata_code}`
    const contData = continentMap.get(continent)!

    if (!contData.origins.has(originKey)) {
      contData.origins.set(originKey, {
        city: origin.city,
        iata: origin.iata_code,
        country: origin.country,
        continent,
        routes: [],
      })
    }

    const originGroup = contData.origins.get(originKey)!

    // Add routes to top destinations (max 30 per origin)
    for (const dest of unique) {
      if (dest.city === origin.city && dest.country === origin.country) continue
      if (originGroup.routes.length >= 30) break

      const destMeta = COUNTRY_CONTINENT[dest.country]

      originGroup.routes.push({
        originCity: origin.city,
        originIATA: origin.iata_code,
        originCountry: origin.country,
        destCity: dest.city,
        destIATA: dest.iata_code,
        destCountry: dest.country,
        destContinent: destMeta?.continent ?? 'Other',
        slug: buildSlug(origin.city, dest.city),
      })
    }
  }

  // Render in your exact Sanity continent order
  const CONTINENT_ORDER = [
    'Europe',
    'Asia',
    'Middle East',
    'North America',
    'South America',
    'Africa',
    'Oceania',
  ]

  return CONTINENT_ORDER.flatMap(continent => {
    const data = continentMap.get(continent)
    if (!data) return []
    const origins = Array.from(data.origins.values()).filter(o => o.routes.length > 0)
    if (!origins.length) return []
    return [{
      continent,
      continentSlug: toContinentSlug(continent),
      emoji: data.emoji,
      origins,
    }]
  })
}

// ─────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────
export async function generateMetadata() {
  return buildMetadata({
    title: 'Popular Flight Routes | Timms Travel',
    description:
      'Browse hundreds of popular flight routes worldwide. Find cheap flights between cities across Europe, Asia, the Americas, Africa and more — book instantly with Timms Travel.',
  })
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function PopularRoutesPage() {
  const continentGroups = buildContinentGroups()

  const totalRoutes = continentGroups.reduce(
    (acc, c) => acc + c.origins.reduce((a, o) => a + o.routes.length, 0),
    0
  )

  // Flat list of all cities for autocomplete
  const allCities = continentGroups.flatMap(c =>
    c.origins.map(o => ({
      city: o.city,
      iata: o.iata,
      country: o.country,
      continent: o.continent,
    }))
  )

  return (
    <PopularRoutesClient
      continentGroups={continentGroups}
      totalRoutes={totalRoutes}
      allCities={allCities}
    />
  )
}