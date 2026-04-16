import { buildMetadata } from '@/app/metadata'
import HotelsPageClient from './HotelsPageClient'

export function generateMetadata() {
  return buildMetadata({
    title: 'Compare Hotel Prices Worldwide | Timms Travel',
    description: 'Compare and book hotels worldwide — from budget stays to 5-star luxury. Search 500,000+ properties with free cancellation on most rooms.',
    openGraph: {
      url: 'https://timmstravel.com/hotels',
    },
  })
}

export default function HotelsPage() {
  return <HotelsPageClient />
}
