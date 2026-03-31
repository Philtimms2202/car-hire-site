'use client'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useState } from 'react'

// Sample data for countries and cities
const countryCityMap = {
  'United Kingdom': ['London', 'Manchester', 'Edinburgh'],
  'USA': ['New York', 'Orlando', 'Los Angeles'],
  'France': ['Paris', 'Nice', 'Lyon'],
  'India': ['Delhi', 'Mumbai', 'Bangalore'],
  'Spain': ['Barcelona', 'Madrid', 'Valencia'],
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'experiences' | 'flights' | 'hotels' | 'cars'>('experiences')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [dropoffDate, setDropoffDate] = useState('')

  const handleSearch = () => {
    if (!selectedCountry || !selectedCity) return
    let url = ''

    switch (activeTab) {
      case 'cars':
        url = `/locations/${getContinent(selectedCountry)}/${selectedCountry.toLowerCase().replaceAll(' ', '-')}/${selectedCity.toLowerCase().replaceAll(' ', '-')}`
        break
      case 'hotels':
        url = `/locations/${getContinent(selectedCountry)}/${selectedCountry.toLowerCase().replaceAll(' ', '-')}/${selectedCity.toLowerCase().replaceAll(' ', '-')}`
        break
      case 'flights':
        url = `/locations/${getContinent(selectedCountry)}/${selectedCountry.toLowerCase().replaceAll(' ', '-')}/${selectedCity.toLowerCase().replaceAll(' ', '-')}`
        break
      case 'experiences':
        url = `/locations/${getContinent(selectedCountry)}/${selectedCountry.toLowerCase().replaceAll(' ', '-')}/${selectedCity.toLowerCase().replaceAll(' ', '-')}`
        break
    }

    window.location.href = url
  }

  // Simple helper to map country to continent (expand as needed)
  const getContinent = (country: string) => {
    const europe = ['United Kingdom', 'France', 'Spain']
    const asia = ['India']
    const northAmerica = ['USA']
    if (europe.includes(country)) return 'europe'
    if (asia.includes(country)) return 'asia'
    if (northAmerica.includes(country)) return 'north-america'
    return 'other'
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Compare Thousands of Experiences Globally 🌍</h1>
        <p className="text-xl mb-10 text-gray-300">
          Thousands of experiences for you to enjoy - Instant results at the best price!
        </p>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl">
          <div className="flex justify-around mb-6">
            {['experiences', 'flights', 'hotels', 'cars'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-t-xl font-semibold ${
                  activeTab === tab
                    ? 'bg-[#232e4e] text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-left">
              <label className="block text-gray-500 text-sm mb-1">Country</label>
              <select
                className="input-field"
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value)
                  setSelectedCity('') // reset city when country changes
                }}
              >
                <option value="">Select Country</option>
                {Object.keys(countryCityMap).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-left">
              <label className="block text-gray-500 text-sm mb-1">City</label>
              <select
                className="input-field"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedCountry}
              >
                <option value="">Select City</option>
                {selectedCountry &&
                  countryCityMap[selectedCountry].map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            </div>

            {/* Date selectors for relevant tabs */}
            {(activeTab === 'cars' || activeTab === 'hotels' || activeTab === 'experiences') && (
              <>
                <div className="text-left">
                  <label className="block text-gray-500 text-sm mb-1">Start Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>
                <div className="text-left">
                  <label className="block text-gray-500 text-sm mb-1">End Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Search Button */}
            <div className="md:col-span-4 mt-4 md:mt-0">
              <button onClick={handleSearch} className="btn-primary w-full">
                Go
              </button>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex justify-center gap-8 mt-8 text-sm text-gray-300">
          <span>✓ Free cancellation</span>
          <span>✓ No hidden fees</span>
          <span>✓ Best price guarantee</span>
        </div>
      </section>

      {/* HOW IT WORKS downward stays the same */}
      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            How It Works
          </h2>
          <p className="text-center text-gray-500 mb-12">Compare flights, hotels, and experiences around the world.</p>
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
              <p className="text-gray-500 leading-7">Browse results from the world's leading affiliates agencies.</p>
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

      {/* Why Choose Us, Stats Bar, Popular Destinations, Footer remain the same */}
      <Footer />
    </main>
  )
}