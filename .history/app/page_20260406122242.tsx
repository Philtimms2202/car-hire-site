'use client'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Script from 'next/script'

import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import FlightSearch from '@/app/components/Search/FlightSearch'
import HotelSearch from '@/app/components/Search/HotelSearch'
import CarSearch from '@/app/components/Search/CarSearch'

import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'experiences' | 'flights' | 'hotels' | 'cars'>('experiences')
  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [dropoffDate, setDropoffDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const handleCarSearch = () => {
    if (!pickupLocation || !pickupDate || !dropoffDate) return
    const affiliateCode = 'YOURAFFILIATETOKEN'
    const url = `https://www.rentalcars.com/?affiliateCode=${affiliateCode}&preflocation=${encodeURIComponent(pickupLocation)}&puDay=${pickupDate}&doDay=${dropoffDate}`
    window.open(url, '_blank')
  }

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

  return (
    <main className="min-h-screen bg-white">

      <Navbar />

      <Script
        src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
        data-gyg-partner-id="P7B7GRH"
        strategy="afterInteractive"
      />

      {/* HERO SECTION */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Compare Thousands of Experiences Globally 🌍
        </h1>
        <p className="text-xl mb-10 text-gray-300">
          Thousands of experiences for you to enjoy - instant results at the best price!
        </p>

        {/* TAB MENU */}
        <div className="flex justify-center gap-6 mb-8">
          {['experiences', 'flights', 'hotels', 'cars'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 text-lg font-medium ${activeTab === tab ? 'border-b-2 border-white' : 'text-gray-400'}`}
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

        {/* Trust indicators */}
        <div className="flex justify-center gap-8 mt-8 text-sm text-gray-300">
          <span>✓ Compare 100s options in seconds</span>
          <span>✓ No hidden fees</span>
          <span>✓ Competitive price guarantee</span>
        </div>
      </section>

      {/* SEARCH RESULTS (Cars only) */}
      {searched && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8" style={{ color: '#232e4e' }}>
              {loading ? 'Finding the best deals...' : `Available Cars in ${pickupLocation}`}
            </h2>
            {loading ? (
              <div className="text-center py-16 text-gray-400 text-lg">Searching for the best deals...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.map((car) => (
                  <div key={car.id} className="card">
                    <div className="rounded-xl mb-4 h-40 flex items-center justify-center text-6xl" style={{ backgroundColor: '#eff6ff' }}>
                      {car.image}
                    </div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>{car.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-2xl font-bold" style={{ color: '#232e4e' }}>{car.price}</span>
                      <button className="btn-primary text-sm px-4 py-2">Book Now</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* FEATURED DEALS (when NOT searched) */}
      {!searched && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
              Popular Experiences
            </h2>
            <p className="text-center text-gray-500 mb-10">
              Hand picked deals from top destinations
            </p>
          </div>
        </section>
      )}

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
            {[
              { n: 1, title: 'Search', text: 'Find your destination and unlock thousands of experiences, compare flights, and hotels easily online.' },
              { n: 2, title: 'Compare', text: "Browse results from the world's leading affiliates agencies." },
              { n: 3, title: 'Book', text: 'Build your perfect package, book your flights and hotels, plus those all important excursions in one place.' },
            ].map(({ n, title, text }) => (
              <div key={n} className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4" style={{ backgroundColor: '#2f797c' }}>
                  {n}
                </div>
                <h3 className="font-bold text-xl mb-2" style={{ color: '#232e4e' }}>{title}</h3>
                <p className="text-gray-500 leading-7">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { emoji: '🌍', title: 'Worldwide Locations', text: 'Available in 100+ countries' },
            { emoji: '💰', title: 'Competitive Pricing', text: 'We compare all major providers' },
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

      {/* STATS BAR */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: '500+', label: 'Hotels' },
            { stat: '100+', label: 'Countries Covered' },
            { stat: '1000+', label: 'Experiences to Browse' },
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
            Popular Destinations
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Some of our most searched destinations
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destinations.map((dest) => (
              <a key={dest.city} href={`/locations/${dest.continent}/${dest.country}/${dest.slug}`} className="card text-center hover:shadow-xl transition cursor-pointer">
                <div className="text-4xl mb-2">{dest.emoji}</div>
                <p className="font-semibold text-sm" style={{ color: '#232e4e' }}>{dest.city}</p>
                <p className="text-xs mt-1" style={{ color: '#2f797c' }}>Discover More</p>
              </a>
            ))}
          </div>

          <div className="text-center mt-8">
            <a href="/locations/continents" className="btn-primary inline-block">View All Destinations</a>
          </div>

          {/* GYG WIDGET */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
              Top Experiences
            </h3>
            <p className="text-center text-gray-500 mb-8">
              Discover the best activities and tours worldwide
            </p>
            <div data-gyg-widget="auto" data-gyg-partner-id="P7B7GRH"></div>
          </div>

        </div>
      </section>

      <Footer />

    </main>
  )
}