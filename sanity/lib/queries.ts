// ============================================
// SANITY QUERIES - sanity/lib/queries.ts
// ============================================

export const postsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    "category": categories[0]->title,
    "imageUrl": mainImage.asset->url,
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
  }
`

export const postQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    body,
    excerpt,
    "category": categories[0]->title,
    "imageUrl": mainImage.asset->url,
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
    "author": author->name
  }
`

export const locationsQuery = `
  *[_type == "location"] | order(city asc) {
    _id,
    city,
    slug,
    country,
    airport,
    emoji
  }
`

export const locationQuery = `
  *[_type == "location" && slug.current == $slug][0] {
    _id,
    city,
    country,
    airport,
    emoji,
    heroDescription,
    mainContent,
    metaDescription
  }
`