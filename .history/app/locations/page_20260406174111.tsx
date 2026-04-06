// ============================================
// LOCATIONS PAGE - app/locations/page.tsx
// ============================================

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: "Explore Destinations Worldwide | Timms Travel",
  description: "Compare flights, hotels, experiences and more across thousands of destinations worldwide.",
}

export default function Locations() {
  const featuredDestinations = [
    {
      city: 'London',
      country: 'United Kingdom',
      continent: 'europe',
      countrySlug: 'united-kingdom',
      slug: 'london',
      image: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba',
    },
    {
      city: 'Barcelona',
      country: 'Spain',
      continent: 'europe',
      countrySlug: 'spain',
      slug: 'barcelona',
      image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad',
    },
    {
      city: 'Dubai',
      country: 'UAE',
      continent: 'asia',
      countrySlug: 'united-arab-emirates',
      slug: 'dubai',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
    },
    {
      city: 'New York',
      country: 'USA',
      continent: 'north-america',
      countrySlug: 'united-states',
      slug: 'new-york',
      image: 'https://images.unsplash.com/photo-1496588152823-86ff7695f1c8',
    },
  ]

  const continents = [
    { name: 'Europe', slug: 'europe' },
    { name: 'North America', slug: 'north-america' },
    { name: 'Asia', slug: 'asia' },
    { name: 'Australia', slug: 'australia' },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="relative bg-[#232e4e] text-white py-24 px-6 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Your Next Destination
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Compare flights, hotels, experiences and more — all in one place.
          </p>

          <a
            href="/locations/continents"
            className="inline-block bg-[#2f797c] hover:opacity-90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
          >
            Browse All Locations →
          </a>
        </div>

        {/* subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-[#232e4e]">
            Trending Destinations
          </h2>
          <p className="text-gray-500 mb-10">
            Hand-picked destinations people are booking right now.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((dest) => (
              <a
                key={dest.city}
                href={`/locations/${dest.continent}/${dest.countrySlug}/${dest.slug}`}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <div
                  className="h-64 bg-cover bg-center group-hover:scale-105 transition duration-300"
                  style={{ backgroundImage: `url(${dest.image})` }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{dest.city}</h3>
                  <p className="text-sm text-gray-200">{dest.country}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTINENTS NAV */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2 text-[#232e4e]">
            Explore by Continent
          </h2>
          <p className="text-gray-500 mb-10">
            Start broad, then drill down into countries and cities.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {continents.map((c) => (
              <a
                key={c.slug}
                href={`/locations/${c.slug}`}
                className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition font-semibold text-[#232e4e]"
              >
                {c.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-bold text-lg mb-2 text-[#232e4e]">
              🔍 Compare Everything
            </h3>
            <p className="text-gray-500 text-sm">
              Flights, hotels, car hire and experiences — all in one place.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2 text-[#232e4e]">
              💸 No Hidden Fees
            </h3>
            <p className="text-gray-500 text-sm">
              Transparent pricing from trusted travel providers.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2 text-[#232e4e]">
              🤝 Trusted Partners
            </h3>
            <p className="text-gray-500 text-sm">
              We only work with reliable, well-known travel brands.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#232e4e] text-white py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Planning?
        </h2>
        <p className="text-gray-300 mb-8">
          Explore thousands of destinations and find the best deals for your next trip.
        </p>

        <a
          href="/locations/continents"
          className="inline-block bg-[#2f797c] px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Explore All Destinations →
        </a>
      </section>

      <Footer />
    </main>
  )
}