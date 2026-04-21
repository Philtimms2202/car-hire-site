'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function FlightSearchIframe() {
  const params = useSearchParams()

  const from = params.get('from') ?? ''
  const to = params.get('to') ?? ''
  const depart = params.get('depart') ?? ''
  const adults = params.get('adults') ?? '1'
  const children = params.get('children') ?? '0'
  const infants = params.get('infants') ?? '0'
  const returnDate = params.get('return') ?? ''
  const roundTrip = params.get('roundTrip') === 'true'

 // Build flightSearch param
const ddmm = depart ? depart.slice(8, 10) + depart.slice(5, 7) : ''
const retDdmm = returnDate && roundTrip ? returnDate.slice(8, 10) + returnDate.slice(5, 7) : ''

const pax =
  (parseInt(children) > 0 ? `c${children}` : '') +
  adults +
  (parseInt(infants) > 0 ? infants : '')

const flightSearch = from && to && ddmm
  ? `${from}${ddmm}${to}${retDdmm}${pax}`
  : ''
  // Build the White Label URL
  const wlUrl = new URL('https://flights.timmstravel.com/')
  if (flightSearch) wlUrl.searchParams.set('flightSearch', flightSearch)
  wlUrl.searchParams.set('marker', '714930')
  if (returnDate && roundTrip) {
    const retDdmm = returnDate.slice(8, 10) + returnDate.slice(5, 7)
    wlUrl.searchParams.set('return', retDdmm)
  }

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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <FlightSearchIframe />
    </Suspense>
  )
}