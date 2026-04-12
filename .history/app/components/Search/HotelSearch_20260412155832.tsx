'use client'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
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

        {/* ✅ TABS RESTORED */}
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

        {/* SEARCH BOX (UNCHANGED UI STRUCTURE) */}
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

      {/* FEATURED EXPERIENCES */}
      {!searched && (
        <section className="hidden md:block py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-2 text-[#232e4e]">
              Popular Experiences
            </h2>

            <p className="text-gray-500 mb-10">
              Hand picked deals from top destinations
            </p>

            <div
              data-gyg-widget="auto"
              data-gyg-partner-id="P7B7GRH"
            />
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2 text-[#232e4e]">
            How It Works
          </h2>

          <p className="text-gray-500 mb-12">
            Compare flights, hotels, and experiences around the world.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                n: 1,
                t: 'Search',
                d: 'Find destinations, flights, hotels and experiences.'
              },
              {
                n: 2,
                t: 'Compare',
                d: 'Browse results from trusted travel providers.'
              },
              {
                n: 3,
                t: 'Book',
                d: 'Complete your trip in one seamless journey.'
              }
            ].map((x) => (
              <div key={x.n}>
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#2f797c] text-white flex items-center justify-center font-bold text-xl">
                  {x.n}
                </div>
                <h3 className="font-bold text-xl text-[#232e4e] mb-2">
                  {x.t}
                </h3>
                <p className="text-gray-500">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}