export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav style={{backgroundColor: '#232e4e'}} className="px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-white">Hire Car Hub</div>
        <div className="flex gap-6">
          <a href="/locations" className="nav-link">Locations</a>
          <a href="/blog" className="nav-link">Blog</a>
          <a href="/about" className="nav-link">About</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{backgroundColor: '#232e4e'}} className="text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Find Your Perfect Car</h1>
        <p className="text-xl mb-10" style={{color: '#a0aec0'}}>Compare thousands of car hire deals worldwide</p>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-left">
              <label className="block text-gray-500 text-sm mb-1">Pick-up Location</label>
              <input
                type="text"
                placeholder="City or airport"
                className="input-field"
              />
            </div>
            <div className="text-left">
              <label className="block text-gray-500 text-sm mb-1">Pick-up Date</label>
              <input
                type="date"
                className="input-field"
              />
            </div>
            <div className="text-left">
              <label className="block text-gray-500 text-sm mb-1">Drop-off Date</label>
              <input
                type="date"
                className="input-field"
              />
            </div>
            <button className="btn-primary mt-5">
              Search Cars
            </button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-3">🚗</div>
            <h3 className="font-bold text-gray-800 text-lg">500+ Car Options</h3>
            <p className="text-gray-500">From economy to luxury</p>
          </div>
          <div>
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-bold text-gray-800 text-lg">Best Price Guarantee</h3>
            <p className="text-gray-500">We compare all major providers</p>
          </div>
          <div>
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="font-bold text-gray-800 text-lg">Worldwide Locations</h3>
            <p className="text-gray-500">Available in 100+ countries</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{backgroundColor: '#232e4e'}} className="text-gray-400 text-center py-8 px-6">
        <p className="text-white font-bold text-lg mb-2">Hire Car Hub</p>
        <p className="text-sm">© 2026 Hire Car Hub. All rights reserved.</p>
      </footer>
    </main>
  )
}