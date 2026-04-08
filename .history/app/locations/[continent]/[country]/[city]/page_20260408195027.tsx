import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'
import Script from 'next/script'
import { client } from '../../../../../sanity/lib/client'
import { PortableText } from '@portabletext/react'
import CitySearchBar from '../../../../components/Search/CitySearchBar'

export const revalidate = 60

// -----------------------------
// Metadata
// -----------------------------
export async function generateMetadata({ params }: any) {
  const { continent, country, city } = await params

  const data = await client.fetch(
    `*[
      _type == "city" &&
      slug.current == $city &&
      country->slug.current == $country &&
      country->continent->slug.current == $continent
    ][0]{
      name,
      heroDescription,
      metaDescription,
      country->{ name }
    }`,
    { continent, country, city }
  )

  const cityName = data?.name || city
  const countryName = data?.country?.name || country

  const desc =
    data?.metaDescription ||
    data?.heroDescription ||
    `Discover the best tours, attractions, and experiences in ${cityName}, ${countryName}.`

  return {
    title: `Timms Travel | Explore ${cityName}`,
    description: desc,
  }
}

// -----------------------------
// City Fetch (no Location fallback)
// -----------------------------
async function getCity(continentSlug: string, countrySlug: string, citySlug: string) {
  try {
    return await client.fetch(
      `*[
        _type == "city" &&
        slug.current == $citySlug &&
        country->slug.current == $countrySlug &&
        country->continent->slug.current == $continentSlug
      ][0]{
        name,
        "slug": slug.current,
        emoji,
        airport,
        heroDescription,
        mainContent,
        metaDescription,
        country->{
          name,
          "slug": slug.current,
          emoji,
          continent->{ name, "slug": slug.current, emoji }
        }
      }`,
      { continentSlug, countrySlug, citySlug }
    )
  } catch {
    return null
  }
}

// -----------------------------
// Page Component
// -----------------------------
export default async function CityPage({
  params,
}: {
  params: Promise<{ continent: string; country: string; city: string }>
}) {
  const { continent, country, city } = await params
  const cityDoc = await getCity(continent, country, city)

  if (!cityDoc) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            City Not Found
          </h1>
          <a
            href={`/locations/${continent}/${country}`}
            style={{ color: '#2f797c' }}
            className="font-semibold hover:opacity-75 transition"
          >
            Back to {country}
          </a>
        </div>
        <Footer />
      </main>
    )
  }

  const cityName =
    cityDoc.name ||
    city
      .split('-')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

  const countryName = cityDoc.country?.name || country

  const emoji = cityDoc.emoji
  const heroDescription = cityDoc.heroDescription
  const mainContent = cityDoc.mainContent

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <Script
        src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
        data-gyg-partner-id="P7B7GRH"
        strategy="afterInteractive"
      />

      {/* HERO */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <div className="text-6xl mb-4">{emoji}</div>

        <h1 className="text-5xl font-bold mb-4">Explore {cityName}</h1>

        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          {heroDescription ||
            `Discover amazing experiences in ${cityName}, ${countryName}.`}
        </p>

        <div className="mt-10">
          <CitySearchBar defaultCity={cityName} />
        </div>
      </section>

      {/* GYG Widget */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
            Top Experiences in {cityName}
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Hand picked activities and tours in {cityName}
          </p>

          <div
            data-gyg-widget="activities"
            data-gyg-partner-id="P7B7GRH"
            data-gyg-q={cityName}
            data-gyg-number-of-items="8"
          ></div>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-10 text-center">
        <a
          href={`/locations/${continent}/${country}/${city}/things-to-do`}
          className="
            inline-flex items-center justify-center 
            px-6 py-3 rounded-xl font-semibold 
            bg-[#2f797c] text-white 
            shadow-md hover:opacity-90 transition
          "
        >
          View More Things To Do in {cityName}
        </a>
      </div>

      {/* ABOUT */}
      <section className="py-16 px-6">
        <div className="max-w-100% mx-auto">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: '#03989e' }}
          >
            About {cityName}
          </h2>

          {mainContent && (
            <div className="prose max-w-none mt-8">
              <PortableText value={mainContent} />
            </div>
          )}

          {/* Breadcrumbs */}
          <div className="mt-10 flex gap-4 text-sm">
            <a
              href="/locations"
              style={{ color: '#2f797c' }}
              className="hover:opacity-75 transition"
            >
              All Continents
            </a>
            <span className="text-gray-400">→</span>

            <a
              href={`/locations/${continent}`}
              style={{ color: '#2f797c' }}
              className="hover:opacity-75 transition capitalize"
            >
              {continent}
            </a>
            <span className="text-gray-400">→</span>

            <a
              href={`/locations/${continent}/${country}`}
              style={{ color: '#2f797c' }}
              className="hover:opacity-75 transition capitalize"
            >
              {country}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}