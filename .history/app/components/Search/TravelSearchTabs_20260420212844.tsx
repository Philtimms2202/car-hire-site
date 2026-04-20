'use client'

import { useState } from 'react'

import FlightSearch from './FlightSearch'
import HotelSearch from './HotelSearch'
import ExperienceSearch from './ExperienceSearch'
import CarSearch from './CarSearch'

export default function TravelSearchTabs() {
  const [activeTab, setActiveTab] =
    useState<'flights' | 'hotels' | 'experiences' | 'cars'>('flights')

  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [dropoffDate, setDropoffDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCarSearch = () => {
    // keep your existing logic or connect API later
  }

  return (
    <div>
      {/* Tabs */}
      <nav className="flex justify-center gap-1 mb-6 bg-white/10 rounded-2xl p-1 max-w-sm mx-auto">
        {(['flights', 'hotels', 'experiences', 'cars'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            aria-pressed={activeTab === tab}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl capitalize transition ${
              activeTab === tab
                ? 'bg-white text-[#232e4e] shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Panels */}
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
  )
}