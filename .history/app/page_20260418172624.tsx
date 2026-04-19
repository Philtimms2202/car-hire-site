'use client'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Script from 'next/script'
import Image as NextImage from 'next/image';

import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import FlightSearch from '@/app/components/Search/FlightSearch'
import HotelSearch from '@/app/components/Search/HotelSearch'
import CarSearch from '@/app/components/Search/CarSearch'

import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'experiences' | 'flights' | 'hotels' | 'cars'>('flights')
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

  const destinations = [
    { city: 'London', emoji: '🏙️', continent: 'europe', country: 'united-kingdom', slug: 'london' },
    { city: 'Manchester', emoji: '🐝', continent: 'europe', country: 'united-kingdom', slug: 'manchester' },
    { city: 'Edinburgh', emoji: '🏰', continent: 'europe', country: 'united-kingdom', slug: 'edinburgh' },
    { city: 'Barcelona', emoji: '⛪', continent: 'europe', country: 'spain', slug: 'barcelona' },
    { city: 'Delhi', emoji: '🕌', continent: 'asia', country: 'india', slug: 'delhi' },
    { city: 'New York', emoji: '🗽', continent: 'north-america', country: 'usa', slug: 'new-york' },
    { city: 'Orlando', emoji: '🎢', continent: 'north-america', country: 'usa', slug: 'orlando' },
    { city: 'Paris', emoji: '🗼', continent: 'europe', country: 'france', slug: 'paris' },
  ]

  return (
    <main className="min-h-screen bg-white">

      <Navbar />

      <Script
        src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
        data-gyg-partner-id="P7B7GRH"
        strategy="afterInteractive"
      />

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden text-white py-24 px-6 text-center"
      >
        {/* Unsplash background image */}
        <NextImage
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80"
          alt="Travel destination"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Dark overlay so text stays legible */}
        <div className="absolute inset-0 bg-[#232e4e]/70 z-0" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
            Timms Travel
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Compare Flights, Hotels, Experiences & More!
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto mb-10">
            Choose from hundreds of destinations around the world. No hidden fees, live prices and everything in one place.
          </p>

          <div className="flex justify-center gap-1 mb-6 bg-white/10 rounded-2xl p-1 max-w-sm mx-auto">
            {(['flights', 'hotels', 'experiences', 'cars'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-white text-[#232e4e] shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

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

          <div className="flex justify-center gap-8 mt-8 text-sm text-gray-300">
            <span>Fully Bespoke Offers</span>
            <span>No hidden fees</span>
            <span>Competitive price guarantee</span>
          </div>
        </div>
      </section>

      {/* ── CAR SEARCH RESULTS ── */}
      {searched && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8" style={{ color: '#232e4e' }}>
              {loading ? 'Finding the best deals...' : `Available Cars in ${pickupLocation}`}
            </h2>
            {loading ? (
              <div className="text-center py-16 text-gray-400 text-lg">Searching for the best deals...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.map((car) => (
                  <div key={car.id} className="card">
                    <div className="rounded-xl mb-4 h-40 flex items-center justify-center text-6xl" style={{ backgroundColor: '#eff6ff' }}>
                      {car.image}
                    </div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>{car.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-2xl font-bold" style={{ color: '#232e4e' }}>{car.price}</span>
                      <button className="btn-primary text-sm px-4 py-2">Book Now</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── WHAT WE OFFER ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Everything in one place</p>
            <h2 className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              One platform. Every part of your trip.
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
              Timms Travel brings flights, hotels, experiences and car hire together so you can plan your entire journey without switching between a dozen different websites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                emoji: '✈️',
                title: 'Flights',
                href: '/flights',
                color: '#232e4e',
                bg: '#232e4e12',
                body: 'Search and compare flights to hundreds of destinations. Whether you want the cheapest fare or the most convenient route, we surface the options that matter.',
              },
              {
                emoji: '🏨',
                title: 'Hotels',
                href: '/hotels',
                color: '#03989e',
                bg: '#03989e12',
                body: 'From five-star luxury to smart budget stays, browse curated hotel picks across every major destination -with live prices and no booking fees.',
              },
              {
                emoji: '🎟️',
                title: 'Experiences',
                href: '/experiences',
                color: '#b8860b',
                bg: '#b8860b12',
                body: 'Tours, day trips, food tastings, skip-the-line tickets and local adventures. The best experiences at your destination, handpicked and ready to book.',
              },
              {
                emoji: '🚗',
                title: 'Car Hire',
                href: '/car-hire',
                color: '#5a7a52',
                bg: '#5a7a5212',
                body: 'Compare rental cars from leading providers worldwide. Pick up at the airport or in the city -flexibility built in from the start.',
              },
            ].map(({ emoji, title, href, color, bg, body }) => (
              <a
                key={title}
                href={href}
                className="group rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all"
                style={{ backgroundColor: bg }}
              >
                <div className="text-3xl mb-4">{emoji}</div>
                <h3 className="font-bold text-lg mb-2 group-hover:underline" style={{ color }}>{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                <span className="mt-4 inline-block text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>
                  Explore {title} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR EXPERIENCES (GetYourGuide widget) ── */}
      {!searched && (
        <section className="hidden md:block py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Hand picked</p>
              <h2 className="text-3xl font-bold" style={{ color: '#232e4e' }}>
                Popular Experiences
              </h2>
              <p className="text-gray-500 mt-2">
                Top rated tours and activities from destinations around the world.
              </p>
            </div>
            <div data-gyg-widget="auto" data-gyg-partner-id="P7B7GRH"></div>
            <div className="text-center mt-8">
              <a
                href="/experiences"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 shadow-md"
                style={{ backgroundColor: '#03989e' }}
              >
                Browse All Experiences →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Simple process</p>
            <h2 className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              How It Works
            </h2>
            <p className="text-center text-gray-500 mt-2">
              From first search to final booking in three easy steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                n: 1,
                title: 'Search',
                text: 'Type in your destination and travel dates. Instantly unlock thousands of flights, hotels, experiences and car hire options from trusted providers around the world.',
              },
              {
                n: 2,
                title: 'Compare',
                text: "Browse results side by side from the world's leading travel providers. Filter by price, rating or type so you can find exactly what suits your trip and budget.",
              },
              {
                n: 3,
                title: 'Book',
                text: 'Build your perfect trip and book with confidence. Flights, hotels, experiences and car hire all in one place -no juggling multiple websites or hidden charges at checkout.',
              },
            ].map(({ n, title, text }) => (
              <div key={n} className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4" style={{ backgroundColor: '#2f797c' }}>
                  {n}
                </div>
                <h3 className="font-bold text-xl mb-2" style={{ color: '#232e4e' }}>{title}</h3>
                <p className="text-gray-500 leading-7">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: '500+', label: 'Hotels' },
            { stat: '100+', label: 'Countries Covered' },
            { stat: '1,000+', label: 'Experiences to Browse' },
            { stat: '24/7', label: 'Customer Support' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-4xl font-bold mb-1" style={{ color: '#03989e' }}>{stat}</p>
              <p className="text-gray-300 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── POPULAR DESTINATIONS ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Explore</p>
            <h2 className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              Popular Destinations
            </h2>
            <p className="text-center text-gray-500 mt-2">
              Some of our most searched destinations -click to explore hotels, flights and more.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destinations.map((dest) => (
              <a
                key={dest.city}
                href={`/locations/${dest.continent}/${dest.country}/${dest.slug}`}
                className="card text-center hover:shadow-xl transition cursor-pointer"
              >
                <div className="text-4xl mb-2">{dest.emoji}</div>
                <p className="font-semibold text-sm" style={{ color: '#232e4e' }}>{dest.city}</p>
                <p className="text-xs mt-1" style={{ color: '#2f797c' }}>Discover More</p>
              </a>
            ))}
          </div>

          <div className="text-center mt-8">
            <a href="/locations/continents" className="btn-primary inline-block">View All Destinations</a>
          </div>
        </div>
      </section>

      {/* ── TRIP INSPIRATION ── */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Not sure where to go?</p>
            <h2 className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              Find your perfect trip
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              Browse by travel style and let us point you in the right direction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: '🌴',
                title: 'Sun & Beach',
                body: 'White sand, warm water and nothing on the agenda. From the Canaries to the Caribbean, we\'ll find you the right resort and the right room.',
                cta: 'Browse beach hotels',
                href: '/hotels',
              },
              {
                emoji: '🏛️',
                title: 'City Breaks',
                body: 'A long weekend in a great city is one of life\'s simple pleasures. Flights on Friday, back by Monday -with the best boutique hotels in between.',
                cta: 'Search city breaks',
                href: '/hotels',
              },
              {
                emoji: '🧗',
                title: 'Adventure & Outdoors',
                body: 'Trek, ski, dive or climb -the world\'s most thrilling destinations are closer than you think. We\'ll get you there and find you somewhere to sleep.',
                cta: 'Explore experiences',
                href: '/experiences',
              },
              {
                emoji: '🍽️',
                title: 'Food & Culture',
                body: 'Some trips are really just an excuse to eat well and see great art. Tokyo, Lisbon, Bologna -we know exactly where to send you.',
                cta: 'Discover destinations',
                href: '/locations/continents',
              },
              {
                emoji: '👨‍👩‍👧',
                title: 'Family Holidays',
                body: 'Keeping everyone happy is the hardest part of travel. We make it easier with family-friendly hotels, flexible flights and activities for all ages.',
                cta: 'Search family hotels',
                href: '/hotels',
              },
              {
                emoji: '💑',
                title: 'Couples & Romance',
                body: 'Honeymoons, anniversaries or just a trip you\'ll both remember. Boutique hotels, private tours and destinations made for two.',
                cta: 'Find romantic stays',
                href: '/hotels',
              },
            ].map(({ emoji, title, body, cta, href }) => (
              <a
                key={title}
                href={href}
                className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:border-teal-200 hover:bg-teal-50/30 transition-all"
              >
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-[#03989e] transition-colors" style={{ color: '#232e4e' }}>
                  {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{body}</p>
                <span className="text-xs font-bold text-[#03989e] opacity-0 group-hover:opacity-100 transition-opacity">
                  {cta} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRAVEL TIPS STRIP ── */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-400 mb-1">Travel smarter</p>
            <h2 className="text-3xl font-bold text-white">Quick tips before you book</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                emoji: '📅',
                tip: 'Book flights 6–8 weeks out',
                detail: 'For most routes, this window offers the best balance of availability and price.',
              },
              {
                emoji: '🛂',
                tip: 'Check your passport validity',
                detail: 'Many countries require 6 months of validity beyond your return date. Check before you book.',
              },
              {
                emoji: '💳',
                tip: 'Tell your bank before you go',
                detail: 'Banks routinely block foreign transactions without prior notice. A quick call saves a lot of stress.',
              },
              {
                emoji: '🧾',
                tip: 'Download everything offline',
                detail: 'Hotel confirmations, boarding passes, maps. Airport Wi-Fi is never as reliable as it should be.',
              },
            ].map(({ emoji, tip, detail }) => (
              <div key={tip} className="rounded-2xl bg-white/10 border border-white/10 p-5">
                <div className="text-2xl mb-3">{emoji}</div>
                <h3 className="font-bold text-white text-sm mb-1">{tip}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Why Timms Travel</p>
            <h2 className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              Built for real travellers
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              We built Timms Travel because booking a trip should be straightforward -not a battle across a dozen different websites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
            {[
              { emoji: '🌍', title: 'Worldwide Locations', text: 'Available in 100+ countries -from capital cities to coastlines most sites don\'t bother covering.' },
              { emoji: '💰', title: 'Competitive Pricing', text: 'We compare all major providers in real time so you\'re always seeing the best available price, not a padded one.' },
              { emoji: '🛡️', title: 'Flexible Bookings', text: 'Plans change and we get it. We work with providers who offer real flexibility -not fine print that traps you.' },
            ].map(({ emoji, title, text }) => (
              <div key={title}>
                <div className="text-4xl mb-3">{emoji}</div>
                <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 md:p-10 max-w-4xl mx-auto">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
              <p>
                Timms Travel was built in the United Kingdom with one goal in mind: making travel planning genuinely simple. Too many booking platforms bury the best deals behind endless upsells, confusing filters and prices that look great until checkout. We do things differently.
              </p>
              <p>
                Whether you are searching for a last-minute city break, comparing hotel options for a family holiday or looking for something to do when you land, Timms Travel gives you honest results from trusted providers -all in one place.
              </p>
              <p>
                We partner with Expedia, GetYourGuide and other leading travel companies to bring you live availability and genuine prices. No markup, no hidden platform fees. What you see is what you pay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HUB LINKS ── */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Explore further</p>
            <h2 className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              Dive into a dedicated hub
            </h2>
            <p className="text-gray-500 mt-2">
              Each hub has curated picks, travel guides and deep search tools for that category.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                href: '/hotels',
                emoji: '🏨',
                title: 'Hotels Hub',
                body: 'Curated hotels by city, best-time-to-visit guides, hotel type explainers and a full packing checklist. The most complete hotel planning resource we\'ve built.',
                color: '#03989e',
              },
              {
                href: '/flights',
                emoji: '✈️',
                title: 'Flights Hub',
                body: 'Search flexible dates, compare routes and find the cheapest way to reach your destination. Tips on when to book and which airports to use.',
                color: '#232e4e',
              },
              {
                href: '/experiences',
                emoji: '🎟️',
                title: 'Experiences Hub',
                body: 'Thousands of tours, activities and skip-the-line tickets. Searchable by destination and category so you find the right thing fast.',
                color: '#b8860b',
              },
              {
                href: '/car-hire',
                emoji: '🚗',
                title: 'Car Hire Hub',
                body: 'Compare rental cars across providers. Filter by car type, pickup location and budget. No surprise fees at the counter.',
                color: '#5a7a52',
              },
            ].map(({ href, emoji, title, body, color }) => (
              <a
                key={title}
                href={href}
                className="group flex items-start gap-5 rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-lg transition-all"
              >
                <div
                  className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${color}15` }}
                >
                  {emoji}
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1 group-hover:underline" style={{ color }}>
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                  <span className="mt-2 inline-block text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>
                    Visit hub →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />

    </main>
  )
}