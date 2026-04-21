'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FlightSearch from '@/app/components/Search/FlightSearch'
import HotelSearch from '@/app/components/Search/HotelSearch'
import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import CarSearch from '@/app/components/Search/CarSearch'
import NextImage from 'next/image'
import Link from 'next/link'
import Script from 'next/script'

const GYG_PARTNER_ID = 'P7B7GRH'
const GYG_BASE = 'https://www.getyourguide.com'

const buildGygUrl = (path: string) => {
  const clean = path.endsWith('/') ? path.slice(0, -1) : path
  return `${GYG_BASE}${clean}?partner_id=${GYG_PARTNER_ID}`
}

const buildGygSearchUrl = (query: string) =>
  `${GYG_BASE}/en-gb/s/?q=${encodeURIComponent(query.trim())}&searchSource=8&src=search_bar&adults=1&partner_id=${GYG_PARTNER_ID}`

// JSON-LD
const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://timmstravel.com/experiences#webpage',
  url: 'https://timmstravel.com/experiences',
  name: 'Book Tours, Activities and Experiences Worldwide | Timms Travel',
  description:
    'Browse and book over 70,000 tours, activities, day trips and experiences across 170+ countries. Skip-the-line tickets, guided tours, food and drink experiences and more.',
  inLanguage: 'en-GB',
  isPartOf: {
    '@type': 'WebSite',
    '@id': 'https://timmstravel.com/#website',
    url: 'https://timmstravel.com',
    name: 'Timms Travel',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',        item: 'https://timmstravel.com'              },
      { '@type': 'ListItem', position: 2, name: 'Experiences', item: 'https://timmstravel.com/experiences'  },
    ],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I book an experience through Timms Travel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Browse or search for an experience on this page, then click through to complete your booking securely on GetYourGuide. You get instant confirmation and can manage your booking directly through them.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I cancel an experience if my plans change?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most experiences offered through GetYourGuide include free cancellation up to 24 hours before the start time. Always check the specific cancellation policy on the booking page before confirming.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of experiences can I book?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can book guided city tours, skip-the-line tickets to major attractions, food and drink experiences, adventure activities, day trips, water sports, cultural experiences and much more across 170+ countries.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are the prices shown in pounds sterling?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All prices shown on Timms Travel are displayed in GBP. Final pricing is confirmed at checkout on GetYourGuide.',
      },
    },
  ],
}

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Top Travel Experiences Worldwide',
  url: 'https://timmstravel.com/experiences',
  itemListElement: [
    { '@type': 'ListItem', position: 1,  name: 'Colosseum Skip-the-Line Tour, Rome'      },
    { '@type': 'ListItem', position: 2,  name: 'Paris Seine River Cruise'                },
    { '@type': 'ListItem', position: 3,  name: 'Barcelona Tapas and Wine Night Tour'     },
    { '@type': 'ListItem', position: 4,  name: 'Queenstown Bungee Jump'                  },
    { '@type': 'ListItem', position: 5,  name: 'Santorini Sunset Sailing'                },
    { '@type': 'ListItem', position: 6,  name: 'Tokyo Tsukiji Market and Sushi Tour'     },
    { '@type': 'ListItem', position: 7,  name: 'Machu Picchu Full Day Tour'              },
    { '@type': 'ListItem', position: 8,  name: 'New York City Helicopter Tour'           },
    { '@type': 'ListItem', position: 9,  name: 'Pyramids of Giza Guided Tour'            },
    { '@type': 'ListItem', position: 10, name: 'Amalfi Coast Boat Trip'                  },
    { '@type': 'ListItem', position: 11, name: 'Dubai Desert Safari at Sunset'           },
    { '@type': 'ListItem', position: 12, name: 'Prague Old Town and Castle Walk'         },
  ],
}

type Category = { label: string; value: string; emoji: string }
type Experience = {
  id: number; title: string; location: string; category: string; duration: string
  rating: number; reviews: number; price: number; badge: string; gygPath: string; image: string
}

