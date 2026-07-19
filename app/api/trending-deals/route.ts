// app/api/trending-deals/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getDealsForSlug } from '@/lib/getDealsForSlug'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const origin = searchParams.get('origin') ?? 'MAN'
  const slug = searchParams.get('slug') ?? ''

  const deals = await getDealsForSlug(slug, origin)

  return NextResponse.json(
    { deals },
    { headers: { 'Cache-Control': 'public, s-maxage=21600' } }
  )
}