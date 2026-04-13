import { NextResponse } from "next/server"

const BASE_URL = "https://timmstravel.com"

export async function GET() {
  const now = new Date().toISOString()

  const staticUrls = [
    "/",               // homepage
    "/locations",
    "/flights",
    "/hotels",
    "/experiences",
    "/car-hire",
    "/blog",
    "/about",
    "/contact",
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls
  .map(
    (path) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${now}</lastmod>
  </url>`
  )
  .join("")}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}