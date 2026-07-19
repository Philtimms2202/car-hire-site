import { notFound } from 'next/navigation'
import { DEAL_CATEGORIES } from '@/data/dealCategories'
import { buildMetadata } from '@/app/metadata'
import { getSanityCities } from '@/lib/getSanityCities'
import { getDealsForSlug } from '@/lib/getDealsForSlug'
import DealPageClient from '../DealPageClient'
import { resolveAirportSlugToIata, resolveIataToLabel, getPrimaryAirportSlugs } from '@/lib/airportUtils'

export async function generateStaticParams() {
  const airports = getPrimaryAirportSlugs()
  return Object.keys(DEAL_CATEGORIES).flatMap((slug) =>
    airports.map((a) => ({ slug, airport: a.slug }))
  )
}

export async function generateMetadata({ params }: { params: Promise<DealParams> }) {
  const { slug, airport } = await params
  const categoryConfig = DEAL_CATEGORIES[slug as keyof typeof DEAL_CATEGORIES]
  const iata = resolveAirportSlugToIata(airport)

console.log('DEBUG:', { slug, airport, categoryConfigFound: !!categoryConfig, iata })

  if (!categoryConfig || !iata) {
    return buildMetadata({
      title: 'Flight Deals | Timms Travel',
      description: 'Find real-time discounted airfares and travel deals worldwide.',
    })
  }

  const airportLabel = resolveIataToLabel(iata)
  const title = `${categoryConfig.title} from ${airportLabel} | Timms Travel`
  const description = `${categoryConfig.subtitle} Live indicative pricing departing ${airportLabel} (${iata}), updated every few hours.`
  const canonical = `https://timmstravel.com/deals/${slug}/${airport}`

  return buildMetadata({
    title,
    description,
    alternates: { canonical },
    openGraph: { url: canonical, title, description },
  })
}

export default async function DealAirportPage({ params }: { params: Promise<DealParams> }) {
  const { slug, airport } = await params
  const categoryConfig = DEAL_CATEGORIES[slug as keyof typeof DEAL_CATEGORIES]
  const iata = resolveAirportSlugToIata(airport)

  if (!categoryConfig || !iata) notFound()

  const [sanityCities, deals] = await Promise.all([
    getSanityCities(),
    getDealsForSlug(slug, iata),
  ])

  console.log('DEBUG deals:', { slug, iata, rawCount: deals.length, sample: deals.slice(0, 3) })

  return (
    <DealPageClient
      slug={slug}
      airportSlug={airport}
      originIata={iata}
      categoryConfig={categoryConfig}
      sanityCities={sanityCities}
      initialDeals={deals}
    />
  )
}