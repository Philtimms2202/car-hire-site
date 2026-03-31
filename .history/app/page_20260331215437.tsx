'use client'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useState } from 'react'

export default function Home() {
  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [dropoffDate, setDropoffDate] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = () => {
    if (!pickupLocation || !pickupDate || !dropoffDate) return

    // TODO: Replace YOURAFFILIATETOKEN with your real affiliate code when approved
    const affiliateCode = 'YOURAFFILIATETOKEN'

    // Format dates to YYYY-MM-DD
    const formattedPickup = pickupDate
    const formattedDropoff = dropoffDate

    // Build the referral URL - swap this URL for your chosen partner when ready
    const url = `https://www.rentalcars.com/?affiliateCode=${affiliateCode}&preflocation=${encodeURIComponent(pickupLocation)}&puDay=${formattedPickup}&doDay=${formattedDropoff}`

    window.open(url, '_blank')
  }

  return (
    <main className="min-h-screen bg-white">

      {/* Navigation */}
      <Navbar />

      "use client";

import LocationDropdown from "@/components/LocationDropdown";

export default function HeroSection() {
  return (
    <section className="w-full bg-gray-50 py-20 px-6 flex justify-center">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">
          Find unforgettable experiences
        </h1>

        <p className="text-gray-600 mb-10">
          Choose a continent, country, and city to discover the best things to do.
        </p>

        <div className="bg-white shadow-xl rounded-xl p-6 flex flex-col gap-6">
          <LocationDropdown />

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Search Experiences
          </button>
        </div>
      </div>
    </section>
  );
}

        {/* Trust indicators */}
        <div className="flex justify-center gap-8 mt-8 text-sm text-gray-300">
          <span>✓ Free cancellation</span>
          <span>✓ No hidden fees</span>
          <span>✓ Best price guarantee</span>
        </div>
      </section>

      {/* Search Results */}
      {searched && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8" style={{color: '#232e4e'}}>
              {loading ? 'Finding the best deals...' : `Available Cars in ${pickupLocation}`}
            </h2>
            {loading ? (
              <div className="text-center py-16 text-gray-400 text-lg">Searching for the best deals...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.map((car) => (
                  <div key={car.id} className="card">
                    <div className="rounded-xl mb-4 h-40 flex items-center justify-center text-6xl" style={{backgroundColor: '#eff6ff'}}>
                      {car.image}
                    </div>
                    <h3 className="font-bold text-lg mb-1" style={{color: '#232e4e'}}>{car.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-2xl font-bold" style={{color: '#232e4e'}}>{car.price}</span>
                      </div>
                      <button className="btn-primary text-sm px-4 py-2">Book Now</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

{/* Featured Deals - shown when no search */}
{!searched && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2" style={{color: '#232e4e'}}>Popular Experiences</h2>
            <p className="text-center text-gray-500 mb-10">Hand picked deals from top destinations</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {[
                { id: 1, name: 'Economy Car', category: 'Economy', seats: 4, doors: 4, transmission: 'Manual', price: '£25', tag: 'Best Value', tagColor: '#2f797c', bg: '#eff6ff', image: '🚗', location: 'Manchester Airport', supplier: 'Hertz' },
                { id: 2, name: 'SUV / Family', category: 'SUV', seats: 5, doors: 5, transmission: 'Automatic', price: '£45', tag: 'Most Popular', tagColor: '#2f797c', bg: '#f0fdf4', image: '🚙', location: 'London Heathrow', supplier: 'Europcar' },
                { id: 3, name: 'Luxury', category: 'Luxury', seats: 4, doors: 4, transmission: 'Automatic', price: '£85', tag: 'Premium', tagColor: '#232e4e', bg: '#fefce8', image: '💎', location: 'Edinburgh Airport', supplier: 'Avis' },
              ].map((car) => (
                <div key={car.id} className="card">
                  <div className="rounded-xl mb-4 h-40 flex items-center justify-center text-6xl" style={{backgroundColor: car.bg}}>
                    {car.image}
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg" style={{color: '#232e4e'}}>{car.name}</h3>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{backgroundColor: car.tagColor}}>{car.tag}</span>
                  </div>
                  <p className="text-gray-400 text-xs mb-3">📍 {car.location} · {car.supplier}</p>
                  <div className="flex gap-3 text-xs text-gray-500 mb-4">
                    <span>👤 {car.seats} seats</span>
                    <span>🚪 {car.doors} doors</span>
                    <span>⚙️ {car.transmission}</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <div>
                      <span className="text-2xl font-bold" style={{color: '#232e4e'}}>{car.price}</span>
                      <span className="text-gray-400 text-sm">/day</span>
                    </div>
                    <button className="btn-primary text-sm px-4 py-2">View Deal</button>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
<section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{color: '#232e4e'}}>How It Works</h2>
          <p className="text-center text-gray-500 mb-12">Compare flights, hotels, and experiences around the world.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4" style={{backgroundColor: '#2f797c'}}>1</div>
              <h3 className="font-bold text-xl mb-2" style={{color: '#232e4e'}}>Search</h3>
              <p className="text-gray-500 leading-7">Find your destination and unlock thousands of experiences, compare flights, and hotels easily online.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4" style={{backgroundColor: '#2f797c'}}>2</div>
              <h3 className="font-bold text-xl mb-2" style={{color: '#232e4e'}}>Compare</h3>
              <p className="text-gray-500 leading-7">Browse results from the world's leading affiliates agencies.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4" style={{backgroundColor: '#2f797c'}}>3</div>
              <h3 className="font-bold text-xl mb-2" style={{color: '#232e4e'}}>Book</h3>
              <p className="text-gray-500 leading-7">Build your perfect package, book your flights and hotels, plus those all important excursions in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="font-bold text-lg mb-1" style={{color: '#232e4e'}}>Worldwide Locations</h3>
            <p className="text-gray-500 text-sm">Available in 100+ countries</p>
          </div>
          <div>
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-bold text-lg mb-1" style={{color: '#232e4e'}}>Competitive Pricing</h3>
            <p className="text-gray-500 text-sm">We compare all major providers</p>
          </div>
          <div>
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="font-bold text-lg mb-1" style={{color: '#232e4e'}}>Flexible Bookings</h3>
            <p className="text-gray-500 text-sm">Plans change - we get it</p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{backgroundColor: '#232e4e'}} className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold mb-1" style={{color: '#03989e'}}>500+</p>
            <p className="text-gray-300 text-sm">Hotels</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-1" style={{color: '#03989e'}}>100+</p>
            <p className="text-gray-300 text-sm">Countries Covered</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-1" style={{color: '#03989e'}}>1000+</p>
            <p className="text-gray-300 text-sm">Experiences to Browse</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-1" style={{color: '#03989e'}}>24/7</p>
            <p className="text-gray-300 text-sm">Customer Support</p>
          </div>
        </div>
      </section>

{/* Popular Destinations */}
<section className="py-16 px-6 bg-gray-50">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
      Popular Destinations
    </h2>
    <p className="text-center text-gray-500 mb-10">
      Some of our most searched destinations
    </p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { city: 'London', emoji: '🏙️', continent: 'europe', country: 'united-kingdom', slug: 'london' },
        { city: 'Manchester', emoji: '🐝', continent: 'europe', country: 'united-kingdom', slug: 'manchester' },
        { city: 'Edinburgh', emoji: '🏰', continent: 'europe', country: 'united-kingdom', slug: 'edinburgh' },
        { city: 'Barcelona', emoji: '⛪', continent: 'europe', country: 'spain', slug: 'barcelona' },
        { city: 'Delhi', emoji: '🕌', continent: 'asia', country: 'india', slug: 'delhi' },
        { city: 'New York', emoji: '🗽', continent: 'north-america', country: 'usa', slug: 'new-york' },
        { city: 'Orlando', emoji: '🎢', continent: 'north-america', country: 'usa', slug: 'orlando' },
        { city: 'Paris', emoji: '🗼', continent: 'europe', country: 'france', slug: 'paris' },
      ].map((dest) => (
        <a
          key={dest.city}
          href={`/locations/${dest.continent}/${dest.country}/${dest.slug}`}
          className="card text-center hover:shadow-xl transition cursor-pointer"
        >
          <div className="text-4xl mb-2">{dest.emoji}</div>
          <p className="font-semibold text-sm" style={{ color: '#232e4e' }}>
            {dest.city}
          </p>
          <p className="text-xs mt-1" style={{ color: '#2f797c' }}>
            Discover More
          </p>
        </a>
      ))}
    </div>

    <div className="text-center mt-8">
      <a href="/locations" className="btn-primary inline-block">
        View All Destinations
      </a>
    </div>
  </div>
</section>

      {/* Footer */}
      <Footer />

    </main>
  )
}