'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function FlightSearchIframe() {
  const params = useSearchParams()

  const from = params.get('from') ?? ''
  const to = params.get('to') ?? ''
  const depart = params.get('depart') ?? ''
  const returnDate = params.get('return') ?? ''
  const roundTrip = params.get('roundTrip') === 'true'

  const adults = params.get('adults') ?? '1'
  const children = params.get('children') ?? '0'
  const infants = params.get('infants') ?? '0'

  const cabin = params.get('cabin') ?? 'economy'

  // ✅ Only valid cabin codes
  const cabinCode: Record<string, string> = {
    economy: 'y',
    business: 'c',
  }

  const wlUrl = new URL('https://flights.timmstravel.com/')

  // Core params
  if (from) wlUrl.searchParams.set('origin', from)
  if (to) wlUrl.searchParams.set('destination', to)
  if (depart) wlUrl.searchParams.set('depart_date', depart)

  if (roundTrip && returnDate) {
    wlUrl.searchParams.set('return_date', returnDate)
  }

  wlUrl.searchParams.set('adults', adults)
  wlUrl.searchParams.set('children', children)
  wlUrl.searchParams.set('infants', infants)

  // ✅ Correct cabin handling (no bad fallback)
  wlUrl.searchParams.set('trip_class', cabinCode[cabin] ?? 'y')

  wlUrl.searchParams.set('marker', '714930')

  console.log('FINAL URL:', wlUrl.toString())

  return (
    <main className="min-h-screen flex flex-col">
      <iframe
        src={wlUrl.toString()}
        className="w-full flex-1 border-0"
        style={{ minHeight: '100vh' }}
        title="Search Flights - Timms Travel"
        loading="lazy"
        allow="geolocation"
      />
    </main>
  )
}

export default function FlightSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    }>
      <FlightSearchIframe />
    </Suspense>
  )
}