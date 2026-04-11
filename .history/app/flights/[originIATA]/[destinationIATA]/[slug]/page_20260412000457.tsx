import { buildMetadata } from '@/app/metadata'
import RoutePageClient from './RoutePageClient'
import { client } from '@/sanity/lib/client'

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
// SANITY HELPER
// Returns null gracefully when IATA fields are blank
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
// METADATA
// Pattern: "Cheap Flights from [Origin] to [Destination] | Timms Travel"
// Falls back to IATA codes when Sanity isn't populated yet
// ─────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<RouteParams> }
) {
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

  const originName = origin?.name ?? originIATA.toUpperCase()
  const destinationName = destination?.name ?? destinationIATA.toUpperCase()
  const originCountry = origin?.country?.name
  const destinationCountry = destination?.country?.name

  // Primary title pattern — optimised for "cheap flights from X to Y" searches
  const title = `Cheap Flights from ${originName} to ${destinationName} | Timms Travel`

  // Meta description — include countries for broader keyword coverage
  const description =
    destination?.metaDescription ??
    `Find cheap flights from ${originName}${originCountry ? `, ${originCountry}` : ''} to ${destinationName}${destinationCountry ? `, ${destinationCountry}` : ''}. Compare airlines and book securely with Timms Travel powered by Kiwi.com.`

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
export default async function RoutePage({
  params,
}: {
  params: Promise<RouteParams>
}) {
  const { originIATA, destinationIATA, slug } = await params

  const [origin, destination] = await Promise.all([
    getCityByIATA(originIATA),
    getCityByIATA(destinationIATA),
  ])

  return (
    <RoutePageClient
      originIATA={originIATA}
      destinationIATA={destinationIATA}
      slug={slug}
      origin={origin}
      destination={destination}
    />
  )
}
