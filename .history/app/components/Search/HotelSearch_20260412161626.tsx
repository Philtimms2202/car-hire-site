'use client'

import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HotelSearch from '@/app/components/Search/HotelSearch'
import FlightSearch from '@/app/components/Search/FlightSearch'
import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import CarSearch from '@/app/components/Search/CarSearch'
import airports from '@/data/airports.json'

// ---------------------------------------------
// TYPES (unchanged)
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
// AFFILIATE CONSTANTS (unchanged)
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
// CURATED HOTELS (UNCHANGED)
// ---------------------------------------------
const curatedHotels: Record<string, Hotel[]> = {
  London: [
    {
      name: 'The Ritz London',
      type: 'Luxury',
      area: 'Mayfair',
      description: 'Iconic five star hotel overlooking Green Park.',
      city: 'London',
      country: 'United Kingdom',
      expediaUrl: buildHotelUrl('The Ritz London', 'United Kingdom'),
    },
  ],
}

// ---------------------------------------------
// PAGE
// ---------------------------------------------
export default function HotelsPageClient() {

  // ✅ TAB STATE (ADDED - SAME AS FLIGHTS PAGE)
  const [activeTab, setActiveTab] =
    useState<'flights' | 'hotels' | 'experiences' | 'cars'>('hotels')

  const [selectedCity, setSelectedCity] = React.useState<CityOption>({
    city: 'London',
    country: 'United Kingdom',
  })

  const hotels =
    curatedHotels[selectedCity.city] ?? []

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

        <p className="text-base md:text-lg mb-6 text-gray-300 max-w-xl mx-auto">
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

        {/* SEARCH AREA (UNCHANGED STRUCTURE) */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
          {activeTab === 'flights' && <FlightSearch />}
          {activeTab === 'hotels' && <HotelSearch />}
          {activeTab === 'experiences' && <ExperienceSearch />}
          {activeTab === 'cars' && <CarSearch />}
        </div>
      </section>

      {/* SEARCH + RESULTS (UNCHANGED) */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mt-10 mb-2"
            style={{ color: '#232e4e' }}
          >
            Hotels in {selectedCity.city}
          </h2>

          <div className="space-y-3">
            {hotels.map(hotel => (
              <div key={hotel.name}>
                <a
                  href={hotel.expediaUrl}
                  className="block p-4 bg-white rounded-xl shadow-sm hover:shadow-md"
                >
                  <p className="font-bold">{hotel.name}</p>
                  <p className="text-sm text-gray-500">{hotel.type}</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}