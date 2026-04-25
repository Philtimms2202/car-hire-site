import { buildMetadata } from '@/app/metadata'
import TransfersPageClient from './TransfersPageClient'

export function generateMetadata() {
  return buildMetadata({
    title: 'Book Your Airport Transfers | Timms Travel',
    description:
      'Book your airport transfer, available in over 100 countries worldwide.',
    openGraph: {
      url: 'https://timmstravel.com/other-services/airport-transfers',
    },
    alternates: {
      canonical: 'https://timmstravel.com/other-services/airport-transfers',
    },
  })
}

export default function AirportTransfersPage() {
  return <TransfersPageClient />
}