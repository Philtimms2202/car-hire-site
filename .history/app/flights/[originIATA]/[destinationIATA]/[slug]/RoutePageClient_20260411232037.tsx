'use client'

import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

type City = {
  name: string
  slug: { current: string }
  country: {
    name: string
    slug: { current: string }
  }
  heroDescription?: string | null
  metaDescription?: string | null
  primaryIATA?: string | null
  alternateIATAs?: string[] | null
}

type Props = {
  originIATA?: string
  destinationIATA?: string
  slug?: string
  origin: City | null
  destination: City | null
}

export default function RoutePageClient({
  originIATA,
  destinationIATA,
  slug,
  origin,
  destination,
}: Props) {
  // Debug log so we SEE what props are arriving
  console.log("CLIENT PROPS:", { originIATA, destinationIATA, slug, origin, destination })

  // Safe fallbacks
  const safeOriginIATA = originIATA ?? ''
  const safeDestinationIATA = destinationIATA ?? ''
  const safeSlug = slug ?? ''

  const originName =
    origin?.name ||
    (safeOriginIATA ? safeOriginIATA.toUpperCase() : 'Unknown Origin')

  const destinationName =
    destination?.name ||
    (safeDestinationIATA ? safeDestinationIATA.toUpperCase() : 'Unknown Destination')

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-24 px-6 text-center"
      >
        <p
          className="text-sm uppercase tracking-widest mb-3"
          style={{ color: '#03989e' }}
        >
          Flights
        </p>

        <h1 className="text-5xl font-bold mb-4">
          Flights from {originName} to {destinationName}
        </h1>

        <p className="text-xl mb-6 text-gray-300 max-w-xl mx-auto">
          Compare routes, airlines and prices for your trip from {originName} to{' '}
          {destinationName} with our trusted partners.
        </p>

        <p className="text-sm text-gray-300">
          Route slug: <span className="font-mono">{safeSlug}</span>
        </p>
      </section>

      {/* Placeholder content */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            This is the new dynamic flight route page shell. Next step: add
            route facts, airlines, Kiwi deep links, hotels, and things to do —
            all styled like your Hotels page.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}