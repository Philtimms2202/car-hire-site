'use client'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import ExperienceSearch from './components/search/ExperienceSearch'
import FlightSearch from './components/search/FlightSearch'
import HotelSearch from './components/search/HotelSearch'
import CarSearch from './components/search/CarSearch'

import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'experiences' | 'flights' | 'hotels' | 'cars'>('experiences')

  // Car search state
  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [dropoffDate, setDropoffDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const handleCarSearch = () => {
    if (!pickupLocation || !pickupDate || !dropoffDate) return

    const affiliateCode = 'YOURAFFILIATETOKEN'
    const url = `https://www.rentalcars.com/?affiliateCode=${affiliateCode}&preflocation=${encodeURIComponent(
      pickupLocation
    )}&puDay=${pickupDate}&doDay=${dropoffDate}`

    window.open(url, '_blank')
  }

  return (
    <main className="min-h-screen bg-white">

      <Navbar />

     {/* HERO SECTION */}
     <section style={{ backgroundColor: '#232e4e' }} className="text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Compare Thousands of Experiences Globally 🌍</h1>
        <p className="text-xl mb-10 text-gray-300">
          Thousands of experiences for you to enjoy — instant results at the best price!
        </p>

        {/* TAB MENU */}
        <div className="flex justify-center gap-6 mb-8">
          {['experiences', 'flights', 'hotels', 'cars'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 text-lg font-medium ${
                activeTab === tab ? 'border-b-2 border-white' : 'text-gray-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* SEARCH AREA */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
          {activeTab === 'experiences' && <ExperienceSearch />}
          {activeTab === 'flights' && <FlightSearch />}
          {activeTab === 'hotels' && <HotelSearch />}
          {activeTab === 'cars' && (
            <CarSearch
              pickupLocation={pickupLocation}
              pickupDate={pickupDate}
              dropoffDate={dropoffDate}
              setPickupLocation={setPickupLocation}
              setPickupDate={setPickupDate}
              setDropoffDate={setDropoffDate}
              loading={loading}
              onSearch={handleCarSearch}
            />
          )}
        </div>
      {/* HOW IT WORKS */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            How It Works
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Compare flights, hotels, and experiences around the world.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4"
                style={{ backgroundColor: '#2f797c' }}
              >
                1
              </div>
              <h3 className="font-bold text-xl mb-2" style={{ color: '#232e4e' }}>
                Search
              </h3>
              <p className="text-gray-500 leading-7">
                Find your destination and unlock thousands of experiences, compare flights, and hotels easily online.
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4"
                style={{ backgroundColor: '#2f797c' }}
              >
                2
              </div>
              <h3 className="font-bold text-xl mb-2" style={{ color: '#232e4e' }}>
                Compare
              </h3>
              <p className="text-gray-500 leading-7">
                Browse results from the world's leading affiliates agencies.
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4"
                style={{ backgroundColor: '#2f797c' }}
              >
                3
              </div>
              <h3 className="font-bold text-xl mb-2" style={{ color: '#232e4e' }}>
                Book
              </h3>
              <p className="text-gray-500 leading-7">
                Build your perfect package, book your flights and hotels, plus those all important excursions in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>
              Worldwide Locations
            </h3>
            <p className="text-gray-500 text-sm">Available in 100+ countries</p>
          </div>

          <div>
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>
              Competitive Pricing
            </h3>
            <p className="text-gray-500 text-sm">We compare all major providers</p>
          </div>

          <div>
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>
              Flexible Bookings
            </h3>
            <p className="text-gray-500 text-sm">Plans change — we get it</p>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold mb-1" style={{ color: '#03989e' }}>
              500+
            </p>
            <p className="text-gray-300 text-sm">Hotels</p>
          </div>

          <div>
            <p className="text-4xl font-bold mb-1" style={{ color: '#03989e' }}>
              100+
            </p>
            <p className="text-gray-300 text-sm">Countries Covered</p>
          </div>

          <div>
            <p className="text-4xl font-bold mb-1" style={{ color: '#03989e' }}>
              1000+
            </p>
            <p className="text-gray-300 text-sm">Experiences to Browse</p>
          </div>

          <div>
            <p className="text-4xl font-bold mb-1" style={{ color: '#03989e' }}>
              24/7
            </p>
            <p className="text-gray-300 text-sm">Customer Support</p>
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
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

      <Footer />
    </main>
  )
}