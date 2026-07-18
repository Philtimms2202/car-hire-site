'use client'

import { useEffect, useState } from 'react'

type PriceState = {
  price: number | null
  loading: boolean
}

// Simple module-level cache so switching origin airport, or revisiting a page,
// doesn't re-fire requests for a pair we've already resolved this session.
const cache = new Map<string, number | null>()

export function useFlightPrice(origin: string | null, destination: string): PriceState {
  const [state, setState] = useState<PriceState>({ price: null, loading: true })

  useEffect(() => {
    if (!origin || !destination) {
      setState({ price: null, loading: false })
      return
    }

    const key = `${origin}-${destination}`
    if (cache.has(key)) {
      setState({ price: cache.get(key)!, loading: false })
      return
    }

    let cancelled = false
    setState(s => ({ ...s, loading: true }))

    fetch(`/api/flight-prices?origin=${origin}&destination=${destination}`)
      .then(res => res.json())
      .then((data: { price: number; found: boolean }) => {
        if (cancelled) return
        const price = data.found ? data.price : null
        cache.set(key, price)
        setState({ price, loading: false })
      })
      .catch(() => {
        if (cancelled) return
        cache.set(key, null)
        setState({ price: null, loading: false })
      })

    return () => {
      cancelled = true
    }
  }, [origin, destination])

  return state
}