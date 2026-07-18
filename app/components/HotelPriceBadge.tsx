'use client'

import { useEffect, useRef, useState } from 'react'
import { useHotelPrice } from '@/hooks/useHotelPrice'

type Props = {
  city: string
  className?: string
}

/**
 * Overlay-style price chip for image-based destination cards (e.g. DestinationCardTile).
 * Lazy-loads via IntersectionObserver so a grid of many cards doesn't fire every
 * request on page load — same pattern as LazyPriceBadge for flights.
 */
export default function HotelPriceBadge({ city, className }: Props) {
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
      {inView ? <PriceValue city={city} className={className} /> : <Placeholder className={className} />}
    </span>
  )
}

function PriceValue({ city, className }: { city: string; className?: string }) {
  const { price, loading } = useHotelPrice(city)

  if (loading) return <Placeholder className={className} />

  return (
    <span
      className={
        className ??
        'inline-block text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-sm'
      }
      style={
        className
          ? undefined
          : { backgroundColor: 'rgba(255,255,255,0.9)', color: '#232e4e' }
      }
    >
      {price ? `From £${price}` : 'POA'}
    </span>
  )
}

function Placeholder({ className }: { className?: string }) {
  return (
    <span
      className={
        className ??
        'inline-block h-6 w-16 rounded-xl bg-white/30 animate-pulse backdrop-blur-sm'
      }
    />
  )
}