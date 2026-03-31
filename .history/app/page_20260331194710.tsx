"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"cars" | "flights" | "hotels" | "experiences">("cars");

  // Dropdown data (replace with Sanity later)
  const countries = [
    { name: "Spain", slug: "spain", cities: ["Barcelona", "Madrid", "Malaga"] },
    { name: "France", slug: "france", cities: ["Paris", "Nice", "Lyon"] },
    { name: "USA", slug: "united-states", cities: ["New York", "Los Angeles", "Miami"] },
    { name: "UAE", slug: "united-arab-emirates", cities: ["Dubai", "Abu Dhabi"] },
    { name: "Australia", slug: "australia", cities: ["Sydney", "Melbourne"] },
  ];

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");

  const handleCarSearch = () => {
    if (!selectedCountry || !selectedCity || !pickupDate || !dropoffDate) return;

    const affiliateCode = "YOURAFFILIATETOKEN";

    const url = `https://www.rentalcars.com/?affiliateCode=${affiliateCode}&preflocation=${encodeURIComponent(
      selectedCity
    )}&puDay=${pickupDate}&doDay=${dropoffDate}`;

    window.open(url, "_blank");
  };

  return (
    <main className="min-h-screen bg-white">

      {/* Tabs */}
      <div className="flex gap-6 border-b px-6 pt-6">
        {["cars", "flights", "hotels", "experiences"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-3 text-lg ${
              activeTab === tab ? "border-b-2 border-black font-semibold" : "text-gray-500"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Search Box */}
      <div className="p-6 max-w-2xl mx-auto space-y-4">

        {/* Country Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Country</label>
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setSelectedCity(""); // reset city when country changes
            }}
            className="w-full border p-3 rounded"
          >
            <option value="">Select a country</option>
            {countries.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* City Dropdown */}
        <div>
          <label className="block mb-1 font-medium">City</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full border p-3 rounded"
            disabled={!selectedCountry}
          >
            <option value="">Select a city</option>
            {selectedCountry &&
              countries
                .find((c) => c.slug === selectedCountry)
                ?.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
          </select>
        </div>

        {/* Cars Tab Fields */}
        {activeTab === "cars" && (
          <>
            <div>
              <label className="block mb-1 font-medium">Pickup Date</label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full border p-3 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Dropoff Date</label>
              <input
                type="date"
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                className="w-full border p-3 rounded"
              />
            </div>

            <button
              onClick={handleCarSearch}
              className="w-full bg-black text-white p-3 rounded mt-4"
            >
              Search Cars
            </button>
          </>
        )}

        {/* Placeholder Buttons for Other Tabs */}
        {activeTab === "flights" && (
          <button className="w-full bg-blue-600 text-white p-3 rounded mt-4">
            Search Flights
          </button>
        )}

        {activeTab === "hotels" && (
          <button className="w-full bg-green-600 text-white p-3 rounded mt-4">
            Search Hotels
          </button>
        )}

        {activeTab === "experiences" && (
          <button className="w-full bg-purple-600 text-white p-3 rounded mt-4">
            Search Experiences
          </button>
        )}
      </div>

      {/* KEEP EVERYTHING BELOW THIS COMMENT THE SAME */}
      {/* How It Works */}
      {/* How It Works */}
<section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{color: '#232e4e'}}>How It Works</h2>
          <p className="text-center text-gray-500 mb-12">Compare flights, hotels, and experiences around the world.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4" style={{backgroundColor: '#2f797c'}}>1</div>
              <h3 className="font-bold text-xl mb-2" style={{color: '#232e4e'}}>Search</h3>
              <p className="text-gray-500 leading-7">Find your destination and unlock thousands of experiences, compare flights, and hotels easily online.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4" style={{backgroundColor: '#2f797c'}}>2</div>
              <h3 className="font-bold text-xl mb-2" style={{color: '#232e4e'}}>Compare</h3>
              <p className="text-gray-500 leading-7">Browse results from the world's leading affiliates agencies.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4" style={{backgroundColor: '#2f797c'}}>3</div>
              <h3 className="font-bold text-xl mb-2" style={{color: '#232e4e'}}>Book</h3>
              <p className="text-gray-500 leading-7">Build your perfect package, book your flights and hotels, plus those all important excursions in one place.</p>
            </div>
          </div>
        </div>
      </section>

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
            <h3 className="font-bold text-lg mb-1" style={{color: '#232e4e'}}>Flexible Bookings</h3>
            <p className="text-gray-500 text-sm">Plans change - we get it</p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{backgroundColor: '#232e4e'}} className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold mb-1" style={{color: '#03989e'}}>500+</p>
            <p className="text-gray-300 text-sm">Hotels</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-1" style={{color: '#03989e'}}>100+</p>
            <p className="text-gray-300 text-sm">Countries Covered</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-1" style={{color: '#03989e'}}>1000+</p>
            <p className="text-gray-300 text-sm">Experiences to Browse</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-1" style={{color: '#03989e'}}>24/7</p>
            <p className="text-gray-300 text-sm">Customer Support</p>
          </div>
        </div>
      </section>

{/* Popular Destinations */}
<section className="py-16 px-6 bg-gray-50">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
      Popular Destinations
    </h2>
    <p className="text-center text-gray-500 mb-10">
      Some of our most searched destinations
    </p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { city: 'London', emoji: '🏙️', continent: 'europe', country: 'united-kingdom', slug: 'london' },
        { city: 'Manchester', emoji: '🐝', continent: 'europe', country: 'united-kingdom', slug: 'manchester' },
        { city: 'Edinburgh', emoji: '🏰', continent: 'europe', country: 'united-kingdom', slug: 'edinburgh' },
        { city: 'Barcelona', emoji: '⛪', continent: 'europe', country: 'spain', slug: 'barcelona' },
        { city: 'Delhi', emoji: '🕌', continent: 'asia', country: 'india', slug: 'delhi' },
        { city: 'New York', emoji: '🗽', continent: 'north-america', country: 'usa', slug: 'new-york' },
        { city: 'Orlando', emoji: '🎢', continent: 'north-america', country: 'usa', slug: 'orlando' },
        { city: 'Paris', emoji: '🗼', continent: 'europe', country: 'france', slug: 'paris' },
      ].map((dest) => (
        <a
          key={dest.city}
          href={`/locations/${dest.continent}/${dest.country}/${dest.slug}`}
          className="card text-center hover:shadow-xl transition cursor-pointer"
        >
          <div className="text-4xl mb-2">{dest.emoji}</div>
          <p className="font-semibold text-sm" style={{ color: '#232e4e' }}>
            {dest.city}
          </p>
          <p className="text-xs mt-1" style={{ color: '#2f797c' }}>
            Discover More
          </p>
        </a>
      ))}
    </div>

    <div className="text-center mt-8">
      <a href="/locations" className="btn-primary inline-block">
        View All Destinations
      </a>
    </div>
  </div>
</section>

      {/* Footer */}
      <Footer />

    </main>
  )
}