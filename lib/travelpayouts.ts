const TP_TOKEN = process.env.TRAVELPAYOUTS_TOKEN

// A diverse mix of global flight hubs spanning different regions
const GLOBAL_HUB_POOL = [
  'LON', 'MAN', 'EDI',               // UK
  'PAR', 'AMS', 'FRA', 'BCN', 'FCO', // Europe
  'NYC', 'LAX', 'MIA', 'ORD',        // North America
  'DXB', 'SIN', 'HND', 'HKG', 'BKK', // Asia / Middle East
  'SYD', 'MEL',                      // Oceania
  'GRU', 'MEX'                       // Latin America
]

export type CheapFlightPrice = {
  price: number
  currency: string
  departAt: string | null
  returnAt: string | null
  found: boolean
}

/**
 * Cheapest non-stop-or-otherwise fare found for a specific origin/destination pair.
 */
export async function getCheapestFlight(
  origin: string,
  destination: string,
  currency = 'gbp'
): Promise<CheapFlightPrice> {
  if (!TP_TOKEN) throw new Error('Missing TRAVELPAYOUTS_TOKEN env variable')

  const params = new URLSearchParams({
    origin,
    destination,
    currency,
    token: TP_TOKEN,
  })

  const res = await fetch(`https://api.travelpayouts.com/v1/prices/cheap?${params.toString()}`, {
    next: { revalidate: 21600 },
  })

  if (!res.ok) {
    return { price: 0, currency, departAt: null, returnAt: null, found: false }
  }

  const json = await res.json()
  const destData = json?.data?.[destination]
  if (!destData) {
    return { price: 0, currency, departAt: null, returnAt: null, found: false }
  }

  const options = Object.values(destData) as Array<{
    price: number
    departure_at?: string
    return_at?: string
  }>
  if (!options.length) {
    return { price: 0, currency, departAt: null, returnAt: null, found: false }
  }

  const cheapest = options.reduce((min, o) => (o.price < min.price ? o : min), options[0])

  return {
    price: Math.round(cheapest.price),
    currency,
    departAt: cheapest.departure_at ?? null,
    returnAt: cheapest.return_at ?? null,
    found: true,
  }
}

export type TrendingDeal = {
  origin: string
  destination: string
  price: number
  departDate: string
  returnDate: string | null
}

/**
 * Cheapest recently-found tickets. If origin is omitted or set to 'GLOBAL', 
 * compiles a randomized assortment of low-cost flights from global hubs.
 * https://api.travelpayouts.com/v2/prices/latest
 */
export async function getTrendingDeals(
  origin?: string,
  currency = 'gbp',
  limit = 1000 
): Promise<TrendingDeal[]> {
  if (!TP_TOKEN) throw new Error('Missing TRAVELPAYOUTS_TOKEN env variable')

  // 1. Standard execution if a targeted single origin is passed
  if (origin && origin !== 'GLOBAL') {
    return fetchSingleOrigin(origin, currency, limit)
  }

  // 2. Multi-hub global execution path
  // Shuffle the pool and pick 6 distinct hubs to build a mixed grid
  const shuffledHubs = [...GLOBAL_HUB_POOL].sort(() => 0.5 - Math.random())
  const selectedHubs = shuffledHubs.slice(0, 6)

  // Query each hub concurrently with a balanced allocation
  const perHubLimit = Math.max(50, Math.floor(limit / selectedHubs.length))
  const promises = selectedHubs.map((hub) => fetchSingleOrigin(hub, currency, perHubLimit))
  
  const resultsArray = await Promise.all(promises)
  const flatDeals = resultsArray.flat()

  // Shuffle the merged results so different cities intermingle seamlessly in the UI
  return flatDeals.sort(() => 0.5 - Math.random())
}

/**
 * Helper to fetch flight segments for an individual origin hub market
 */
async function fetchSingleOrigin(origin: string, currency: string, limit: number): Promise<TrendingDeal[]> {
  try {
    const params = new URLSearchParams({
      currency,
      limit: String(limit),  
      token: TP_TOKEN!,
      one_way: 'false',
      unique: 'false',
      origin: origin,
    })

    const res = await fetch(`https://api.travelpayouts.com/v2/prices/latest?${params.toString()}`, {
      next: { revalidate: 3600 }, // Shorter 1-hour cache for the global feed keeps it highly dynamic
    })

    if (!res.ok) return []

    const json = await res.json()
    if (!Array.isArray(json?.data)) return []

    return json.data.map(
      (d: { origin: string; destination: string; value: number; depart_date: string; return_date?: string }) => ({
        origin: d.origin,
        destination: d.destination,
        price: Math.round(d.value),
        departDate: d.depart_date,
        returnDate: d.return_date ?? null,
      })
    )
  } catch (err) {
    console.error(`Failed fetching hub component: ${origin}`, err)
    return []
  }
}