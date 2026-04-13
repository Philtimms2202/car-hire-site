// ============================================
// CONTINENTS LIST PAGE - app/locations/continents/page.tsx
// URL: hirecarhub.com/locations/continents
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
      template: "Timms Travel |",
    },
    description: "Discover amazing experiences around the world.",
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
          Choose a continent to browse all countries and cities we cover.
        </p>
      </section>

      {/* Continents Grid */}
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

      <Footer />
    </main>
  )
}