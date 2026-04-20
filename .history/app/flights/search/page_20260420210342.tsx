import { useEffect } from 'react'

export default function FlightsPage() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'YOUR_TRAVELPAYOUTS_SCRIPT_URL'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-10 px-6 text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>
          Search Cheap Flights
        </h1>
        <p className="text-gray-500">
          Compare hundreds of airlines and travel sites in seconds.
        </p>
      </section>

      {/* Search form */}
      <section className="px-6 mb-10">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow">
          <div id="tpwl-search"></div>
        </div>
      </section>

      {/* Results */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div id="tpwl-tickets"></div>
        </div>
      </section>
    </main>
  )
}