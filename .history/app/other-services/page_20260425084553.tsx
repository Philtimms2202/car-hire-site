import { buildMetadata } from '@/app/metadata'
import OtherServicesPageClient from './OtherServicesPageClient'

export function generateMetadata() {
  return buildMetadata({
    title: 'Travel Services: eSIMs, Insurance, Hotels & More | Timms Travel',
    description:
      'Discover all Timms Travel services including eSIMs, travel insurance, flights, hotels, experiences and car hire. Everything you need for your trip in one place.',
    openGraph: {
      url: 'https://timmstravel.com/other-services',
    },
    alternates: {
      canonical: 'https://timmstravel.com/other-services',
    },
  })
}

export default function OtherServicesPage() {
  return <OtherServicesPageClient />
}