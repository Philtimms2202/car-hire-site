'use client'

import React from 'react'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HotelSearch from '@/app/components/Search/HotelSearch'
import FlightSearch from '@/app/components/Search/FlightSearch'
import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import CarSearch from '@/app/components/Search/CarSearch'
import airports from '@/data/airports.json'

// ---------------------------------------------
// TYPES
// ---------------------------------------------
type Hotel = {
  name: string
  type: string
  area?: string
  description?: string
  city: string
  country?: string
  expediaUrl: string
}

type CityOption = {
  city: string
  country: string
}

type AirportRecord = {
  city: string
  country: string
}

// ---------------------------------------------
// AFFILIATE CONSTANTS
// ---------------------------------------------
const BASE_URL = 'https://www.expedia.co.uk'
const AFFILIATE_ID = 'UK.DIRECT.PHG.1011l428377'

const buildHotelUrl = (city: string, country?: string) => {
  const params = new URLSearchParams()
  params.set('affcid', AFFILIATE_ID)
  params.set('destination', country ? `${city}, ${country}` : city)
  return `${BASE_URL}/Hotel-Search?${params.toString()}`
}

// ---------------------------------------------
// PAGE
// ---------------------------------------------
export default function HotelsPageClient() {

  // ✅ TAB STATE (FIXED)
  const [activeTab, setActiveTab] =
    useState<'flights' | 'hotels' | 'experiences' | 'cars'>('hotels')

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Perfect Stay
        </h1>

        <p className="text-base md:text-lg mb-8 text-gray-300 max-w-xl mx-auto">
          Search hotels in any city worldwide. Get started with your search today.
        </p>

        {/* ✅ TAB MENU (IDENTICAL TO FLIGHTS PAGE) */}
        <div className="flex justify-center gap-6 mb-8">
          {['flights', 'hotels', 'experiences', 'cars'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 text-lg font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-white'
                  : 'text-gray-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* SEARCH AREA (UNCHANGED) */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
          {activeTab === 'flights' && <FlightSearch />}
          {activeTab === 'hotels' && <HotelSearch />}
          {activeTab === 'experiences' && <ExperienceSearch />}
          {activeTab === 'cars' && <CarSearch />}
        </div>
      </section>

      <Footer />
    </main>
  )
}