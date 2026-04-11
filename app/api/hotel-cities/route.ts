import { NextResponse } from 'next/server'
import airports from '@/data/airports.json'

// Convert airport list → unique city list
const CITY_LIST = Object.values(
  airports.reduce((acc: any, airport: any) => {
    const key = `${airport.city}-${airport.country}`

    if (!acc[key]) {
      acc[key] = {
        name: airport.city,
        country: airport.country,
        // TEMP: use IATA as ID until we map Trip.com IDs
        id: airport.iata_code
      }
    }

    return acc
  }, {})
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.toLowerCase() || ''

  if (!q || q.length < 2) {
    return NextResponse.json([])
  }

  const filtered = CITY_LIST.filter(
    (c: any) =>
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q)
  )

  return NextResponse.json(filtered)
}
