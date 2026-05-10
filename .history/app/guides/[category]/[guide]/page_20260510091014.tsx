import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import JsonLd from '@/app/components/JsonLd'
import BreadcrumbNav from '@/app/components/BreadcrumbNav'
import PortableTextRenderer from '@/app/components/PortableTextRenderer'
import { getGuideBySlug, getAllGuideSlugs } from '@/lib/sanity.queries'
import { categories } from '@/lib/categories'
import type { Metadata } from 'next'

type Props = {
  params: { category: string; guide: string }
}

export async function generateStaticParams() {
  const slugs = await getAllGuideSlugs()
  return slugs.map((s: any) => ({
    category: s.categorySlug,
    guide: s.guideSlug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = await getGuideBySlug(params.category, params.guide)
  if (!guide) return {}

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: {
      canonical: `https://timmstravel.com/guides/${params.category}/${params.guide}`,
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.ogDescription ?? guide.metaDescription,
      url: `https://timmstravel.com/guides/${params.category}/${params.guide}`,
      siteName: 'Timms Travel',
      locale: 'en_GB',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.metaTitle,
      description: guide.metaDescription,
    },
  }
}

export default async function GuidePage({ params }: Props) {
  const guide = await getGuideBySlug(params.category, params.guide)
  if (!guide) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `https://timmstravel.com/guides/${params.category}/${params.guide}`,
    url: `https://timmstravel.com/guides/${params.category}/${params.guide}`,
    headline: guide.title,
    description: guide.metaDescription,
    inLanguage: 'en-GB',
    publisher: {
      '@type': 'Organization',
      name: 'Timms Travel',
      url: 'https://timmstravel.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://timmstravel.com/logo.png',
      },
    },
    isPartOf: { '@id': 'https://timmstravel.com/#website' },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://timmstravel.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://timmstravel.com/guides' },
      { '@type': 'ListItem', position: 3, name: guide.categoryTitle, item: `https://timmstravel.com/guides/${params.category}` },
      { '@type': 'ListItem', position: 4, name: guide.title, item: `https://timmstravel.com/guides/${params.category}/${params.guide}` },
    ],
  }

  // Related categories (excluding current)
  const relatedCategories = categories.filter((c) => c.slug !== params.category).slice(0, 3)

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* HERO */}
      <section
        className="py-20 px-6 text-white"
        style={{ backgroundColor: '#232e4e' }}
        aria-labelledby="guide-heading"
      >
        <div className="max-w-3xl mx-auto text-center">
          <Link
            href={`/guides/${params.category}`}
            className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4 hover:underline"
          >
            {guide.categoryEmoji} {guide.categoryTitle}
          </Link>
          <h1
            id="guide-heading"
            className="text-3xl md:text-5xl font-bold mb-5 leading-tight"
          >
            {guide.title}
          </h1>
          {guide.excerpt && (
            <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              {guide.excerpt}
            </p>
          )}
          {guide.readingTime && (
            <p className="mt-5 text-sm text-teal-400 font-medium">
              {guide.readingTime} min read
            </p>
          )}
        </div>
      </section>

      {/* BREADCRUMB */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <BreadcrumbNav
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Guides', href: '/guides' },
            { label: guide.categoryTitle, href: `/guides/${params.category}` },
            { label: guide.title },
          ]}
        />
      </div>

      {/* CONTENT */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">

            {/* MAIN CONTENT */}
            <article>
              {guide.content && <PortableTextRenderer content={guide.content} />}

              {/* BACK LINK */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <Link
                  href={`/guides/${params.category}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold hover:underline transition-colors"
                  style={{ color: '#03989e' }}
                >
                  ← Back to {guide.categoryTitle}
                </Link>
              </div>
            </article>

            {/* SIDEBAR */}
            <aside className="space-y-6">

              {/* QUICK LINKS */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <h3
                  className="font-bold text-base mb-4"
                  style={{ color: '#232e4e' }}
                >
                  Browse More Guides
                </h3>
                <ul className="space-y-3">
                  {relatedCategories.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/guides/${cat.slug}`}
                        className="flex items-center gap-3 text-sm font-medium hover:underline transition-colors group"
                        style={{ color: '#232e4e' }}
                      >
                        <span className="text-xl" aria-hidden="true">{cat.emoji}</span>
                        <span className="group-hover:text-[#03989e] transition-colors">
                          {cat.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/guides"
                      className="text-sm font-bold hover:underline"
                      style={{ color: '#03989e' }}
                    >
                      View all guide categories →
                    </Link>
                  </li>
                </ul>
              </div>

              {/* SEARCH CTA */}
              <div
                className="rounded-2xl p-6 text-white"
                style={{ backgroundColor: '#232e4e' }}
              >
                <p className="font-bold text-base mb-2">Ready to book?</p>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">
                  Search flights, hotels and experiences in one place. No hidden fees.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/flights"
                    className="block text-center px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                    style={{ backgroundColor: '#03989e', color: '#fff' }}
                  >
                    Search Flights →
                  </Link>
                  <Link
                    href="/hotels"
                    className="block text-center px-5 py-2.5 rounded-xl font-semibold text-sm border border-white/20 hover:bg-white/10 transition-all"
                  >
                    Search Hotels →
                  </Link>
                </div>
              </div>

              {/* ESSENTIALS CTA */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <p className="font-bold text-base mb-2" style={{ color: '#232e4e' }}>
                  Travel Essentials
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  Don't forget insurance, an eSIM and your airport transfer.
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/other-services/travel-insurance"
                    className="text-sm font-semibold hover:underline"
                    style={{ color: '#be123c' }}
                  >
                    🛡️ Travel Insurance →
                  </Link>
                  <Link
                    href="/other-services/esims"
                    className="text-sm font-semibold hover:underline"
                    style={{ color: '#6d28d9' }}
                  >
                    🌐 eSIMs →
                  </Link>
                  <Link
                    href="/other-services/airport-transfers"
                    className="text-sm font-semibold hover:underline"
                    style={{ color: '#0369a1' }}
                  >
                    🚐 Airport Transfers →
                  </Link>
                </div>
              </div>

            </aside>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section
        className="py-14 px-6 text-center text-white"
        style={{ backgroundColor: '#232e4e' }}
        aria-labelledby="guide-cta-heading"
      >
        <div className="max-w-2xl mx-auto">
          <h2 id="guide-cta-heading" className="text-3xl font-bold mb-4">
            Plan Your Trip with Timms Travel
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Search flights, hotels, experiences, car hire, travel insurance, airport transfers and eSIMs — all in one place.
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
              href="/other-services"
              className="inline-block px-8 py-3 rounded-full font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-all"
            >
              View Other Services →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}