'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FlightSearch from '@/app/components/Search/FlightSearch'
import HotelSearch from '@/app/components/Search/HotelSearch'
import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import CarSearch from '@/app/components/Search/CarSearch'
import NextImage from 'next/image'

const GYG_PARTNER_ID = 'P7B7GRH'
const GYG_BASE = 'https://www.getyourguide.com'

const buildGygUrl = (path: string) => {
  const clean = path.endsWith('/') ? path.slice(0, -1) : path
  return `${GYG_BASE}${clean}?partner_id=${GYG_PARTNER_ID}`
}

const buildGygSearchUrl = (query: string) =>
  `${GYG_BASE}/en-gb/s/?q=${encodeURIComponent(query.trim())}&searchSource=8&src=search_bar&adults=1&partner_id=${GYG_PARTNER_ID}`

type Category = { label: string; value: string; emoji: string }
type Experience = {
  id: number; title: string; location: string; category: string; duration: string
  rating: number; reviews: number; price: number; badge: string; gygPath: string; image: string
}

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
  { id:1,  title:'Colosseum Skip-the-Line Tour',      location:'Rome, Italy',             category:'culture',   duration:'3 hours',    rating:4.9, reviews:12840, price:49,  badge:'Bestseller',    image:'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',                               gygPath:'/en-gb/colosseum-l2619/' },
  { id:2,  title:'Paris Seine River Cruise',          location:'Paris, France',           category:'tours',     duration:'1 hour',     rating:4.8, reviews:9320,  price:19,  badge:'Top Rated',     image:'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',                             gygPath:'/en-gb/seine-river-l2601/' },
  { id:3,  title:'Barcelona Tapas & Wine Night Tour', location:'Barcelona, Spain',        category:'food',      duration:'3.5 hours',  rating:4.9, reviews:5210,  price:79,  badge:'Fan Favourite', image:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',                               gygPath:'/en-gb/s/?q=barcelona+tapas+and+wine&searchSource=8&src=search_bar&adults=1' },
  { id:4,  title:'Queenstown Bungee Jump',            location:'Queenstown, NZ',          category:'adventure', duration:'2 hours',    rating:4.9, reviews:3870,  price:195, badge:'Thrilling',     image:'https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=600&q=80',                             gygPath:'/en-gb/queenstown-l498/bungee-jumping-tc86/?adults=1&searchSource=8' },
  { id:5,  title:'Santorini Sunset Sailing',          location:'Santorini, Greece',       category:'water',     duration:'5 hours',    rating:4.8, reviews:7640,  price:115, badge:'Bestseller',    image:'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80',                             gygPath:'/en-gb/s/?q=santorini+sunset+sailing&searchSource=8&src=search_bar&adults=1' },
  { id:6,  title:'Tokyo Tsukiji Market & Sushi Tour', location:'Tokyo, Japan',            category:'food',      duration:'4 hours',    rating:4.9, reviews:4190,  price:89,  badge:'Top Rated',     image:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',                             gygPath:'/en-gb/s/?q=tokyo+tsukiji+market&searchSource=8&src=search_bar&adults=1' },
  { id:7,  title:'Machu Picchu Full Day Tour',        location:'Cusco, Peru',             category:'daytrips',  duration:'Full day',   rating:4.9, reviews:6580,  price:135, badge:'Iconic',        image:'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80',                             gygPath:'/en-gb/machu-picchu-l1570/?adults=1&searchSource=8' },
  { id:8,  title:'New York City Helicopter Tour',     location:'New York, USA',           category:'tours',     duration:'15 minutes', rating:4.8, reviews:8100,  price:219, badge:'Spectacular',   image:'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80',                             gygPath:'/en-gb/s/?q=NYC+helicopter+tour&searchSource=8&src=search_bar&adults=1' },
  { id:9,  title:'Pyramids of Giza Guided Tour',      location:'Cairo, Egypt',            category:'culture',   duration:'6 hours',    rating:4.7, reviews:5430,  price:65,  badge:'Must-Do',       image:'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1740&auto=format&fit=crop',       gygPath:'/en-gb/pyramids-of-giza-l4184/?adults=1&searchSource=8' },
  { id:10, title:'Amalfi Coast Boat Trip',            location:'Amalfi, Italy',           category:'water',     duration:'8 hours',    rating:4.9, reviews:3210,  price:98,  badge:'Stunning',      image:'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=600&q=80',                             gygPath:'/en-gb/s/?q=Amalfi+coast+boat+trip&searchSource=8&src=search_bar&adults=1' },
  { id:11, title:'Dubai Desert Safari at Sunset',     location:'Dubai, UAE',              category:'adventure', duration:'6 hours',    rating:4.8, reviews:11200, price:55,  badge:'Bestseller',    image:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',                             gygPath:'/en-gb/s/?q=dubai+desert+safari&searchSource=8&src=search_bar&adults=1' },
  { id:12, title:'Prague Old Town & Castle Walk',     location:'Prague, Czech Republic',  category:'daytrips',  duration:'3 hours',    rating:4.7, reviews:4870,  price:22,  badge:'Great Value',   image:'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80',                             gygPath:'/en-gb/s/?q=prague+old+town&adults=1&searchSource=8' },
]

const whyItems = [
  { emoji:'🎟️', title:'Skip the Queues',    body:"Guaranteed entrance to the world's most popular attractions." },
  { emoji:'💬', title:'Expert Local Guides', body:'Vetted, passionate guides who bring every destination to life.' },
  { emoji:'🔄', title:'Free Cancellation',   body:'Most experiences offer free cancellation up to 24 hours before. Book worry-free.' },
  { emoji:'⭐', title:'Millions of Reviews', body:'Every experience is rated by real travellers so you know exactly what to expect.' },
]

const popularCities = [
  { city:'London',    emoji:'🏙️', gygPath:'/en-gb/london-l2357/',   count:'4,200+' },
  { city:'Rome',      emoji:'🏛️', gygPath:'/en-gb/rome-l2619/',     count:'2,900+' },
  { city:'Paris',     emoji:'🗼', gygPath:'/en-gb/paris-l2601/',     count:'3,100+' },
  { city:'Barcelona', emoji:'⛪', gygPath:'/en-gb/barcelona-l2998/', count:'2,400+' },
  { city:'Dubai',     emoji:'🌆', gygPath:'/en-gb/dubai-l4966/',     count:'1,800+' },
  { city:'Tokyo',     emoji:'⛩️', gygPath:'/en-gb/tokyo-l1193/',     count:'2,100+' },
  { city:'New York',  emoji:'🗽', gygPath:'/en-gb/new-york-l1977/',  count:'3,500+' },
  { city:'Lisbon',    emoji:'🌊', gygPath:'/en-gb/lisbon-l2606/',    count:'1,200+' },
]

const trendingSearches = [
  'Colosseum Rome','Sagrada Familia','Northern Lights','Safari Kenya',
  'Venice gondola','Eiffel Tower','Great Wall China','Machu Picchu',
]

const seasonalPicks = [
  {
    season:'Spring 🌸', desc:'Mild weather, fewer crowds, gardens in bloom.',
    picks:[
      { title:'Keukenhof Gardens Tour', location:'Amsterdam', price:35, gygPath:'/en-gb/s/?q=keukenhof+gardens&searchSource=8' },
      { title:'Cherry Blossom Walk',    location:'Kyoto',     price:28, gygPath:'/en-gb/s/?q=kyoto+cherry+blossom&searchSource=8' },
      { title:'Amalfi Coastal Hike',    location:'Italy',     price:45, gygPath:'/en-gb/s/?q=amalfi+hiking&searchSource=8' },
    ],
  },
  {
    season:'Summer ☀️', desc:'Peak season sun, festivals and long evenings.',
    picks:[
      { title:'Ibiza Boat Party',       location:'Ibiza',   price:65,  gygPath:'/en-gb/s/?q=ibiza+boat+party&searchSource=8' },
      { title:'Greek Island Hopping',   location:'Greece',  price:120, gygPath:'/en-gb/s/?q=greek+island+hopping&searchSource=8' },
      { title:'Midnight Sun Kayaking',  location:'Norway',  price:89,  gygPath:'/en-gb/s/?q=norway+midnight+sun+kayaking&searchSource=8' },
    ],
  },
  {
    season:'Autumn 🍂', desc:'Golden colours, harvest festivals, cooler temps.',
    picks:[
      { title:'Oktoberfest Tour',           location:'Munich',  price:55, gygPath:'/en-gb/s/?q=oktoberfest+munich&searchSource=8' },
      { title:'New England Fall Foliage',   location:'Boston',  price:79, gygPath:'/en-gb/s/?q=new+england+fall+foliage&searchSource=8' },
      { title:'Tuscany Wine Harvest',       location:'Florence',price:95, gygPath:'/en-gb/s/?q=tuscany+wine+harvest&searchSource=8' },
    ],
  },
  {
    season:'Winter ❄️', desc:'Festive markets, skiing, and warm-weather escapes.',
    picks:[
      { title:'Northern Lights Tour',   location:'Iceland', price:110, gygPath:'/en-gb/s/?q=northern+lights+iceland&searchSource=8' },
      { title:'Christmas Markets Walk', location:'Vienna',  price:25,  gygPath:'/en-gb/s/?q=vienna+christmas+market&searchSource=8' },
      { title:'Dubai Desert Glamping',  location:'Dubai',   price:145, gygPath:'/en-gb/s/?q=dubai+glamping+desert&searchSource=8' },
    ],
  },
]

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-sm">
      <span style={{ color:'#f5a623' }}>{'★'.repeat(Math.floor(rating))}</span>
      <span style={{ color:'#d1d5db' }}>{'★'.repeat(5 - Math.floor(rating))}</span>
    </span>
  )
}

