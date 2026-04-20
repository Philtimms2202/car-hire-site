import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'
import Script from 'next/script'
import { client } from '../../../../../sanity/lib/client'
import { PortableText } from '@portabletext/react'
import CitySearchTabs from '@/app/components/Search/CitySearchBar'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const revalidate = 60

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
    `Explore ${cityName}, ${countryName} — top attractions, tours, travel tips and things to do.`

  return {
    title: `Timms Travel | Explore ${cityName}`,
    description: desc,
    alternates: {
      canonical: `https://timmstravel.com/locations/${continent}/${country}/${city}`,
    },
  }
}

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

async function findCorrectLocation(countrySlug: string, citySlug: string) {
  try {
    return await client.fetch(
      `*[
        _type == "city" &&
        slug.current == $citySlug &&
        country->slug.current == $countrySlug
      ][0]{
        "slug": slug.current,
        "countrySlug": country->slug.current,
        "continentSlug": country->continent->slug.current
      }`,
      { countrySlug, citySlug }
    )
  } catch {
    return null
  }
}

export default async function CityPage({ params }: any) {
  const { continent, country, city } = await params
  const cityDoc = await getCity(continent, country, city)

  if (!cityDoc) {
    const correct = await findCorrectLocation(country, city)
    if (correct?.continentSlug) {
      redirect(`/locations/${correct.continentSlug}/${correct.countrySlug}/${correct.slug}`)
    }

    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            City Not Found
          </h1>
          <Link
            href={`/locations/${continent}/${country}`}
            className="font-semibold hover:opacity-75 transition"
            style={{ color: '#2f797c' }}
          >
            Back to {country}
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const cityName = cityDoc.name
  const countryName = cityDoc.country?.name
  const continentName = cityDoc.country?.continent?.name
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
            `Discover top attractions, tours, and unforgettable experiences in ${cityName}, ${countryName}.`}
        </p>

        {/* ONLY CHANGE HERE */}
        <div className="mt-10">
          <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
            <CitySearchTabs />
          </div>
        </div>
      </section>

      {/* everything else unchanged */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#232e4e' }}>
            Highlights of {cityName}
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {cityName} is one of the most iconic destinations in {countryName}. Whether you are
            visiting for culture, food, nightlife or history, the city offers something for every
            traveller.
          </p>

          <ul className="grid md:grid-cols-2 gap-6 text-gray-700">
            <li className="p-4 border rounded-lg shadow-sm">
              <strong>Top Attractions in {cityName}</strong>
            </li>
            <li className="p-4 border rounded-lg shadow-sm">
              <strong>Culture & Local Life</strong>
            </li>
            <li className="p-4 border rounded-lg shadow-sm">
              <strong>Food & Dining</strong>
            </li>
            <li className="p-4 border rounded-lg shadow-sm">
              <strong>Day Trips</strong>
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  )
}