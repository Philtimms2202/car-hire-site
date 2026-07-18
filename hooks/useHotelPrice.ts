'use client'

import { useEffect, useState } from 'react'

type PriceState = {
  price: number | null
  loading: boolean
}

const cache = new Map<string, number | null>()

export function useHotelPrice(city: string): PriceState {
  const [state, setState] = useState<PriceState>({ price: null, loading: true })

  useEffect(() => {
    if (!city) {
      setState({ price: null, loading: false })
      return
    }

    if (cache.has(city)) {
      setState({ price: cache.get(city)!, loading: false })
      return
    }

    let cancelled = false
    setState(s => ({ ...s, loading: true }))

    fetch(`/api/hotel-prices?city=${encodeURIComponent(city)}`)
      .then(res => res.json())
      .then((data: { price: number; found: boolean }) => {
        if (cancelled) return
        const price = data.found ? data.price : null
        cache.set(city, price)
        setState({ price, loading: false })
      })
      .catch(() => {
        if (cancelled) return
        cache.set(city, null)
        setState({ price: null, loading: false })
      })

    return () => {
      cancelled = true
    }
  }, [city])

  return state
}