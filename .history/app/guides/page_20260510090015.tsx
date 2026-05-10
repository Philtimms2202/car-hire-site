import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import JsonLd from '@/components/JsonLd'
import { categories } from '@/lib/categories'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Travel Guides | Timms Travel',
  description: 'Explore our collection of expert travel guides covering aviation, planning, money, hotels, transport, gear and safety. Written in British English for real travellers.',
  alternates: {
    canonical: 'https://timmstravel.com/guides',
  },
  openGraph: {
    title: 'Travel Guides | Timms Travel',
    description: 'Expert travel guides covering everything from flight science to travel money, hotels, gear and safety.',
    url: 'https://timmstravel.com/guides',
    siteName: 'Timms Travel',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Guides | Timms Travel',
    description: 'Expert travel guides for real travellers. British English, practical advice and no filler.',
  },
}

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://timmstravel.com/guides',
  url: 'https://timmstravel.com/guides',
  name: 'Travel Guides | Timms Travel',
  description: 'Expert travel guides covering aviation, planning, money, hotels, transport, gear and safety.',
  inLanguage: 'en-GB',
  isPartOf: { '@id': 'https://timmstravel.com/#website' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://timmstravel.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://timmstravel.com/guides' },
    ],
  },
}

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <JsonLd data={webPageSchema} />

      {/* HERO */}
      <section
        className="py-20 px-6 text-center text-white"
        style={{ backgroundColor: '#232e4e' }}
        aria-labelledby="guides-heading"
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
            Timms Travel
          </p>
          <h1
            id="guides-heading"
            className="text-4xl md:text-5xl font-bold mb-5 leading-tight"
          >
            Travel Guides
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Practical, honest guides written for real travellers. From understanding how your flight works to finding the right hotel, we cover every part of the journey.
          </p>
        </div>
      </section>

      {/* BREADCRUMB */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:underline" style={{ color: '#03989e' }}>
                Home
              </Link>
            </li>
            <li><span className="text-gray-300 mx-1">/</span></li>
            <li>
              <span className="font-medium" style={{ color: '#232e4e' }}>Guides</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* CATEGORIES GRID */}
      <section className="py-16 px-6" aria-labelledby="categories-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">
              Browse by topic
            </p>
            <h2
              id="categories-heading"
              className="text-3xl font-bold"
              style={{ color: '#232e4e' }}
            >
              What would you like to know?
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
              Choose a category below to browse guides on that topic. Each one is written to give you practical, reliable information before and during your trip.
            </p>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <li key={category.slug} className="list-none">
                <Link
                  href={`/guides/${category.slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-gray-100 bg-gray-50 p-7 hover:shadow-lg hover:border-teal-200 transition-all"
                  title={category.title}
                >
                  <div className="text-4xl mb-4" aria-hidden="true">
                    {category.emoji}
                  </div>
                  <h3
                    className="font-bold text-lg mb-2 group-hover:text-[#03989e] transition-colors"
                    style={{ color: '#232e4e' }}
                  >
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">
                    {category.description}
                  </p>
                  <span
                    className="mt-5 inline-block text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: '#03989e' }}
                  >
                    Browse guides →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA BANNER */}
      <section
        className="py-14 px-6 text-center text-white"
        style={{ backgroundColor: '#232e4e' }}
        aria-labelledby="guides-cta-heading"
      >
        <div className="max-w-2xl mx-auto">
          <h2 id="guides-cta-heading" className="text-3xl font-bold mb-4">
            Ready to Start Planning?
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Once you know what you need, search flights, hotels, experiences and more — all in one place with no hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/flights"
              className="inline-block px-8 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: '#2dd4bf', color: '#232e4e' }}
            >
              Search Flights →
            </Link>
            <Link
              href="/hotels"
              className="inline-block px-8 py-3 rounded-full font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-all"
            >
              Search Hotels →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}