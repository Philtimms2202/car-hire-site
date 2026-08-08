import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import JsonLd from '@/app/components/JsonLd'
import BreadcrumbNav from '@/app/components/BreadcrumbNav'
import { getGuideCategoryBySlug, getGuidesByCategory } from '@/lib/sanity.queries'
import { categories } from '@/lib/categories'
import { client } from '@/sanity/lib/client'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ category: string }>
}

type Guide = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  readingTime?: number
  mainImage?: string
  categorySlug?: string
  categoryTitle?: string
}

// Fetch cities from Sanity specifically for destination guides
async function getDestinationCities() {
  try {
    return await client.fetch(`
      *[_type == "city"] | order(name asc) {
        _id,
        name,
        "slug": slug.current,
        emoji,
        "countryName": country->name,
        "countrySlug": country->slug.current,
        "continentSlug": country->continent->slug.current
      }
    `)
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params
  
  const sanityCategory = await getGuideCategoryBySlug(categorySlug).catch(() => null)
  const localCategory = categories.find((c) => c.slug === categorySlug)
  const category = sanityCategory || localCategory

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

  // 1. Fetch category metadata, Sanity posts, and cities concurrently
  const [sanityCategory, guides, cities] = await Promise.all([
    getGuideCategoryBySlug(categorySlug).catch(() => null),
    getGuidesByCategory(categorySlug).catch(() => []),
    categorySlug === 'destination-guides' ? getDestinationCities() : Promise.resolve([]),
  ])

  // Fallback to local categories file if category is not in Sanity guideCategory schema
  const localCategory = categories.find((c) => c.slug === categorySlug)
  const category = sanityCategory || localCategory

  if (!category) notFound()

  const isDestinationGuides = categorySlug === 'destination-guides'

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

      {/* BREADCRUMBS */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <BreadcrumbNav
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Guides', href: '/guides' },
            { label: category.title },
          ]}
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <section className="py-16 px-6" aria-labelledby="guides-heading">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* SECTION 1: SANITY POSTS / GUIDES */}
          {guides && guides.length > 0 && (
            <div>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-[#232e4e]">
                  Articles & Travel Guides
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  In-depth articles written by our team.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {guides.map((guide: Guide) => (
                  <article
                    key={guide._id || guide.slug}
                    className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-teal-200 transition-all group"
                  >
                    {/* Featured Image */}
                    {guide.mainImage && (
                      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                        <Image
                          src={guide.mainImage}
                          alt={guide.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-bold text-xl mb-3 text-[#232e4e] group-hover:text-teal-600 transition-colors leading-snug">
                        <Link href={`/guides/${category.slug}/${guide.slug}`}>
                          {guide.title}
                        </Link>
                      </h3>

                      {guide.excerpt && (
                        <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4 line-clamp-3">
                          {guide.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50 mt-auto">
                        {guide.readingTime ? (
                          <span>{guide.readingTime} min read</span>
                        ) : (
                          <span />
                        )}
                        <Link
                          href={`/guides/${category.slug}/${guide.slug}`}
                          className="font-bold text-teal-600 group-hover:underline flex items-center gap-1"
                        >
                          Read guide <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: DESTINATION CITY HUBS */}
          {isDestinationGuides && cities && cities.length > 0 && (
            <div>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-[#232e4e]">
                  Explore City Destination Guides
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Browse complete travel hubs across {cities.length} global destinations.
                </p>
              </div>

              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {cities.map((city: any) => (
                  <li key={city._id} className="list-none">
                    <Link
                      href={`/locations/${city.continentSlug}/${city.countrySlug}/${city.slug}`}
                      className="group flex flex-col items-center justify-center p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-lg hover:border-teal-200 transition-all text-center h-full"
                    >
                      <span className="text-3xl mb-2">{city.emoji || '🏙️'}</span>
                      <span className="font-bold text-sm text-slate-800 group-hover:text-teal-600 transition-colors">
                        {city.name}
                      </span>
                      {city.countryName && (
                        <span className="text-xs text-gray-400 mt-0.5">
                          {city.countryName}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FALLBACK WHEN NO CONTENT EXISTS */}
          {(!guides || guides.length === 0) && (!cities || cities.length === 0) && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">No articles published in this category yet.</p>
              <p className="text-sm mt-2">Check back shortly — we are adding new content regularly.</p>
            </div>
          )}

        </div>
      </section>

      {/* BACK LINK */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:underline text-teal-600"
        >
          ← Back to all guides
        </Link>
      </div>

      <Footer />
    </main>
  )
}