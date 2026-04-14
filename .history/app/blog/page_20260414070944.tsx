// ============================================
// BLOG PAGE - app/blog/page.tsx
// URL: hirecarhub.com/blog
// ============================================

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { client } from '../../sanity/lib/client'
import { postsQuery } from '../../sanity/lib/queries'



export const revalidate = 60

export const metadata = {
  title: {
    default: "Timms Travel | Blog",
    template: "Timms Travel |",
  },
  description: "Discover amazing experiences around the world.",
  icons: {
    icon: "/favicon.ico",
  },
}

async function getPosts() {
  try {
    const posts = await client.fetch(postsQuery)
    return posts
  } catch (error) {
    return []
  }
}

export default async function Blog() {
  const posts = await getPosts()

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{backgroundColor: '#232e4e'}} className="text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Tips, guides and the latest news from the world of travel, everything you need to make the most of your next adventure.
        </p>
      </section>

      {/* Blog Posts */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">✍️</div>
              <h2 className="text-2xl font-bold mb-2" style={{color: '#232e4e'}}>Articles Coming Soon</h2>
              <p className="text-gray-500">We're busy writing some great content for you — check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <a key={post._id} href={`/blog/${post.slug}`} className="card hover:shadow-xl transition cursor-pointer block">
                  {/* Image */}
                  <div className="rounded-xl mb-4 overflow-hidden" style={{height: 'auto'}}>
                {post.imageUrl ? (
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover object-top" />
                 ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl" style={{backgroundColor: '#eff6ff'}}>🚗</div>
  )}
</div>

                  {/* Category & Read Time */}
                  <div className="flex gap-2 mb-3">
                    {post.category && (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{backgroundColor: '#2f797c'}}>
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
                  <h3 className="font-bold text-xl mb-2 leading-7" style={{color: '#232e4e'}}>{post.title}</h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-500 text-sm leading-6 mb-4">{post.excerpt}</p>
                  )}

                  {/* Date */}
                  <p className="text-xs text-gray-400">
                    {new Date(post.publishedAt).toLocaleDateString('en-GB', { timeZone: 'UTC' })}

                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </main>
  )
}