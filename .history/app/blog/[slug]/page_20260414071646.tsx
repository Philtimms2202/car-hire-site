// ============================================
// BLOG POST PAGE - app/blog/[slug]/page.tsx
// ============================================

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { PortableText } from '@portabletext/react'
import { client } from '../../../sanity/lib/client'
import { urlFor } from '../../../sanity/lib/image'
import { postQuery } from '../../../sanity/lib/queries'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const post = await getPost(slug)

  return {
    title: post?.metaTitle || post?.title || "The Latest News | Timms Travel",
    description: post?.metaDescription || post?.excerpt || "Discover amazing experiences around the world.",
    icons: { icon: "/favicon.ico" },
    openGraph: {
      title: post?.metaTitle || post?.title,
      description: post?.metaDescription || post?.excerpt,
      images: post?.metaImage ? [{ url: urlFor(post.metaImage).url() }] : [],
    },
    alternates: {
      canonical: `https://timmstravel.com/blog/${slug}`,
    },
  }
}

async function getPost(slug: string) {
  try {
    const post = await client.fetch(postQuery, { slug })
    return post
  } catch (error) {
    return null
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>Article Not Found</h1>
          <a href="/blog" style={{ color: '#2f797c' }} className="font-semibold hover:opacity-75 transition">Back to Blog</a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center gap-2 mb-4">
            {post.category && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#2f797c' }}>
                {post.category}
              </span>
            )}
            {post.estimatedReadingTime > 0 && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-white text-gray-600">
                {post.estimatedReadingTime} min read
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-300 text-sm">
            {post.author && <span>By {post.author} · </span>}
            {new Date(post.publishedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        {post.excerpt && (
          <p className="text-xl text-gray-500 leading-8 mb-8 font-medium">
            {post.excerpt}
          </p>
        )}
        {post.body && (
          <PortableText
            value={post.body}
            components={{
              // ── Custom block types (images, tables) ──
              types: {
                // Sanity image / Unsplash image inserted via studio
                image: ({ value }) => {
                  if (!value?.asset) return null
                  return (
                    <figure className="my-8">
                      <img
                        src={urlFor(value).width(800).url()}
                        alt={value.alt || ''}
                        className="w-full rounded-xl object-cover"
                      />
                      {value.caption && (
                        <figcaption className="text-center text-sm text-gray-400 mt-2">
                          {value.caption}
                        </figcaption>
                      )}
                    </figure>
                  )
                },
                // Table block
                table: ({ value }) => {
                  if (!value?.rows?.length) return null
                  return (
                    <div className="overflow-x-auto my-8">
                      <table className="w-full border-collapse text-sm">
                        <tbody>
                          {value.rows.map((row: any, i: number) => (
                            <tr key={i} className={i === 0 ? 'font-bold' : 'border-t border-gray-200'}>
                              {row.cells.map((cell: string, j: number) => (
                                i === 0 ? (
                                  <th key={j} className="px-4 py-3 text-left border border-gray-200 text-white text-xs uppercase tracking-wide" style={{ backgroundColor: '#232e4e' }}>
                                    {cell}
                                  </th>
                                ) : (
                                  <td key={j} className="px-4 py-3 border border-gray-200 text-gray-600">
                                    {cell}
                                  </td>
                                )
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                },
              },

              // ── Text blocks ──
              block: {
                normal: ({ children }) => <p className="text-gray-600 leading-8 mb-6">{children}</p>,
                h2: ({ children }) => <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-bold mt-8 mb-3" style={{ color: '#232e4e' }}>{children}</h3>,
                h4: ({ children }) => <h4 className="text-lg font-bold mt-6 mb-2" style={{ color: '#232e4e' }}>{children}</h4>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 pl-4 italic text-gray-500 my-6" style={{ borderColor: '#2f797c' }}>
                    {children}
                  </blockquote>
                ),
              },

              // ── Lists ──
              list: {
                bullet: ({ children }) => <ul className="list-disc list-inside mb-6 text-gray-600 leading-8">{children}</ul>,
                number: ({ children }) => <ol className="list-decimal list-inside mb-6 text-gray-600 leading-8">{children}</ol>,
              },

              // ── Inline marks ──
              marks: {
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                link: ({ value, children }) => (
                  <a href={value?.href} style={{ color: '#2f797c' }} className="underline hover:opacity-75 transition" target={value?.blank ? '_blank' : undefined} rel={value?.blank ? 'noopener noreferrer' : undefined}>
                    {children}
                  </a>
                ),
              },
            }}
          />
        )}
      </article>

      {/* Back to Blog */}
      <div className="text-center pb-16">
        <a href="/blog" style={{ color: '#2f797c' }} className="font-semibold hover:opacity-75 transition">← Back to Blog</a>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.publishedAt,
            author: { "@type": "Person", name: post.author },
          })
        }}
      />

      <Footer />
    </main>
  )
}