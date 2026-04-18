import { buildMetadata } from '@/app/metadata'
import RoutePageClient from './RoutePageClient'
import { client } from '@/sanity/lib/client'
import { getSanityCities } from '@/lib/getSanityCities'
import {
  getRouteFlightInfo,
  formatFlightDuration,
} from '@/lib/flight-utils'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type RouteParams = {
  originIATA: string
  destinationIATA: string
  slug: string
}

type City = {
  name: string
  slug: { current: string }
  country: {
    name: string
    slug: { current: string }
  }
  heroDescription?: string | null
  metaDescription?: string | null
  primaryIATA?: string | null
  alternateIATAs?: string[] | null
  emoji?: string | null
  latitude?: number | null
  longitude?: number | null
}

// ─────────────────────────────────────────────
// SANITY LOOKUP
// ─────────────────────────────────────────────
async function getCityByIATA(iata?: string): Promise<City | null> {
  if (!iata) return null

  const query = `
    *[_type == "city" && primaryIATA == $iata][0]{
      name,
      slug,
      country->{ name, slug },
      heroDescription,
      metaDescription,
      primaryIATA,
      alternateIATAs,
      emoji,
      latitude,
      longitude
    }
  `

  return client.fetch(query, { iata })
}

// ─────────────────────────────────────────────
// FALLBACK IATA → CITY MAPPING
// (Used when Sanity is missing data)
// ─────────────────────────────────────────────
const IATA_CITIES: Record<string, { city: string; country: string }> = {
  LHR: { city: 'London', country: 'United Kingdom' },
  LGW: { city: 'London', country: 'United Kingdom' },
  STN: { city: 'London', country: 'United Kingdom' },
  LTN: { city: 'London', country: 'United Kingdom' },
  MAN: { city: 'Manchester', country: 'United Kingdom' },
  EDI: { city: 'Edinburgh', country: 'United Kingdom' },
  BHX: { city: 'Birmingham', country: 'United Kingdom' },
  GLA: { city: 'Glasgow', country: 'United Kingdom' },
  BRS: { city: 'Bristol', country: 'United Kingdom' },
  LBA: { city: 'Leeds', country: 'United Kingdom' },
  NCL: { city: 'Newcastle', country: 'United Kingdom' },
  DUB: { city: 'Dublin', country: 'Ireland' },
  CDG: { city: 'Paris', country: 'France' },
  ORY: { city: 'Paris', country: 'France' },
  AMS: { city: 'Amsterdam', country: 'Netherlands' },
  BCN: { city: 'Barcelona', country: 'Spain' },
  MAD: { city: 'Madrid', country: 'Spain' },
  PMI: { city: 'Mallorca', country: 'Spain' },
  IBZ: { city: 'Ibiza', country: 'Spain' },
  AGP: { city: 'Málaga', country: 'Spain' },
  ALC: { city: 'Alicante', country: 'Spain' },
  TFS: { city: 'Tenerife', country: 'Spain' },
  FCO: { city: 'Rome', country: 'Italy' },
  MXP: { city: 'Milan', country: 'Italy' },
  VCE: { city: 'Venice', country: 'Italy' },
  NAP: { city: 'Naples', country: 'Italy' },
  FRA: { city: 'Frankfurt', country: 'Germany' },
  MUC: { city: 'Munich', country: 'Germany' },
  BER: { city: 'Berlin', country: 'Germany' },
  VIE: { city: 'Vienna', country: 'Austria' },
  ZRH: { city: 'Zurich', country: 'Switzerland' },
  GVA: { city: 'Geneva', country: 'Switzerland' },
  BRU: { city: 'Brussels', country: 'Belgium' },
  CPH: { city: 'Copenhagen', country: 'Denmark' },
  OSL: { city: 'Oslo', country: 'Norway' },
  ARN: { city: 'Stockholm', country: 'Sweden' },
  HEL: { city: 'Helsinki', country: 'Finland' },
  LIS: { city: 'Lisbon', country: 'Portugal' },
  OPO: { city: 'Porto', country: 'Portugal' },
  FAO: { city: 'Faro', country: 'Portugal' },
  ATH: { city: 'Athens', country: 'Greece' },
  HER: { city: 'Heraklion', country: 'Greece' },
  RHO: { city: 'Rhodes', country: 'Greece' },
  PRG: { city: 'Prague', country: 'Czech Republic' },
  BUD: { city: 'Budapest', country: 'Hungary' },
  WAW: { city: 'Warsaw', country: 'Poland' },
  KRK: { city: 'Krakow', country: 'Poland' },
  AYT: { city: 'Antalya', country: 'Turkey' },
  IST: { city: 'Istanbul', country: 'Turkey' },
  SAW: { city: 'Istanbul', country: 'Turkey' },
  DXB: { city: 'Dubai', country: 'UAE' },
  AUH: { city: 'Abu Dhabi', country: 'UAE' },
  DOH: { city: 'Doha', country: 'Qatar' },
  AMM: { city: 'Amman', country: 'Jordan' },
  CAI: { city: 'Cairo', country: 'Egypt' },
  HRG: { city: 'Hurghada', country: 'Egypt' },
  SSH: { city: 'Sharm el-Sheikh', country: 'Egypt' },
  CMN: { city: 'Casablanca', country: 'Morocco' },
  RAK: { city: 'Marrakech', country: 'Morocco' },
  CPT: { city: 'Cape Town', country: 'South Africa' },
  JNB: { city: 'Johannesburg', country: 'South Africa' },
  SID: { city: 'Cape Verde', country: 'Cape Verde' },
  JFK: { city: 'New York', country: 'USA' },
  EWR: { city: 'New York', country: 'USA' },
  LAX: { city: 'Los Angeles', country: 'USA' },
  MCO: { city: 'Orlando', country: 'USA' },
  MIA: { city: 'Miami', country: 'USA' },
  ORD: { city: 'Chicago', country: 'USA' },
  SFO: { city: 'San Francisco', country: 'USA' },
  LAS: { city: 'Las Vegas', country: 'USA' },
  BOS: { city: 'Boston', country: 'USA' },
  YYZ: { city: 'Toronto', country: 'Canada' },
  YVR: { city: 'Vancouver', country: 'Canada' },
  CUN: { city: 'Cancún', country: 'Mexico' },
  GRU: { city: 'São Paulo', country: 'Brazil' },
  GIG: { city: 'Rio de Janeiro', country: 'Brazil' },
  EZE: { city: 'Buenos Aires', country: 'Argentina' },
  BKK: { city: 'Bangkok', country: 'Thailand' },
  HKT: { city: 'Phuket', country: 'Thailand' },
  CNX: { city: 'Chiang Mai', country: 'Thailand' },
  SIN: { city: 'Singapore', country: 'Singapore' },
  KUL: { city: 'Kuala Lumpur', country: 'Malaysia' },
  HKG: { city: 'Hong Kong', country: 'Hong Kong' },
  NRT: { city: 'Tokyo', country: 'Japan' },
  HND: { city: 'Tokyo', country: 'Japan' },
  OSA: { city: 'Osaka', country: 'Japan' },
  ICN: { city: 'Seoul', country: 'South Korea' },
  DEL: { city: 'Delhi', country: 'India' },
  BOM: { city: 'Mumbai', country: 'India' },
  MAA: { city: 'Chennai', country: 'India' },
  COK: { city: 'Kochi', country: 'India' },
  CGK: { city: 'Jakarta', country: 'Indonesia' },
  DPS: { city: 'Bali', country: 'Indonesia' },
  MNL: { city: 'Manila', country: 'Philippines' },
  SGN: { city: 'Ho Chi Minh City', country: 'Vietnam' },
  HAN: { city: 'Hanoi', country: 'Vietnam' },
  REP: { city: 'Siem Reap', country: 'Cambodia' },
  SYD: { city: 'Sydney', country: 'Australia' },
  MEL: { city: 'Melbourne', country: 'Australia' },
  BNE: { city: 'Brisbane', country: 'Australia' },
  AKL: { city: 'Auckland', country: 'New Zealand' },
}

