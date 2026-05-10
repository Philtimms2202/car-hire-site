import { client } from '@/sanity/lib/client'

// ─── Category Queries ───────────────────────────────────────────────

export async function getAllGuideCategories() {
  return client.fetch(
    `*[_type == "guideCategory"] | order(_createdAt asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      emoji,
      metaTitle,
      metaDescription
    }`
  )
}

export async function getGuideCategoryBySlug(slug: string) {
  return client.fetch(
    `*[_type == "guideCategory" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      description,
      emoji,
      metaTitle,
      metaDescription
    }`,
    { slug }
  )
}

// ─── Guide Queries ───────────────────────────────────────────────────

export async function getGuidesByCategory(categorySlug: string) {
  return client.fetch(
    `*[_type == "guide" && category->slug.current == $categorySlug] | order(_createdAt asc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      readingTime,
      "categorySlug": category->slug.current,
      "categoryTitle": category->title
    }`,
    { categorySlug }
  )
}

export async function getGuideBySlug(categorySlug: string, guideSlug: string) {
  return client.fetch(
    `*[_type == "guide" && slug.current == $guideSlug && category->slug.current == $categorySlug][0] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      content,
      readingTime,
      metaTitle,
      metaDescription,
      ogDescription,
      "categorySlug": category->slug.current,
      "categoryTitle": category->title,
      "categoryEmoji": category->emoji
    }`,
    { categorySlug, guideSlug }
  )
}

export async function getAllGuideSlugs() {
  return client.fetch(
    `*[_type == "guide"] {
      "guideSlug": slug.current,
      "categorySlug": category->slug.current
    }`
  )
}