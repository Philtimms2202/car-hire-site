'use client'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useState, useEffect } from 'react'
import { client } from '../sanity/lib/client' // adjust path to your sanity client
import { groq } from 'next-sanity'

type Country = {
  _id: string
  name: string
  continent: string
  cities: { name: string; slug: string }[]
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'experiences' | 'flights' | 'hotels' | 'cars'>('experiences')
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [pickupDate, setPickupDate] = useState('')
  const [dropoffDate, setDropoffDate] = useState('')

  useEffect(() => {
    const fetchCountries = async () => {
      const query = groq`*[_type=="country"]{
        _id,
        name,
        continent,
        "cities": cities[]->{name, "slug": slug.current}
      }`
      const data = await client.fetch(query)
      setCountries(data)
    }
    fetchCountries()
  }, [])

  const handleSearch = () => {
    if (!selectedCountry || !selectedCity) return
    const continent = selectedCountry.continent || 'other'
    const countrySlug = selectedCountry.name.toLowerCase().replaceAll(' ', '-')
    const citySlug = selectedCity.toLowerCase().replaceAll(' ', '-')
    const url = `/locations/${continent}/${countrySlug}/${citySlug}`
    window.location.href = url
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[#232e4e] text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Compare Thousands of Experiences Globally 🌍</h1>
        <p className="text-xl mb-10 text-gray-300">
          Thousands of experiences for you to enjoy - Instant results at the best price!
        </p>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto bg-gray-100 rounded-2xl shadow-xl p-6">
          <div className="flex justify-around mb-6">
            {['experiences', 'flights', 'hotels', 'cars'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-t-xl font-semibold transition ${
                  activeTab === tab
                    ? 'bg-[#2f797c] text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-left">
              <label className="block text-gray-700 text-sm mb-1">Country</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={selectedCountry?._id || ''}
                onChange={(e) => {
                  const country = countries.find((c) => c._id === e.target.value) || null
                  setSelectedCountry(country)
                  setSelectedCity('')
                }}
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-left">
              <label className="block text-gray-700 text-sm mb-1">City</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedCountry}
              >
                <option value="">Select City</option>
                {selectedCountry?.cities.map((city) => (
                  <option key={city.slug} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Only show dates for tabs that need them */}
            {(activeTab === 'cars' || activeTab === 'hotels' || activeTab === 'experiences') && (
              <>
                <div className="text-left">
                  <label className="block text-gray-700 text-sm mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>
                <div className="text-left">
                  <label className="block text-gray-700 text-sm mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="md:col-span-4 mt-4 md:mt-0">
              <button
                onClick={handleSearch}
                className="w-full bg-[#2f797c] hover:bg-[#276663] text-white font-bold py-3 rounded-xl transition"
              >
                Search
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

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2 text-[#232e4e]">How It Works</h2>
          <p className="text-center text-gray-500 mb-12">Compare flights, hotels, and experiences around the world.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Search', desc: 'Find your destination and unlock thousands of experiences, compare flights, and hotels easily online.' },
              { step: '2', title: 'Compare', desc: "Browse results from the world's leading affiliates agencies." },
              { step: '3', title: 'Book', desc: 'Build your perfect package, book your flights and hotels, plus those all important excursions in one place.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 bg-[#2f797c]">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl mb-2 text-[#232e4e]">{item.title}</h3>
                <p className="text-gray-500 leading-7">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: '🌍', title: 'Worldwide Locations', desc: 'Available in 100+ countries' },
            { icon: '💰', title: 'Competitive Pricing', desc: 'We compare all major providers' },
            { icon: '🛡️', title: 'Flexible Bookings', desc: 'Plans change - we get it' },
          ].map((item) => (
            <div key={item.title}>
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-lg mb-1 text-[#232e4e]">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#232e4e] py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: '500+', label: 'Hotels' },
            { value: '100+', label: 'Countries Covered' },
            { value: '1000+', label: 'Experiences to Browse' },
            { value: '24/7', label: 'Customer Support' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold mb-1 text-[#03989e]">{stat.value}</p>
              <p className="text-gray-300 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2 text-[#232e4e]">Popular Destinations</h2>
          <p className="text-gray-500 mb-10">Some of our most searched destinations</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {countries.slice(0, 8).map((country) =>
              country.cities.map((city) => (
                <a
                  key={city.slug}
                  href={`/locations/${country.continent}/${country.name.toLowerCase().replaceAll(' ', '-')}/${city.slug}`}
                  className="card text-center p-4 rounded-xl bg-white shadow hover:shadow-lg transition"
                >
                  <div className="text-4xl mb-2">📍</div>
                  <p className="font-semibold text-sm text-[#232e4e]">{city.name}</p>
                  <p className="text-xs mt-1 text-[#2f797c]">Discover More</p>
                </a>
              ))
            )}
          </div>
          <div className="text-center mt-8">
            <a href="/locations" className="btn-primary inline-block bg-[#2f797c] hover:bg-[#276663] text-white font-bold py-3 px-6 rounded-xl transition">
              View All Destinations
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}