// ============================================
// CONTINENTS LIST PAGE - app/locations/continents/page.tsx
// ============================================

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { createClient } from '@sanity/client'
import Link from 'next/link'

const client = createClient({
  projectId: '6ogv1wx8',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

export const metadata = {
  title: {
    default: "Timms Travel | Continents",
    template: "Timms Travel | %s",
  },
  description: "Explore continents around the world and discover countries, cities, and experiences curated by Timms Travel.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default async function ContinentsPage() {
  const countries = await client.fetch(`
    *[_type == "location"]{
      continent,
      "continentSlug": continentSlug.current,
      continentEmoji
    }
  `)

  const continents = Array.from(
    new Map(
      countries.map(c => [c.continentSlug, c])
    ).values()
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <h1 className="text-5xl font-bold mb-4">Explore by Continent</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover the world one continent at a time — from iconic cities to hidden gems.
        </p>
      </section>

      {/* Why Explore Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            Why Explore by Continent?
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Every continent offers its own unique blend of culture, landscapes, cuisine, and experiences. 
            Whether you're planning a weekend escape in Europe, a wildlife adventure in Africa, or a 
            once‑in‑a‑lifetime trip across Asia, exploring by continent helps you discover destinations 
            that match your travel style.
          </p>
        </div>
      </section>

      {/* Continents Grid (unchanged) */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {continents.map(continent => (
              <Link
                key={continent.continentSlug}
                href={`/locations/${continent.continentSlug}`}
                className="p-6 border rounded-lg hover:shadow-xl transition cursor-pointer text-center"
              >
                <div className="text-5xl mb-3">{continent.continentEmoji}</div>
                <h3
                  className="font-bold text-xl"
                  style={{ color: '#232e4e' }}
                >
                  {continent.continent}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  View countries →
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/locations"
              className="font-semibold hover:opacity-75 transition"
              style={{ color: '#2f797c' }}
            >
              ← Back to Locations
            </Link>
          </div>
        </div>
      </section>

{/* Popular Destinations Section */}
<section className="py-20 px-6 bg-white border-t">
  <div className="max-w-5xl mx-auto text-center">
    <h2 className="text-3xl font-bold mb-6" style={{ color: '#232e4e' }}>
      Popular Destinations Around the World
    </h2>
    <p className="text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
      A curated selection of iconic cities across the globe — perfect for planning your next adventure.
    </p>

    <div className="grid md:grid-cols-3 gap-12 text-left">

      {/* Europe */}
      <div>
        <h3 className="font-bold text-xl mb-4" style={{ color: '#232e4e' }}>
          Europe
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-[#2f797c] text-lg mt-1">•</span>
            <Link
              href="/locations/europe/france/paris"
              className="text-gray-700 hover:text-[#2f797c] hover:underline transition"
            >
              Paris, France
            </Link>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-[#2f797c] text-lg mt-1">•</span>
            <Link
              href="/locations/europe/italy/rome"
              className="text-gray-700 hover:text-[#2f797c] hover:underline transition"
            >
              Rome, Italy
            </Link>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-[#2f797c] text-lg mt-1">•</span>
            <Link
              href="/locations/europe/spain/barcelona"
              className="text-gray-700 hover:text-[#2f797c] hover:underline transition"
            >
              Barcelona, Spain
            </Link>
          </li>
        </ul>
      </div>

      {/* Asia */}
      <div>
        <h3 className="font-bold text-xl mb-4" style={{ color: '#232e4e' }}>
          Asia
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-[#2f797c] text-lg mt-1">•</span>
            <Link
              href="/locations/asia/japan/tokyo"
              className="text-gray-700 hover:text-[#2f797c] hover:underline transition"
            >
              Tokyo, Japan
            </Link>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-[#2f797c] text-lg mt-1">•</span>
            <Link
              href="/locations/asia/thailand/bangkok"
              className="text-gray-700 hover:text-[#2f797c] hover:underline transition"
            >
              Bangkok, Thailand
            </Link>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-[#2f797c] text-lg mt-1">•</span>
            <Link
              href="/locations/asia/singapore/singapore"
              className="text-gray-700 hover:text-[#2f797c] hover:underline transition"
            >
              Singapore
            </Link>
          </li>
        </ul>
      </div>

      {/* North America */}
      <div>
        <h3 className="font-bold text-xl mb-4" style={{ color: '#232e4e' }}>
          North America
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-[#2f797c] text-lg mt-1">•</span>
            <Link
              href="/locations/north-america/usa/new-york"
              className="text-gray-700 hover:text-[#2f797c] hover:underline transition"
            >
              New York City, USA
            </Link>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-[#2f797c] text-lg mt-1">•</span>
            <Link
              href="/locations/north-america/usa/los-angeles"
              className="text-gray-700 hover:text-[#2f797c] hover:underline transition"
            >
              Los Angeles, USA
            </Link>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-[#2f797c] text-lg mt-1">•</span>
            <Link
              href="/locations/north-america/canada/toronto"
              className="text-gray-700 hover:text-[#2f797c] hover:underline transition"
            >
              Toronto, Canada
            </Link>
          </li>
        </ul>
      </div>

    </div>
  </div>
</section>


      {/* Travel Inspiration */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            Need Travel Inspiration?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            From tropical escapes to cultural city breaks, our travel guides help you plan unforgettable journeys.
          </p>

          <Link
            href="/blog"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-white"
            style={{ backgroundColor: '#2f797c' }}
          >
            Read Travel Guides
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
