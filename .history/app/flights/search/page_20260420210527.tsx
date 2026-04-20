'use client'

import { useEffect } from 'react'

export default function FlightSearchPage() {
  useEffect(() => {
    // Inject Travelpayouts embed script
    const script = document.createElement('script')
    script.src = 'https://YOUR-TRAVELPAYOUTS-WHITELABEL.js' // ← REPLACE THIS
    script.async = true
    document.body.appendChild(script)

    // Optional: config (only if your embed requires it)
    // @ts-ignore
    window.TPWL_CONFIG = {
      locale: 'en',
      currency: 'GBP',
      host: 'yourdomain.com',
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* ── HERO / HEADER ───────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-12 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: '#232e4e' }}
          >
            Search Cheap Flights
          </h1>
          <p className="text-gray-500">
            We compare hundreds of airlines and travel sites to find you the best deals.
          </p>
        </div>
      </section>

      {/* ── SEARCH FORM (TPWL) ─────────────────────── */}
      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <div id="tpwl-search" />
        </div>
      </section>

      {/* ── RESULTS (TPWL) ─────────────────────────── */}
      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div id="tpwl-tickets" />
        </div>
      </section>

      {/* ── OPTIONAL: POPULAR DESTINATIONS (from their template) ── */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2
            className="text-2xl font-bold mb-8"
            style={{ color: '#232e4e' }}
          >
            Popular destinations
          </h2>

          <div
            id="tpwl-widget-weedles"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div data-destination="IST" is="weedle"></div>
            <div data-destination="DXB" is="weedle"></div>
            <div data-destination="NYC" is="weedle"></div>
            <div data-destination="LON" is="weedle"></div>
            <div data-destination="PAR" is="weedle"></div>
            <div data-destination="BCN" is="weedle"></div>
          </div>
        </div>
      </section>
    </main>
  )
}