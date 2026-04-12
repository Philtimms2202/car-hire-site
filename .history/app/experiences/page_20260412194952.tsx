import { buildMetadata } from '@/app/metadata'
import ExperiencesPageClient from './ExperiencesPageClient'

export function generateMetadata() {
  return buildMetadata({
    title: 'Find Experiences Worldwide | Timms Travel',
    description: 'From exciting adventure to food tours you've never experienced before.',
    openGraph: {
      url: 'https://timmstravel.com/experiences',
    },
  })
}

export default function ExperiencesPage() {
  return <ExperiencesPageClient />
}
