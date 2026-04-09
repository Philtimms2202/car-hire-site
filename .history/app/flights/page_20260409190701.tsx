'use client'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FlightSearch from '@/app/components/Search/FlightSearch'

const destinations = [
  { city: 'London', emoji: '🏙️', continent: 'europe', country: 'united-kingdom', slug: 'london' },
  { city: 'Manchester', emoji: '🐝', continent: 'europe', country: 'united-kingdom', slug: 'manchester' },
  { city: 'Edinburgh', emoji: '🏰', continent: 'europe', country: 'united-kingdom', slug: 'edinburgh' },
  { city: 'Barcelona', emoji: '⛪', continent: 'europe', country: 'spain', slug: 'barcelona' },
  { city: 'Delhi', emoji: '🕌', continent: 'asia', country: 'india', slug: 'delhi' },
  { city: 'New York', emoji: '🗽', continent: 'north-america', country: 'usa', slug: 'new-york' },
  { city: 'Orlando', emoji: '🎢', continent: 'north-america', country: 'usa', slug: 'orlando' },
  { city: 'Paris', emoji: '🗼', continent: 'europe', country: 'france', slug: 'paris' },
]

export default function FlightsPage() {
  return (
    <main className="min-h-screen bg-white">

      <Navbar />

      {/* HERO SECTION */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Compare Thousands of Flights Globally ✈️
        </h1>
        <p className="text-xl mb-10 text-gray-300">
          Search hundreds of airlines and travel sites at once — instant results at the best price!
        </p>

        {/* NAV TABS — links to other pages */}
        <div className="flex justify-center gap-6 mb-8">
          {[
            { label: 'Flights', href: '/flights' },
            { label: 'Hotels', href: '/hotels' },
            { label: 'Experiences', href: '/experiences' },
            { label: 'Cars', href: '/hire-cars' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={`pb-2 text-lg font-medium transition ${
                label === 'Flights'
                  ? 'border-b-2 border-white text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* SEARCH AREA */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
          <FlightSearch />
        </div>

        {/* Trust indicators */}
        <div className="flex justify-center gap-8 mt-8 text-sm text-gray-300">
          <span>✓ Fully Bespoke Offers</span>
          <span>✓ No hidden fees</span>
          <span>✓ Competitive price guarantee</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            How It Works
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Finding your perfect flight has never been easier.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: 1, title: 'Search', text: 'Enter your departure city, destination, and travel dates to instantly search hundreds of airlines and travel sites.' },
              { n: 2, title: 'Compare', text: "Browse results from the world's leading flight comparison engines, powered by Aviasales." },
              { n: 3, title: 'Book', text: 'Choose your perfect flight and book securely. Add hotels and experiences to complete your trip in one place.' },
            ].map(({ n, title, text }) => (
              <div key={n} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4"
                  style={{ backgroundColor: '#2f797c' }}
                >
                  {n}
                </div>
                <h3 className="font-bold text-xl mb-2" style={{ color: '#232e4e' }}>{title}</h3>
                <p className="text-gray-500 leading-7">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: '500+', label: 'Airlines Compared' },
            { stat: '100+', label: 'Countries Covered' },
            { stat: '1000+', label: 'Routes Available' },
            { stat: '24/7', label: 'Customer Support' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-4xl font-bold mb-1" style={{ color: '#03989e' }}>{stat}</p>
              <p className="text-gray-300 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Popular Flight Destinations
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Some of our most searched destinations
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destinations.map((dest) => (
              <a
                key={dest.city}
                href={`/locations/${dest.continent}/${dest.country}/${dest.slug}`}
                className="card text-center hover:shadow-xl transition cursor-pointer"
              >
                <div className="text-4xl mb-2">{dest.emoji}</div>
                <p className="font-semibold text-sm" style={{ color: '#232e4e' }}>{dest.city}</p>
                <p className="text-xs mt-1" style={{ color: '#2f797c' }}>Find Flights</p>
              </a>
            ))}
          </div>

          <div className="text-center mt-8">
            <a href="/locations/continents" className="btn-primary inline-block">View All Destinations</a>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { emoji: '✈️', title: 'Hundreds of Airlines', text: 'We compare all major carriers and budget airlines' },
            { emoji: '💰', title: 'Best Price Guarantee', text: 'We compare all major providers so you don\'t have to' },
            { emoji: '🛡️', title: 'Flexible Bookings', text: 'Plans change — we get it' },
          ].map(({ emoji, title, text }) => (
            <div key={title}>
              <div className="text-4xl mb-3">{emoji}</div>
              <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>{title}</h3>
              <p className="text-gray-500 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />

    </main>
  )
}
