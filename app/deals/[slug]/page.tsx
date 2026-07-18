import { notFound } from 'next/navigation'
import { DEAL_CATEGORIES } from '@/data/dealCategories'
import { buildMetadata } from '@/app/metadata'
import { getSanityCities } from '@/lib/getSanityCities'
import DealPageClient from './DealPageClient'

type DealParams = {
  slug: string
}

export async function generateMetadata({ params }: { params: Promise<DealParams> }) {
  const { slug } = await params
  const categoryConfig = DEAL_CATEGORIES[slug as keyof typeof DEAL_CATEGORIES]

  if (!categoryConfig) {
    return buildMetadata({
      title: 'Flight Deals | Timms Travel',
      description: 'Find real-time discounted airfares and travel deals worldwide.',
    })
  }

  // Handle runtime custom overrides seamlessly for titles/subtitles
  const displayTitle = slug === 'under-50' ? 'Flights Under £50' : categoryConfig.title
  const displaySubtitle = slug === 'under-50' 
    ? 'Rock-bottom micro-breaks and pocket-friendly European drops.' 
    : categoryConfig.subtitle

  const title = `${displayTitle} | Live Travel Drops | Timms Travel`
  const description = `${displaySubtitle} Track active ticket markdown logs filtered by price ceilings and destination criteria.`
  const canonical = `https://timmstravel.com/deals/${slug}`

  return buildMetadata({
    title,
    description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title,
      description,
    },
  })
}

export default async function DealPage({ params }: { params: Promise<DealParams> }) {
  const { slug } = await params
  const categoryConfig = DEAL_CATEGORIES[slug as keyof typeof DEAL_CATEGORIES]

  if (!categoryConfig) {
    notFound()
  }

  // Fetch the localized naming dataset from Sanity to map IATA identifiers
  const sanityCities = await getSanityCities()

  return (
    <DealPageClient 
      slug={slug} 
      categoryConfig={categoryConfig} 
      sanityCities={sanityCities}
    />
  )
}