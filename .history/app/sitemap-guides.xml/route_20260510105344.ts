import { client } from "@/sanity/lib/client"
import { categories } from "@/lib/categories"

const BASE_URL = "https://timmstravel.com"

export async function GET() {
  const guides = await client.fetch(`
    *[_type == "guide"]{
      "guideSlug": slug.current,
      "categorySlug": category->slug.current,
      _updatedAt
    }
  `)

  // ─── Guide index ──────────────────────────────────────────────────
  const indexUrl = `
    <url>
      <loc>${BASE_URL}/guides</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
  `

  // ─── Category routes ──────────────────────────────────────────────
  const categoryUrls = categories.map((c) => `
    <url>
      <loc>${BASE_URL}/guides/${c.slug}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `)

  // ─── Individual guide routes ──────────────────────────────────────
  const guideUrls = guides.map((g: any) => {
    const lastmod = g._updatedAt ?? new Date().toISOString()
    return `
      <url>
        <loc>${BASE_URL}/guides/${g.categorySlug}/${g.guideSlug}</loc>
        <lastmod>${new Date(lastmod).toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
    `
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${indexUrl}
    ${categoryUrls.join("\n")}
    ${guideUrls.join("\n")}
  </urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}