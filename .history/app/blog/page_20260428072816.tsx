// ============================================
// BLOG PAGE - app/blog/page.tsx
// ============================================

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { client } from '../../sanity/lib/client'
import { postsQuery } from '../../sanity/lib/queries'
import BlogClient from '../components/BlogClient'

export const revalidate = 60

export const metadata = {
  title: {
    default: 'The Latest Travel News and Guides',
    template: 'Timms Travel |',
  },
  description: 'Travel tips, destination guides and the latest news to help you make the most of your next adventure.',
  alternates: {
    canonical: 'https://timmstravel.com/blog',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

async function getPosts() {
  try {
    return await client.fetch(postsQuery)
  } catch {
    return []
  }
}

export default async function Blog() {
  const posts = await getPosts()

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <h1 className="text-5xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Tips, guides and the latest news from the world of travel, everything you need to
          make the most of your next adventure.
        </p>
      </section>

      {/* Blog Posts + Filters + Pagination */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">✍️</div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#232e4e' }}>
                Articles Coming Soon
              </h2>
              <p className="text-gray-500">
                We're busy writing some great content for you, check back soon!
              </p>
            </div>
          ) : (
            <BlogClient posts={posts} />
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}