export default function ExperiencesPage() {
  const [activeTab, setActiveTab]           = useState<'flights'|'hotels'|'experiences'|'cars'>('experiences')
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch]                 = useState('')

  const filtered = experiences.filter(exp => {
    const q = search.toLowerCase()
    const matchSearch = !q || exp.title.toLowerCase().includes(q) || exp.location.toLowerCase().includes(q) || exp.category.toLowerCase().includes(q)
    return matchSearch && (activeCategory === 'all' || exp.category === activeCategory)
  })

    const [pickupLocation, setPickupLocation] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [dropoffDate, setDropoffDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCarSearch = () => {
      // whatever logic you want here
    };


  return (
    <main className="min-h-screen bg-white">
      <Navbar />

    {/* ── HERO ── */}
<section className="relative overflow-hidden text-white py-24 px-6 text-center">
  {/* Unsplash background image */}
  <NextImage
    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80"
    alt="Travel experiences around the world"
    fill
    className="object-cover object-center"
    priority
  />

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-[#232e4e]/75 z-0" />

  <div className="relative z-10 max-w-3xl mx-auto">
    <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
      Timms Travel
    </p>

    <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
      Experiences & Tours Around the World!
    </h1>

    <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto mb-10">
      Choose from hundreds of destinations around the world.
    </p>

    {/* SEARCH TABS */}
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

    {/* SEARCH AREA */}
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

    {/* Trust indicators */}
    <div className="flex justify-center gap-8 mt-8 text-sm text-gray-300">
      <span>Fully Bespoke Offers</span>
      <span>No hidden fees</span>
      <span>Competitive price guarantee</span>
    </div>

         {/* Trust indicators (unchanged) */}
          <div className="flex justify-center gap-8 mt-8 text-sm text-gray-300">
            <span>Fully Bespoke Offers</span>
            <span>No hidden fees</span>
            <span>Competitive price guarantee</span>
          </div>
        </div>
      </section>

      {/* ── TRENDING SEARCHES ── */}
      <section className="py-10 px-6 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">🔥 Trending right now</p>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map(term => (
              <a key={term} href={buildGygSearchUrl(term)} target="_blank" rel="noopener noreferrer sponsored"
                className="px-4 py-2 rounded-full text-sm border border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-gray-100 transition-colors">
                {term}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── BROWSE BY CITY ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color:'#232e4e' }}>Browse by City</h2>
          <p className="text-center text-gray-500 mb-10">Jump straight to experiences in the world's most popular destinations.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {popularCities.map(c => (
              <a key={c.city} href={buildGygUrl(c.gygPath)} target="_blank" rel="noopener noreferrer sponsored"
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition text-center group">
                <div className="text-4xl mb-3">{c.emoji}</div>
                <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{c.city}</p>
                <p className="text-xs text-gray-400 mt-1">{c.count} experiences</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED EXPERIENCES ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color:'#232e4e' }}>Featured Experiences</h2>
          <p className="text-center text-gray-500 mb-8">Filter by category or search below - press Enter to search directly on GetYourGuide.</p>

          {/* SEARCH — restyled with dynamic GYG link */}
<div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-xl">
  <div className="flex-1 flex items-center border border-gray-300 rounded-lg shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-200 transition">
    <span className="ml-3 text-gray-400 text-sm">🔍</span>
    <input
      type="text"
      placeholder="Search destinations or activities…"
      value={search}
      onChange={e => setSearch(e.target.value)}
      onKeyDown={e => { 
        if (e.key === 'Enter' && search.trim()) 
          window.open(buildGygSearchUrl(search), '_blank', 'noopener,noreferrer') 
      }}
      className="flex-1 px-3 py-2.5 text-black text-sm rounded-r-lg focus:outline-none"
    />
  </div>
  {search.trim() && (
    <a
      href={buildGygSearchUrl(search)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="flex items-center justify-center px-5 py-2.5 rounded-lg text-white text-sm font-semibold whitespace-nowrap transition-opacity hover:opacity-90"
      style={{ backgroundColor:'#232e4e' }}
    >
      Search on GYG →
    </a>
  )}
</div>

          {/* CATEGORY FILTERS */}
          <div className="flex gap-2 flex-wrap mb-6">
            {categories.map(cat => (
              <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeCategory === cat.value ? 'text-white border-transparent' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
                style={activeCategory === cat.value ? { backgroundColor:'#232e4e', borderColor:'#232e4e' } : {}}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-400 mb-6">{filtered.length} experience{filtered.length !== 1 ? 's' : ''} found</p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(exp => (
                <div key={exp.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
                    <span className="absolute top-3 left-3 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full" style={{ backgroundColor:'#232e4e' }}>{exp.badge}</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color:'#232e4e' }}>📍 {exp.location}</p>
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
                        <span className="text-xl font-extrabold" style={{ color:'#232e4e' }}>£{exp.price}</span>
                      </div>
                    </div>
                    <a href={buildGygUrl(exp.gygPath)} target="_blank" rel="noopener noreferrer sponsored"
                      className="block w-full text-center text-white text-sm font-semibold py-3 rounded-xl transition-opacity hover:opacity-90"
                      style={{ backgroundColor:'#232e4e' }}>
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
              <p className="text-sm mb-4">Try a different search term or category.</p>
              {search.trim() && (
                <a href={buildGygSearchUrl(search)} target="_blank" rel="noopener noreferrer sponsored"
                  className="inline-block text-white text-sm font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition"
                  style={{ backgroundColor:'#232e4e' }}>
                  Search "{search}" on GetYourGuide →
                </a>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <a href={`${GYG_BASE}/?partner_id=${GYG_PARTNER_ID}`} target="_blank" rel="noopener noreferrer sponsored"
              className="inline-block text-white font-semibold px-8 py-4 rounded-full transition-opacity hover:opacity-90"
              style={{ backgroundColor:'#232e4e' }}>
              Browse All 70,000+ Experiences on GetYourGuide →
            </a>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCES BY SEASON ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color:'#232e4e' }}>Experiences by Season</h2>
          <p className="text-center text-gray-500 mb-10">The right experience at the right time of year.</p>
          <div className="space-y-10">
            {seasonalPicks.map(block => (
              <div key={block.season}>
                <div className="flex items-baseline gap-3 mb-4">
                  <h3 className="text-xl font-bold" style={{ color:'#232e4e' }}>{block.season}</h3>
                  <p className="text-sm text-gray-500">{block.desc}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {block.picks.map(pick => (
                    <a key={pick.title} href={buildGygUrl(pick.gygPath)} target="_blank" rel="noopener noreferrer sponsored"
                      className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition group">
                      <p className="text-xs text-gray-400 mb-1">📍 {pick.location}</p>
                      <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 leading-snug">{pick.title}</p>
                      <p className="text-sm font-semibold" style={{ color:'#232e4e' }}>from £{pick.price}</p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY BOOK ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color:'#232e4e' }}>Why Book With Us?</h2>
          <p className="text-center text-gray-500 mb-10">We partner with GetYourGuide so you get the very best.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyItems.map(item => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4" style={{ backgroundColor:'#eef0f7' }}>{item.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { stat:'70,000+', label:'Experiences worldwide' },
            { stat:'170+',    label:'Countries covered' },
            { stat:'50M+',    label:'Travellers served' },
            { stat:'4.8★',    label:'Average rating' },
          ].map(item => (
            <div key={item.label}>
              <p className="text-3xl font-extrabold mb-1" style={{ color:'#232e4e' }}>{item.stat}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 px-6 text-center text-white" style={{ backgroundColor:'#232e4e' }}>
        <h2 className="text-4xl font-bold mb-3">Ready to Explore?</h2>
        <p className="text-gray-300 text-lg max-w-md mx-auto mb-8">Browse over 70,000 experiences across 170+ countries, all bookable in minutes.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a href={`${GYG_BASE}/?partner_id=${GYG_PARTNER_ID}`} target="_blank" rel="noopener noreferrer sponsored"
            className="font-bold px-8 py-4 rounded-full transition-opacity hover:opacity-90 text-sm"
            style={{ backgroundColor:'#ffffff', color:'#232e4e' }}>
            Browse All Experiences
          </a>
          <a href="/flights" className="border border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-gray-900 transition-colors text-sm">
            Search Flights Instead
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}