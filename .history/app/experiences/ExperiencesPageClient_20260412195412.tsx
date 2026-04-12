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

const buildGygUrl = (path: string) => {
  // Ensure no trailing slash at end of path
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
// DATA (unchanged)
// -----------------------------
const categories: Category[] = [
  { label: 'All Experiences', value: 'all', emoji: '🌍' },
  { label: 'Tours', value: 'tours', emoji: '🗺️' },
  { label: 'Food & Drink', value: 'food', emoji: '🍷' },
  { label: 'Adventure', value: 'adventure', emoji: '🧗' },
  { label: 'Culture', value: 'culture', emoji: '🏛️' },
  { label: 'Water Sports', value: 'water', emoji: '🌊' },
  { label: 'Day Trips', value: 'daytrips', emoji: '🚌' },
]

// experiences array unchanged...

const whyItems = [
  { emoji: '🎟️', title: 'Skip the Queues', body: "Guaranteed entrance to the world's most popular attractions." },
  { emoji: '💬', title: 'Expert Local Guides', body: 'Vetted, passionate guides who bring every destination to life.' },
  { emoji: '🔄', title: 'Free Cancellation', body: 'Most experiences offer free cancellation up to 24 hours before. Book worry-free.' },
  { emoji: '⭐', title: 'Millions of Reviews', body: 'Every experience is rated by real travellers so you know exactly what to expect.' },
]

// -----------------------------
// STAR RATING
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
// PAGE
// -----------------------------
export default function ExperiencesPage() {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'experiences' | 'cars'>('experiences')
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = experiences.filter(exp => {
    const matchCat = activeCategory === 'all' || exp.category === activeCategory
    const matchSearch =
      !search ||
      exp.title.toLowerCase().includes(search.toLowerCase()) ||
      exp.location.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO, SEARCH, TABS unchanged */}

      {/* EXPERIENCE LISTINGS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Featured Experiences
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Search, filter by category, or browse our hand-picked highlights below.
          </p>

          {/* SEARCH + FILTER ROW unchanged */}

          <p className="text-sm text-gray-400 mb-6">
            {filtered.length} experience{filtered.length !== 1 ? 's' : ''} found
          </p>

          {/* CARD GRID */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(exp => (
                <div key={exp.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full" style={{ backgroundColor: '#232e4e' }}>
                      {exp.badge}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#232e4e' }}>
                      📍 {exp.location}
                    </p>
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">{exp.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">⏱ {exp.duration}</p>

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

      {/* WHY BOOK, BOTTOM CTA unchanged */}

      <Footer />
    </main>
  )
}