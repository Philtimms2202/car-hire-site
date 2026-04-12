'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// -----------------------------
// CONSTANTS
// -----------------------------
const GYG_PARTNER_ID = 'P7B7GRH'
const GYG_BASE = 'https://www.getyourguide.com'

// -----------------------------
// TYPES
// -----------------------------
type Experience = {
  id: number
  title: string
  location: string
  duration: string
  rating: number
  reviews: number
  price: number
  badge: string
  image: string
  gygPath: string
}

const experiences: Experience[] = [
  {
    id: 1,
    title: 'Colosseum Skip-the-Line Tour',
    location: 'Rome, Italy',
    duration: '3 hours',
    rating: 4.9,
    reviews: 12840,
    price: 49,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
    gygPath: '/en-gb/colosseum-l2619/',
  },
  {
    id: 2,
    title: 'Paris Seine River Cruise',
    location: 'Paris, France',
    duration: '1 hour',
    rating: 4.8,
    reviews: 9320,
    price: 19,
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',
    gygPath: '/en-gb/seine-river-l2601/',
  },
  {
    id: 3,
    title: 'Barcelona Tapas & Wine Night Tour',
    location: 'Barcelona, Spain',
    duration: '3.5 hours',
    rating: 4.9,
    reviews: 5210,
    price: 79,
    badge: 'Fan Favourite',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
    gygPath: '/en-gb/s/?q=barcelona+tapas+and+wine&searchSource=8&src=search_bar&adults=1',
  },
  {
    id: 4,
    title: 'Pyramids of Giza Guided Tour',
    location: 'Cairo, Egypt',
    duration: '6 hours',
    rating: 4.7,
    reviews: 5430,
    price: 65,
    badge: 'Must-Do',
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0',
    gygPath: '/en-gb/pyramids-of-giza-l4184/?adults=1&searchSource=8',
  },
]

// -----------------------------
// STAR RATING COMPONENT
// -----------------------------
function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const empty = 5 - full
  return (
    <span className="text-sm">
      <span style={{ color: '#f5a623' }}>{'★'.repeat(full)}</span>
      <span style={{ color: '#d1d5db' }}>{'★'.repeat(empty)}</span>
    </span>
  )
}

// -----------------------------
// HELPER TO BUILD GYG URL
// -----------------------------
const buildGygUrl = (path: string) => {
  const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path
  return `${GYG_BASE}${cleanPath}?partner_id=${GYG_PARTNER_ID}`
}

// -----------------------------
// PAGE COMPONENT
// -----------------------------
export default function ExperiencesPage() {
  const [search, setSearch] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return
    const searchUrl = `${GYG_BASE}/en-gb/s/?q=${encodeURIComponent(search)}&partner_id=${GYG_PARTNER_ID}`
    window.open(searchUrl, '_blank', 'noopener,noreferrer')
  }

  const whyItems = [
    { emoji: '🎟️', title: 'Skip the Queues', body: "Guaranteed entrance to the world's most popular attractions." },
    { emoji: '💬', title: 'Expert Local Guides', body: 'Vetted, passionate guides who bring every destination to life.' },
    { emoji: '🔄', title: 'Free Cancellation', body: 'Most experiences offer free cancellation up to 24 hours before. Book worry-free.' },
    { emoji: '⭐', title: 'Millions of Reviews', body: 'Every experience is rated by real travellers so you know exactly what to expect.' },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Experiences Worth Remembering</h1>
        <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
          Hand-picked tours, activities and adventures from the world's leading experiences platform.
        </p>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Search activities, cities, countries…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 shadow-sm w-full text-black"
          />
          <button
            type="submit"
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Search
          </button>
        </form>
      </section>

      {/* FEATURED EXPERIENCES */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Experiences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map(exp => (
              <div key={exp.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-[#232e4e]">
                    {exp.badge}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-[#232e4e]">📍 {exp.location}</p>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{exp.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">⏱ {exp.duration}</p>
                  <div className="flex items-center justify-between mb-4 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <Stars rating={exp.rating} />
                      <span className="text-sm font-bold text-gray-800">{exp.rating}</span>
                      <span className="text-xs text-gray-400">({exp.reviews.toLocaleString()})</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs text-gray-400">from</span>
                      <span className="text-xl font-extrabold text-[#232e4e]">£{exp.price}</span>
                    </div>
                  </div>
                  <a
                    href={buildGygUrl(exp.gygPath)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="block w-full text-center text-white text-sm font-semibold py-3 rounded-xl transition-opacity hover:opacity-90 bg-[#232e4e]"
                  >
                    Book on GetYourGuide →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY BOOK */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#232e4e] mb-2">Why Book With Us?</h2>
          <p className="text-gray-500 mb-10">We partner with GetYourGuide so you get the very best.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyItems.map(item => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 bg-[#eef0f7]">{item.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 px-6 text-center text-white bg-[#232e4e]">
        <h2 className="text-4xl font-bold mb-3">Ready to Explore?</h2>
        <p className="text-gray-300 text-lg max-w-md mx-auto mb-8">
          Browse over 70,000 experiences across 170+ countries, all bookable in minutes.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href={`${GYG_BASE}/?partner_id=${GYG_PARTNER_ID}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="font-bold px-8 py-4 rounded-full transition-opacity hover:opacity-90 text-sm bg-white text-[#232e4e]"
          >
            Browse All Experiences
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}