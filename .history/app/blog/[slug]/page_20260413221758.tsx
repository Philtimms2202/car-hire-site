// ============================================
// BLOG POST PAGE - app/blog/[slug]/page.tsx
// URL: hirecarhub.com/blog/article-title
// ============================================

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { PortableText } from '@portabletext/react'
import { client } from '../../../sanity/lib/client'
import { postQuery } from '../../../sanity/lib/queries'



export const revalidate = 60

// ⭐ NEW — generateMetadata (replaces static metadata)
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      metaTitle,
      metaDescription,
      metaImage
    }`,
    { slug: params.slug }
  )

  if (!post) {
    return {
      title: "Timms Travel | Blog",
      description: "Discover amazing experiences around the world.",
    }
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || "",
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || "",
      images: post.metaImage ? [urlFor(post.metaImage)] : [],
      url: `https://hirecarhub.com/blog/${params.slug}`,
      type: "article",
    },
  }
}


  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{backgroundColor: '#232e4e'}} className="text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center gap-2 mb-4">
            {post.category && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{backgroundColor: '#2f797c'}}>
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
              year: 'numeric'
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
              block: {
                normal: ({children}) => <p className="text-gray-600 leading-8 mb-6">{children}</p>,
                h2: ({children}) => <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-bold mt-8 mb-3" style={{color: '#232e4e'}}>{children}</h3>,
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 pl-4 italic text-gray-500 my-6" style={{borderColor: '#2f797c'}}>{children}</blockquote>
                ),
              },
              list: {
                bullet: ({children}) => <ul className="list-disc list-inside mb-6 text-gray-600 leading-8">{children}</ul>,
                number: ({children}) => <ol className="list-decimal list-inside mb-6 text-gray-600 leading-8">{children}</ol>,
              },
              marks: {
                strong: ({children}) => <strong className="font-bold">{children}</strong>,
                em: ({children}) => <em className="italic">{children}</em>,
                link: ({value, children}) => (
                  <a href={value?.href} style={{color: '#2f797c'}} className="underline hover:opacity-75 transition">{children}</a>
                ),
              },
            }}
          />
        )}
      </article>

      {/* Back to Blog */}
      <div className="text-center pb-16">
        <a href="/blog" style={{color: '#2f797c'}} className="font-semibold hover:opacity-75 transition">← Back to Blog</a>
      </div>

      {/* Footer */}
      <Footer />

    </main>
  )
}