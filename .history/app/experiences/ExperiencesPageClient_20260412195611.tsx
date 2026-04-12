'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FlightSearch from '@/app/components/Search/FlightSearch'
import HotelSearch from '@/app/components/Search/HotelSearch'
import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import CarSearch from '@/app/components/Search/CarSearch'

// -----------------------------
// CONSTANTS
// -----------------------------
const GYG_PARTNER_ID = 'P7B7GRH'
const GYG_BASE = 'https://www.getyourguide.com'

// Fixed URL builder — remove trailing slash before query
const buildGygUrl = (path: string) => {
  const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path
  return `${GYG_BASE}${cleanPath}?partner_id=${GYG_PARTNER_ID}`
}

// -----------------------------
// TYPES
// -----------------------------
type Category = {
  label: string
  value: string
  emoji: string
}

type Experience = {
  id: number
  title: string
  location: string
  category: string
  duration: string
  rating: number
  reviews: number
  price: number
  badge: string
  gygPath: string
  image: string
}

// -----------------------------
// DATA
// -----------------------------
const categories: Category[] = [
  { label: 'All Experiences', value: 'all',       emoji: '🌍' },
  { label: 'Tours',           value: 'tours',     emoji: '🗺️' },
  { label: 'Food & Drink',    value: 'food',      emoji: '🍷' },
  { label: 'Adventure',       value: 'adventure', emoji: '🧗' },
  { label: 'Culture',         value: 'culture',   emoji: '🏛️' },
  { label: 'Water Sports',    value: 'water',     emoji: '🌊' },
  { label: 'Day Trips',       value: 'daytrips',  emoji: '🚌' },
]

const experiences: Experience[] = [
  {
    id: 1,
    title: 'Colosseum Skip-the-Line Tour',
    location: 'Rome, Italy',
    category: 'culture',
    duration: '3 hours',
    rating: 4.9,
    reviews: 12840,
    price: 49,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
    gygPath: '/en-gb/colosseum-l2619/colosseum-skip-the-line-guided-tour-t33523',
  },
  {
    id: 2,
    title: 'Paris Seine River Cruise',
    location: 'Paris, France',
    category: 'tours',
    duration: '1 hour',
    rating: 4.8,
    reviews: 9320,
    price: 19,
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',
    gygPath: '/paris-l16/seine-river-cruise-t3776',
  },
  {
    id: 3,
    title: 'Barcelona Tapas & Wine Night Tour',
    location: 'Barcelona, Spain',
    category: 'food',
    duration: '3.5 hours',
    rating: 4.9,
    reviews: 5210,
    price: 79,
    badge: 'Fan Favourite',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
    gygPath: '/barcelona-l45/tapas-wine-tour-t234732',
  },
  {
    id: 4,
    title: 'Queenstown Bungee Jump',
    location: 'Queenstown, New Zealand',
    category: 'adventure',
    duration: '2 hours',
    rating: 4.9,
    reviews: 3870,
    price: 195,
    badge: 'Thrilling',
    image: 'https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=600&q=80',
    gygPath: '/queenstown-l668/ledge-bungy-jump-t37649',
  },
  {
    id: 5,
    title: 'Santorini Sunset Sailing',
    location: 'Santorini, Greece',
    category: 'water',
    duration: '5 hours',
    rating: 4.8,
    reviews: 7640,
    price: 115,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80',
    gygPath: '/santorini-l91949/sunset-sailing-caldera-t63832',
  },
  {
    id: 6,
    title: 'Tokyo Tsukiji Market & Sushi Tour',
    location: 'Tokyo, Japan',
    category: 'food',
    duration: '4 hours',
    rating: 4.9,
    reviews: 4190,
    price: 89,
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
    gygPath: '/tokyo-l193/tsukiji-food-tour-t243890',
  },
  {
    id: 7,
    title: 'Machu Picchu Full Day Tour',
    location: 'Cusco, Peru',
    category: 'daytrips',
    duration: 'Full day',
    rating: 4.9,
    reviews: 6580,
    price: 135,
    badge: 'Iconic',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80',
    gygPath: '/cusco-l712/machu-picchu-guided-tour-t77832',
  },
  {
    id: 8,
    title: 'New York City Helicopter Tour',
    location: 'New York, USA',
    category: 'tours',
    duration: '15 minutes',
    rating: 4.8,
    reviews: 8100,
    price: 219,
    badge: 'Spectacular',
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80',
    gygPath: '/new-york-city-l805/helicopter-tour-t65478',
  },
  {
    id: 9,
    title: 'Pyramids of Giza Guided Tour',
    location: 'Cairo, Egypt',
    category: 'culture',
    duration: '6 hours',
    rating: 4.7,
    reviews: 5430,
    price: 65,
    badge: 'Must-Do',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&q=80',
    gygPath: '/cairo-l91/pyramids-giza-guided-tour-t38291',
  },
  {
    id: 10,
    title: 'Amalfi Coast Boat Trip',
    location: 'Amalfi, Italy',
    category: 'water',
    duration: '8 hours',
    rating: 4.9,
    reviews: 3210,
    price: 98,
    badge: 'Stunning',
    image: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=600&q=80',
    gygPath: '/amalfi-l4249/amalfi-coast-boat-trip-t51293',
  },
  {
    id: 11,
    title: 'Dubai Desert Safari at Sunset',
    location: 'Dubai, UAE',
    category: 'adventure',
    duration: '6 hours',
    rating: 4.8,
    reviews: 11200,
    price: 55,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    gygPath: '/dubai-l987/desert-safari-sunset-t18472',
  },
  {
    id: 12,
    title: 'Prague Old Town & Castle Walk',
    location: 'Prague, Czech Republic',
    category: 'daytrips',
    duration: '3 hours',
    rating: 4.7,
    reviews: 4870,
    price: 22,
    badge: 'Great Value',
    image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80',
    gygPath: '/prague-l1121/old-town-castle-walking-tour-t29183',
  },
]

