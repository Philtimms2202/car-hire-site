const TP_TOKEN = process.env.TRAVELPAYOUTS_TOKEN

export type CheapHotelPrice = {
  price: number
  currency: string
  hotelName: string | null
  stars: number | null
  found: boolean
}

function defaultDates() {
  // 30 days out, 7-night stay — a representative window for a "from £X" teaser
  const checkIn = new Date()
  checkIn.setDate(checkIn.getDate() + 30)
  const checkOut = new Date(checkIn)
  checkOut.setDate(checkOut.getDate() + 7)

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  return { checkIn: fmt(checkIn), checkOut: fmt(checkOut) }
}

/**
 * Cheapest cached hotel price for a city.
 * https://engine.hotellook.com/api/v2/cache.json
 */
export async function getCheapestHotel(city: string, currency = 'gbp'): Promise<CheapHotelPrice> {
  if (!TP_TOKEN) throw new Error('Missing TRAVELPAYOUTS_TOKEN env variable')

  const { checkIn, checkOut } = defaultDates()

  const params = new URLSearchParams({
    location: city,
    checkIn,
    checkOut,
    currency,
    limit: '1',
    token: TP_TOKEN,
  })

  const res = await fetch(`https://engine.hotellook.com/api/v2/cache.json?${params.toString()}`, {
    next: { revalidate: 21600 }, // 6 hours, same as flight prices — marketing teaser not live booking data
  })

  if (!res.ok) {
    return { price: 0, currency, hotelName: null, stars: null, found: false }
  }

  const json = await res.json()
  const hotel = Array.isArray(json) ? json[0] : null

  if (!hotel || typeof hotel.priceFrom !== 'number') {
    return { price: 0, currency, hotelName: null, stars: null, found: false }
  }

  return {
    price: Math.round(hotel.priceFrom),
    currency,
    hotelName: hotel.hotelName ?? null,
    stars: hotel.stars ?? null,
    found: true,
  }
}