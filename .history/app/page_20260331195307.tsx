{/* Tabs */}
<div className="max-w-4xl mx-auto bg-[#eff6ff] rounded-2xl shadow-xl p-6">
  <div className="flex justify-around mb-6">
    {['experiences', 'flights', 'hotels', 'cars'].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab as any)}
        className={`px-4 py-2 rounded-t-xl font-semibold transition ${
          activeTab === tab
            ? 'bg-[#2f797c] text-white shadow-lg'
            : 'bg-[#dbeafe] text-[#232e4e] hover:bg-[#c7ddf5]'
        }`}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    ))}
  </div>

  {/* Search Form */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div className="text-left">
      <label className="block text-gray-700 text-sm mb-1">Country</label>
      <select
        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-[#232e4e]"
        value={selectedCountry?._id || ''}
        onChange={(e) => {
          const country = countries.find((c) => c._id === e.target.value) || null
          setSelectedCountry(country)
          setSelectedCity('')
        }}
      >
        <option value="">Select Country</option>
        {countries.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>

    <div className="text-left">
      <label className="block text-gray-700 text-sm mb-1">City</label>
      <select
        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-[#232e4e]"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        disabled={!selectedCountry}
      >
        <option value="">Select City</option>
        {selectedCountry?.cities.map((city) => (
          <option key={city.slug} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </div>

    {/* Start/End dates */}
    {(activeTab === 'cars' || activeTab === 'hotels' || activeTab === 'experiences') && (
      <>
        <div className="text-left">
          <label className="block text-gray-700 text-sm mb-1">Start Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-[#232e4e]"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
          />
        </div>
        <div className="text-left">
          <label className="block text-gray-700 text-sm mb-1">End Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-[#232e4e]"
            value={dropoffDate}
            onChange={(e) => setDropoffDate(e.target.value)}
          />
        </div>
      </>
    )}

    <div className="md:col-span-4 mt-4 md:mt-0">
      <button
        onClick={handleSearch}
        className="w-full bg-[#2f797c] hover:bg-[#276663] text-white font-bold py-3 rounded-xl transition"
      >
        Search
      </button>
    </div>
  </div>
</div>

{/* Trust indicators */}
<div className="flex justify-center gap-8 mt-6 text-sm text-[#2f797c]">
  <span>✓ Free cancellation</span>
  <span>✓ No hidden fees</span>
  <span>✓ Best price guarantee</span>
</div>