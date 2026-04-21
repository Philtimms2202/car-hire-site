import { buildMetadata } from '@/app/metadata'
import OtherServicesPageClient from './OtherServicesPageClient'

export function generateMetadata() {
  return buildMetadata({
    title: 'eSIMs, Insurance, Hotels & More | Timms Travel',
    description:
      'Discover all Timms Travel services - eSIMs, travel insurance, flights, hotels, experiences and car hire. Everything your trip needs in one place.',
    openGraph: {
      url: 'https://timmstravel.com/other-services',
    },
  })
}

export default function OtherServicesPage() {
  return <OtherServicesPageClient />
}