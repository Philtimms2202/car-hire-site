'use client'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Tab = 'experiences' | 'flights' | 'hotels'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('experiences')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const router = useRouter()

  const handleSearch = () => {
    if (!location || !startDate) return

    // Construct slug URL based on location input
    // You can replace with your own logic to resolve continent/country/city
    const [continent, country, city] = location
      .toLowerCase()
      .split(',') // Expect input like "Europe, United-Kingdom, London"
      .map((s) => s.trim())

    if (!continent || !country || !city) {
      alert('Please enter location as: Continent, Country, City')
      return
    }

    router.push(`/locations/${continent}/${country}/${city}`)
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Explore the World: Flights, Hotels & Experiences 🌍
        </h1>
        <p className="text-xl mb-10 text-gray-300">
          Search and compare the best deals instantly!
        </p>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {['experiences', 'flights', 'hotels'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as Tab)}
              className={`px-6 py-2 rounded-full font-semibold ${
                activeTab === tab
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-left">
              <label className="block text-gray-500 text-sm mb-1">Location</label>
              <input
                type="text"
                placeholder="Continent, Country, City"
                className="input-field"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="text-left">
              <label className="block text-gray-500 text-sm mb-1">Start Date</label>
              <input
                type="date"
                className="input-field"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            {activeTab !== 'experiences' && (
              <div className="text-left">
                <label className="block text-gray-500 text-sm mb-1">End Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            )}
            <button
              onClick={handleSearch}
              className="btn-primary mt-5 w-full"
            >
              Search {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </div>
        </div>
      </section>

      {/* Optional: Tab content previews */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'experiences' && (
            <>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
                Popular Experiences
              </h2>
              <p className="text-gray-500 mb-6">Top curated experiences from around the globe.</p>
              {/* Example experience cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'City Tour', price: '£50', emoji: '🏙️' },
                  { name: 'Cooking Class', price: '£35', emoji: '🍳' },
                  { name: 'Boat Trip', price: '£70', emoji: '⛴️' },
                ].map((exp, i) => (
                  <div key={i} className="card p-4 bg-white rounded-xl shadow">
                    <div className="text-6xl mb-3">{exp.emoji}</div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>{exp.name}</h3>
                    <p className="text-gray-500 font-semibold">{exp.price}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          {activeTab === 'flights' && (
            <p className="text-center text-gray-500">Search flights from major airlines using your location & dates.</p>
          )}
          {activeTab === 'hotels' && (
            <p className="text-center text-gray-500">Search hotels worldwide with flexible check-in/out dates.</p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}