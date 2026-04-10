// ============================================
// ABOUT PAGE - app/about/page.tsx
// URL: timmstravel.com/about
// ============================================

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: {
    default: "Tiimms Travel | About Us",
    template: "Tiimms Travel |",
  },
  description: "Discover amazing experiences around the world.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function About() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{backgroundColor: '#232e4e'}} className="text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">About Timms Travel</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          We're on a mission to make global travel simple, transparent and affordable for everyone.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{color: '#232e4e'}}>Why Choose Hire Car Hub?</h2>
          <p className="text-center text-gray-500 mb-12">We're not just another travel site - here's what makes us different</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-bold text-xl mb-2" style={{color: '#232e4e'}}>We Do the Hard Work</h3>
              <p className="text-gray-500">We compare hundreds of destinations, allowing you to shop flights, hotels, experiences, and more from trusted suppliers so you don't have to. Find the best price in seconds.</p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="font-bold text-xl mb-2" style={{color: '#232e4e'}}>No Hidden Surprises</h3>
              <p className="text-gray-500">We believe in total transparency. We never charge a fee and do not inflate the price.</p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="font-bold text-xl mb-2" style={{color: '#232e4e'}}>Wherever You're Headed</h3>
              <p className="text-gray-500">From a weekend city break to a month-long road trip, we've got you covered in over 100 countries worldwide.</p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="font-bold text-xl mb-2" style={{color: '#232e4e'}}>Instant Results</h3>
              <p className="text-gray-500">No waiting around. Our search pulls up live availability and pricing in real time so you can book with confidence.</p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="font-bold text-xl mb-2" style={{color: '#232e4e'}}>Free Cancellation</h3>
              <p className="text-gray-500">Plans change and we get it. Most of our deals come with free cancellation so you can book now and adjust later.</p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="font-bold text-xl mb-2" style={{color: '#232e4e'}}>Trusted Suppliers Only</h3>
              <p className="text-gray-500">We only work with reputable, well-reviewed car hire companies so you can travel with complete peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{backgroundColor: '#232e4e'}} className="py-16 px-6 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Car?</h2>
        <p className="text-gray-300 mb-8 text-lg">Search thousands of deals and hit the road today</p>
        <a href="/" className="btn-primary inline-block">Search Cars Now</a>
      </section>

      {/* Footer */}
      <Footer />

    </main>
  )
}