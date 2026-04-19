import { buildMetadata } from '@/app/metadata'
import TravelInsurancePageClient from './TravelInsurancePageClient'

export function generateMetadata() {
  return buildMetadata({
    title: 'Buy Travel Insurance | Timms Travel',
    description:
      'Get comprehensive travel insurance for your next trip. Medical cover up to £10m, cancellation protection, baggage cover and 24/7 emergency support. Quotes in minutes, powered by Ekta.',
    openGraph: {
      url: 'https://timmstravel.com/travel-insurance',
    },
  })
}

export default function TravelInsurancePage() {
  return <TravelInsurancePageClient />
}