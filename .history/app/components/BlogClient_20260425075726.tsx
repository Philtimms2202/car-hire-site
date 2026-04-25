'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Post {
  _id: string
  title: string
  slug: string
  publishedAt: string
  excerpt?: string
  category?: string
  imageUrl?: string
  estimatedReadingTime?: number
}

const POSTS_PER_PAGE = 9

export default function BlogClient({ posts }: { posts: Post[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState(1)

  // Get unique categories
  const categories = useMemo(() => {
    const cats = posts
      .map(p => p.category)
      .filter((c): c is string => !!c)
    return ['All', ...Array.from(new Set(cats)).sort()]
  }, [posts])

  // Filter posts by category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return posts
    return posts.filter(p => p.category === selectedCategory)
  }, [posts, selectedCategory])

  // Paginate
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  )

  // Reset to page 1 when category changes
  function handleCategoryChange(cat: string) {
    setSelectedCategory(cat)
    setCurrentPage(1)
  }

  return (
    <>
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
              selectedCategory === cat
                ? 'text-white border-transparent'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
            style={
              selectedCategory === cat
                ? { backgroundColor: '#2f797c', borderColor: '#2f797c' }
                : {}
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {paginatedPosts.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">✍️</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#232e4e' }}>
            No posts in this category yet
          </h2>
          <p className="text-gray-500">Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {paginatedPosts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group block rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white"
            >
              {/* Image */}
              <div className="overflow-hidden h-48 bg-blue-50">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    ✈️
                  </div>
                )}
              </div>

              <div className="p-5">
                {/* Category & Read Time */}
                <div className="flex gap-2 mb-3">
                  {post.category && (
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: '#2f797c' }}
                    >
                      {post.category}
                    </span>
                  )}
                  {post.estimatedReadingTime && post.estimatedReadingTime > 0 && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-500">
                      {post.estimatedReadingTime} min read
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3
                  className="font-bold text-xl mb-2 leading-7 group-hover:opacity-75 transition"
                  style={{ color: '#232e4e' }}
                >
                  {post.title}
                </h3>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-gray-500 text-sm leading-6 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                {/* Date */}
                <p className="text-xs text-gray-400">
                  {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                    timeZone: 'UTC',
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border text-sm font-medium transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{ color: '#232e4e', borderColor: '#e5e7eb' }}
          >
            ← Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${
                currentPage === page
                  ? 'text-white'
                  : 'border border-gray-200 hover:bg-gray-50'
              }`}
              style={
                currentPage === page
                  ? { backgroundColor: '#2f797c' }
                  : { color: '#232e4e' }
              }
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border text-sm font-medium transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{ color: '#232e4e', borderColor: '#e5e7eb' }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Post count */}
      <p className="text-center text-sm text-gray-400 mt-4">
        Showing {paginatedPosts.length} of {filteredPosts.length} articles
        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
      </p>
    </>
  )
}