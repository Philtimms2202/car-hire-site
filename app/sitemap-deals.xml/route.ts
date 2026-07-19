import { NextResponse } from 'next/server'
import { DEAL_CATEGORIES } from '@/data/dealCategories'
import { getSitemapAirportSlugs } from '@/lib/airportUtils'

export const revalidate = 3600

export async function GET() {
  const airports = getSitemapAirportSlugs(150)
  const categorySlugs = Object.keys(DEAL_CATEGORIES)
  const baseUrl = 'https://timmstravel.com'
  const lastmod = new Date().toISOString()

  const urls: string[] = []

  // Category landing pages (no airport selected)
  for (const slug of categorySlugs) {
    urls.push(`
  <url>
    <loc>${baseUrl}/deals/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`)
  }

  // Category × airport pages
  for (const slug of categorySlugs) {
    for (const airport of airports) {
      urls.push(`
  <url>
    <loc>${baseUrl}/deals/${slug}/${airport.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600',
    },
  })
}