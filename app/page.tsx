'use client'

import Navbar from './components/Navbar'
import { useState } from 'react'
import { searchCars } from '../lib/discovercars'

export default function Home() {
  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [dropoffDate, setDropoffDate] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!pickupLocation || !pickupDate || !dropoffDate) return
    setLoading(true)
    setSearched(true)
    const data = await searchCars({ pickupLocation, pickupDate, dropoffDate })
    setResults(data.results)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-white">

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section style={{backgroundColor: '#232e4e'}} className="text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Compare Thousands of Hire Car Deals Globally</h1>
        <p className="text-xl mb-10 text-gray-300">Compare thousands of car hire deals worldwide — instant results, best prices</p>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-left">
              <label className="block text-gray-500 text-sm mb-1">Pick-up Location</label>
              <input
                type="text"
                placeholder="City or airport"
                className="input-field"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>
            <div className="text-left">
              <label className="block text-gray-500 text-sm mb-1">Pick-up Date</label>
              <input
                type="date"
                className="input-field"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
              />
            </div>
            <div className="text-left">
              <label className="block text-gray-500 text-sm mb-1">Drop-off Date</label>
              <input
                type="date"
                className="input-field"
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
              />
            </div>
            <button onClick={handleSearch} className="btn-primary mt-5 w-full">
              {loading ? 'Searching...' : 'Search Cars'}
            </button>
          </div>
        </div>

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
            <h2 className="text-3xl font-bold text-center mb-2" style={{color: '#232e4e'}}>Popular Car Hire Deals</h2>
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
            <h3 className="font-bold text-lg mb-1" style={{color: '#232e4e'}}>Free Cancellation</h3>
            <p className="text-gray-500 text-sm">Plans change - we get it</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{backgroundColor: '#232e4e'}} className="text-gray-400 text-center py-8 px-6">
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