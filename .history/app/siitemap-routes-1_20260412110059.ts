import { client } from "@/sanity/lib/client"

const BASE_URL = "https://timmstravel.com"

export default async function sitemap() {
  const cities = await client.fetch(`
    *[_type == "location" && defined(primaryIATA)]{
      "citySlug": slug.current,
      primaryIATA
    }
  `)

  const routes = []

  for (const origin of cities) {
    for (const dest of cities) {
      if (origin.primaryIATA === dest.primaryIATA) continue

      const slug = `${origin.citySlug}-to-${dest.citySlug}`

      routes.push({
        url: `${BASE_URL}/flights/${origin.primaryIATA}/${dest.primaryIATA}/${slug}`,
        lastModified: new Date().toISOString(),
      })
    }
  }

  return routes
}