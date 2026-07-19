import Link from 'next/link'
import { TrendingDeal } from '@/lib/travelpayouts'
import { resolveLocationLabel } from '@/lib/airportUtils'

function displayFormatDate(dateStr: string) {
  if (!dateStr) return ''
  const cleanStr = dateStr.split('T')[0]
  const parts = cleanStr.split('-')
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`
  return dateStr
}

function formatDateForQuery(dateStr: string) {
  const cleanStr = dateStr.split('T')[0]
  const parts = cleanStr.split('-')
  if (parts.length === 3) return `${parts[2]}${parts[1]}`
  return ''
}

export default function DealCard({ deal }: { deal: TrendingDeal }) {
  const departDDMM = formatDateForQuery(deal.departDate)
  const returnDDMM = deal.returnDate ? formatDateForQuery(deal.returnDate) : ''

  const routingOrigin = deal.origin.toLowerCase()
  const routingDestination = deal.destination.toLowerCase()

  const originNameSlug = resolveLocationLabel(deal.origin, 'short')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const destNameSlug = resolveLocationLabel(deal.destination, 'short')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const widgetSearchLink = `https://flights.timmstravel.com/?flightSearch=${deal.origin}${departDDMM}${deal.destination}${returnDDMM}1&destination_airports=0&origin_airports=1`
  const internalRouteLink = `/flights/${routingOrigin}/${routingDestination}/${originNameSlug}-to-${destNameSlug}`

  return (
    <div className="group rounded-2xl border border-gray-100 p-6 flex flex-col justify-between transition-all hover:shadow-lg hover:border-teal-100" style={{ backgroundColor: '#232e4e08' }}>
      <div>
        <div className="flex flex-col mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-1">Live Drop Route</span>
          <Link href={internalRouteLink} className="group/link text-lg font-bold tracking-tight leading-snug hover:text-[#03989e] transition-colors" style={{ color: '#232e4e' }}>
            <span className="border-b border-transparent group-hover/link:border-[#03989e] block overflow-hidden text-ellipsis whitespace-nowrap">
              {resolveLocationLabel(deal.origin, 'full')}
            </span>
            <span className="text-gray-400 block my-0.5 text-sm font-normal normal-case">to</span>
            <span className="border-b border-transparent group-hover/link:border-[#03989e] block overflow-hidden text-ellipsis whitespace-nowrap">
              {resolveLocationLabel(deal.destination, 'full')}
            </span>
          </Link>
          <div className="mt-3 text-3xl font-black" style={{ color: '#03989e' }}>£{deal.price}</div>
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
        <a href={widgetSearchLink} target="_blank" rel="noopener noreferrer" className="w-full text-center py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 shadow-sm block" style={{ backgroundColor: '#232e4e' }}>
          Check Live Fares →
        </a>
        <Link href={internalRouteLink} className="w-full text-center py-2 rounded-xl text-gray-600 hover:text-teal-700 border border-gray-200 hover:border-teal-200 bg-white font-medium text-xs transition-all block">
          View Guide & Route Info
        </Link>
      </div>
    </div>
  )
}