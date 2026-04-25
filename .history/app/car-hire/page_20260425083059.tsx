import { buildMetadata } from '@/app/metadata'
import CarHirePageClient from './CarHirePageClient'

export function generateMetadata() {
  return buildMetadata({
    title: 'Find Hire Car Deals | Timms Travel',
    description: 'Compare hundreds of car hire deals instantly — great prices, no hidden fees.',
    alternates: {
      canonical: 'https://timmstravel.com/car-hire',
    },
    openGraph: {
      url: 'https://timmstravel.com/car-hire',
    },
  })
}

export default function CarHirePage() {
  return <CarHirePageClient />
}