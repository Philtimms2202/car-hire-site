// ============================================
// BLOG PAGE - app/blog/page.tsx
// ============================================

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { client } from '../../sanity/lib/client'

export const revalidate = 60

export const metadata = {
  title: "Timms Travel | Blog",
  description: "Discover amazing experiences around the world.",
  icons: { icon: "/favicon.ico" },
}

const POSTS_PER_PAGE = 12

async function getPosts(page: number, category?: string) {
  const start = (page - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const filter = category
    ? `*[_type == "post" && categories[0]->title == $category]`
    : `*[_type == "post"]`

  const [posts, total, categories] = await Promise.all([
    client.fetch(`
      ${filter} | order(publishedAt desc) [$start...$end] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        excerpt,
        "category": categories[0]->title,
        "imageUrl": mainImage.asset->url,
        "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
      }
    `, { start, end, category: category || '' }),
    client.fetch(`count(${filter})`, { category: category || '' }),
    client.fetch(`array::unique(*[_type == "post"].categories[0]->title)`)
  ])

  return { posts, total, categories: categories.filter(Boolean) }
}

export default async function Blog({
  searchParams,
}: {
  searchParams: { page?: string; category?: string }
}) {
  const page = Number(searchParams?.page) || 1
  const category = searchParams?.category || ''
  const { posts, total, categories } = await getPosts(page, category || undefined)
  const totalPages = Math.ceil(total / POSTS_PER_PAGE)

  const buildUrl = (p: number, cat?: string) => {
    const params = new URLSearchParams()
    if (p > 1) params.set('page', String(p))
    if (cat) params.set('category', cat)
    const qs = params.toString()
    return `/blog${qs ? `?${qs}` : ''}`
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Tips, guides and the latest news from the world of travel, everything you need to make the most of your next adventure.
        </p>
      </section>

{/* Category Filter */}
<section className="border-b border-gray-200">
  <div className="max-w-6xl mx-auto px-6 py-4 flex gap-2 flex-wrap">
    
      href="/blog"
      className="px-4 py-2 rounded-full text-sm font-semibold transition hover:opacity-75"
      style={{ backgroundColor: !category ? '#232e4e' : 'transparent', color: !category ? 'white' : '#232e4e', border: !category ? 'none' : '1px solid #e5e7eb' }}
    >
      All
    </a>
    {categories.map((cat: string) => (
      
        key={cat}
        href={`/blog?category=${encodeURIComponent(cat)}`}
        className="px-4 py-2 rounded-full text-sm font-semibold transition hover:opacity-75"
        style={{ backgroundColor: category === cat ? '#232e4e' : 'transparent', color: category === cat ? 'white' : '#232e4e', border: category === cat ? 'none' : '1px solid #e5e7eb' }}
      >
        {cat}
      </a>
    ))}
  </div>
</section>

      {/* Blog Posts */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">✍️</div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#232e4e' }}>
                {category ? `No articles in "${category}" yet` : 'Articles Coming Soon'}
              </h2>
              <p className="text-gray-500">We're busy writing some great content for you — check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post: any) => (
                  <a key={post._id} href={`/blog/${post.slug}`} className="card hover:shadow-xl transition cursor-pointer block">
                    {/* Image */}
                    <div className="rounded-xl mb-4 overflow-hidden" style={{ height: 'auto' }}>
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover object-top" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl" style={{ backgroundColor: '#eff6ff' }}>✈️</div>
                      )}
                    </div>

                    {/* Category & Read Time */}
                    <div className="flex gap-2 mb-3">
                      {post.category && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#2f797c' }}>
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
                    <h3 className="font-bold text-xl mb-2 leading-7" style={{ color: '#232e4e' }}>{post.title}</h3>

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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-16">
                  {page > 1 && (
                    
                      href={buildUrl(page - 1, category || undefined)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold transition hover:opacity-75"
                      style={{ color: '#2f797c', border: '1px solid #2f797c' }}
                    >
                      ← Previous
                    </a>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    
                      key={p}
                      href={buildUrl(p, category || undefined)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition hover:opacity-75"
                      style={p === page
                        ? { backgroundColor: '#232e4e', color: 'white' }
                        : { color: '#232e4e', border: '1px solid #e5e7eb' }
                      }
                    >
                      {p}
                    </a>
                  ))}

                  {page < totalPages && (
                    
                      href={buildUrl(page + 1, category || undefined)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold transition hover:opacity-75"
                      style={{ color: '#2f797c', border: '1px solid #2f797c' }}
                    >
                      Next →
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}