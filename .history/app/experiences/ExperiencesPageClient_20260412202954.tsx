'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FlightSearch from '@/app/components/Search/FlightSearch'
import HotelSearch from '@/app/components/Search/HotelSearch'
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

// Example experiences — same as your existing data
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
    gygPath: '/en-gb/colosseum-l2619/',
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
    gygPath: '/en-gb/seine-river-l2601/',
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
    gygPath: '/en-gb/s/?q=barcelona+tapas+and+wine&searchSource=8&src=search_bar&adults=1',
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
    gygPath: '/en-gb/queenstown-l498/bungee-jumping-tc86/?adults=1&searchSource=8',
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
    gygPath: '/en-gb/s/?q=santorini+sunset+sailing&searchSource=8&src=search_bar&adults=1',
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
    gygPath: '/en-gb/s/?q=tokyo+tsukiji+market&searchSource=8&src=search_bar&adults=1',
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
    gygPath: '/en-gb/machu-picchu-l1570/?adults=1&searchSource=8',
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
    gygPath: '/en-gb/s/?q=NYC+helicopter+tour&searchSource=8&src=search_bar&adults=1',
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
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gygPath: '/en-gb/pyramids-of-giza-l4184/?adults=1&searchSource=8',
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
    gygPath: '/en-gb/s/?q=Almalfi+coast+boat+trip&searchSource=8&src=search_bar&adults=1',
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
    gygPath: '/en-gb/s/?q=dubai+desert+safari&searchSource=8&src=search_bar&adults=1',
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
    gygPath: '/en-gb/s/?q=prague+old+town&adults=1&searchSource=8',
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

  const filtered = experiences.filter(exp => activeCategory === 'all' || exp.category === activeCategory)

  // Opens GetYourGuide search in a new tab
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return
    const searchUrl = `${GYG_BASE}/en-gb/s/?q=${encodeURIComponent(search)}&partner_id=${GYG_PARTNER_ID}`
    window.open(searchUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Experiences Worth Remembering</h1>
        <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
          Hand-picked tours, activities and adventures from the world's leading experiences platform.
        </p>

        {/* TAB MENU */}
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
          {activeTab === 'experiences' && (
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search destinations, cities, or activities…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm text-black w-full sm:max-w-xs"
              />
              <button
                type="submit"
                className="bg-[#232e4e] text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Search
              </button>
            </form>
          )}
          {activeTab === 'cars' && <CarSearch />}
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

          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>Featured Experiences</h2>
          <p className="text-center text-gray-500 mb-8">
            Browse our hand-picked highlights below.
          </p>

          {/* CATEGORY FILTER */}
          <div className="flex gap-2 flex-wrap justify-center mb-6">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeCategory === cat.value
                    ? 'text-white border-transparent'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
                style={activeCategory === cat.value ? { backgroundColor: '#232e4e', borderColor