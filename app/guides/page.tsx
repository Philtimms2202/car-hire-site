import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import JsonLd from '@/app/components/JsonLd'
import BreadcrumbNav from '@/app/components/BreadcrumbNav'
import { getAllGuideCategories } from '@/lib/sanity.queries'
import { categories as localCategories, Category } from '@/lib/categories'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Travel Guides & Tips | Timms Travel',
  description: 'Explore our practical travel guides covering destinations, budget tips, luxury stays, and travel gear.',
  alternates: {
    canonical: 'https://timmstravel.com/guides',
  },
}

export default async function GuidesIndexPage() {
  // Fetch categories from Sanity with safe fallback to local lib/categories.ts
  let categories: Category[] = localCategories

  try {
    const sanityCategories = await getAllGuideCategories()
    if (sanityCategories && Array.isArray(sanityCategories) && sanityCategories.length > 0) {
      categories = sanityCategories
    }
  } catch (err) {
    console.error('Sanity fetch error on /guides:', err)
  }

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://timmstravel.com/guides',
    url: 'https://timmstravel.com/guides',
    name: 'Travel Guides | Timms Travel',
    description: 'Explore travel guides across various categories.',
    inLanguage: 'en-GB',
    isPartOf: { '@id': 'https://timmstravel.com/#website' },
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <JsonLd data={collectionPageSchema} />

      {/* HERO */}
      <section
        className="py-20 px-6 text-center text-white"
        style={{ backgroundColor: '#232e4e' }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
            Explore Topics
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Travel Guides & Resources
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Honest, practical guides to help you plan your next trip — no fluff, just actionable insights.
          </p>
        </div>
      </section>

      {/* BREADCRUMBS */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <BreadcrumbNav
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Guides' },
          ]}
        />
      </div>

      {/* CATEGORIES GRID */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/guides/${cat.slug}`}
                className="group flex flex-col p-8 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-lg hover:border-teal-200 transition-all"
              >
                <div className="text-4xl mb-4" aria-hidden="true">
                  {cat.emoji || '🗺️'}
                </div>
                <h2 className="text-xl font-bold text-[#232e4e] group-hover:text-teal-600 transition-colors mb-2">
                  {cat.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">
                  {cat.description}
                </p>
                <span className="text-xs font-bold text-teal-600 mt-6 group-hover:underline flex items-center gap-1">
                  Browse category <span>→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}