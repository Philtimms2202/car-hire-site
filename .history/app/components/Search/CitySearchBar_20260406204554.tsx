"use client"

import { useState } from "react"
import ExperienceSearch from "./ExperienceSearch"
import FlightSearch from "./FlightSearch"
import HotelSearch from "./HotelSearch"
import CarSearch from "./CarSearch"

export default function CitySearchBar({ defaultCity }: { defaultCity: string }) {
  const [activeTab, setActiveTab] = useState<"experiences" | "flights" | "hotels" | "cars">(
    "experiences"
  )

  // Car search state
  const [pickupLocation, setPickupLocation] = useState(defaultCity)
  const [pickupDate, setPickupDate] = useState("")
  const [dropoffDate, setDropoffDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const handleCarSearch = async () => {
    setLoading(true)
    setSearched(true)

    // Simulated API delay
    setTimeout(() => {
      setResults([
        { id: 1, name: "Economy Car", price: "£32/day", image: "🚗" },
        { id: 2, name: "SUV", price: "£55/day", image: "🚙" },
        { id: 3, name: "Luxury", price: "£120/day", image: "🏎️" }
      ])
      setLoading(false)
    }, 1200)
  }

  return (
    <>
      {/* TAB MENU */}
      <div className="flex justify-center gap-6 mb-8">
        {["experiences", "flights", "hotels", "cars"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-2 text-lg font-medium ${
              activeTab === tab ? "border-b-2 border-white" : "text-gray-400"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* SEARCH AREA */}
      <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
        {activeTab === "experiences" && (
          <ExperienceSearch defaultLocation={defaultCity} />
        )}

        {activeTab === "flights" && (
          <FlightSearch defaultLocation={defaultCity} />
        )}

        {activeTab === "hotels" && (
          <HotelSearch defaultLocation={defaultCity} />
        )}

        {activeTab === "cars" && (
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

      {/* TRUST INDICATORS */}
      <div className="flex justify-center gap-8 mt-8 text-sm text-gray-300">
        <span>✓ Fully Bespoke Offers</span>
        <span>✓ No hidden fees</span>
        <span>✓ Best price guarantee</span>
      </div>

      {/* CAR RESULTS */}
      {activeTab === "cars" && searched && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-3xl font-bold mb-8"
              style={{ color: "#232e4e" }}
            >
              {loading
                ? "Finding the best deals..."
                : `Available Cars in ${pickupLocation}`}
            </h2>

            {loading ? (
              <div className="text-center py-16 text-gray-400 text-lg">
                Searching for the best deals...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.map((car) => (
                  <div key={car.id} className="card">
                    <div
                      className="rounded-xl mb-4 h-40 flex items-center justify-center text-6xl"
                      style={{ backgroundColor: "#eff6ff" }}
                    >
                      {car.image}
                    </div>

                    <h3
                      className="font-bold text-lg mb-1"
                      style={{ color: "#232e4e" }}
                    >
                      {car.name}
                    </h3>

                    <div className="flex items-center justify-between mt-3">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: "#232e4e" }}
                      >
                        {car.price}
                      </span>
                      <button className="btn-primary text-sm px-4 py-2">
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}