const categories: Category[] = [
  { label: 'All Experiences', value: 'all',       emoji: '🌍' },
  { label: 'Tours',           value: 'tours',     emoji: '🗺️' },
  { label: 'Food and Drink',  value: 'food',      emoji: '🍷' },
  { label: 'Adventure',       value: 'adventure', emoji: '🧗' },
  { label: 'Culture',         value: 'culture',   emoji: '🏛️' },
  { label: 'Water Sports',    value: 'water',     emoji: '🌊' },
  { label: 'Day Trips',       value: 'daytrips',  emoji: '🚌' },
]

const experiences: Experience[] = [
  { id:1,  title:'Colosseum Skip-the-Line Tour',      location:'Rome, Italy',            category:'culture',   duration:'3 hours',    rating:4.9, reviews:12840, price:49,  badge:'Bestseller',    image:'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',                         gygPath:'/en-gb/colosseum-l2619/' },
  { id:2,  title:'Paris Seine River Cruise',          location:'Paris, France',          category:'tours',     duration:'1 hour',     rating:4.8, reviews:9320,  price:19,  badge:'Top Rated',     image:'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',                       gygPath:'/en-gb/seine-river-l2601/' },
  { id:3,  title:'Barcelona Tapas and Wine Night Tour',location:'Barcelona, Spain',      category:'food',      duration:'3.5 hours',  rating:4.9, reviews:5210,  price:79,  badge:'Fan Favourite', image:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',                         gygPath:'/en-gb/s/?q=barcelona+tapas+and+wine&searchSource=8&src=search_bar&adults=1' },
  { id:4,  title:'Queenstown Bungee Jump',            location:'Queenstown, NZ',         category:'adventure', duration:'2 hours',    rating:4.9, reviews:3870,  price:195, badge:'Thrilling',     image:'https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=600&q=80',                       gygPath:'/en-gb/queenstown-l498/bungee-jumping-tc86/?adults=1&searchSource=8' },
  { id:5,  title:'Santorini Sunset Sailing',          location:'Santorini, Greece',      category:'water',     duration:'5 hours',    rating:4.8, reviews:7640,  price:115, badge:'Bestseller',    image:'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80',                       gygPath:'/en-gb/s/?q=santorini+sunset+sailing&searchSource=8&src=search_bar&adults=1' },
  { id:6,  title:'Tokyo Tsukiji Market and Sushi Tour',location:'Tokyo, Japan',          category:'food',      duration:'4 hours',    rating:4.9, reviews:4190,  price:89,  badge:'Top Rated',     image:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',                       gygPath:'/en-gb/s/?q=tokyo+tsukiji+market&searchSource=8&src=search_bar&adults=1' },
  { id:7,  title:'Machu Picchu Full Day Tour',        location:'Cusco, Peru',            category:'daytrips',  duration:'Full day',   rating:4.9, reviews:6580,  price:135, badge:'Iconic',        image:'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80',                       gygPath:'/en-gb/machu-picchu-l1570/?adults=1&searchSource=8' },
  { id:8,  title:'New York City Helicopter Tour',     location:'New York, USA',          category:'tours',     duration:'15 minutes', rating:4.8, reviews:8100,  price:219, badge:'Spectacular',   image:'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80',                       gygPath:'/en-gb/s/?q=NYC+helicopter+tour&searchSource=8&src=search_bar&adults=1' },
  { id:9,  title:'Pyramids of Giza Guided Tour',      location:'Cairo, Egypt',           category:'culture',   duration:'6 hours',    rating:4.7, reviews:5430,  price:65,  badge:'Must-Do',       image:'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1740&auto=format&fit=crop', gygPath:'/en-gb/pyramids-of-giza-l4184/?adults=1&searchSource=8' },
  { id:10, title:'Amalfi Coast Boat Trip',            location:'Amalfi, Italy',          category:'water',     duration:'8 hours',    rating:4.9, reviews:3210,  price:98,  badge:'Stunning',      image:'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=600&q=80',                       gygPath:'/en-gb/s/?q=Amalfi+coast+boat+trip&searchSource=8&src=search_bar&adults=1' },
  { id:11, title:'Dubai Desert Safari at Sunset',     location:'Dubai, UAE',             category:'adventure', duration:'6 hours',    rating:4.8, reviews:11200, price:55,  badge:'Bestseller',    image:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',                       gygPath:'/en-gb/s/?q=dubai+desert+safari&searchSource=8&src=search_bar&adults=1' },
  { id:12, title:'Prague Old Town and Castle Walk',   location:'Prague, Czech Republic', category:'daytrips',  duration:'3 hours',    rating:4.7, reviews:4870,  price:22,  badge:'Great Value',   image:'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80',                         gygPath:'/en-gb/s/?q=prague+old+town&adults=1&searchSource=8' },
]

const whyItems = [
  { emoji:'🎟️', title:'Skip the Queues',    body:'Guaranteed entrance to the world\'s most popular attractions. No waiting, no disappointment.' },
  { emoji:'💬', title:'Expert Local Guides', body:'Vetted, passionate guides who bring every destination to life with knowledge you won\'t find in a guidebook.' },
  { emoji:'🔄', title:'Free Cancellation',   body:'Most experiences offer free cancellation up to 24 hours before. Book with confidence, change your plans without stress.' },
  { emoji:'⭐', title:'Millions of Reviews', body:'Every experience is rated by real travellers so you know exactly what to expect before you book.' },
]

// Cities with both internal things-to-do links and external GYG links
const popularCities = [
  { city:'London',    emoji:'🏙️', continent:'europe',        country:'united-kingdom', slug:'london',    gygPath:'/en-gb/london-l2357/',   count:'4,200+' },
  { city:'Rome',      emoji:'🏛️', continent:'europe',        country:'italy',          slug:'rome',      gygPath:'/en-gb/rome-l2619/',     count:'2,900+' },
  { city:'Paris',     emoji:'🗼', continent:'europe',        country:'france',         slug:'paris',     gygPath:'/en-gb/paris-l2601/',    count:'3,100+' },
  { city:'Barcelona', emoji:'⛪', continent:'europe',        country:'spain',          slug:'barcelona', gygPath:'/en-gb/barcelona-l2998/',count:'2,400+' },
  { city:'Dubai',     emoji:'🌆', continent:'middle-east',   country:'uae',            slug:'dubai',     gygPath:'/en-gb/dubai-l4966/',    count:'1,800+' },
  { city:'Tokyo',     emoji:'⛩️', continent:'asia',          country:'japan',          slug:'tokyo',     gygPath:'/en-gb/tokyo-l1193/',    count:'2,100+' },
  { city:'New York',  emoji:'🗽', continent:'north-america', country:'usa',            slug:'new-york',  gygPath:'/en-gb/new-york-l1977/', count:'3,500+' },
  { city:'Lisbon',    emoji:'🌊', continent:'europe',        country:'portugal',       slug:'lisbon',    gygPath:'/en-gb/lisbon-l2606/',   count:'1,200+' },
]

// Additional city directory for SEO internal linking
const cityDirectory = [
  { city:'Amsterdam',  continent:'europe',        country:'netherlands',    slug:'amsterdam'  },
  { city:'Bangkok',    continent:'asia',          country:'thailand',       slug:'bangkok'    },
  { city:'Berlin',     continent:'europe',        country:'germany',        slug:'berlin'     },
  { city:'Budapest',   continent:'europe',        country:'hungary',        slug:'budapest'   },
  { city:'Cairo',      continent:'africa',        country:'egypt',          slug:'cairo'      },
  { city:'Cape Town',  continent:'africa',        country:'south-africa',   slug:'cape-town'  },
  { city:'Edinburgh',  continent:'europe',        country:'united-kingdom', slug:'edinburgh'  },
  { city:'Istanbul',   continent:'europe',        country:'turkey',         slug:'istanbul'   },
  { city:'Lisbon',     continent:'europe',        country:'portugal',       slug:'lisbon'     },
  { city:'Madrid',     continent:'europe',        country:'spain',          slug:'madrid'     },
  { city:'Marrakech',  continent:'africa',        country:'morocco',        slug:'marrakech'  },
  { city:'New York',   continent:'north-america', country:'usa',            slug:'new-york'   },
  { city:'Orlando',    continent:'north-america', country:'usa',            slug:'orlando'    },
  { city:'Prague',     continent:'europe',        country:'czech-republic', slug:'prague'     },
  { city:'Singapore',  continent:'asia',          country:'singapore',      slug:'singapore'  },
  { city:'Sydney',     continent:'oceania',       country:'australia',      slug:'sydney'     },
  { city:'Tenerife',   continent:'europe',        country:'spain',          slug:'tenerife'   },
  { city:'Vienna',     continent:'europe',        country:'austria',        slug:'vienna'     },
]

const trendingSearches = [
  'Colosseum Rome', 'Sagrada Familia', 'Northern Lights', 'Safari Kenya',
  'Venice gondola', 'Eiffel Tower', 'Great Wall China', 'Machu Picchu',
]

const seasonalPicks = [
  {
    season: 'Spring', emoji: '🌸',
    desc: 'Mild weather, fewer crowds and gardens in full bloom.',
    picks: [
      { title:'Keukenhof Gardens Tour', location:'Amsterdam', continent:'europe', country:'netherlands', slug:'amsterdam', price:35, gygPath:'/en-gb/s/?q=keukenhof+gardens&searchSource=8' },
      { title:'Cherry Blossom Walk',    location:'Kyoto',     continent:'asia',   country:'japan',       slug:'kyoto',     price:28, gygPath:'/en-gb/s/?q=kyoto+cherry+blossom&searchSource=8' },
      { title:'Amalfi Coastal Hike',    location:'Amalfi',    continent:'europe', country:'italy',       slug:'amalfi',    price:45, gygPath:'/en-gb/s/?q=amalfi+hiking&searchSource=8' },
    ],
  },
  {
    season: 'Summer', emoji: '☀️',
    desc: 'Peak season sun, festivals and long golden evenings.',
    picks: [
      { title:'Ibiza Boat Party',      location:'Ibiza',  continent:'europe', country:'spain',   slug:'ibiza',  price:65,  gygPath:'/en-gb/s/?q=ibiza+boat+party&searchSource=8' },
      { title:'Greek Island Hopping',  location:'Athens', continent:'europe', country:'greece',  slug:'athens', price:120, gygPath:'/en-gb/s/?q=greek+island+hopping&searchSource=8' },
      { title:'Midnight Sun Kayaking', location:'Bergen', continent:'europe', country:'norway',  slug:'bergen', price:89,  gygPath:'/en-gb/s/?q=norway+midnight+sun+kayaking&searchSource=8' },
    ],
  },
  {
    season: 'Autumn', emoji: '🍂',
    desc: 'Golden colours, harvest festivals and cooler temperatures.',
    picks: [
      { title:'Oktoberfest Tour',         location:'Munich',   continent:'europe',        country:'germany', slug:'munich',   price:55, gygPath:'/en-gb/s/?q=oktoberfest+munich&searchSource=8' },
      { title:'New England Fall Foliage', location:'Boston',   continent:'north-america', country:'usa',     slug:'boston',   price:79, gygPath:'/en-gb/s/?q=new+england+fall+foliage&searchSource=8' },
      { title:'Tuscany Wine Harvest',     location:'Florence', continent:'europe',        country:'italy',   slug:'florence', price:95, gygPath:'/en-gb/s/?q=tuscany+wine+harvest&searchSource=8' },
    ],
  },
  {
    season: 'Winter', emoji: '❄️',
    desc: 'Festive markets, skiing and warm-weather escapes.',
    picks: [
      { title:'Northern Lights Tour',   location:'Reykjavik', continent:'europe',      country:'iceland', slug:'reykjavik', price:110, gygPath:'/en-gb/s/?q=northern+lights+iceland&searchSource=8' },
      { title:'Christmas Markets Walk', location:'Vienna',    continent:'europe',      country:'austria', slug:'vienna',    price:25,  gygPath:'/en-gb/s/?q=vienna+christmas+market&searchSource=8' },
      { title:'Dubai Desert Glamping',  location:'Dubai',     continent:'middle-east', country:'uae',     slug:'dubai',     price:145, gygPath:'/en-gb/s/?q=dubai+glamping+desert&searchSource=8' },
    ],
  },
]

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-sm" aria-label={`${rating} out of 5 stars`}>
      <span style={{ color:'#f5a623' }}>{'★'.repeat(Math.floor(rating))}</span>
      <span style={{ color:'#d1d5db' }}>{'★'.repeat(5 - Math.floor(rating))}</span>
    </span>
  )
}

export default function ExperiencesPage() {
  const [activeTab, setActiveTab]           = useState<'flights'|'hotels'|'experiences'|'cars'>('experiences')
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch]                 = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate]         = useState('')
  const [dropoffDate, setDropoffDate]       = useState('')
  const [loading]                           = useState(false)

  const handleCarSearch = () => {
    if (!pickupLocation || !pickupDate || !dropoffDate) return
    window.open(`https://www.rentalcars.com/?affiliateCode=YOURAFFILIATETOKEN&preflocation=${encodeURIComponent(pickupLocation)}&puDay=${pickupDate}&doDay=${dropoffDate}`, '_blank')
  }

  const filtered = experiences.filter(exp => {
    const q = search.toLowerCase()
    const matchSearch = !q || exp.title.toLowerCase().includes(q) || exp.location.toLowerCase().includes(q) || exp.category.toLowerCase().includes(q)
    return matchSearch && (activeCategory === 'all' || exp.category === activeCategory)
  })

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <Script id="schema-webpage" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <Script id="schema-faq" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-itemlist" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-100 px-6 py-2">
        <ol className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-500" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/" className="hover:text-blue-600 transition-colors" itemProp="item">
              <span itemProp="name">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li aria-hidden="true" className="text-gray-300">/</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span className="text-gray-800 font-medium" itemProp="name">Experiences</span>
            <meta itemProp="position" content="2" />
            <link itemProp="item" href="https://timmstravel.com/experiences" />
          </li>
        </ol>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden text-white py-24 px-6 text-center" aria-labelledby="hero-heading">
        <NextImage
          src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600&q=80"
          alt="People enjoying guided tours and travel experiences around the world"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[#232e4e]/75 z-0" aria-hidden="true" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">Timms Travel</p>
          <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Tours, Activities and Experiences Worldwide
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto mb-10">
            Browse over 70,000 experiences across 170 countries. Skip-the-line tickets, guided tours, food and drink, adventure activities and more, all bookable in minutes.
          </p>

          <nav aria-label="Search category" className="flex justify-center gap-1 mb-6 bg-white/10 rounded-2xl p-1 max-w-sm mx-auto">
            {(['flights', 'hotels', 'experiences', 'cars'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                aria-pressed={activeTab === tab}
                aria-label={`Search ${tab}`}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all capitalize ${
                  activeTab === tab ? 'bg-white text-[#232e4e] shadow-sm' : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black" role="search" aria-label="Travel search">
            {activeTab === 'flights'     && <FlightSearch />}
            {activeTab === 'hotels'      && <HotelSearch />}
            {activeTab === 'experiences' && <ExperienceSearch />}
            {activeTab === 'cars'        && (
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

          <p className="flex justify-center gap-8 mt-8 text-sm text-gray-300" aria-label="Trust signals">
            <span>Fully Bespoke Offers</span>
            <span>No Hidden Fees</span>
            <span>Competitive Price Guarantee</span>
          </p>
        </div>
      </section>

      {/* TRENDING SEARCHES */}
      <section className="py-10 px-6 bg-white border-b border-gray-100" aria-labelledby="trending-heading">
        <div className="max-w-6xl mx-auto">
          <p id="trending-heading" className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
            Trending Right Now
          </p>
          <ul className="flex flex-wrap gap-2">
            {trendingSearches.map(term => (
              <li key={term}>
                <a
                  href={buildGygSearchUrl(term)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="px-4 py-2 rounded-full text-sm border border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-gray-100 transition-colors"
                  title={`Search ${term} experiences on GetYourGuide`}
                >
                  {term}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* BROWSE BY CITY */}
      <section className="py-16 px-6 bg-gray-50" aria-labelledby="cities-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Explore by destination</p>
            <h2 id="cities-heading" className="text-3xl font-bold" style={{ color:'#232e4e' }}>
              Browse Things to Do by City
            </h2>
            <p className="text-center text-gray-500 mt-2">
              Jump straight to experiences in the world's most popular destinations. Each city page includes local things to do, travel guides, flights and hotels.
            </p>
          </div>

          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {popularCities.map(c => (
              <li key={c.city}>
                <Link
                  href={`/locations/${c.continent}/${c.country}/${c.slug}/things-to-do`}
                  className="block bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition text-center group"
                  title={`Things to do in ${c.city} - tours, activities and experiences`}
                >
                  <div className="text-4xl mb-3" aria-hidden="true">{c.emoji}</div>
                  <p className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">{c.city}</p>
                  <p className="text-xs text-gray-400 mt-1">{c.count} experiences</p>
                  <p className="text-xs font-semibold mt-2" style={{ color:'#03989e' }}>View things to do →</p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="text-center mt-8">
            <Link
              href="/locations/continents"
              className="inline-block px-7 py-3 rounded-2xl font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ backgroundColor:'#232e4e' }}
            >
              Browse All Destinations →
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED EXPERIENCES */}
      <section className="py-16 px-6 bg-white" aria-labelledby="featured-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Hand picked</p>
            <h2 id="featured-heading" className="text-3xl font-bold" style={{ color:'#232e4e' }}>
              Featured Experiences
            </h2>
            <p className="text-center text-gray-500 mt-2">
              Filter by category or search below. Press Enter to search directly on GetYourGuide.
            </p>
          </div>

          {/* SEARCH */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-xl" role="search" aria-label="Search experiences">
            <div className="flex-1 flex items-center border border-gray-300 rounded-lg shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-200 transition">
              <span className="ml-3 text-gray-400 text-sm" aria-hidden="true">🔍</span>
              <input
                type="text"
                placeholder="Search destinations or activities"
                value={search}
                aria-label="Search experiences by destination or activity type"
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
                aria-label={`Search for ${search} on GetYourGuide`}
              >
                Search on GYG →
              </a>
            )}
          </div>

          {/* CATEGORY FILTERS */}
          <nav aria-label="Filter experiences by category" className="flex gap-2 flex-wrap mb-6">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                aria-pressed={activeCategory === cat.value}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeCategory === cat.value
                    ? 'text-white border-transparent'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
                style={activeCategory === cat.value ? { backgroundColor:'#232e4e', borderColor:'#232e4e' } : {}}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </nav>

          <p className="text-sm text-gray-400 mb-6" aria-live="polite">
            {filtered.length} experience{filtered.length !== 1 ? 's' : ''} found
          </p>

          {filtered.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(exp => (
                <li key={exp.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={exp.image}
                      alt={`${exp.title} in ${exp.location}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full" style={{ backgroundColor:'#232e4e' }}>
                      {exp.badge}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color:'#232e4e' }}>
                      📍 {exp.location}
                    </p>
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">{exp.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">Duration: {exp.duration}</p>
                    <div className="flex items-center justify-between mb-4 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <Stars rating={exp.rating} />
                        <span className="text-sm font-bold text-gray-800">{exp.rating}</span>
                        <span className="text-xs text-gray-400">({exp.reviews.toLocaleString()} reviews)</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs text-gray-400">from</span>
                        <span className="text-xl font-extrabold" style={{ color:'#232e4e' }}>£{exp.price}</span>
                      </div>
                    </div>
                    <a
                      href={buildGygUrl(exp.gygPath)}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="block w-full text-center text-white text-sm font-semibold py-3 rounded-xl transition-opacity hover:opacity-90"
                      style={{ backgroundColor:'#232e4e' }}
                      aria-label={`Book ${exp.title} on GetYourGuide`}
                    >
                      Book on GetYourGuide →
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-20 text-gray-400" role="status">
              <p className="text-5xl mb-4" aria-hidden="true">🗺️</p>
              <p className="text-xl font-semibold text-gray-600 mb-1">No experiences found</p>
              <p className="text-sm mb-4">Try a different search term or category.</p>
              {search.trim() && (
                <a
                  href={buildGygSearchUrl(search)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-block text-white text-sm font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition"
                  style={{ backgroundColor:'#232e4e' }}
                >
                  Search for "{search}" on GetYourGuide →
                </a>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href={`${GYG_BASE}/?partner_id=${GYG_PARTNER_ID}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-block text-white font-semibold px-8 py-4 rounded-full transition-opacity hover:opacity-90"
              style={{ backgroundColor:'#232e4e' }}
            >
              Browse All 70,000 Experiences on GetYourGuide →
            </a>
          </div>
        </div>
      </section>

      {/* EXPERIENCES BY SEASON */}
      <section className="py-16 px-6 bg-gray-50" aria-labelledby="seasonal-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Plan ahead</p>
            <h2 id="seasonal-heading" className="text-3xl font-bold" style={{ color:'#232e4e' }}>
              Experiences by Season
            </h2>
            <p className="text-center text-gray-500 mt-2">
              The right experience at the right time of year. Find activities that match the season and make the most of every destination.
            </p>
          </div>

          <div className="space-y-12">
            {seasonalPicks.map(block => (
              <article key={block.season} aria-label={`${block.season} experiences`}>
                <div className="flex items-baseline gap-3 mb-5">
                  <h3 className="text-xl font-bold flex items-center gap-2" style={{ color:'#232e4e' }}>
                    <span aria-hidden="true">{block.emoji}</span> Best Experiences in {block.season}
                  </h3>
                  <p className="text-sm text-gray-500 hidden sm:block">{block.desc}</p>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {block.picks.map(pick => (
                    <li key={pick.title}>
                      <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition h-full flex flex-col">
                        <p className="text-xs text-gray-400 mb-1">📍 {pick.location}</p>
                        <p className="font-bold text-gray-900 mb-1 leading-snug flex-1">{pick.title}</p>
                        <p className="text-sm font-semibold mb-3" style={{ color:'#232e4e' }}>from £{pick.price}</p>
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/locations/${pick.continent}/${pick.country}/${pick.slug}/things-to-do`}
                            className="text-xs font-semibold text-teal-600 hover:underline"
                            title={`Things to do in ${pick.location}`}
                          >
                            Things to do in {pick.location} →
                          </Link>
                          <a
                            href={buildGygUrl(pick.gygPath)}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="text-xs font-semibold text-gray-500 hover:underline"
                            aria-label={`Book ${pick.title} on GetYourGuide`}
                          >
                            Book on GetYourGuide →
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY BOOK */}
      <section className="py-16 px-6 bg-white" aria-labelledby="why-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Our promise</p>
            <h2 id="why-heading" className="text-3xl font-bold" style={{ color:'#232e4e' }}>
              Why Book Experiences With Timms Travel?
            </h2>
            <p className="text-center text-gray-500 mt-2">
              We partner with GetYourGuide to bring you the world's best tours and activities, with the protections and flexibility real travellers need.
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyItems.map(item => (
              <li key={item.title} className="text-center list-none">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4" style={{ backgroundColor:'#eef0f7' }} aria-hidden="true">
                  {item.emoji}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* STATS */}
      <section className="py-14 px-6 bg-gray-50 border-t border-gray-100" aria-label="Experiences at a glance">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { stat:'70,000+', label:'Experiences worldwide' },
            { stat:'170+',    label:'Countries covered'     },
            { stat:'50M+',    label:'Travellers served'     },
            { stat:'4.8',     label:'Average star rating'   },
          ].map(item => (
            <div key={item.label}>
              <p className="text-3xl font-extrabold mb-1" style={{ color:'#232e4e' }}>{item.stat}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CITY DIRECTORY - internal links for SEO */}
      <section className="py-16 px-6 bg-white border-t border-gray-100" aria-labelledby="directory-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Full directory</p>
            <h2 id="directory-heading" className="text-3xl font-bold" style={{ color:'#232e4e' }}>
              Things to Do in Every City
            </h2>
            <p className="text-center text-gray-500 mt-2">
              Browse our full destination guides for things to do, local tips, flights and hotels in cities across the world.
            </p>
          </div>
          <nav aria-label="Things to do by city directory">
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {cityDirectory.map(dest => (
                <li key={dest.slug}>
                  <Link
                    href={`/locations/${dest.continent}/${dest.country}/${dest.slug}/things-to-do`}
                    className="block text-sm text-blue-700 hover:text-blue-900 hover:underline py-1 px-2 rounded transition-colors"
                    title={`Things to do in ${dest.city} - tours, activities and experiences`}
                  >
                    Things to do in {dest.city}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-center mt-8">
            <Link
              href="/locations/continents"
              className="inline-block px-7 py-3 rounded-2xl font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ backgroundColor:'#232e4e' }}
            >
              View All Destinations →
            </Link>
          </div>
        </div>
      </section>

      {/* RELATED SERVICES */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100" aria-labelledby="related-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Complete your trip</p>
            <h2 id="related-heading" className="text-2xl font-bold" style={{ color:'#232e4e' }}>
              Everything Else You Need
            </h2>
            <p className="text-gray-500 mt-2">
              Experiences are just one part of a great trip. Timms Travel has everything else covered too.
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { href:'/flights',                          emoji:'✈️', title:'Flights',            body:'Compare flights to your destination from hundreds of airlines.',       color:'#232e4e' },
              { href:'/hotels',                           emoji:'🏨', title:'Hotels',             body:'Browse hotels near your experiences. From budget to luxury.',           color:'#03989e' },
              { href:'/car-hire',                         emoji:'🚗', title:'Car Hire',           body:'Hire a car and explore your destination at your own pace.',             color:'#5a7a52' },
              { href:'/other-services/airport-transfers', emoji:'🚐', title:'Airport Transfers',  body:'Pre-book your transfer so you arrive relaxed and on time.',             color:'#0369a1' },
            ].map(({ href, emoji, title, body, color }) => (
              <li key={title} className="list-none">
                <Link
                  href={href}
                  className="group flex flex-col h-full rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-lg transition-all"
                  title={`${title} - Timms Travel`}
                >
                  <div className="text-3xl mb-3" aria-hidden="true">{emoji}</div>
                  <h3 className="font-bold text-base mb-2 group-hover:underline" style={{ color }}>{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{body}</p>
                  <span className="mt-3 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>
                    Explore {title} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-white border-t border-gray-100" aria-labelledby="faq-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Common questions</p>
            <h2 id="faq-heading" className="text-3xl font-bold" style={{ color:'#232e4e' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 mt-2">Everything you need to know about booking experiences through Timms Travel.</p>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'How do I book an experience through Timms Travel?',
                a: 'Browse or search for an experience on this page, then click through to complete your booking securely on GetYourGuide. You get instant confirmation and can manage your booking directly with them.',
              },
              {
                q: 'Can I cancel an experience if my plans change?',
                a: 'Most experiences offered through GetYourGuide include free cancellation up to 24 hours before the start time. Always check the specific cancellation policy on the booking page before confirming.',
              },
              {
                q: 'What types of experiences can I book?',
                a: 'You can book guided city tours, skip-the-line tickets to major attractions, food and drink experiences, adventure activities, day trips, water sports, cultural experiences and much more across 170 countries.',
              },
              {
                q: 'Are the prices shown in pounds sterling?',
                a: 'Yes. All prices shown on Timms Travel are displayed in GBP. Final pricing is confirmed at checkout on GetYourGuide.',
              },
            ].map(({ q, a }) => (
              <details
                key={q}
                className="group bg-gray-50 border border-gray-200 rounded-2xl p-5"
                itemScope
                itemType="https://schema.org/Question"
              >
                <summary
                  className="cursor-pointer font-semibold text-base flex justify-between items-center list-none"
                  style={{ color:'#232e4e' }}
                  itemProp="name"
                >
                  {q}
                  <span className="ml-4 text-gray-400 shrink-0 group-open:rotate-180 transition-transform duration-200" aria-hidden="true">▾</span>
                </summary>
                <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed" itemProp="text">{a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 px-6 text-center text-white" style={{ backgroundColor:'#232e4e' }} aria-labelledby="cta-heading">
        <div className="max-w-2xl mx-auto">
          <h2 id="cta-heading" className="text-4xl font-bold mb-3">Ready to Explore?</h2>
          <p className="text-gray-300 text-lg max-w-md mx-auto mb-8">
            Browse over 70,000 experiences across 170 countries. Skip the queues, find a great guide and make every destination count.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href={`${GYG_BASE}/?partner_id=${GYG_PARTNER_ID}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="font-bold px-8 py-4 rounded-full transition-opacity hover:opacity-90 text-sm"
              style={{ backgroundColor:'#ffffff', color:'#232e4e' }}
            >
              Browse All Experiences
            </a>
            <Link
              href="/flights/search"
              className="border border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-gray-900 transition-colors text-sm"
            >
              Search Flights Instead
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}