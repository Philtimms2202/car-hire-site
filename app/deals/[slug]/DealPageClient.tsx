'use client'

import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import AirportSelector from '../../components/AirportSelector'
import { TrendingDeal } from '@/lib/travelpayouts'
import { resolveIataToLabel } from '@/lib/airportUtils'
import airportsData from '@/data/airports.json'

type AirportItem = {
  name: string
  city: string
  country: string
  iata_code: string
}

type DealPageClientProps = {
  slug: string
  airportSlug: string
  originIata: string
  categoryConfig: {
    title: string
    subtitle: string
    maxPrice?: number
    destinations?: string[]
    months?: number[]
    maxDaysAhead?: number
  }
  initialDeals: TrendingDeal[]
}

export default function DealPageClient({
  slug,
  airportSlug,
  originIata,
  categoryConfig,
  initialDeals,
}: DealPageClientProps) {
  const resolveLocationLabel = (iata: string, format: 'full' | 'short' = 'short') => {
    if (!iata) return ''
    const code = iata.toUpperCase().trim()

    const metacityOverrides: Record<string, { city: string; name: string }> = {
      LON: { city: 'London', name: 'All Airports' },
      NYC: { city: 'New York', name: 'All Airports' },
      PAR: { city: 'Paris', name: 'All Airports' },
      ROM: { city: 'Rome', name: 'All Airports' },
      MIL: { city: 'Milan', name: 'All Airports' },
      BCN: { city: 'Barcelona', name: 'El Prat Airport' }
    }

    if (metacityOverrides[code]) {
      const override = metacityOverrides[code]
      return format === 'full' ? `${override.city} (${override.name})` : override.city
    }

    let foundAirport = (airportsData as AirportItem[]).find(
      (airport) => airport.iata_code?.toUpperCase().trim() === code
    )

    if (!foundAirport) {
      foundAirport = (airportsData as AirportItem[]).find(
        (airport) => airport.city?.toUpperCase().trim() === code ||
                     airport.name?.toUpperCase().trim().includes(code)
      )
    }

    if (!foundAirport) return code

    if (format === 'full') {
      if (foundAirport.name.toLowerCase().includes(foundAirport.city.toLowerCase())) {
        return foundAirport.name
      }
      return `${foundAirport.city} (${foundAirport.name})`
    }

    return foundAirport.city || foundAirport.name
  }

  // Filtering now runs on server-fetched data — no client-side fetch, no useEffect
  const deals = initialDeals.filter((deal) => {
    if (categoryConfig.maxPrice && deal.price > categoryConfig.maxPrice) return false
    if (deal.origin.toUpperCase() === deal.destination.toUpperCase()) return false

    if (categoryConfig.destinations && categoryConfig.destinations.length > 0) {
      if (!categoryConfig.destinations.includes(deal.destination.toUpperCase())) return false
    }

    const dateParts = deal.departDate.split('T')[0].split('-')
    if (dateParts.length !== 3) return false

    const month = parseInt(dateParts[1], 10)
    const day = parseInt(dateParts[2], 10)

    if (categoryConfig.months && categoryConfig.months.length > 0) {
      if (!categoryConfig.months.includes(month)) return false
    }

    if (slug === 'christmas-deals' && month === 11 && day < 23) return false

    if (categoryConfig.maxDaysAhead) {
      const now = new Date()
      const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
      const flightUTC = Date.UTC(parseInt(dateParts[0], 10), month - 1, day)
      const diffDays = Math.ceil((flightUTC - todayUTC) / (1000 * 60 * 60 * 24))
      if (diffDays < 0 || diffDays > categoryConfig.maxDaysAhead) return false
    }

    return true
  })

  const displayFormatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const cleanStr = dateStr.split('T')[0]
    const parts = cleanStr.split('-')
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`
    return dateStr
  }

  const originLabel = resolveIataToLabel(originIata)

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Navbar />

        <section
          className="text-white py-20 md:py-24 px-6 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #022135 0%, #03989e 100%)' }}
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <Link
              href="/deals"
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/10 mb-6 text-teal-100"
            >
              ← Back to All Categories
            </Link>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-none">
              {categoryConfig.title} from {originLabel}
            </h1>
            <p className="text-base md:text-lg text-teal-50 max-w-2xl mx-auto mb-4 leading-relaxed font-light">
              {categoryConfig.subtitle}
            </p>

            <AirportSelector slug={slug} currentIata={originIata} />
          </div>
        </section>

        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            {deals.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200 max-w-2xl mx-auto px-4">
                <span className="text-4xl block mb-3">✈️</span>
                <p className="text-base font-semibold" style={{ color: '#232e4e' }}>No matching drops found</p>
                <p className="text-xs text-gray-400 mt-1">Try checking back shortly as routes update.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.map((deal, idx) => {
                  const formatDateForQuery = (dateStr: string) => {
                    const cleanStr = dateStr.split('T')[0]
                    const parts = cleanStr.split('-')
                    if (parts.length === 3) return `${parts[2]}${parts[1]}`
                    return ''
                  }

                  const departDDMM = formatDateForQuery(deal.departDate)
                  const returnDDMM = deal.returnDate ? formatDateForQuery(deal.returnDate) : ''

                  const routingOrigin = deal.origin.toLowerCase()
                  const routingDestination = deal.destination.toLowerCase()

                  const originNameSlug = resolveLocationLabel(deal.origin, 'short')
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')

                  const destNameSlug = resolveLocationLabel(deal.destination, 'short')
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')

                  const widgetSearchLink = `https://flights.timmstravel.com/?flightSearch=${deal.origin}${departDDMM}${deal.destination}${returnDDMM}1&destination_airports=0&origin_airports=1`
                  const internalRouteLink = `/flights/${routingOrigin}/${routingDestination}/${originNameSlug}-to-${destNameSlug}`

                  return (
                    <div
                      key={idx}
                      className="group rounded-2xl border border-gray-100 p-6 flex flex-col justify-between transition-all hover:shadow-lg hover:border-teal-100"
                      style={{ backgroundColor: '#232e4e08' }}
                    >
                      <div>
                        <div className="flex flex-col mb-4">
                          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-1">Live Drop Route</span>

                          <Link
                            href={internalRouteLink}
                            className="group/link text-lg font-bold tracking-tight leading-snug hover:text-[#03989e] transition-colors"
                            style={{ color: '#232e4e' }}
                          >
                            <span className="border-b border-transparent group-hover/link:border-[#03989e] block overflow-hidden text-ellipsis whitespace-nowrap">
                              {resolveLocationLabel(deal.origin, 'full')}
                            </span>
                            <span className="text-gray-400 block my-0.5 text-sm font-normal normal-case">to</span>
                            <span className="border-b border-transparent group-hover/link:border-[#03989e] block overflow-hidden text-ellipsis whitespace-nowrap">
                              {resolveLocationLabel(deal.destination, 'full')}
                            </span>
                          </Link>

                          <div className="mt-3 text-3xl font-black" style={{ color: '#03989e' }}>
                            £{deal.price}
                          </div>
                        </div>

                        <div className="space-y-2 border-t border-gray-200/50 pt-3 text-xs text-gray-500 mb-6">
                          <div className="flex justify-between items-center">
                            <span>Outbound Flight:</span>
                            <span className="font-semibold text-gray-700">{displayFormatDate(deal.departDate)}</span>
                          </div>
                          {deal.returnDate && (
                            <div className="flex justify-between items-center">
                              <span>Return Flight:</span>
                              <span className="font-semibold text-gray-700">{displayFormatDate(deal.returnDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <a
                          href={widgetSearchLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full text-center py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 shadow-sm block"
                          style={{ backgroundColor: '#232e4e' }}
                        >
                          Check Live Fares →
                        </a>
                        <Link
                          href={internalRouteLink}
                          className="w-full text-center py-2 rounded-xl text-gray-600 hover:text-teal-700 border border-gray-200 hover:border-teal-200 bg-white font-medium text-xs transition-all block"
                        >
                          View Guide & Route Info
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}