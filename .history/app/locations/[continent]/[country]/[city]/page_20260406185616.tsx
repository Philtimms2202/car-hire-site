import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'
import Script from 'next/script'
import { client } from '../../../../../sanity/lib/client'
import { PortableText } from '@portabletext/react'
import CitySearchBar from '../../../../components/Search/CitySearchBar'

export const revalidate = 60

// --- Currency + Language lookup by country ---
const countryInfo: Record<string, { currency: string; languages: string }> = {
  "United Kingdom": { currency: "GBP (British Pound)", languages: "English" },
  "France": { currency: "EUR (Euro)", languages: "French" },
  "Spain": { currency: "EUR (Euro)", languages: "Spanish" },
  "Italy": { currency: "EUR (Euro)", languages: "Italian" },
  "United States": { currency: "USD (US Dollar)", languages: "English" },
  // Add more as needed
}

export async function generateMetadata({ params }: any) {
  const resolved = await params
  const { continent, country, city } = resolved

  const cityData = await client.fetch(
    `*[_type == "location" 
      && continentSlug.current == $continent
      && countrySlug.current == $country
      && slug.current == $city][0]{
        city,
        country,
        description
      }`,
    { continent, country, city }
  )

  const cityName = cityData?.city || city
  const countryName = cityData?.country || country
  const desc =
    cityData?.description ||
    `Discover the best tours, attractions, and experiences in ${cityName}, ${countryName}.`

  return {
    title: `Things to do in ${cityName}`,
    description: desc,
  }
}

async function getCity(continentSlug: string, countrySlug: string, citySlug: string) {
  try {
    return await client.fetch(
      `*[_type == "location" 
        && continentSlug.current == $continentSlug 
        && countrySlug.current == $countrySlug
        && slug.current == $citySlug][0]{
          city,
          country,
          emoji,
          countryEmoji,
          description,
          mainContent,
          timezone, // <-- Add this to your Sanity schema
          "citySlug": slug.current,
          "countrySlug": countrySlug.current,
          "continentSlug": continentSlug.current
      }`,
      { continentSlug, countrySlug, citySlug }
    )
  } catch {
    return null
  }
}

// --- Helper: Get local time from timezone ---
function getLocalTime(timezone: string | undefined) {
  try {
    return new Date().toLocaleTimeString("en-GB", {
      timeZone: timezone || "UTC",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return "Unavailable"
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ continent: string; country: string; city: string }>
}) {
  const { continent, country, city } = await params
  const cityData = await getCity(continent, country, city)

  const cityName =
    cityData?.city ||
    city
      .split('-')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

  if (!cityData) {
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

  // Lookup currency + languages
  const info = countryInfo[cityData.country] || {
    currency: "Varies",
    languages: "Varies",
  }

  const localTime = getLocalTime(cityData.timezone)

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* GYG Script */}
      <Script
        src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
        data-gyg-partner-id="P7B7GRH"
        strategy="afterInteractive"
      />

      {/* Hero */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <div className="text-6xl mb-4">{cityData.emoji}</div>
        <h1 className="text-5xl font-bold mb-4">Explore {cityData.city}</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover amazing experiences in {cityData.city}, {cityData.country}.
        </p>

        <div className="mt-10">
          <CitySearchBar defaultCity={cityData.city} />
        </div>
      </section>

      {/* --- CITY AT A GLANCE (NEW SECTION) --- */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-bold mb-6"
            style={{ color: '#03989e' }}
          >
            {cityData.city} at a Glance
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Quick Facts */}
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Local Time:</strong> {localTime}
              </p>
              <p className="text-gray-700">
                <strong>Currency:</strong> {info.currency}
              </p>
              <p className="text-gray-700">
                <strong>Languages Spoken:</strong> {info.languages}
              </p>
            </div>

            {/* Map */}
            <div>
              <iframe
                width="100%"
                height="250"
                loading="lazy"
                style={{ border: 0 }}
                allowFullScreen
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  cityData.city + ", " + cityData.country
                )}&output=embed`}
              ></iframe>
            </div>

          </div>
        </div>
      </section>

      {/* GYG Widget */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
            Top Experiences in {cityData.city}
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Hand picked activities and tours in {cityData.city}
          </p>

          <div
            data-gyg-widget="activities"
            data-gyg-partner-id="P7B7GRH"
            data-gyg-q={cityName}
            data-gyg-number-of-items="8"
          ></div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 px-6">
        <div className="max-w-100% mx-auto">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: '#03989e' }}
          >
            About {cityData.city}
          </h2>

          {cityData.mainContent && (
            <div className="prose max-w-none mt-8">
              <PortableText value={cityData.mainContent} />
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