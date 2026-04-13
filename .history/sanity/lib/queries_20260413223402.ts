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
    "slug": slug.current,
    publishedAt,
    body,
    excerpt,
    "category": categories[0]->title,
    mainImage,
    "imageUrl": mainImage.asset->url,
    metaTitle,
    metaDescription,
    metaImage,
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
    "author": author->name
  }
`


export const continentsQuery = `
  *[_type == "location"] {
    continent,
    continentEmoji,
    "continentSlug": continentSlug.current
  } | order(continent asc)
`

export const countriesByContinentQuery = `
  *[_type == "location" && continentSlug.current == $continentSlug] {
    country,
    countryEmoji,
    "countrySlug": countrySlug.current,
    "continentSlug": continentSlug.current
  } | order(country asc)
`

export const citiesByCountryQuery = `
  *[_type == "location" && continentSlug.current == $continentSlug && countrySlug.current == $countrySlug] | order(city asc) {
    _id,
    city,
    country,
    countryEmoji,
    continent,
    continentEmoji,
    airport,
    emoji,
    "citySlug": slug.current,
    "countrySlug": countrySlug.current,
    "continentSlug": continentSlug.current
  }
`

export const cityQuery = `
  *[_type == "location" && continentSlug.current == $continentSlug && countrySlug.current == $countrySlug && slug.current == $citySlug][0] {
    _id,
    city,
    country,
    countryEmoji,
    continent,
    continentEmoji,
    airport,
    emoji,
    heroDescription,
    mainContent,
    metaDescription,
    "citySlug": slug.current,
    "countrySlug": countrySlug.current,
    "continentSlug": continentSlug.current
  }
`