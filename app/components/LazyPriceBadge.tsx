'use client'

import { useEffect, useRef, useState } from 'react'
import { useFlightPrice } from '@/hooks/useFlightPrice'

type LazyPriceBadgeProps = {
  origin: string
  destination: string
  className?: string
}

/**
 * Same behaviour as PriceBadge, but defers the fetch until the badge is
 * within ~200px of the viewport. Use this anywhere many route cards render
 * on one page (directories, "browse all routes" listings) to avoid firing
 * dozens/hundreds of price lookups on page load.
 */
export default function LazyPriceBadge({ origin, destination, className }: LazyPriceBadgeProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (inView || !ref.current) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [inView])

  return (
    <span ref={ref} className="inline-block">
      {inView ? <PriceValue origin={origin} destination={destination} className={className} /> : <Placeholder className={className} />}
    </span>
  )
}

function PriceValue({ origin, destination, className }: { origin: string; destination: string; className?: string }) {
  const { price, loading } = useFlightPrice(origin, destination)

  if (loading) return <Placeholder className={className} />
  if (price) return <span className={className ?? 'text-xs font-semibold text-gray-500'}>From £{price}</span>

  // No live price found for this route — show a POA-style badge rather than leaving a gap
  return (
    <span
      className={className ?? 'text-xs font-semibold px-2 py-0.5 rounded-full'}
      style={className ? undefined : { backgroundColor: '#f0fafa', color: '#03989e' }}
    >
      Find Flights
    </span>
  )
}

function Placeholder({ className }: { className?: string }) {
  return <span className={`inline-block h-3 w-14 rounded bg-gray-100 animate-pulse ${className ?? ''}`} />
}