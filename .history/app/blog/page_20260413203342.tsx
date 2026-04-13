// ============================================
// BLOG INDEX PAGE - app/blog/page.tsx
// URL: timmstravel.com/blog
// ============================================

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Link from "next/link"
import { client } from "@/sanity/lib/client"
import { postsQuery } from "@/sanity/lib/queries"
import imageUrlBuilder from "@sanity/image-url"

export const revalidate = 60

// Global metadata for the blog index
export const metadata = {
  title: "Timms Travel | Blog",
  description:
    "Travel tips, guides, and insights to help you plan your next adventure.",
  icons: {
    icon: "/favicon.ico",
  },
}

const builder = imageUrlBuilder(client)
const urlFor = (src: any) => builder.image(src).width(800).height(600).url()

async function getPosts() {
  try {
    return await client.fetch(postsQuery)
  } catch (error) {
    console.error("Failed to fetch posts:", error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section
        className="text-white py-20 px-6 text-center"
        style={{ backgroundColor: "#232e4e" }}
      >
        <h1 className="text-5xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Tips, guides and the latest news from the world of travel — everything
          you need to make the most of your next adventure.
        </p>
      </section>

      {/* Blog Posts */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">✍️</div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: "#232e4e" }}
              >
                Articles Coming Soon
              </h2>
              <p className="text-gray-500">
                We're busy writing some great content for you — check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {posts.map((post: any) => {
                const image =
                  post.mainImage ? urlFor(post.mainImage) : null

                return (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug.current}`}
                    className="block group"
                  >
                    {/* Image */}
                    <div className="rounded-xl overflow-hidden mb-4 bg-gray-100 h-56 flex items-center justify-center">
                      {image ? (
                        <img
                          src={image}
                          alt={post.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-5xl">🌍</div>
                      )}
                    </div>

                    {/* Category + Read Time */}
                    <div className="flex gap-2 mb-3">
                      {post.category && (
                        <span
                          className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                          style={{ backgroundColor: "#2f797c" }}
                        >
                          {post.category}
                        </span>
                      )}

                      {post.estimatedReadingTime > 0 && (
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-500">
                          {post.estimatedReadingTime} min read
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className="font-bold text-xl mb-2 leading-7 group-hover:underline"
                      style={{ color: "#232e4e" }}
                    >
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-gray-500 text-sm leading-6 mb-4">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Date */}
                    <p className="text-xs text-gray-400">
                      {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}