// ============================================
// LOCATIONS PAGE - app/locations/page.tsx
// URL: timmstravel.com/locations
// ============================================

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: {
    default: "Timms Travel | Locations",
    template: "Timms Travel |",
  },
  description: "Discover amazing experiences around the world.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function Locations() {
  const ukDestinations = [
    {
      city: 'London',
      airport: 'Heathrow Airport',
      emoji: '🏙️',
      description:
        'The world in one city. From the theatres of the West End to the galleries of South Kensington, London rewards every kind of traveller. Day trips to the Cotswolds, Windsor Castle and Brighton are all easily within reach.',
      continent: 'europe',
      country: 'united-kingdom',
      slug: 'london',
      highlight: 'World-class museums, food scene and nightlife',
    },
    {
      city: 'Manchester',
      airport: 'Manchester Airport',
      emoji: '🐝',
      description:
        'The heart of the North. A city of music, football and genuine northern warmth. Use it as a base to explore the Peak District, Lake District and the stunning moorland of the Pennines just beyond the city limits.',
      continent: 'europe',
      country: 'united-kingdom',
      slug: 'manchester',
      highlight: 'Gateway to the Peak District and Lake District',
    },
    {
      city: 'Edinburgh',
      airport: 'Edinburgh Airport',
      emoji: '🏰',
      description:
        "Scotland's dramatic capital sits between an ancient volcano and a royal palace. One of Britain's most beautiful cities, it's the perfect jumping-off point for the Highlands, Loch Ness and the whisky distilleries of Speyside.",
      continent: 'europe',
      country: 'united-kingdom',
      slug: 'edinburgh',
      highlight: 'Highlands, whisky trails and festival season',
    },
    {
      city: 'Birmingham',
      airport: 'Birmingham Airport',
      emoji: '🏭',
      description:
        "Britain's second city has quietly become one of its most exciting food destinations. Its central location also makes it the ideal base for day trips to Stratford-upon-Avon, the Cotswolds and Ironbridge.",
      continent: 'europe',
      country: 'united-kingdom',
      slug: 'birmingham',
      highlight: 'Midlands hub with easy access to the Cotswolds',
    },
    {
      city: 'Bristol',
      airport: 'Bristol Airport',
      emoji: '🌉',
      description:
        "One of Britain's most creative and independent-minded cities. Banksy's home turf is also the gateway to the South West — drive down to Cornwall, the Jurassic Coast or the rolling hills of the Brecon Beacons.",
      continent: 'europe',
      country: 'united-kingdom',
      slug: 'bristol',
      highlight: 'Gateway to Cornwall and the Jurassic Coast',
    },
    {
      city: 'Glasgow',
      airport: 'Glasgow Airport',
      emoji: '🎶',
      description:
        "Scotland's biggest city has more going on than its quieter neighbour Edinburgh gets credit for. Incredible Victorian architecture, a world-class music scene and easy access to Loch Lomond and the Trossachs National Park.",
      continent: 'europe',
      country: 'united-kingdom',
      slug: 'glasgow',
      highlight: 'Loch Lomond, the Trossachs and the west coast',
    },
  ]

  const europeDestinations = [
    {
      city: 'Barcelona',
      country: 'Spain',
      emoji: '🇪🇸',
      description:
        'Gaudí, tapas, golden beaches and a football club that needs no introduction. Explore beyond the city to the Costa Brava, Montserrat and the Pyrenees.',
      continent: 'europe',
      countrySlug: 'spain',
      slug: 'barcelona',
    },
    {
      city: 'Paris',
      country: 'France',
      emoji: '🇫🇷',
      description:
        'The world\'s most visited city for good reason. Art, fashion, food and architecture in extraordinary concentration — and the Loire Valley a short drive away.',
      continent: 'europe',
      countrySlug: 'france',
      slug: 'paris',
    },
    {
      city: 'Rome',
      country: 'Italy',
      emoji: '🇮🇹',
      description:
        'Two thousand years of history at every turn. Drive through Tuscany, explore the Amalfi Coast or head south toward Sicily — Italy is made for the road.',
      continent: 'europe',
      countrySlug: 'italy',
      slug: 'rome',
    },
    {
      city: 'Malaga',
      country: 'Spain',
      emoji: '🌞',
      description:
        'The gateway to the Costa del Sol. Pick up your hire car at the airport and all of Andalusia is yours — whitewashed villages, flamenco and world-class food.',
      continent: 'europe',
      countrySlug: 'spain',
      slug: 'malaga',
    },
    {
      city: 'Amsterdam',
      country: 'Netherlands',
      emoji: '🇳🇱',
      description:
        'Canal rings, world-class museums and the most cycle-friendly city on earth. One of Europe\'s great short-break destinations — beautiful in every season.',
      continent: 'europe',
      countrySlug: 'netherlands',
      slug: 'amsterdam',
    },
    {
      city: 'Lisbon',
      country: 'Portugal',
      emoji: '🇵🇹',
      description:
        'Cobbled hills, fado music, custard tarts and a coastline that stretches all the way to the Algarve. One of Europe\'s most loved city break destinations.',
      continent: 'europe',
      countrySlug: 'portugal',
      slug: 'lisbon',
    },
    {
      city: 'Prague',
      country: 'Czech Republic',
      emoji: '🏰',
      description:
        'Medieval squares, Gothic spires and a culture of great beer and live music. Central Europe\'s most beautiful city is one of the continent\'s best value breaks.',
      continent: 'europe',
      countrySlug: 'czech-republic',
      slug: 'prague',
    },
    {
      city: 'Tenerife',
      country: 'Spain',
      emoji: '🌋',
      description:
        'Year-round sunshine, dramatic volcanic landscapes and resorts to suit every budget. The most popular Spanish island with British tourists — and with good reason.',
      continent: 'europe',
      countrySlug: 'spain',
      slug: 'tenerife',
    },
  ]

  const worldDestinations = [
    {
      city: 'New York',
      country: 'USA',
      emoji: '🗽',
      description:
        'The city that never sleeps lives up to every expectation. The skyline, the food, the energy — and beyond the city, the Catskills, Hamptons and New England coast.',
      continent: 'north-america',
      countrySlug: 'usa',
      slug: 'new-york',
    },
    {
      city: 'Dubai',
      country: 'UAE',
      emoji: '🇦🇪',
      description:
        'A city of extraordinary ambition. World-record skyscrapers, desert safaris, luxury shopping and beaches that bake in reliable winter sunshine.',
      continent: 'asia',
      countrySlug: 'united-arab-emirates',
      slug: 'dubai',
    },
    {
      city: 'Sydney',
      country: 'Australia',
      emoji: '🇦🇺',
      description:
        'The harbour, the Opera House, the beaches. Australia\'s most iconic city is also the starting point for some of the world\'s great road trips — north and south.',
      continent: 'oceania',
      countrySlug: 'australia',
      slug: 'sydney',
    },
    {
      city: 'Cancun',
      country: 'Mexico',
      emoji: '🇲🇽',
      description:
        'Hire a car and discover the Yucatan Peninsula — ancient Mayan ruins at Chichen Itza, crystal-clear cenotes and hidden beaches well beyond the resort strip.',
      continent: 'north-america',
      countrySlug: 'mexico',
      slug: 'cancun',
    },
    {
      city: 'Tokyo',
      country: 'Japan',
      emoji: '🇯🇵',
      description:
        'Ancient temples and neon towers in perfect coexistence. The food alone justifies the flight — and beyond the city, Kyoto, Nikko and Mount Fuji beckon.',
      continent: 'asia',
      countrySlug: 'japan',
      slug: 'tokyo',
    },
    {
      city: 'Bangkok',
      country: 'Thailand',
      emoji: '🇹🇭',
      description:
        'Street food at every corner, golden temples and a nightlife scene unlike anywhere else. The ideal gateway for exploring Thailand\'s beaches and northern mountains.',
      continent: 'asia',
      countrySlug: 'thailand',
      slug: 'bangkok',
    },
    {
      city: 'Orlando',
      country: 'USA',
      emoji: '🎢',
      description:
        'The world\'s theme park capital. Walt Disney World, Universal Studios and Kennedy Space Center — the ultimate family destination with sunshine practically guaranteed.',
      continent: 'north-america',
      countrySlug: 'usa',
      slug: 'orlando',
    },
    {
      city: 'Cape Town',
      country: 'South Africa',
      emoji: '🇿🇦',
      description:
        'Table Mountain, the Cape Winelands and some of the world\'s finest coastal scenery. One of Africa\'s great cities — and a genuine bucket-list destination.',
      continent: 'africa',
      countrySlug: 'south-africa',
      slug: 'cape-town',
    },
  ]

  const travelTypes = [
    { emoji: '🌴', label: 'Sun & Beach', sub: 'Tenerife, Cancun, Dubai, Bali', href: '/locations/continents' },
    { emoji: '🏛️', label: 'History & Culture', sub: 'Rome, Athens, Kyoto, Cairo', href: '/locations/europe' },
    { emoji: '🦁', label: 'Safari & Wildlife', sub: 'Cape Town, Nairobi, Zanzibar', href: '/locations/africa' },
    { emoji: '🏙️', label: 'City Breaks', sub: 'London, Paris, New York, Tokyo', href: '/locations/continents' },
    { emoji: '🧗', label: 'Adventure', sub: 'Queenstown, Patagonia, Nepal', href: '/locations/continents' },
    { emoji: '👨‍👩‍👧', label: 'Family Holidays', sub: 'Orlando, Malaga, Tenerife', href: '/locations/continents' },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
          Timms Travel · Locations
        </p>
        <h1 className="text-5xl font-bold mb-4">Most Popular Destinations</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Whether you're exploring closer to home or heading somewhere a little more exotic, we've got flights, hotels and experiences covered across the UK and worldwide.
        </p>
      </section>

      {/* ── WHAT ARE YOU LOOKING FOR ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Find your trip</p>
            <h2 className="text-3xl font-bold" style={{ color: '#232e4e' }}>What kind of trip are you planning?</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Not sure where to start? Browse by travel type and we'll point you in the right direction.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {travelTypes.map(({ emoji, label, sub, href }) => (
              <a
                key={label}
                href={href}
                className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 hover:border-teal-200 hover:bg-teal-50/30 transition-all text-center"
              >
                <div className="text-3xl mb-2">{emoji}</div>
                <h3 className="font-bold text-sm mb-1 group-hover:text-[#2f797c] transition-colors" style={{ color: '#232e4e' }}>{label}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{sub}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── UK DESTINATIONS ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Closer to home</p>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>UK Destinations</h2>
            <p className="text-gray-500">
              From city breaks to coastal escapes — the best of Britain, with flights, hotels and experiences to match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ukDestinations.map((dest) => (
              <div key={dest.city} className="card hover:shadow-xl transition cursor-pointer">
                <div className="text-4xl mb-3">{dest.emoji}</div>
                <h3 className="font-bold text-xl mb-1" style={{ color: '#232e4e' }}>{dest.city}</h3>
                <p className="text-sm font-medium mb-1" style={{ color: '#2f797c' }}>✈ {dest.airport}</p>
                <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">{dest.highlight}</p>
                <p className="text-gray-500 text-sm leading-6">{dest.description}</p>
                <a
                  href={`/locations/${dest.continent}/${dest.country}/${dest.slug}`}
                  className="inline-block mt-4 text-sm font-semibold hover:opacity-75 transition"
                  style={{ color: '#2f797c' }}
                >
                  Search experiences in {dest.city} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EUROPE ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Just across the water</p>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>Europe</h2>
            <p className="text-gray-500">
              Short flights, huge variety. Europe packs more culture, food and history into a two-hour radius than anywhere else on earth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {europeDestinations.map((dest) => (
              <div key={dest.city} className="card hover:shadow-xl transition cursor-pointer">
                <div className="text-4xl mb-3">{dest.emoji}</div>
                <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>{dest.city}</h3>
                <p className="text-sm font-medium mb-3 text-gray-400">{dest.country}</p>
                <p className="text-gray-500 text-sm leading-6">{dest.description}</p>
                <a
                  href={`/locations/${dest.continent}/${dest.countrySlug}/${dest.slug}`}
                  className="inline-block mt-4 text-sm font-semibold hover:opacity-75 transition"
                  style={{ color: '#2f797c' }}
                >
                  Search experiences in {dest.city} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: '100+', label: 'Countries covered' },
            { stat: '500+', label: 'Destinations worldwide' },
            { stat: '1,000+', label: 'Experiences to browse' },
            { stat: '24/7', label: 'Support whenever you need it' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-4xl font-bold mb-1" style={{ color: '#03989e' }}>{stat}</p>
              <p className="text-gray-300 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WORLDWIDE DESTINATIONS ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Further afield</p>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>Worldwide Destinations</h2>
            <p className="text-gray-500">
              Heading further afield? From New York to Tokyo, Dubai to Cape Town — we've got the hotels, flights and experiences to match every long-haul adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {worldDestinations.map((dest) => (
              <div key={dest.city} className="card hover:shadow-xl transition cursor-pointer">
                <div className="text-4xl mb-3">{dest.emoji}</div>
                <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>{dest.city}</h3>
                <p className="text-sm font-medium mb-3 text-gray-400">{dest.country}</p>
                <p className="text-gray-500 text-sm leading-6">{dest.description}</p>
                <a
                  href={`/locations/${dest.continent}/${dest.countrySlug}/${dest.slug}`}
                  className="inline-block mt-4 text-sm font-semibold hover:opacity-75 transition"
                  style={{ color: '#2f797c' }}
                >
                  Search experiences in {dest.city} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Simple process</p>
            <h2 className="text-3xl font-bold" style={{ color: '#232e4e' }}>How to book with Timms Travel</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              From first search to final booking — here's how it works.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                n: 1,
                title: 'Pick your destination',
                text: 'Choose from our most popular destinations above or use our full search to find anywhere in the world. Every destination has its own page with hotels, flights and experiences tailored to that location.',
              },
              {
                n: 2,
                title: 'Compare your options',
                text: 'Browse hotels, flights and experiences from trusted providers side by side. Filter by price, type or rating — all the information you need to make the right call, in one place.',
              },
              {
                n: 3,
                title: 'Book with confidence',
                text: 'Click through to book directly with our trusted partners. No hidden platform fees, no surprise charges at checkout. The price you see is the price you pay.',
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

      {/* ── TRAVEL TIPS ── */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-400 mb-1">Travel smarter</p>
            <h2 className="text-3xl font-bold text-white">Things to sort before you go</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                emoji: '🛂',
                tip: 'Check your passport',
                detail: 'Many countries require 6 months of validity beyond your return date. Check before you book, not after.',
              },
              {
                emoji: '🏥',
                tip: 'Get travel insurance',
                detail: 'It\'s the one thing you hope you never need. Don\'t travel without it — medical bills abroad can be catastrophic.',
              },
              {
                emoji: '💳',
                tip: 'Notify your bank',
                detail: 'Banks routinely block foreign transactions without warning. A quick call or app notification before you go saves a lot of stress at checkout.',
              },
              {
                emoji: '📲',
                tip: 'Download everything offline',
                detail: 'Boarding passes, hotel confirmations, maps. Don\'t rely on airport Wi-Fi being reliable when you need it most.',
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

      {/* ── WHY TIMMS TRAVEL ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Why us</p>
            <h2 className="text-3xl font-bold" style={{ color: '#232e4e' }}>Why book through Timms Travel</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { emoji: '🌍', title: 'Worldwide Locations', text: 'Available in 100+ countries — from capital cities to coastlines most sites don\'t bother covering.' },
              { emoji: '💰', title: 'Competitive Pricing', text: 'We compare all major providers in real time so you\'re always seeing the best available price, not a padded one.' },
              { emoji: '🛡️', title: 'Flexible Bookings', text: 'Plans change and we get it. We work with providers who offer real flexibility — not fine print that traps you.' },
            ].map(({ emoji, title, text }) => (
              <div key={title} className="text-center">
                <div className="text-4xl mb-3">{emoji}</div>
                <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-7 shadow-sm space-y-4 text-slate-700 leading-relaxed text-sm">
            <p>
              Timms Travel was built in the United Kingdom to make travel planning genuinely simple. Whether you are comparing hotels for a weekend in Edinburgh, finding the best experiences in Barcelona or booking flights to New York, everything you need is in one place.
            </p>
            <p>
              We partner with Expedia, GetYourGuide and other trusted travel providers to bring you live prices and real availability — with no markup and no hidden platform fees added on top. What you see when you search is what you pay when you book.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="py-16 px-6 text-center text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Can't See Your Destination?</h2>
        <p className="text-gray-300 mb-8 text-lg max-w-xl mx-auto">
          We cover thousands of locations worldwide. Browse by continent to find countries, cities and experiences wherever you're headed.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/locations/continents" className="btn-primary inline-block">
            Browse All Destinations
          </a>
          <a
            href="/hotels"
            className="inline-block px-6 py-3 rounded-lg font-semibold border border-white/30 text-white hover:bg-white/10 transition"
          >
            Search Hotels Worldwide
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}