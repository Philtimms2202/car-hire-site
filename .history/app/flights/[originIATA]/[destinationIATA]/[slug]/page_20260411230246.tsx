import { buildMetadata } from '@/app/metadata'
import RoutePageClient from './RoutePageClient'
import { client } from '@/sanity/lib/client'

// Types for route params
type RouteParams = {
  originIATA: string
  destinationIATA: string
  slug: string
}

// Basic city type based on your GROQ result
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

// ---- Sanity helpers ----

async function getCityByIATA(iata: string): Promise<City | null> {
  // For now this will return null until primaryIATA is populated,
  // but the structure is correct and future‑proof.
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

// ---- Metadata ----

export async function generateMetadata({ params }: { params: RouteParams }) {
  const { originIATA, destinationIATA, slug } = params

  // Try to fetch cities (non‑blocking for now)
  const [origin, destination] = await Promise.all([
    getCityByIATA(originIATA),
    getCityByIATA(destinationIATA),
  ])

  const originName = origin?.name ?? originIATA.toUpperCase()
  const destinationName = destination?.name ?? destinationIATA.toUpperCase()

  const title = `Flights from ${originName} to ${destinationName} | Timms Travel`

  const description =
    destination?.metaDescription ??
    `Compare and book flights from ${originName} to ${destinationName} with trusted partners via Timms Travel.`

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

// ---- Page ----

export default async function RoutePage({ params }: { params: RouteParams }) {
  const { originIATA, destinationIATA, slug } = params

  // Fetch cities for the actual page
  const [origin, destination] = await Promise.all([
    getCityByIATA(originIATA),
    getCityByIATA(destinationIATA),
  ])

  // Later we can add:
  // - slug validation
  // - canonical redirects
  // - 404 handling if cities not found

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
