import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import HomeClient from '@/app/components/HomeClient'
import { client } from '@/sanity/lib/client'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source).url()
}

async function getFeaturedGuides() {
  try {
    return await client.fetch(
      `*[_type == "guide"] | order(_createdAt desc) [0...3] {
        title,
        "slug": slug.current,
        "categorySlug": category->slug.current,
        "categoryTitle": category->title,
        "categoryEmoji": category->emoji,
        excerpt,
        readingTime
      }`
    )
  } catch {
    return []
  }
}

async function getFeaturedPosts() {
  try {
    return await client.fetch(
      `*[_type == "post"] | order(publishedAt desc) [0...3] {
        title,
        "slug": slug.current,
        excerpt,
        publishedAt,
        "mainImageUrl": mainImage.asset->url
      }`
    )
  } catch {
    return []
  }
}

export default async function Home() {
  const [guides, posts] = await Promise.all([
    getFeaturedGuides(),
    getFeaturedPosts(),
  ])

  return (
    <>
      <Navbar />
      <HomeClient guides={guides} posts={posts} />
      <Footer />
    </>
  )
}