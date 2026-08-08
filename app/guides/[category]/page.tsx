import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import JsonLd from '@/app/components/JsonLd'
import BreadcrumbNav from '@/app/components/BreadcrumbNav'
import { getGuidesByCategory } from '@/lib/sanity.queries'
import { categories } from '@/lib/categories'
import { client } from '@/sanity/lib/client'
import CityGuidesGrid from './CityGuidesGrid'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ category: string }>
}

// Fetch cities from Sanity specifically for destination guides.
// Cached for 24h — city data barely changes, and this was previously
// querying Sanity live on every request with no caching at all.
async function getDestinationCities() {
  try {
    return await client.fetch(
      `*[_type == "city"] | order(name asc) {
        _id,
        name,
        "slug": slug.current,
        emoji,
        "countryName": country->name,
        "countrySlug": country->slug.current,
        "continentSlug": country->continent->slug.current
      }`,
      {},
      { next: { revalidate: 86400, tags: ["cities"] } }
    )
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = categories.find((c) => c.slug === categorySlug)

  if (!category) return {}

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    alternates: {
      canonical: `https://timmstravel.com/guides/${category.slug}`,
    },
    openGraph: {
      title: category.metaTitle,
      description: category.metaDescription,
      url: `https://timmstravel.com/guides/${category.slug}`,
      siteName: 'Timms Travel',
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: category.metaTitle,
      description: category.metaDescription,
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params

  // 1. Find the category from local lib/categories.ts
  const category = categories.find((c) => c.slug === categorySlug)
  if (!category) notFound()

  const isDestinationGuides = categorySlug === 'destination-guides'

  // 2. Fetch written articles and city hubs concurrently
  const [guides, cities] = await Promise.all([
    getGuidesByCategory(categorySlug).catch(() => []),
    isDestinationGuides ? getDestinationCities() : Promise.resolve([]),
  ])

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `https://timmstravel.com/guides/${category.slug}`,
    url: `https://timmstravel.com/guides/${category.slug}`,
    name: category.metaTitle,
    description: category.metaDescription,
    inLanguage: 'en-GB',
    isPartOf: { '@id': 'https://timmstravel.com/#website' },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://timmstravel.com' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://timmstravel.com/guides' },
        { '@type': 'ListItem', position: 3, name: category.title, item: `https://timmstravel.com/guides/${category.slug}` },
      ],
    },
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <JsonLd data={collectionPageSchema} />

      {/* HERO */}
      <section
        className="py-20 px-6 text-center text-white"
        style={{ backgroundColor: '#232e4e' }}
        aria-labelledby="category-heading"
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
            Travel Guides
          </p>
          <div className="text-5xl mb-5" aria-hidden="true">{category.emoji}</div>
          <h1
            id="category-heading"
            className="text-4xl md:text-5xl font-bold mb-5 leading-tight"
          >
            {category.title}
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {category.description}
          </p>
        </div>
      </section>

      {/* BREADCRUMB */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <BreadcrumbNav
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Guides', href: '/guides' },
            { label: category.title },
          ]}
        />
      </div>

      {/* CONTENT SECTIONS */}
      <section className="py-16 px-6" aria-labelledby="guides-heading">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* SECTION 1: WRITTEN GUIDES FROM SANITY */}
          {guides && guides.length > 0 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#232e4e]">
                  Featured Articles & Destination Tips
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  In-depth editorial articles and travel guides.
                </p>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide: any) => (
                  <li key={guide.slug} className="list-none">
                    <Link
                      href={`/guides/${category.slug}/${guide.slug}`}
                      className="group flex flex-col h-full rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:shadow-md hover:border-teal-200 transition-all"
                    >
                      <h3 className="font-bold text-lg mb-2 text-[#232e4e] group-hover:text-teal-600 transition-colors">
                        {guide.title}
                      </h3>
                      {guide.excerpt && (
                        <p className="text-sm text-gray-500 leading-relaxed flex-1">
                          {guide.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        {guide.readingTime && (
                          <span className="text-xs text-gray-400">{guide.readingTime} min read</span>
                        )}
                        <span className="text-xs font-bold text-teal-600 group-hover:underline ml-auto">
                          Read guide →
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* SECTION 2: CITY LOCATION HUBS */}
          {isDestinationGuides && cities && cities.length > 0 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#232e4e]">
                  Explore City Destination Guides
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Browse complete travel hubs across {cities.length} global destinations.
                </p>
              </div>

              <CityGuidesGrid cities={cities} />
            </div>
          )}

          {/* FALLBACK WHEN NO CONTENT EXISTS */}
          {!isDestinationGuides && (!guides || guides.length === 0) && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">Guides coming soon.</p>
              <p className="text-sm mt-2">Check back shortly — we are adding new content regularly.</p>
            </div>
          )}

        </div>
      </section>

      {/* BACK LINK */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:underline"
          style={{ color: '#03989e' }}
        >
          ← Back to all guides
        </Link>
      </div>

      {/* CTA */}
      <section
        className="py-14 px-6 text-center text-white"
        style={{ backgroundColor: '#232e4e' }}
        aria-labelledby="category-cta-heading"
      >
        <div className="max-w-2xl mx-auto">
          <h2 id="category-cta-heading" className="text-3xl font-bold mb-4">
            Ready to Book Your Trip?
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Search flights, hotels, experiences and more — all in one place with no hidden fees.
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