import { NextRequest, NextResponse } from 'next/server'
import airports from '@/data/airports.json'

type AirportRecord = { city: string; country: string }

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() || ''

  if (q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const seen = new Set<string>()
  const matches: { city: string; country: string; slug: string }[] = []

  for (const record of airports as AirportRecord[]) {
    if (!record.city) continue
    const key = record.city.toLowerCase()
    if (seen.has(key)) continue
    if (!key.includes(q)) continue

    seen.add(key)
    matches.push({
      city: record.city,
      country: record.country,
      slug: slugify(record.city),
    })
  }

  // Prioritise cities that start with the query over ones that just contain it
  matches.sort((a, b) => {
    const aStarts = a.city.toLowerCase().startsWith(q) ? 0 : 1
    const bStarts = b.city.toLowerCase().startsWith(q) ? 0 : 1
    return aStarts - bStarts
  })

  return NextResponse.json({ results: matches.slice(0, 8) })
}