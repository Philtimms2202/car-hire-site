// ============================================
// CONTINENTS LIST PAGE - app/locations/continents/page.tsx
// ============================================

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { createClient } from '@sanity/client'
import Link from 'next/link'
import LocationSearch from './LocationSearch'

const client = createClient({
  projectId: '6ogv1wx8',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

export const metadata = {
  title: {
    default: "Timms Travel | Continents",
    template: "Timms Travel | %s",
  },
  description: "Explore continents around the world and discover countries, cities, and experiences curated by Timms Travel.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default async function ContinentsPage() {
  const countries = await client.fetch(`
    *[_type == "location"]{
      continent,
      "continentSlug": continentSlug.current,
      continentEmoji
    }
  `)

  const continents = Array.from(
    new Map(
      countries.map(c => [c.continentSlug, c])
    ).values()
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
          Timms Travel · Destinations
        </p>
        
        <h1 className="text-5xl font-bold mb-4">Explore by Continent</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover the world one continent at a time - from iconic cities to hidden gems.
        </p>
      </section>

      {/* ── WHY EXPLORE BY CONTINENT ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-2">The bigger picture</p>
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            Why Explore by Continent?
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-8">
            Every continent offers its own unique blend of culture, landscapes, cuisine, and experiences.
            Whether you're planning a weekend escape in Europe, a wildlife adventure in Africa, or a
            once-in-a-lifetime trip across Asia, exploring by continent helps you discover destinations
            that match your travel style.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                emoji: '🗺️',
                title: 'Discover at your own pace',
                body: 'Each continent contains dozens of countries and hundreds of cities. Starting broad helps you narrow down your options without the overwhelm.',
              },
              {
                emoji: '✈️',
                title: 'Plan smarter routes',
                body: 'Understanding which destinations sit near each other helps you build multi-city itineraries that save time and money on connecting flights.',
              },
              {
                emoji: '🌍',
                title: 'Match your travel style',
                body: 'From the ancient history of Europe to the wildlife of Africa and the temples of Asia - different continents suit different kinds of traveller.',
              },
            ].map(({ emoji, title, body }) => (
              <div key={title} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-bold mb-2" style={{ color: '#232e4e' }}>{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTINENTS GRID ── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Where to?</p>
            <h2 className="text-3xl font-bold" style={{ color: '#232e4e' }}>Choose a continent</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {continents.map(continent => (
              <Link
                key={continent.continentSlug}
                href={`/locations/${continent.continentSlug}`}
                className="p-6 border rounded-lg hover:shadow-xl transition cursor-pointer text-center"
              >
                <div className="text-5xl mb-3">{continent.continentEmoji}</div>
                <h3 className="font-bold text-xl" style={{ color: '#232e4e' }}>
                  {continent.continent}
                </h3>
                <p className="text-sm text-gray-500 mt-1">View countries →</p>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/locations"
              className="font-semibold hover:opacity-75 transition"
              style={{ color: '#2f797c' }}
            >
              ← Back to Locations
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTINENT HIGHLIGHTS ── */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">What to expect</p>
            <h2 className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              A world of different experiences
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              No two continents feel the same. Here's what makes each one worth exploring.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                emoji: '🏰',
                continent: 'Europe',
                slug: 'europe',
                headline: 'History, culture and some of the world\'s great cities.',
                body: 'Europe packs extraordinary variety into a relatively compact space. You can eat your way through the trattorias of Bologna, walk the medieval lanes of Prague, stand on the white cliffs of the Algarve and take a sleeper train through the Alps - all within the same two-week trip. The infrastructure is excellent, the food is world-class and the density of UNESCO heritage sites is unlike anywhere else on earth.',
                bestFor: 'City breaks, food travel, history and art',
                mustSee: 'Paris, Rome, Amsterdam, Lisbon, Edinburgh',
              },
              {
                emoji: '🕌',
                continent: 'Asia',
                slug: 'asia',
                headline: 'Ancient temples, dazzling food and relentless energy.',
                body: 'Asia is the world\'s largest and most diverse continent - and that diversity is exactly what makes it so compelling. Tokyo\'s ordered precision sits alongside the beautiful chaos of Bangkok\'s street markets. The spiritual calm of Kyoto\'s temples is a world away from the neon towers of Hong Kong. Whether you want beach, jungle, mountain or megacity, Asia has it - often all within the same country.',
                bestFor: 'Adventure, food, culture, backpacking',
                mustSee: 'Tokyo, Bangkok, Bali, Singapore, Vietnam',
              },
              {
                emoji: '🗽',
                continent: 'North America',
                slug: 'north-america',
                headline: 'Road trips, skylines and landscapes on a cinematic scale.',
                body: 'North America\'s sheer scale is part of the experience. The drive from the Grand Canyon to Las Vegas as the sun sets. The Pacific Coast Highway with the windows down. New York in December, when the whole city feels like a film set. Canada adds glacial lakes, enormous national parks and some of the world\'s most liveable cities. There is no other continent where the road trip is quite so much a part of the culture.',
                bestFor: 'Road trips, city breaks, national parks',
                mustSee: 'New York, Los Angeles, Toronto, New Orleans, Vancouver',
              },
              {
                emoji: '🌴',
                continent: 'South America',
                slug: 'south-america',
                headline: 'Rainforests, ruins and the planet\'s most dramatic landscapes.',
                body: 'South America rewards travellers who lean into the unexpected. The Amazon is the world\'s greatest wilderness. Patagonia\'s granite spires are unlike anything else on earth. Machu Picchu is genuinely worth the hype. And in between - the tango bars of Buenos Aires, the carnival energy of Rio, the colonial splendour of Cartagena - there is a richness of culture that few continents can match.',
                bestFor: 'Adventure, wildlife, culture, history',
                mustSee: 'Buenos Aires, Rio de Janeiro, Machu Picchu, Cartagena',
              },
              {
                emoji: '🦁',
                continent: 'Africa',
                slug: 'africa',
                headline: 'Safari, coastline and the world\'s most extraordinary wildlife.',
                body: 'Africa is a continent that changes people. Watching the Serengeti migration from a Land Rover at dawn. Diving the coral reefs off Zanzibar. Hiking Table Mountain above Cape Town as the clouds roll in off the Atlantic. Morocco\'s medinas and desert dunes are just a short flight from Europe, making them an accessible first taste of a continent that will pull you back again and again.',
                bestFor: 'Safari, wildlife, beach, adventure',
                mustSee: 'Cape Town, Marrakech, Zanzibar, Nairobi, Victoria Falls',
              },
              {
                emoji: '🦘',
                continent: 'Oceania',
                slug: 'oceania',
                headline: 'The ends of the earth - and worth every hour of the flight.',
                body: 'Australia and New Zealand are long-haul destinations, but they deliver in proportion to the journey. Sydney\'s harbour is one of the world\'s great urban backdrops. The Great Barrier Reef remains a genuine wonder. New Zealand\'s South Island offers the most cinematic landscapes on earth - fjords, glaciers, vineyards and mountains within an hour of each other. The Pacific islands add a slower, more remote kind of paradise.',
                bestFor: 'Nature, adventure, beach, long stays',
                mustSee: 'Sydney, Melbourne, Queenstown, Fiji, Great Barrier Reef',
              },
            ].map(({ emoji, continent, slug, headline, body, bestFor, mustSee }) => (
              <div key={continent} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="shrink-0 text-5xl">{emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1" style={{ color: '#232e4e' }}>{continent}</h3>
                    <p className="text-[#2f797c] font-medium text-sm mb-3">{headline}</p>
                    <p className="text-gray-600 leading-relaxed text-sm mb-5">{body}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                      <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Best for</p>
                        <p className="text-sm font-semibold text-slate-700">{bestFor}</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Must-see destinations</p>
                        <p className="text-sm font-semibold text-slate-700">{mustSee}</p>
                      </div>
                    </div>
                    <Link
                      href={`/locations/${slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold transition hover:opacity-75"
                      style={{ color: '#2f797c' }}
                    >
                      Explore {continent} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR DESTINATIONS ── */}
      <section className="py-20 px-6 bg-white border-t">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-2">Hand picked</p>
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            Popular Destinations Around the World
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            A curated selection of iconic cities across the globe - perfect for planning your next adventure.
          </p>

          <div className="grid md:grid-cols-3 gap-12 text-left">
            {/* Europe */}
            <div>
              <h3 className="font-bold text-xl mb-4" style={{ color: '#232e4e' }}>🏰 Europe</h3>
              <ul className="space-y-3">
                {[
                  { label: 'Paris, France', href: '/locations/europe/france/paris' },
                  { label: 'Rome, Italy', href: '/locations/europe/italy/rome' },
                  { label: 'Barcelona, Spain', href: '/locations/europe/spain/barcelona' },
                  { label: 'Lisbon, Portugal', href: '/locations/europe/portugal/lisbon' },
                  { label: 'Amsterdam, Netherlands', href: '/locations/europe/netherlands/amsterdam' },
                  { label: 'Edinburgh, UK', href: '/locations/europe/united-kingdom/edinburgh' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-[#2f797c] underline underline-offset-2 hover:opacity-70 transition flex items-center gap-1">
                      <span>{label}</span><span className="text-sm">↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Asia */}
            <div>
              <h3 className="font-bold text-xl mb-4" style={{ color: '#232e4e' }}>🕌 Asia</h3>
              <ul className="space-y-3">
                {[
                  { label: 'Tokyo, Japan', href: '/locations/asia/japan/tokyo' },
                  { label: 'Bangkok, Thailand', href: '/locations/asia/thailand/bangkok' },
                  { label: 'Singapore', href: '/locations/asia/singapore/singapore' },
                  { label: 'Bali, Indonesia', href: '/locations/asia/indonesia/bali' },
                  { label: 'Dubai, UAE', href: '/locations/asia/uae/dubai' },
                  { label: 'Delhi, India', href: '/locations/asia/india/delhi' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-[#2f797c] underline underline-offset-2 hover:opacity-70 transition flex items-center gap-1">
                      <span>{label}</span><span className="text-sm">↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Americas */}
            <div>
              <h3 className="font-bold text-xl mb-4" style={{ color: '#232e4e' }}>🗽 The Americas</h3>
              <ul className="space-y-3">
                {[
                  { label: 'New York City, USA', href: '/locations/north-america/usa/new-york' },
                  { label: 'Los Angeles, USA', href: '/locations/north-america/usa/los-angeles' },
                  { label: 'Toronto, Canada', href: '/locations/north-america/canada/toronto' },
                  { label: 'Orlando, USA', href: '/locations/north-america/usa/orlando' },
                  { label: 'Buenos Aires, Argentina', href: '/locations/south-america/argentina/buenos-aires' },
                  { label: 'Rio de Janeiro, Brazil', href: '/locations/south-america/brazil/rio-de-janeiro' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-[#2f797c] underline underline-offset-2 hover:opacity-70 transition flex items-center gap-1">
                      <span>{label}</span><span className="text-sm">↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRAVEL BY TYPE ── */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Travel your way</p>
            <h2 className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              Not sure which continent is right for you?
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Sometimes it helps to start with what you want to do - then find the continent that delivers it best.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { emoji: '🦁', type: 'Safari & Wildlife', where: 'Africa, South America', href: '/locations/africa' },
              { emoji: '🏖️', type: 'Beach & Islands', where: 'Oceania, Asia, Caribbean', href: '/locations/oceania' },
              { emoji: '🏛️', type: 'History & Culture', where: 'Europe, Asia, South America', href: '/locations/europe' },
              { emoji: '🧗', type: 'Adventure & Hiking', where: 'South America, Oceania, Asia', href: '/locations/south-america' },
              { emoji: '🍽️', type: 'Food & Drink', where: 'Europe, Asia, North America', href: '/locations/europe' },
              { emoji: '🏙️', type: 'City Breaks', where: 'Europe, North America, Asia', href: '/locations/north-america' },
            ].map(({ emoji, type, where, href }) => (
              <Link
                key={type}
                href={href}
                className="group rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-lg transition-all text-center"
              >
                <div className="text-3xl mb-2">{emoji}</div>
                <h3 className="font-bold text-sm mb-1 group-hover:text-[#2f797c] transition-colors" style={{ color: '#232e4e' }}>{type}</h3>
                <p className="text-xs text-gray-400">{where}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANNING TIPS ── */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-400 mb-1">Before you go</p>
            <h2 className="text-3xl font-bold text-white">Planning tips by journey type</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                emoji: '🏃',
                tip: 'Short break (2–4 nights)',
                detail: 'Stick to one city or region. Europe and Asia have excellent short-haul connections that make multi-city breaks very achievable.',
              },
              {
                emoji: '📅',
                tip: 'One to two weeks',
                detail: 'The sweet spot for most international trips. Enough time to explore one country properly or two neighbouring countries at a relaxed pace.',
              },
              {
                emoji: '🌏',
                tip: 'Three weeks or more',
                detail: 'Consider crossing a continent. Interrail through Europe, a Southeast Asia loop or Australia\'s east coast all work brilliantly at this length.',
              },
              {
                emoji: '🎒',
                tip: 'Open-ended travel',
                detail: 'South America and Southeast Asia are the classic backpacker circuits for good reason - affordable, well-connected and endlessly rewarding.',
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

      {/* ── TRAVEL INSPIRATION ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-2">Go deeper</p>
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            Need Travel Inspiration?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            From tropical escapes to cultural city breaks, our travel guides help you plan unforgettable journeys. We cover everything from when to go and where to stay to what to pack and what to do when you arrive.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/blog"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: '#2f797c' }}
            >
              Read Travel Guides
            </Link>
            <Link
              href="/hotels"
              className="inline-block px-8 py-3 rounded-lg font-semibold border transition hover:shadow-md"
              style={{ borderColor: '#232e4e', color: '#232e4e', backgroundColor: 'white' }}
            >
              Browse Hotels Worldwide
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}