import { NextRequest, NextResponse } from 'next/server'
import { getTrendingDeals } from '@/lib/travelpayouts'

const TP_TOKEN = process.env.TRAVELPAYOUTS_TOKEN

const THEME_DESTINATIONS: Record<string, string[]> = {
  'ski-deals': ['GVA', 'INN', 'GNB', 'LYS', 'SOF', 'SZG', 'MUC', 'BCN', 'ZRH'],
  'christmas-deals': ['VIE', 'MUC', 'PRG', 'BRU', 'STR', 'CGN', 'BUD', 'KRK', 'EDI', 'ZRH']
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  // 💡 Read the incoming origin directly without forcing it to a default anchor value
  const origin = searchParams.get('origin') ?? 'BCN'
  const slug = searchParams.get('slug') ?? ''

  try {
    if ((slug === 'ski-deals' || slug === 'christmas-deals') && TP_TOKEN) {
      const targets = THEME_DESTINATIONS[slug]
      
      // Keep whatever the client specified (like 'BCN' or 'LON') instead of defaulting to 'LON'
      const chosenOrigin = origin === 'GLOBAL' ? 'BCN' : origin

      const promises = targets.map(async (dest) => {
        try {
          const params = new URLSearchParams({
            origin: chosenOrigin,
            destination: dest,
            currency: 'gbp',
            token: TP_TOKEN
          })
          const res = await fetch(`https://api.travelpayouts.com/v1/prices/cheap?${params.toString()}`, {
            next: { revalidate: 14400 }
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
            origin: chosenOrigin, // Directly maps to the user-selected origin (e.g. BCN)
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
      const seasonalDeals = matrixResults.flat().filter(d => d.departDate !== '')
      
      return NextResponse.json(
        { deals: seasonalDeals },
        { headers: { 'Cache-Control': 'public, s-maxage=14400' } }
      )
    }

    const deals = await getTrendingDeals(origin, 'gbp', 500)
    return NextResponse.json({ deals })
  } catch (err) {
    console.error('trending-deals API error', err)
    return NextResponse.json({ deals: [] }, { status: 200 })
  }
}