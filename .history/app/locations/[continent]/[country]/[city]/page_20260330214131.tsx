 <Main>
   
 {/* Hero */}
  <section style={{ backgroundColor: '#232e4e' }} className="text-white py-20 px-6 text-center">
    <h1 className="text-5xl font-bold mb-4">Car Hire Locations</h1>
    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
      Whether you are exploring closer to home or heading somewhere a little more exotic, we have car hire covered across the UK and worldwide. Browse by country below to find the best deals.
    </p>
  </section>

  {/* Countries Grid */}
  <section className="py-16 px-6">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>Browse by Country</h2>
      <p className="text-gray-500 mb-10">Select a country to see all available car hire locations.</p>

      {countries.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#232e4e' }}>Locations Coming Soon</h2>
          <p className="text-gray-500">We are busy adding locations worldwide. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {countries.map((country: any) => (
            <a
              key={country.countrySlug}
              href={`/locations/${country.countrySlug}`}
              className="card text-center hover:shadow-xl transition cursor-pointer"
            >
              <div className="text-4xl mb-2">{country.countryEmoji}</div>
              <p className="font-semibold text-sm" style={{ color: '#232e4e' }}>
                {country.country}
              </p>
              <p className="text-xs mt-1" style={{ color: '#2f797c' }}>
                View cities
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  </section>

  {/* CTA */}
  <section style={{ backgroundColor: '#232e4e' }} className="py-16 px-6 text-center text-white">
    <h2 className="text-3xl font-bold mb-4">Can't See Your Destination?</h2>
    <p className="text-gray-300 mb-8 text-lg">
      We cover thousands of locations worldwide. Use our search tool to find the best deals wherever you are headed.
    </p>
    <a href="/" className="btn-primary inline-block">Search All Cars</a>
  </section>

  <Footer />
</main>