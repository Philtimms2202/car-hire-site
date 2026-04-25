import { buildMetadata } from '@/app/metadata'
import ExperiencesPageClient from './ExperiencesPageClient'

export function generateMetadata() {
  return buildMetadata({
    title: 'Find Experiences Worldwide | Timms Travel',
    description: 'From exciting adventure to food tours you have never experienced before.',
    alternates: {
      canonical: 'https://timmstravel.com/experiences',
    },
    openGraph: {
      url: 'https://timmstravel.com/experiences',
    },
  })
}

export default function ExperiencesPage() {
  return <ExperiencesPageClient />
}
