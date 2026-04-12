'use client'

import Navbar from '../Navbar'
import Footer from '../Footer'
import Script from 'next/script'

import { useState } from 'react'

import FlightSearch from '@/app/components/Search/FlightSearch'
import HotelSearch from '@/app/components/Search/HotelSearch'
import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import CarSearch from '@/app/components/Search/CarSearch'

export default function Home() {
  const [activeTab, setActiveTab] =
    useState<'flights' | 'hotels' | 'experiences' | 'cars'>('flights')

  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [dropoffDate, setDropoffDate] = useState('')
  const [loading, setLoading] = useState(false)

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

        {/* TABS (RESTORED EXACTLY) */}
        <div className="flex justify-center gap-6 mb-8">
          {['flights', 'hotels', 'experiences', 'cars'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 text-lg font-medium transition ${
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
          {activeTab === 'hotels' && <HotelSearch />}
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

        {/* TRUST LINE */}
        <div className="flex justify-center gap-8 mt-8 text-sm text-gray-300">
          <span>Fully Bespoke Offers</span>
          <span>No hidden fees</span>
          <span>Competitive price guarantee</span>
        </div>
      </section>

      <Footer />

    </main>
  )
}