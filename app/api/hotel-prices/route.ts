import { NextRequest, NextResponse } from 'next/server'
import { getCheapestHotel } from '@/lib/hotellook'

// GET /api/hotel-prices?city=Paris
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city')

  if (!city) {
    return NextResponse.json({ error: 'city is required' }, { status: 400 })
  }

  try {
    const data = await getCheapestHotel(city)
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400' },
    })
  } catch (err) {
    console.error('hotel-prices API error', err)
    return NextResponse.json({ price: 0, found: false }, { status: 200 })
  }
}