// ============================================
// ABOUT PAGE - app/about/page.tsx
// URL: timmstravel.com/about
// ============================================

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'

export const metadata = {
  title: {
    default: "Timms Travel | About Us",
    template: "Timms Travel |",
  },
  description: "Timms Travel helps travellers find flights, hotels, car hire and experiences across 100+ countries. Learn more about who we are and what we do.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function About() {
  const stats = [
    { value: '100+', label: 'Countries Covered' },
    { value: '1,000+', label: 'Cities & Destinations' },
    { value: '0', label: 'Hidden Fees — Ever' },
    { value: '24hrs', label: 'Support Response Time' },
  ]

  const values = [
    {
      emoji: '🔍',
      title: 'We Do the Hard Work',
      description:
        'We compare hundreds of destinations, allowing you to shop flights, hotels, experiences, and more from trusted suppliers so you do not have to. Find the best price in seconds.',
    },
    {
      emoji: '💬',
      title: 'No Hidden Surprises',
      description:
        'We believe in total transparency. We never charge a fee and do not inflate the price. What you see is exactly what you pay.',
    },
    {
      emoji: '🌍',
      title: 'Wherever You are Headed',
      description:
        'From a weekend city break to a month-long road trip, we have got you covered in over 100 countries worldwide. City, coast or countryside — we have got it.',
    },
    {
      emoji: '⚡',
      title: 'Instant Results',
      description:
        'No waiting around. Our search pulls up live availability and pricing in real time so you can book with confidence, knowing you are seeing the latest deals.',
    },
    {
      emoji: '💰',
      title: 'No Added Fees',
      description:
        'We do not charge any fees for using our service. Everything we provide is completely free of charge to you — we earn a small commission from our partners instead.',
    },
    {
      emoji: '⭐',
      title: 'Trusted Suppliers Only',
      description:
        'Timms Travel only works with a carefully selected group of trusted suppliers. You book directly with the supplier, giving you confidence and peace of mind throughout.',
    },
  ]

  const howItWorks = [
    {
      step: '01',
      title: 'Search Your Destination',
      description:
        'Browse over 1,000 destinations across 100+ countries. Whether you know exactly where you are going or you are looking for inspiration, we have got you covered.',
    },
    {
      step: '02',
      title: 'Compare Your Options',
      description:
        'We bring together flights, hotels, car hire and experiences from our trusted partners — all in one place. No switching between tabs, no hidden surprises.',
    },
    {
      step: '03',
      title: 'Book With Confidence',
      description:
        'When you are ready, you will be securely redirected to our partners site to complete your booking. All payments are handled by them using secure, encrypted systems.',
    },
    {
      step: '04',
      title: 'Enjoy Your Trip',
      description:
        'Pack your bags. Everything's taken care of. If you ever need help finding information about your booking, we're just an email away.',
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-6">🌍</div>
          <h1 className="text-5xl font-bold mb-6">About Timms Travel</h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            We're on a mission to make global travel simple, transparent and affordable for everyone.
            No hidden fees, no inflated prices — just honest travel comparison done right.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="text-4xl font-bold mb-2" style={{ color: '#2f797c' }}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#232e4e' }}>
            Our Story
          </h2>
          <div className="space-y-5 text-gray-600 leading-relaxed text-lg">
            <p>
              Timms Travel was built out of a simple frustration — planning a trip shouldn't require
              ten different browser tabs, confusing price comparisons, and the nagging feeling you've
              missed a better deal somewhere. We set out to fix that.
            </p>
            <p>
              We bring together flights, hotels, car hire, airport transfers and experiences from a
              curated network of trusted suppliers — all in one place. Our job is to do the legwork
              so you can focus on the exciting part: actually going somewhere.
            </p>
            <p>
              We're completely free to use. We earn a small commission from our partners when you
              make a booking, which is how we keep the lights on — but it never costs you a penny
              more. The price you see is the price you pay.
            </p>
            <p>
              Whether you are planning a weekend city break, a family holiday, a honeymoon or a solo
              adventure across multiple countries, Timms Travel is here to make the planning part
              as enjoyable as the trip itself.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3" style={{ color: '#232e4e' }}>
            How It Works
          </h2>
          <p className="text-center text-gray-500 mb-14">
            Planning your trip with Timms Travel is straightforward from start to finish.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {howItWorks.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex gap-6"
              >
                <div
                  className="text-3xl font-bold shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: '#2f797c' }}
                >
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#232e4e' }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3" style={{ color: '#232e4e' }}>
            Why Choose Timms Travel?
          </h2>
          <p className="text-center text-gray-500 mb-14">
            We're not just another travel site — here's what makes us different.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 shadow-sm p-8 text-center hover:shadow-md transition"
              >
                <div className="text-5xl mb-4">{v.emoji}</div>
                <h3 className="font-bold text-xl mb-3" style={{ color: '#232e4e' }}>
                  {v.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3" style={{ color: '#232e4e' }}>
            Everything You Need in One Place
          </h2>
          <p className="text-gray-500 mb-14 max-w-2xl mx-auto">
            From the moment you decide to travel to the moment you arrive, Timms Travel covers every
            part of your journey.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: '✈️', label: 'Flights' },
              { emoji: '🏨', label: 'Hotels' },
              { emoji: '🚗', label: 'Car Hire' },
              { emoji: '🎭', label: 'Experiences' },
              { emoji: '🚐', label: 'Airport Transfers' },
              { emoji: '🗺️', label: 'City Guides' },
              { emoji: '🍽️', label: 'Food & Dining' },
              { emoji: '🥾', label: 'Day Trips' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-3 hover:shadow-md transition"
              >
                <div className="text-4xl">{item.emoji}</div>
                <div className="font-semibold text-sm" style={{ color: '#232e4e' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-20 px-6 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Exploring?</h2>
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Search thousands of destinations, compare deals from trusted partners, and book your
            next adventure — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/locations"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: '#2f797c' }}
            >
              Browse Destinations
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border border-white text-white transition hover:bg-white hover:text-gray-900"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}