const resolveNameFromIATA = (iata: string, sanityCity: City | null) =>
  sanityCity?.name ?? IATA_CITIES[iata.toUpperCase()]?.city ?? iata.toUpperCase()

const resolveCountryFromIATA = (iata: string, sanityCity: City | null) =>
  sanityCity?.country?.name ?? IATA_CITIES[iata.toUpperCase()]?.country

// ─────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { originIATA, destinationIATA, slug } = await params

  if (!originIATA || !destinationIATA) {
    return buildMetadata({
      title: 'Cheap Flights | Timms Travel',
      description: 'Compare and book cheap flights worldwide with Timms Travel.',
    })
  }

  const [origin, destination] = await Promise.all([
    getCityByIATA(originIATA),
    getCityByIATA(destinationIATA),
  ])

  const originName = resolveNameFromIATA(originIATA, origin)
  const destinationName = resolveNameFromIATA(destinationIATA, destination)
  const originCountry = resolveCountryFromIATA(originIATA, origin)
  const destinationCountry = resolveCountryFromIATA(destinationIATA, destination)

  const title = `Cheap Flights from ${originName} to ${destinationName} | Timms Travel`

  const description =
    destination?.metaDescription ??
    `Find cheap flights from ${originName}${originCountry ? `, ${originCountry}` : ''} to ${destinationName}${destinationCountry ? `, ${destinationCountry}` : ''}. Compare airlines and book securely with our trusted partner.`

  const canonical = `https://timmstravel.com/flights/${originIATA}/${destinationIATA}/${slug}`

  return buildMetadata({
    title,
    description,
    openGraph: {
      url: canonical,
      title,
      description,
    },
  })
}

// ─────────────────────────────────────────────
// PAGE (SERVER COMPONENT)
// ─────────────────────────────────────────────
export default async function RoutePage({ params }: { params: Promise<RouteParams> }) {
  const { originIATA, destinationIATA, slug } = await params

  const [origin, destination] = await Promise.all([
    getCityByIATA(originIATA),
    getCityByIATA(destinationIATA),
  ])

  // Deterministic flight info (distance + duration)
  const flightInfo = getRouteFlightInfo(originIATA, destinationIATA)

  // Fetch all cities with IATA codes from Sanity
  const sanityCities = await getSanityCities()

  return (
    <RoutePageClient
      originIATA={originIATA}
      destinationIATA={destinationIATA}
      slug={slug}
      origin={origin}
      destination={destination}
      sanityCities={sanityCities}
      flightInfo={flightInfo}
    />
  )
}
