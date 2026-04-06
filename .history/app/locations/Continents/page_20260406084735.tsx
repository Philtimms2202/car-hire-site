import { createClient } from '@sanity/client'
import Link from 'next/link'

const client = createClient({
  projectId: '6ogv1wx8',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

export default async function ContinentsPage() {
  const countries = await client.fetch(`
    *[_type == "country"]{
      continent,
      continentSlug,
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
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Explore by Continent</h1>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {continents.map(continent => (
              <Link
                key={continent.continentSlug}
                href={`/locations/${continent.continentSlug}`}
                className="p-5 border rounded-lg hover:shadow-lg transition cursor-pointer"
              >
                <div className="text-4xl mb-1">{continent.continentEmoji}</div>
                <h3 className="font-bold text-xl" style={{ color: '#232e4e' }}>
                  {continent.continent}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}