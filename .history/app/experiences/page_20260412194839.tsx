import { buildMetadata } from '@/app/metadata'
import ExperiencesPageClient from './ExperiencesPageClient'

export function generateMetadata() {
  return buildMetadata({
    title: 'Find Cheap Flights | Timms Travel',
    description: 'Compare and book cheap flights from all airports worldwide.',
    openGraph: {
      url: 'https://timmstravel.com/experiences',
    },
  })
}

export default function ExperiencesPage() {
  return <ExperiencesPageClient />
}
