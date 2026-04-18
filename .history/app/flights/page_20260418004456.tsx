import { buildMetadata } from '@/app/metadata'
import FlightsPageClient from './FlightsPageClient'

export function generateMetadata() {
  return buildMetadata({
    title: 'Compare Flights Worldwide | Timms Travel',
    description: 'Compare and book cheap flights from all airports worldwide.',
    openGraph: {
      url: 'https://timmstravel.com/flights',
    },
  })
}

export default function FlightsPage() {
  return <FlightsPageClient />
}
