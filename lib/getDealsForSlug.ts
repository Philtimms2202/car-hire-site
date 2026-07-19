// lib/getDealsForSlug.ts
import { getTrendingDeals, TrendingDeal } from '@/lib/travelpayouts'

const TP_TOKEN = process.env.TRAVELPAYOUTS_TOKEN

const THEME_DESTINATIONS: Record<string, string[]> = {
  'ski-deals': ['GVA', 'INN', 'GNB', 'LYS', 'SOF', 'SZG', 'MUC', 'BCN', 'ZRH'],
  'christmas-deals': ['VIE', 'MUC', 'PRG', 'BRU', 'STR', 'CGN', 'BUD', 'KRK', 'EDI', 'ZRH']
}

export async function getDealsForSlug(slug: string, origin: string): Promise<TrendingDeal[]> {
  try {
    if ((slug === 'ski-deals' || slug === 'christmas-deals') && TP_TOKEN) {
      const targets = THEME_DESTINATIONS[slug]

      const promises = targets.map(async (dest) => {
        try {
          const params = new URLSearchParams({
            origin,
            destination: dest,
            currency: 'gbp',
            token: TP_TOKEN
          })
          const res = await fetch(`https://api.travelpayouts.com/v1/prices/cheap?${params.toString()}`, {
            next: { revalidate: 21600 } // 6 hours
          })
          if (!res.ok) return []
          const json = await res.json()
          const data = json?.data?.[dest]
          if (!data) return []

          const cleanDateStr = (rawDate: any): string => {
            if (!rawDate || typeof rawDate !== 'string') return ''
            return rawDate.split('T')[0]
          }

          return Object.values(data).map((flight: any) => ({
            origin,
            destination: dest,
            price: Math.round(flight.price),
            departDate: cleanDateStr(flight.departure_at),
            returnDate: cleanDateStr(flight.return_at) || null
          }))
        } catch {
          return []
        }
      })

      const matrixResults = await Promise.all(promises)
      return matrixResults.flat().filter(d => d.departDate !== '')
    }

    return await getTrendingDeals(origin, 'gbp', 500)
  } catch (err) {
    console.error('getDealsForSlug error', err)
    return []
  }
}

// Unfiltered, multi-origin sample for the "no airport selected yet" landing view.
// Themed categories (ski/christmas) use a fixed representative origin since their
// destination matrix requires a real IATA city code; other categories use the
// GLOBAL multi-hub pool from getTrendingDeals for genuine worldwide variety.
export async function getTeaserDeals(slug: string): Promise<TrendingDeal[]> {
  if (slug === 'ski-deals' || slug === 'christmas-deals') {
    return getDealsForSlug(slug, 'LON')
  }
  return getTrendingDeals(undefined, 'gbp', 300)
}