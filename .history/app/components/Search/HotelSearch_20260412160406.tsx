'use client'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Script from 'next/script'

import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import FlightSearch from '@/app/components/Search/FlightSearch'
import CarSearch from '@/app/components/Search/CarSearch'
import HotelSearch from '@/app/components/Search/HotelSearch'

import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] =
    useState<'flights' | 'hotels' | 'experiences' | 'cars'>('flights')

  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [dropoffDate, setDropoffDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCarSearch = () => {
    if (!pickupLocation || !pickupDate || !dropoffDate) return

    const url = `https://www.rentalcars.com/?preflocation=${encodeURIComponent(
      pickupLocation
    )}&puDay=${pickupDate}&doDay=${dropoffDate}`

    window.open(url, '_blank')
  }

  return (
    <main className="min-h-screen bg-white">

      <Navbar />

      <Script
        src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
        data-gyg-partner-id="P7B7GRH"
        strategy="afterInteractive"
      />

      {/* HERO */}
      <section className="bg-[#232e4e] text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Create Unforgettable Moments
        </h1>

        <p className="text-xl mb-10 text-gray-300">
          Choose from hundreds of destinations around the world!
        </p>

        {/* TABS (RESTORED EXACT FUNCTIONALITY) */}
        <div className="flex justify-center gap-6 mb-8">
          {['flights', 'hotels', 'experiences', 'cars'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 text-lg font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-white text-white'
                  : 'text-gray-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* SEARCH BOX */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">

          {activeTab === 'flights' && <FlightSearch />}

          {activeTab === 'hotels' && (
            <div className="w-full flex justify-center">
              <HotelSearch />
            </div>
          )}

          {activeTab === 'experiences' && <ExperienceSearch />}

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

        {/* TRUST */}
        <div className="flex justify-center gap-8 mt-8 text-sm text-gray-300">
          <span>Fully Bespoke Offers</span>
          <span>No hidden fees</span>
          <span>Competitive price guarantee</span>
        </div>
      </section>

      {/* GETYOURGUIDE */}
      <section className="hidden md:block py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-[#232e4e]">
            Popular Experiences
          </h2>

          <div data-gyg-widget="auto" data-gyg-partner-id="P7B7GRH" />
        </div>
      </section>

      <Footer />

    </main>
  )
}