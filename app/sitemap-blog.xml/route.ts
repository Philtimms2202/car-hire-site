import { client } from "@/sanity/lib/client"

export const revalidate = 86400

const BASE_URL = "https://timmstravel.com"

export async function GET() {
  // FIXED: was fetching live on every crawl with no caching, and didn't
  // filter out posts missing a slug (would produce /blog/undefined).
  const posts = await client.fetch(
    `*[_type == "post" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt,
      publishedAt
    }`,
    {},
    { next: { revalidate: 86400, tags: ["posts"] } }
  )

  const urls = posts.map((post: any) => {
    const lastmod = post._updatedAt || post.publishedAt || new Date().toISOString()

    return `
      <url>
        <loc>${BASE_URL}/blog/${post.slug}</loc>
        <lastmod>${new Date(lastmod).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join("\n")}
  </urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}