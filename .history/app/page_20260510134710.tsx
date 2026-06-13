'use client'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Script from 'next/script'
import NextImage from 'next/image'
import Link from 'next/link'

import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import FlightSearch from '@/app/components/Search/FlightSearch'
import HotelSearch from '@/app/components/Search/HotelSearch'
import CarSearch from '@/app/components/Search/CarSearch'

import { useState } from 'react'

// JSON-LD structured data
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Timms Travel',
  url: 'https://timmstravel.com',
  logo: 'https://timmstravel.com/logo.png',
  description:
    'Timms Travel is a UK-based travel comparison platform helping you find cheap flights, hotels, experiences, car hire, travel insurance, airport transfers and eSIMs worldwide.',
  areaServed: 'Worldwide',
  serviceType: [
    'Flight Search',
    'Hotel Booking',
    'Car Hire',
    'Travel Experiences',
    'Travel Insurance',
    'Airport Transfers',
    'eSIM',
  ],
  sameAs: [],
}

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://timmstravel.com/#website',
  url: 'https://timmstravel.com',
  name: 'Timms Travel',
  description: 'Compare cheap flights, hotels, car hire and travel experiences worldwide.',
  inLanguage: 'en-GB',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://timmstravel.com/flights?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does Timms Travel find cheap flights?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Timms Travel compares hundreds of airlines and travel providers in real time, surfacing the best available prices for your route and dates without any hidden platform fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Timms Travel free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Searching flights, hotels, experiences and car hire on Timms Travel is completely free. We earn a small commission from partners when you book, at no extra cost to you.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Timms Travel offer travel insurance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Timms Travel offers travel insurance comparison through our Other Services section, helping you find cover that suits your trip and budget.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I get an eSIM through Timms Travel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Timms Travel provides eSIM options for international travellers so you can stay connected abroad without paying roaming charges.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Timms Travel provide airport transfers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can book airport transfers through Timms Travel for a stress-free arrival and departure at your destination.',
      },
    },
  ],
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'experiences' | 'cars'>('flights')
  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [dropoffDate, setDropoffDate] = useState('')
  const [loading] = useState(false)

  const handleCarSearch = () => {
    if (!pickupLocation || !pickupDate || !dropoffDate) return
    const url = `https://www.rentalcars.com/?affiliateCode=YOURAFFILIATETOKEN&preflocation=${encodeURIComponent(pickupLocation)}&puDay=${pickupDate}&doDay=${dropoffDate}`
    window.open(url, '_blank')
  }

  const destinations = [
    { city: 'London',     emoji: '🏙️', continent: 'europe',        country: 'united-kingdom', slug: 'london'     },
    { city: 'Manchester', emoji: '🐝', continent: 'europe',        country: 'united-kingdom', slug: 'manchester' },
    { city: 'Edinburgh',  emoji: '🏰', continent: 'europe',        country: 'united-kingdom', slug: 'edinburgh'  },
    { city: 'Barcelona',  emoji: '⛪', continent: 'europe',        country: 'spain',          slug: 'barcelona'  },
    { city: 'Delhi',      emoji: '🕌', continent: 'asia',          country: 'india',          slug: 'delhi'      },
    { city: 'New York',   emoji: '🗽', continent: 'north-america', country: 'usa',            slug: 'new-york'   },
    { city: 'Orlando',    emoji: '🎢', continent: 'north-america', country: 'usa',            slug: 'orlando'    },
    { city: 'Paris',      emoji: '🗼', continent: 'europe',        country: 'france',         slug: 'paris'      },
  ]

  return (
    <main className="min-h-screen bg-white">

      <Navbar />

      <Script
        src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
        data-gyg-partner-id="P7B7GRH"
        strategy="afterInteractive"
      />

      {/* JSON-LD */}
      <Script id="schema-org" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <Script id="schema-website" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <Script id="schema-faq" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="relative overflow-hidden text-white py-24 px-6 text-center" aria-labelledby="hero-heading">
        <NextImage
          src="https://images.unsplash.com/photo-1501426026826-31c667bdf23d"
          alt="Aerial view of a beautiful travel destination with turquoise water and white sand beaches"
          fill
          className="object-cover object-[center_40%]"
          priority
        />
        <div className="absolute inset-0 bg-[#232e4e]/70 z-0" aria-hidden="true" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">Timms Travel</p>
          <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Compare Flights, Hotels, Experiences and More
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto mb-10">
            Search hundreds of airlines, hotels and travel providers worldwide. Live prices, no hidden fees and everything you need for your trip in one place.
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

      {/* WHAT WE OFFER */}
      <section className="py-16 px-6 bg-white" aria-labelledby="services-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Everything in one place</p>
            <h2 id="services-heading" className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              One platform. Every part of your trip.
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
              Timms Travel brings flights, hotels, experiences, car hire, travel insurance, airport transfers and eSIMs together so you can plan your entire journey without switching between a dozen different websites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                emoji: '✈️',
                title: 'Flights',
                href: '/flights',
                color: '#232e4e',
                bg: '#232e4e12',
                body: 'Search and compare flights to hundreds of destinations worldwide. Whether you want the cheapest fare or the most convenient route, we surface the options that matter.',
              },
              {
                emoji: '🏨',
                title: 'Hotels',
                href: '/hotels',
                color: '#03989e',
                bg: '#03989e12',
                body: 'From five-star luxury to smart budget stays, browse curated hotel picks across every major destination with live prices and no booking fees.',
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
                body: 'Compare rental cars from leading providers worldwide. Pick up at the airport or in the city with flexibility built in from the start.',
              },
            ].map(({ emoji, title, href, color, bg, body }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all"
                style={{ backgroundColor: bg }}
                title={`${title} - Timms Travel`}
              >
                <div className="text-3xl mb-4" aria-hidden="true">{emoji}</div>
                <h3 className="font-bold text-lg mb-2 group-hover:underline" style={{ color }}>{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                <span className="mt-4 inline-block text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>
                  Explore {title} →
                </span>
              </Link>
            ))}
          </div>

          {/* Other Services row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: '🌐',
                title: 'eSIMs',
                href: '/other-services/esims',
                color: '#6d28d9',
                bg: '#6d28d912',
                body: 'Stay connected abroad without expensive roaming charges. Buy an eSIM before you fly and get instant data coverage in 100+ countries.',
              },
              {
                emoji: '🛡️',
                title: 'Travel Insurance',
                href: '/other-services/travel-insurance',
                color: '#be123c',
                bg: '#be123c12',
                body: 'Never travel unprotected. Compare travel insurance policies covering cancellations, medical emergencies, lost luggage and flight delays.',
              },
              {
                emoji: '🚐',
                title: 'Airport Transfers',
                href: '/other-services/airport-transfers',
                color: '#0369a1',
                bg: '#0369a112',
                body: 'Pre-book your airport transfer and arrive stress-free. Fixed prices, professional drivers and no waiting around for a taxi on arrival.',
              },
            ].map(({ emoji, title, href, color, bg, body }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all"
                style={{ backgroundColor: bg }}
                title={`${title} - Timms Travel`}
              >
                <div className="text-3xl mb-4" aria-hidden="true">{emoji}</div>
                <h3 className="font-bold text-lg mb-2 group-hover:underline" style={{ color }}>{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                <span className="mt-4 inline-block text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>
                  Explore {title} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR EXPERIENCES */}
      <section className="hidden md:block py-16 px-6 bg-gray-50" aria-labelledby="experiences-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Hand picked</p>
            <h2 id="experiences-heading" className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              Popular Experiences
            </h2>
            <p className="text-gray-500 mt-2">
              Top rated tours and activities from destinations around the world, bookable in minutes.
            </p>
          </div>
          <div data-gyg-widget="auto" data-gyg-partner-id="P7B7GRH" aria-label="GetYourGuide experience widgets"></div>
          <div className="text-center mt-8">
            <Link
              href="/experiences"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: '#03989e' }}
            >
              Browse All Experiences →
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6 bg-white" aria-labelledby="how-it-works-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Simple process</p>
            <h2 id="how-it-works-heading" className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              How Timms Travel Works
            </h2>
            <p className="text-center text-gray-500 mt-2">
              From first search to final booking in three straightforward steps.
            </p>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                n: 1,
                title: 'Search',
                text: 'Enter your destination and travel dates. Instantly unlock thousands of flights, hotels, experiences and car hire options from trusted providers around the world.',
              },
              {
                n: 2,
                title: 'Compare',
                text: 'Browse results side by side from leading travel providers. Filter by price, rating or type so you can find exactly what suits your trip and budget.',
              },
              {
                n: 3,
                title: 'Book',
                text: 'Build your perfect trip and book with confidence. Flights, hotels, experiences and car hire all in one place with no juggling between multiple websites or hidden charges at checkout.',
              },
            ].map(({ n, title, text }) => (
              <li key={n} className="text-center list-none">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4" style={{ backgroundColor: '#2f797c' }} aria-hidden="true">
                  {n}
                </div>
                <h3 className="font-bold text-xl mb-2" style={{ color: '#232e4e' }}>{title}</h3>
                <p className="text-gray-500 leading-7">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-12 px-6" aria-label="Timms Travel at a glance">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: '700+',   label: 'Destinations Worldwide' },
            { stat: '500+',   label: 'Airlines Compared'      },
            { stat: '1,000+', label: 'Experiences to Browse'  },
            { stat: '24/7',   label: 'Customer Support'       },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-4xl font-bold mb-1" style={{ color: '#03989e' }}>{stat}</p>
              <p className="text-gray-300 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="py-16 px-6 bg-gray-50" aria-labelledby="destinations-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Explore</p>
            <h2 id="destinations-heading" className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              Popular Destinations
            </h2>
            <p className="text-center text-gray-500 mt-2">
              Some of our most searched destinations. Click to explore flights, hotels, experiences and more.
            </p>
          </div>

          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destinations.map((dest) => (
              <li key={dest.city}>
                <Link
                  href={`/locations/${dest.continent}/${dest.country}/${dest.slug}`}
                  className="block rounded-2xl border border-gray-100 bg-white p-6 text-center hover:shadow-xl transition cursor-pointer"
                  title={`Flights, hotels and things to do in ${dest.city}`}
                >
                  <div className="text-4xl mb-2" aria-hidden="true">{dest.emoji}</div>
                  <p className="font-semibold text-sm" style={{ color: '#232e4e' }}>{dest.city}</p>
                  <p className="text-xs mt-1" style={{ color: '#2f797c' }}>Discover More</p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="text-center mt-8">
            <Link href="/locations/continents" className="btn-primary inline-block">View All Destinations</Link>
          </div>
        </div>
      </section>

      {/* TRIP INSPIRATION */}
      <section className="py-16 px-6 bg-white border-t border-gray-100" aria-labelledby="inspiration-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Not sure where to go?</p>
            <h2 id="inspiration-heading" className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              Find Your Perfect Trip
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              Browse by travel style and let us point you in the right direction. Whatever kind of trip you are planning, Timms Travel has the tools to help.
            </p>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: '🌴',
                title: 'Sun and Beach',
                body: 'White sand, warm water and nothing on the agenda. From the Canaries to the Caribbean, we will find you the right resort and the right room.',
                cta: 'Browse beach hotels',
                href: '/hotels',
              },
              {
                emoji: '🏛️',
                title: 'City Breaks',
                body: 'A long weekend in a great city is one of life\'s simple pleasures. Flights on Friday, back by Monday with the best boutique hotels in between.',
                cta: 'Search city breaks',
                href: '/hotels',
              },
              {
                emoji: '🧗',
                title: 'Adventure and Outdoors',
                body: 'Trek, ski, dive or climb. The world\'s most thrilling destinations are closer than you think. We will get you there and find you somewhere to sleep.',
                cta: 'Explore experiences',
                href: '/experiences',
              },
              {
                emoji: '🍽️',
                title: 'Food and Culture',
                body: 'Some trips are really just an excuse to eat well and see great art. Tokyo, Lisbon, Bologna. We know exactly where to send you.',
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
                title: 'Couples and Romance',
                body: 'Honeymoons, anniversaries or just a trip you will both remember. Boutique hotels, private tours and destinations made for two.',
                cta: 'Find romantic stays',
                href: '/hotels',
              },
            ].map(({ emoji, title, body, cta, href }) => (
              <li key={title} className="list-none">
                <Link
                  href={href}
                  className="group flex flex-col h-full rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:border-teal-200 hover:bg-teal-50/30 transition-all"
                  title={title}
                >
                  <div className="text-3xl mb-3" aria-hidden="true">{emoji}</div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-[#03989e] transition-colors" style={{ color: '#232e4e' }}>
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{body}</p>
                  <span className="text-xs font-bold text-[#03989e] opacity-0 group-hover:opacity-100 transition-opacity">
                    {cta} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* OTHER SERVICES */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100" aria-labelledby="other-services-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Beyond the basics</p>
            <h2 id="other-services-heading" className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              Everything Else Your Trip Needs
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
              A great trip is more than just flights and hotels. Timms Travel also covers the practical essentials that too many travellers forget until the last minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: '🌐',
                title: 'eSIMs for Travellers',
                href: '/other-services/esims',
                color: '#6d28d9',
                body: 'Avoid expensive roaming charges with an eSIM. Get instant mobile data coverage in over 100 countries before you even board your flight. No physical SIM card needed.',
                cta: 'Get an eSIM',
              },
              {
                emoji: '🛡️',
                title: 'Travel Insurance',
                href: '/other-services/travel-insurance',
                color: '#be123c',
                body: 'Travel insurance is not optional. Compare policies covering trip cancellation, medical emergencies, lost baggage, flight delays and more. Find cover that fits your trip.',
                cta: 'Compare insurance',
              },
              {
                emoji: '🚐',
                title: 'Airport Transfers',
                href: '/other-services/airport-transfers',
                color: '#0369a1',
                body: 'Pre-book a private or shared airport transfer and start your trip the right way. Fixed prices, professional drivers and no queuing for a taxi after a long flight.',
                cta: 'Book a transfer',
              },
            ].map(({ emoji, title, href, color, body, cta }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-2xl border border-gray-100 bg-white p-8 hover:shadow-lg transition-all"
                title={title}
              >
                <div className="text-4xl mb-4" aria-hidden="true">{emoji}</div>
                <h3 className="font-bold text-xl mb-3 group-hover:underline" style={{ color }}>{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{body}</p>
                <span className="inline-block text-xs font-bold px-4 py-2 rounded-full text-white transition-opacity" style={{ backgroundColor: color }}>
                  {cta} →
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/other-services"
              className="inline-block px-7 py-3 rounded-2xl font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#232e4e' }}
            >
              View All Other Services →
            </Link>
          </div>
        </div>
      </section>

      {/* TRAVEL TIPS */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-14 px-6" aria-labelledby="tips-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-400 mb-1">Travel smarter</p>
            <h2 id="tips-heading" className="text-3xl font-bold text-white">Quick Tips Before You Book</h2>
            <p className="text-gray-400 mt-2 max-w-lg mx-auto text-sm">
              Small things that make a big difference. From booking windows to passport rules, here is what to check before you confirm.
            </p>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                emoji: '📅',
                tip: 'Book Flights 6 to 8 Weeks Out',
                detail: 'For most routes, this window offers the best balance of seat availability and price. Last-minute rarely means cheaper.',
              },
              {
                emoji: '🛂',
                tip: 'Check Your Passport Validity',
                detail: 'Many countries require at least 6 months of validity beyond your return date. Check before you book, not at the airport.',
              },
              {
                emoji: '💳',
                tip: 'Tell Your Bank Before You Go',
                detail: 'Banks routinely block foreign transactions without prior notice. A quick call or app notification saves a lot of stress abroad.',
              },
              {
                emoji: '🧾',
                tip: 'Download Everything Offline',
                detail: 'Hotel confirmations, boarding passes and maps should be saved offline. Airport Wi-Fi is never as reliable as you need it to be.',
              },
              {
                emoji: '🌐',
                tip: 'Get an eSIM Before You Fly',
                detail: 'Roaming charges add up fast. An eSIM gives you instant data coverage abroad at a fraction of the cost. Set it up before departure.',
              },
              {
                emoji: '🛡️',
                tip: 'Buy Insurance When You Book',
                detail: 'Travel insurance is only useful if you have it before something goes wrong. Buy it the same day you book your flights.',
              },
              {
                emoji: '🚐',
                tip: 'Pre-Book Your Airport Transfer',
                detail: 'Arriving tired and hunting for a taxi is avoidable. A pre-booked transfer means a driver with your name waiting when you land.',
              },
              {
                emoji: '🧳',
                tip: 'Check Baggage Allowances',
                detail: 'Budget airlines charge significantly more for baggage added at the airport. Always add hold luggage at the time of booking.',
              },
            ].map(({ emoji, tip, detail }) => (
              <li key={tip} className="rounded-2xl bg-white/10 border border-white/10 p-5 list-none">
                <div className="text-2xl mb-3" aria-hidden="true">{emoji}</div>
                <h3 className="font-bold text-white text-sm mb-1">{tip}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 px-6 bg-white" aria-labelledby="why-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Why Timms Travel</p>
            <h2 id="why-heading" className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              Built for Real Travellers
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              We built Timms Travel because booking a trip should be straightforward, not a battle across a dozen different websites.
            </p>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
            {[
              {
                emoji: '🌍',
                title: 'Worldwide Coverage',
                text: 'Available across 100+ countries, from capital cities to coastlines that most booking sites do not bother covering.',
              },
              {
                emoji: '💰',
                title: 'Competitive Pricing',
                text: 'We compare all major providers in real time so you are always seeing the best available price, not a padded one.',
              },
              {
                emoji: '🔓',
                title: 'Flexible Bookings',
                text: 'Plans change and we get it. We work with providers who offer genuine flexibility, not fine print that traps you.',
              },
            ].map(({ emoji, title, text }) => (
              <li key={title} className="list-none">
                <div className="text-4xl mb-3" aria-hidden="true">{emoji}</div>
                <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>

          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 md:p-10 max-w-4xl mx-auto">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
              <p>
                Timms Travel was built in the United Kingdom with one goal in mind: making travel planning genuinely simple. Too many booking platforms bury the best deals behind endless upsells, confusing filters and prices that look great until checkout. We do things differently.
              </p>
              <p>
                Whether you are searching for a last-minute city break, comparing hotel options for a family holiday or looking for something to do when you land, Timms Travel gives you honest results from trusted providers, all in one place.
              </p>
              <p>
                We partner with leading travel companies to bring you live availability and genuine prices across flights, hotels, experiences, car hire, travel insurance, airport transfers and eSIMs. No markup, no hidden platform fees. What you see is what you pay.
              </p>
              <p>
                From a quick weekend in Barcelona to a month-long adventure in Southeast Asia, Timms Travel is built to handle every kind of trip, for every kind of traveller.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HUB LINKS */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100" aria-labelledby="hubs-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Explore further</p>
            <h2 id="hubs-heading" className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              Dive Into a Dedicated Hub
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
                body: 'Curated hotels by city, best-time-to-visit guides and a full search tool. The most complete hotel planning resource on Timms Travel.',
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
              {
                href: '/other-services/travel-insurance',
                emoji: '🛡️',
                title: 'Travel Insurance Hub',
                body: 'Compare travel insurance policies from leading providers. Find cover for single trips, annual multi-trip policies and specialist travel needs.',
                color: '#be123c',
              },
              {
                href: '/other-services/airport-transfers',
                emoji: '🚐',
                title: 'Airport Transfers Hub',
                body: 'Pre-book private and shared transfers at airports worldwide. Transparent pricing, professional drivers and no hidden extras.',
                color: '#0369a1',
              },
            ].map(({ href, emoji, title, body, color }) => (
              <Link
                key={title}
                href={href}
                className="group flex items-start gap-5 rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-lg transition-all"
                title={title}
              >
                <div
                  className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${color}15` }}
                  aria-hidden="true"
                >
                  {emoji}
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1 group-hover:underline" style={{ color }}>{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                  <span className="mt-2 inline-block text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>
                    Visit hub →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-white border-t border-gray-100" aria-labelledby="faq-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Common questions</p>
            <h2 id="faq-heading" className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 mt-2">
              Everything you need to know about booking travel with Timms Travel.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How does Timms Travel find cheap flights?',
                a: 'Timms Travel compares hundreds of airlines and travel providers in real time, surfacing the best available prices for your route and dates. There are no hidden platform fees and no markup on the prices we show.',
              },
              {
                q: 'Is Timms Travel free to use?',
                a: 'Yes. Searching flights, hotels, experiences and car hire on Timms Travel is completely free. We earn a small commission from our partners when you book, at no extra cost to you.',
              },
              {
                q: 'Does Timms Travel offer travel insurance?',
                a: 'Yes. You can compare travel insurance policies through our Other Services section. We help you find cover for single trips, annual multi-trip policies and specialist travel needs.',
              },
              {
                q: 'Can I get an eSIM through Timms Travel?',
                a: 'Yes. Our eSIM service lets you buy instant mobile data coverage for 100+ countries before you fly, with no physical SIM card needed and no expensive roaming charges.',
              },
              {
                q: 'Does Timms Travel provide airport transfers?',
                a: 'Yes. You can pre-book private or shared airport transfers through Timms Travel. Fixed prices, professional drivers and no waiting around for a taxi after a long flight.',
              },
              {
                q: 'Are there hidden fees on Timms Travel?',
                a: 'No. We aim to show the full price upfront including taxes and charges. There are no hidden platform fees added by Timms Travel. You book directly with the provider at the price shown.',
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
                  style={{ color: '#232e4e' }}
                  itemProp="name"
                >
                  {q}
                  <span className="ml-4 text-gray-400 shrink-0 group-open:rotate-180 transition-transform duration-200" aria-hidden="true">
                    ▾
                  </span>
                </summary>
                <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed" itemProp="text">{a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section
        className="py-16 px-6 text-center text-white"
        style={{ backgroundColor: '#232e4e' }}
        aria-labelledby="cta-heading"
      >
        <div className="max-w-2xl mx-auto">
          <h2 id="cta-heading" className="text-3xl font-bold mb-4">Ready to Start Planning?</h2>
          <p className="text-gray-300 mb-8">
            Search flights, hotels, experiences, car hire, travel insurance, airport transfers and eSIMs all in one place. No hidden fees. No surprises. Just great travel at honest prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/flights/search"
              className="inline-block px-8 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: '#2dd4bf', color: '#232e4e' }}
              aria-label="Search flights with Timms Travel"
            >
              Search Flights →
            </Link>
            <Link
              href="/other-services"
              className="inline-block px-8 py-3 rounded-full font-semibold text-sm border border-white/30 text-white transition-all hover:bg-white/10"
              aria-label="View all other travel services"
            >
              View Other Services →
            </Link>
          </div>
        </div>
      </section>

      <Footer />

    </main>
  )
}