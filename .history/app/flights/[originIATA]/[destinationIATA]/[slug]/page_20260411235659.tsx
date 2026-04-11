import { buildMetadata } from '@/app/metadata'
import RoutePageClient from './RoutePageClient'
import { client } from '@/sanity/lib/client'

// -------------------------------
// Types
// -------------------------------
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
}

// -------------------------------
// Sanity helper
// -------------------------------
async function getCityByIATA(iata?: string): Promise<City | null> {
  if (!iata) return null

  const query = `
    *[_type == "city" && primaryIATA == $iata][0]{
      name,
      slug,
      country->{
        name,
        slug
      },
      heroDescription,
      metaDescription,
      primaryIATA,
      alternateIATAs
    }
  `

  return client.fetch(query, { iata })
}

// -------------------------------
// Metadata
// -------------------------------
export async function generateMetadata(
  { params }: { params?: RouteParams } = {}
) {
  const originIATA = params?.originIATA ?? ''
  const destinationIATA = params?.destinationIATA ?? ''
  const slug = params?.slug ?? ''

  // Next.js sometimes calls this without params during pre-render
  if (!originIATA || !destinationIATA) {
    return buildMetadata({
      title: 'Flights | Timms Travel',
      description: 'Compare and book flights worldwide with Timms Travel.',
    })
  }

  const [origin, destination] = await Promise.all([
    getCityByIATA(originIATA),
    getCityByIATA(destinationIATA),
  ])

  const originName = origin?.name || originIATA.toUpperCase()
  const destinationName = destination?.name || destinationIATA.toUpperCase()

  const title = `Flights from ${originName} to ${destinationName} | Timms Travel`
  const description =
    destination?.metaDescription ||
    `Compare and book flights from ${originName} to ${destinationName} with trusted partners.`

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

// -------------------------------
// Page Component (server)
// -------------------------------
export default async function RoutePage({ params }: { params: RouteParams }) {
  const { originIATA, destinationIATA, slug } = params

  console.log("SERVER PARAMS:", params)

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