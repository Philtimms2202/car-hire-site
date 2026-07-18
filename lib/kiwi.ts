const MARKER = '714930'

export const buildTrackedKiwiUrl = ({
  from, to, depart, returnDate,
  adults = 1, children = 0, infants = 0,
  cabin = 'economy', currency = 'GBP',
}: {
  from: string; to: string; depart: string; returnDate?: string
  adults?: number; children?: number; infants?: number
  cabin?: string; currency?: string
}): string => {
  const kiwiDeep = new URL('https://www.kiwi.com/deep')
  kiwiDeep.searchParams.set('from', from)
  kiwiDeep.searchParams.set('to', to)
  kiwiDeep.searchParams.set('departure', depart)
  if (returnDate) kiwiDeep.searchParams.set('return', returnDate)
  kiwiDeep.searchParams.set('adults', adults.toString())
  kiwiDeep.searchParams.set('children', children.toString())
  kiwiDeep.searchParams.set('infants', infants.toString())
  kiwiDeep.searchParams.set('cabinClass', cabin)
  kiwiDeep.searchParams.set('currency', currency)
  kiwiDeep.searchParams.set('lang', 'en')

  const tracked = new URL('https://c111.travelpayouts.com/click')
  tracked.searchParams.set('shmarker', MARKER)
  tracked.searchParams.set('promo_id', '3791')
  tracked.searchParams.set('source_type', 'customlink')
  tracked.searchParams.set('type', 'click')
  tracked.searchParams.set('custom_url', kiwiDeep.toString())

  return tracked.toString()
}