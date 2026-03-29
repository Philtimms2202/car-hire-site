// ============================================
// LOCATION PAGE - app/locations/[slug]/page.tsx
// URL: hirecarhub.com/locations/manchester
// ============================================

import Navbar from '../../components/Navbar'
import { client } from '../../../sanity/lib/client'
import { locationQuery } from '../../../sanity/lib/queries'
import { PortableText } from '@portabletext/react'

export const revalidate = 60

async function getLocation(slug: string) {
  try {
    const location = await client.fetch(locationQuery, { slug })
    return location
  } catch (error) {
    return null
  }
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const location = await getLocation(slug)

  if (!location) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{color: '#232e4e'}}>Location Not Found</h1>
          <a href="/locations" style={{color: '#2f797c'}} className="font-semibold hover:opacity-75 transition">← Back to Locations</a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{backgroundColor: '#232e4e'}} className="text-white py-20 px-6 text-center">
        <div className="text-6xl mb-4">{location.emoji}</div>
        <h1 className="text-5xl font-bold mb-2">Car Hire in {location.city}</h1>
        {location.country && <p className="text-gray-400 mb-4">{location.country}</p>}
        {location.airport && (
          <p className="text-gray-300 mb-6">✈ {location.airport}</p>
        )}
        {location.heroDescription && (
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">{location.heroDescription}</p>
        )}
      </section>

      {/* Search Bar */}
      <section style={{backgroundColor: '#2f797c'}} className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <p className="text-center font-semibold mb-4" style={{color: '#232e4e'}}>Search car hire in {location.city}</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-left">
                <label className="block text-gray-500 text-sm mb-1">Pick-up Location</label>
                <input type="text" defaultValue={location.city} className="input-field" />
              </div>
              <div className="text-left">
                <label className="block text-gray-500 text-sm mb-1">Pick-up Date</label>
                <input type="date" className="input-field" />
              </div>
              <div className="text-left">
                <label className="block text-gray-500 text-sm mb-1">Drop-off Date</label>
                <input type="date" className="input-field" />
              </div>
              <button className="btn-primary mt-5 w-full">Search Cars</button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      {location.mainContent && (
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <PortableText
              value={location.mainContent}
              components={{
                block: {
                  normal: ({children}) => <p className="text-gray-600 leading-8 mb-6">{children}</p>,
                  h2: ({children}) => <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>{children}</h2>,
                  h3: ({children}) => <h3 className="text-xl font-bold mt-8 mb-3" style={{color: '#232e4e'}}>{children}</h3>,
                },
                list: {
                  bullet: ({children}) => <ul className="list-disc list-inside mb-6 text-gray-600 leading-8">{children}</ul>,
                  number: ({children}) => <ol className="list-decimal list-inside mb-6 text-gray-600 leading-8">{children}</ol>,
                },
                marks: {
                  strong: ({children}) => <strong className="font-bold">{children}</strong>,
                  em: ({children}) => <em className="italic">{children}</em>,
                },
              }}
            />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-4" style={{color: '#232e4e'}}>Ready to Explore {location.city}?</h2>
        <p className="text-gray-500 mb-8">Find the best car hire deals and hit the road today.</p>
        <a href="/" className="btn-primary inline-block">Search All Cars</a>
      </section>

      {/* Footer */}
      <footer style={{backgroundColor: '#232e4e'}} className="text-gray-400 text-center py-8 px-6 border-t border-gray-700">
        <p className="text-white font-bold text-lg mb-2">Hire Car Hub</p>
        <div className="flex justify-center gap-6 text-sm mb-4">
          <a href="/about" className="hover:text-white transition">About</a>
          <a href="/contact" className="hover:text-white transition">Contact</a>
          <a href="/blog" className="hover:text-white transition">Blog</a>
          <a href="/locations" className="hover:text-white transition">Locations</a>
        </div>
        <p className="text-sm">© 2026 Hire Car Hub. All rights reserved.</p>
      </footer>

    </main>
  )
}