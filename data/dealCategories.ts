export interface CategoryConfig {
  title: string
  subtitle: string
  maxPrice?: number
  origin?: string           // Added to anchor specific market endpoints (e.g., 'LON', 'GLOBAL')
  destinations?: string[] 
  months?: number[]         // 1 = Jan, 12 = Dec
  maxDaysAhead?: number
}

export const DEAL_CATEGORIES: Record<string, CategoryConfig> = {
  'under-50': {
    title: 'Flights Under £50',
    subtitle: 'Rock-bottom micro-breaks and pocket-friendly European drops.',
    maxPrice: 50,
    origin: 'GLOBAL',
  },
  'europe-under-50': {
    title: 'Europe Under £50',
    subtitle: 'Pocket-friendly hops across the continent.',
    maxPrice: 50,
    origin: 'LON',
    destinations: ['PAR', 'AMS', 'ROM', 'BCN', 'BER', 'PRG', 'VIE', 'MAD', 'MIL', 'LIS', 'DUB', 'BRU', 'VCE', 'ATH', 'BUD'], 
  },
  'summer-deals': {
    title: 'Summer Getaways',
    subtitle: 'Sun-drenched holiday flights for the perfect summer escape.',
    months: [6, 7, 8], 
  },
  'top-city-breaks': {
    title: 'Top City Breaks',
    subtitle: 'Short-haul weekend escapes packed with culture, food, and history.',
    destinations: ['PAR', 'AMS', 'BCN', 'ROM', 'DUB', 'BER', 'BRU', 'PRG', 'VCE', 'CPH', 'KRK'],
  },
  'last-minute-deals': {
    title: 'Last-Minute Deals',
    subtitle: 'Spontaneous departures leaving within the next 7 days.',
    maxDaysAhead: 7,
  },
  'christmas-deals': {
    title: 'Christmas & Festive Breaks',
    subtitle: 'Capture winter markets and festive cheer.',
    origin: 'LON',
    months: [11, 12], 
    maxDaysAhead: 165, // Targets dynamic cache inventory leading into late December 2026
    destinations: ['VIE', 'MUC', 'PRG', 'BRU', 'STR', 'CGN', 'BUD', 'KRK', 'EDI', 'ZRH'],
  },
  'ski-deals': {
    title: 'Ski & Winter Getaways',
    subtitle: 'Hit the slopes with cheap winter cache drops.',
    origin: 'LON', 
    months: [11, 12, 1, 2], // Extended from late November through February
    maxDaysAhead: 230, // Captures seasonal departures sliding through February 2027
    destinations: ['GVA', 'INN', 'GNB', 'LYS', 'SOF', 'SZG', 'MUC', 'BCN', 'ZRH'], 
  }
}