export default function FlightSearchPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <iframe
        src="https://flights.timmstravel.com"
        className="w-full flex-1 border-0"
        style={{ minHeight: '100vh' }}
        title="Search Flights - Timms Travel"
        loading="lazy"
        allow="geolocation"
      />
    </main>
  )
}