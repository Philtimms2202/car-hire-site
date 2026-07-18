import { NextRequest, NextResponse } from 'next/server'
import { getCheapestFlight } from '@/lib/travelpayouts'

// GET /api/flight-prices?origin=MAN&destination=BKK
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')

  if (!origin || !destination) {
    return NextResponse.json({ error: 'origin and destination are required' }, { status: 400 })
  }

  try {
    const data = await getCheapestFlight(origin, destination)
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400' },
    })
  } catch (err) {
    console.error('flight-prices API error', err)
    // Fail soft — the client falls back to the static "From £X" value
    return NextResponse.json({ price: 0, found: false }, { status: 200 })
  }
}