const whyItems = [
  { emoji: '🎟️', title: 'Skip the Queues',    body: "Guaranteed entrance to the world's most popular attractions." },
  { emoji: '💬', title: 'Expert Local Guides', body: 'Vetted, passionate guides who bring every destination to life.' },
  { emoji: '🔄', title: 'Free Cancellation',   body: 'Most experiences offer free cancellation up to 24 hours before. Book worry-free.' },
  { emoji: '⭐', title: 'Millions of Reviews', body: 'Every experience is rated by real travellers so you know exactly what to expect.' },
]

// -----------------------------
// STAR RATING
// -----------------------------
function Stars({ rating }: { rating: number }) {
  const full  = Math.floor(rating)
  const empty = 5 - full
  return (
    <span className="text-sm">
      <span style={{ color: '#f5a623' }}>{'★'.repeat(full)}</span>
      <span style={{ color: '#d1d5db' }}>{'★'.repeat(empty)}</span>
    </span>
  )
}

// -----------------------------
// PAGE
// -----------------------------
export default function ExperiencesPage() {
  const [activeTab, setActiveTab]           = useState<'flights' | 'hotels' | 'experiences' | 'cars'>('experiences')
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch]                 = useState('')

  const filtered = experiences.filter(exp => {
    const matchCat    = activeCategory === 'all' || exp.category === activeCategory
    const matchSearch = !search ||
      exp.title.toLowerCase().includes(search.toLowerCase()) ||
      exp.location.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-24 px-6 text-center"
      >
        <h1 className="text-5xl font-bold mb-4">
          Experiences Worth Remembering
        </h1>
        <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
          Hand-picked tours, activities and adventures from the world's leading experiences platform.
        </p>

        {/* TAB MENU — mirrors flights page exactly */}
        <div className="flex justify-center gap-6 mb-8">
          {(['flights', 'hotels', 'experiences', 'cars'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-lg font-medium transition-colors ${
                activeTab === tab ? 'border-b-2 border-white' : 'text-gray-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* SEARCH BOX */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
          {activeTab === 'flights'     && <FlightSearch />}
          {activeTab === 'hotels'      && <HotelSearch />}
          {activeTab === 'experiences' && <ExperienceSearch />}
          {activeTab === 'cars'        && <CarSearch />}
        </div>

        {/* TRUST STRIP */}
        <div className="mt-8 flex justify-center gap-8 flex-wrap text-gray-400 text-sm">
          <span>✓ Guaranteed Entry</span>
          <span>✓ Instant confirmation</span>
          <span>✓ 70,000+ activities worldwide</span>
        </div>
      </section>

      {/* ── EXPERIENCE LISTINGS ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">

          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
            Featured Experiences
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Search, filter by category, or browse our hand-picked highlights below.
          </p>

          {/* SEARCH + FILTER ROW */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
            <input
              type="text"
              placeholder="Search destinations or activities…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm text-black bg-white w-full sm:max-w-xs"
            />

            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    activeCategory === cat.value
                      ? 'text-white border-transparent'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                  style={
                    activeCategory === cat.value
                      ? { backgroundColor: '#232e4e', borderColor: '#232e4e' }
                      : {}
                  }
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            {filtered.length} experience{filtered.length !== 1 ? 's' : ''} found
          </p>

          {/* CARD GRID */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(exp => (
                <div
                  key={exp.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                    <span
                      className="absolute top-3 left-3 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full"
                      style={{ backgroundColor: '#232e4e' }}
                    >
                      {exp.badge}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-1"
                      style={{ color: '#232e4e' }}
                    >
                      📍 {exp.location}
                    </p>
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">
                      {exp.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">⏱ {exp.duration}</p>

                    {/* Rating + Price */}
                    <div className="flex items-center justify-between mb-4 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <Stars rating={exp.rating} />
                        <span className="text-sm font-bold text-gray-800">{exp.rating}</span>
                        <span className="text-xs text-gray-400">({exp.reviews.toLocaleString()})</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs text-gray-400">from</span>
                        <span className="text-xl font-extrabold" style={{ color: '#232e4e' }}>
                          £{exp.price}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <a
                      href={buildGygUrl(exp.gygPath)}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="block w-full text-center text-white text-sm font-semibold py-3 rounded-xl transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#232e4e' }}
                    >
                      Book on GetYourGuide →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🗺️</p>
              <p className="text-xl font-semibold text-gray-600 mb-1">No experiences found</p>
              <p className="text-sm">Try a different search term or category.</p>
            </div>
          )}

          {/* BROWSE ALL LINK */}
          <div className="text-center mt-12">
            <a
              href={`${GYG_BASE}/?partner_id=${GYG_PARTNER_ID}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-block text-white font-semibold px-8 py-4 rounded-full transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#232e4e' }}
            >
              Browse All 70,000+ Experiences on GetYourGuide →
            </a>
          </div>
        </div>
      </section>

      {/* ── WHY BOOK ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
            Why Book With Us?
          </h2>
          <p className="text-center text-gray-500 mb-10">
            We partner with GetYourGuide so you get the very best.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyItems.map(item => (
              <div key={item.title} className="text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                  style={{ backgroundColor: '#eef0f7' }}
                >
                  {item.emoji}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section
        className="py-20 px-6 text-center text-white"
        style={{ backgroundColor: '#232e4e' }}
      >
        <h2 className="text-4xl font-bold mb-3">Ready to Explore?</h2>
        <p className="text-gray-300 text-lg max-w-md mx-auto mb-8">
          Browse over 70,000 experiences across 170+ countries, all bookable in minutes.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href={`${GYG_BASE}/?partner_id=${GYG_PARTNER_ID}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="font-bold px-8 py-4 rounded-full transition-opacity hover:opacity-90 text-sm"
            style={{ backgroundColor: '#ffffff', color: '#232e4e' }}
          >
            Browse All Experiences
          </a>
          <a
            href="/flights"
            className="border border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-gray-900 transition-colors text-sm"
          >
            Search Flights Instead
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}