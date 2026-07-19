import { TrendingDeal } from '@/lib/travelpayouts'

type CategoryConfig = {
  maxPrice?: number
  destinations?: string[]
  months?: number[]
  maxDaysAhead?: number
}

export function filterDealsForCategory(
  deals: TrendingDeal[],
  slug: string,
  categoryConfig: CategoryConfig
): TrendingDeal[] {
  return deals.filter((deal) => {
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
}