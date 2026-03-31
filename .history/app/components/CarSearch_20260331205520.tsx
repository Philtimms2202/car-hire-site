'use client'

export default function CarSearch({
  pickupLocation,
  pickupDate,
  dropoffDate,
  setPickupLocation,
  setPickupDate,
  setDropoffDate,
  loading,
  onSearch
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-gray-500 text-sm mb-1">Pick-up Location</label>
        <input
          type="text"
          placeholder="City or airport"
          className="input-field"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-gray-500 text-sm mb-1">Pick-up Date</label>
        <input
          type="date"
          className="input-field"
          value={pickupDate}
          onChange={(e) => setPickupDate(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-gray-500 text-sm mb-1">Drop-off Date</label>
        <input
          type="date"
          className="input-field"
          value={dropoffDate}
          onChange={(e) => setDropoffDate(e.target.value)}
        />
      </div>

      <button onClick={onSearch} className="btn-primary mt-5 w-full">
        {loading ? 'Searching...' : 'Search Cars'}
      </button>
    </div>
  )
}