// ============================================
// LOCATIONS PAGE - app/locations/page.tsx
// URL: hirecarhub.com/locations
// ============================================

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'


export default function Locations() {
  const ukDestinations = [
    { city: 'London', airport: 'Heathrow Airport', emoji: '🏙️', description: 'Explore the capital with ease. From the West End to the Cotswolds, having a car opens up a whole new side of London.' },
    { city: 'Manchester', airport: 'Manchester Airport', emoji: '🐝', description: 'The heart of the North. Perfect for exploring the Peak District, Lake District and everything in between.' },
    { city: 'Edinburgh', airport: 'Edinburgh Airport', emoji: '🏰', description: 'Scotland\'s stunning capital. Hire a car and discover the Highlands, lochs and castles at your own pace.' },
    { city: 'Birmingham', airport: 'Birmingham Airport', emoji: '🏭', description: 'Central location makes Birmingham the ideal base for exploring the Midlands and beyond.' },
    { city: 'Bristol', airport: 'Bristol Airport', emoji: '🌉', description: 'Gateway to the South West. Drive down to Cornwall, Bath or the Jurassic Coast in comfort.' },
    { city: 'Glasgow', airport: 'Glasgow Airport', emoji: '🎶', description: 'Scotland\'s biggest city with easy access to Loch Lomond and the Trossachs National Park.' },
  ]

  const worldDestinations = [
    { city: 'Barcelona', country: 'Spain', emoji: '🇪🇸', description: 'Hire a car and explore beyond the city — the Costa Brava, Montserrat and the Pyrenees are all within easy reach.' },
    { city: 'Paris', country: 'France', emoji: '🇫🇷', description: 'The Loire Valley, Champagne region and Normandy coast are all just a short drive from the French capital.' },
    { city: 'New York', country: 'USA', emoji: '🇺🇸', description: 'Hit the open road and discover the Catskills, the Hamptons or drive the iconic Route 1 up the New England coast.' },
    { city: 'Dubai', country: 'UAE', emoji: '🇦🇪', description: 'Cruise around in style. A hire car is the perfect way to explore Dubai\'s incredible attractions and desert landscapes.' },
    { city: 'Sydney', country: 'Australia', emoji: '🇦🇺', description: 'From the Blue Mountains to the Hunter Valley wine region, Sydney is the perfect starting point for an epic road trip.' },
    { city: 'Malaga', country: 'Spain', emoji: '🇪🇸', description: 'The gateway to the Costa del Sol. Pick up your hire car at the airport and the whole of Andalusia is yours to explore.' },
    { city: 'Rome', country: 'Italy', emoji: '🇮🇹', description: 'Drive through Tuscany, explore the Amalfi Coast or head south to Sicily — Italy is made for road trips.' },
    { city: 'Cancun', country: 'Mexico', emoji: '🇲🇽', description: 'Hire a car and discover the Yucatan Peninsula — ancient Mayan ruins, cenotes and hidden beaches await.' },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{backgroundColor: '#232e4e'}} className="text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Most Popular Destinations</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Whether you're exploring closer to home or heading somewhere a little more exotic, we've got car hire covered across the UK and worldwide.
        </p>
      </section>

      {/* UK Destinations */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2" style={{color: '#232e4e'}}>UK Destinations</h2>
          <p className="text-gray-500 mb-10">From city breaks to coastal road trips, find the best car hire deals at airports and city centres across the UK.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ukDestinations.map((dest) => (
              <div key={dest.city} className="card hover:shadow-xl transition cursor-pointer">
                <div className="text-4xl mb-3">{dest.emoji}</div>
                <h3 className="font-bold text-xl mb-1" style={{color: '#232e4e'}}>{dest.city}</h3>
                <p className="text-sm font-medium mb-3" style={{color: '#2f797c'}}>✈ {dest.airport}</p>
                <p className="text-gray-500 text-sm leading-6">{dest.description}</p>
                <a href="/" className="inline-block mt-4 text-sm font-semibold hover:opacity-75 transition" style={{color: '#2f797c'}}>
                  Search car hire in {dest.city} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Worldwide Destinations */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2" style={{color: '#232e4e'}}>Worldwide Destinations</h2>
          <p className="text-gray-500 mb-10">Heading further afield? We compare car hire deals in over 100 countries so you can hit the road wherever you land.</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {worldDestinations.map((dest) => (
              <div key={dest.city} className="card hover:shadow-xl transition cursor-pointer">
                <div className="text-4xl mb-3">{dest.emoji}</div>
                <h3 className="font-bold text-lg mb-1" style={{color: '#232e4e'}}>{dest.city}</h3>
                <p className="text-sm font-medium mb-3 text-gray-400">{dest.country}</p>
                <p className="text-gray-500 text-sm leading-6">{dest.description}</p>
                <a href="/" className="inline-block mt-4 text-sm font-semibold hover:opacity-75 transition" style={{color: '#2f797c'}}>
                  Search car hire in {dest.city} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{backgroundColor: '#232e4e'}} className="py-16 px-6 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Can't See Your Destination?</h2>
        <p className="text-gray-300 mb-8 text-lg">We cover thousands of locations worldwide. Search above and we'll find the best deals wherever you're headed.</p>
        <a href="/" className="btn-primary inline-block">Search All Locations</a>
      </section>

      {/* Footer */}
      <Footer />

    </main>
  )
}