'use client'

import { useFlightPrice } from '@/hooks/useFlightPrice'

type PriceBadgeProps = {
  origin: string | null
  destination: string
  /** The existing hardcoded "From £XX" string — shown while loading errors or no live price is found */
  fallback: string
  className?: string
}

export default function PriceBadge({ origin, destination, fallback, className }: PriceBadgeProps) {
  const { price, loading } = useFlightPrice(origin, destination)

  if (loading) {
    return <span className={`inline-block h-4 w-24 rounded bg-gray-100 animate-pulse ${className ?? ''}`} />
  }

  if (price) {
    return (
      <span className={className ?? 'text-sm text-gray-500'}>
        From £{price} per person
      </span>
    )
  }

  return <span className={className ?? 'text-sm text-gray-500'}>{fallback} per person</span>
}