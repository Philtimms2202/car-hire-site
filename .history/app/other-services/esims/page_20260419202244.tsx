import { buildMetadata } from '@/app/metadata'
import EsimsPageClient from '.app/other-services/EsimsPageClient'

export function generateMetadata() {
  return buildMetadata({
    title: 'Travel eSIMs — Stay Connected Abroad | Timms Travel',
    description:
      'Get affordable mobile data in 150+ countries with a Saily eSIM. No roaming charges, no physical SIM card, instant activation. Browse plans and get connected before you fly.',
    openGraph: {
      url: 'https://timmstravel.com/esims',
    },
  })
}

export default function EsimsPage() {
  return <EsimsPageClient />
}