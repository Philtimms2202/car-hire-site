// app/tools/data/countryPrices.ts
//
// MODELED ESTIMATES, not researched figures - covers ~130 countries across
// every continent so the currency converter page has global content rather
// than just Europe. Numbers are generated from a baseline USD price for
// beer/budget/mid/expensive meals, scaled by a rough regional cost-of-living
// tier (e.g. Switzerland/Norway/Iceland scaled up, South Asia/Sub-Saharan
// Africa scaled down), then converted at an approximate exchange rate.
//
// This means relative ordering between countries should be roughly sensible
// (Switzerland > Spain > Vietnam, etc.) but exact numbers are NOT verified
// against real prices. Treat as a starting point - correct any country you
// know well, especially your highest-traffic destination pages, before
// relying on these publicly. Exchange-rate-based entries will also drift
// out of date over time since they're hardcoded here, not live.
//
// Keyed by the country slug used in your /locations/[continent]/[country]
// URLs. IMPORTANT: these slugs are my best guess at standard kebab-case
// names (e.g. "united-arab-emirates") - check them against your actual
// Sanity slugs. Any mismatch just means that country won't appear in the
// dropdown, nothing will break.

export interface CountryPriceEntry {
  currencyCode: string
  // Optional: slug of a representative city for linking to /hotels/[slug].
  // These are guesses too (e.g. "new-york" for the US) - leave undefined or
  // correct them if your /hotels pages use different slugs. If there's no
  // match, the "Hotels in X" link falls back to the general /hotels page.
  representativeCitySlug?: string
  averagePrices: {
    beer: number
    budgetMeal: number
    midRangeMeal: number
    expensiveMeal: number
  }
}

export const COUNTRY_PRICES: Record<string, CountryPriceEntry> = {
  'austria': { // Austria
    currencyCode: 'EUR',
    representativeCitySlug: 'vienna',
    averagePrices: { beer: 3.13, budgetMeal: 7.04, midRangeMeal: 15.5, expensiveMeal: 35.0 },
  },
  'france': { // France
    currencyCode: 'EUR',
    representativeCitySlug: 'paris',
    averagePrices: { beer: 3.13, budgetMeal: 7.04, midRangeMeal: 15.5, expensiveMeal: 35.0 },
  },
  'spain': { // Spain
    currencyCode: 'EUR',
    representativeCitySlug: 'barcelona',
    averagePrices: { beer: 2.21, budgetMeal: 4.97, midRangeMeal: 11.0, expensiveMeal: 25.0 },
  },
  'italy': { // Italy
    currencyCode: 'EUR',
    representativeCitySlug: 'rome',
    averagePrices: { beer: 3.13, budgetMeal: 7.04, midRangeMeal: 15.5, expensiveMeal: 35.0 },
  },
  'portugal': { // Portugal
    currencyCode: 'EUR',
    representativeCitySlug: 'lisbon',
    averagePrices: { beer: 2.21, budgetMeal: 4.97, midRangeMeal: 11.0, expensiveMeal: 25.0 },
  },
  'greece': { // Greece
    currencyCode: 'EUR',
    representativeCitySlug: 'athens',
    averagePrices: { beer: 2.21, budgetMeal: 4.97, midRangeMeal: 11.0, expensiveMeal: 25.0 },
  },
  'germany': { // Germany
    currencyCode: 'EUR',
    representativeCitySlug: 'berlin',
    averagePrices: { beer: 3.13, budgetMeal: 7.04, midRangeMeal: 15.5, expensiveMeal: 35.0 },
  },
  'netherlands': { // Netherlands
    currencyCode: 'EUR',
    representativeCitySlug: 'amsterdam',
    averagePrices: { beer: 4.42, budgetMeal: 9.94, midRangeMeal: 22.0, expensiveMeal: 49.5 },
  },
  'belgium': { // Belgium
    currencyCode: 'EUR',
    representativeCitySlug: 'brussels',
    averagePrices: { beer: 3.13, budgetMeal: 7.04, midRangeMeal: 15.5, expensiveMeal: 35.0 },
  },
  'ireland': { // Ireland
    currencyCode: 'EUR',
    representativeCitySlug: 'dublin',
    averagePrices: { beer: 4.42, budgetMeal: 9.94, midRangeMeal: 22.0, expensiveMeal: 49.5 },
  },
  'switzerland': { // Switzerland
    currencyCode: 'CHF',
    representativeCitySlug: 'zurich',
    averagePrices: { beer: 5.63, budgetMeal: 12.5, midRangeMeal: 28.0, expensiveMeal: 63.5 },
  },
  'united-kingdom': { // United Kingdom
    currencyCode: 'GBP',
    representativeCitySlug: 'london',
    averagePrices: { beer: 3.79, budgetMeal: 8.53, midRangeMeal: 19.0, expensiveMeal: 42.5 },
  },
  'iceland': { // Iceland
    currencyCode: 'ISK',
    representativeCitySlug: 'reykjavik',
    averagePrices: { beer: 877, budgetMeal: 1970, midRangeMeal: 4380, expensiveMeal: 9860 },
  },
  'norway': { // Norway
    currencyCode: 'NOK',
    representativeCitySlug: 'oslo',
    averagePrices: { beer: 68.0, budgetMeal: 153, midRangeMeal: 339, expensiveMeal: 763 },
  },
  'sweden': { // Sweden
    currencyCode: 'SEK',
    representativeCitySlug: 'stockholm',
    averagePrices: { beer: 50.0, budgetMeal: 112, midRangeMeal: 250, expensiveMeal: 562 },
  },
  'denmark': { // Denmark
    currencyCode: 'DKK',
    representativeCitySlug: 'copenhagen',
    averagePrices: { beer: 33.0, budgetMeal: 74.5, midRangeMeal: 166, expensiveMeal: 373 },
  },
  'finland': { // Finland
    currencyCode: 'EUR',
    representativeCitySlug: 'helsinki',
    averagePrices: { beer: 4.42, budgetMeal: 9.94, midRangeMeal: 22.0, expensiveMeal: 49.5 },
  },
  'poland': { // Poland
    currencyCode: 'PLN',
    representativeCitySlug: 'warsaw',
    averagePrices: { beer: 9.48, budgetMeal: 21.5, midRangeMeal: 47.5, expensiveMeal: 107 },
  },
  'czech-republic': { // Czech Republic
    currencyCode: 'CZK',
    representativeCitySlug: 'prague',
    averagePrices: { beer: 55.0, budgetMeal: 124, midRangeMeal: 276, expensiveMeal: 621 },
  },
  'hungary': { // Hungary
    currencyCode: 'HUF',
    representativeCitySlug: 'budapest',
    averagePrices: { beer: 876, budgetMeal: 1970, midRangeMeal: 4380, expensiveMeal: 9860 },
  },
  'romania': { // Romania
    currencyCode: 'RON',
    representativeCitySlug: 'bucharest',
    averagePrices: { beer: 7.36, budgetMeal: 16.5, midRangeMeal: 37.0, expensiveMeal: 83.0 },
  },
  'bulgaria': { // Bulgaria
    currencyCode: 'BGN',
    representativeCitySlug: 'sofia',
    averagePrices: { beer: 2.88, budgetMeal: 6.48, midRangeMeal: 14.5, expensiveMeal: 32.5 },
  },
  'croatia': { // Croatia
    currencyCode: 'EUR',
    representativeCitySlug: 'dubrovnik',
    averagePrices: { beer: 2.21, budgetMeal: 4.97, midRangeMeal: 11.0, expensiveMeal: 25.0 },
  },
  'slovenia': { // Slovenia
    currencyCode: 'EUR',
    representativeCitySlug: 'ljubljana',
    averagePrices: { beer: 2.21, budgetMeal: 4.97, midRangeMeal: 11.0, expensiveMeal: 25.0 },
  },
  'slovakia': { // Slovakia
    currencyCode: 'EUR',
    representativeCitySlug: 'bratislava',
    averagePrices: { beer: 2.21, budgetMeal: 4.97, midRangeMeal: 11.0, expensiveMeal: 25.0 },
  },
  'serbia': { // Serbia
    currencyCode: 'RSD',
    representativeCitySlug: 'belgrade',
    averagePrices: { beer: 173, budgetMeal: 389, midRangeMeal: 864, expensiveMeal: 1940 },
  },
  'montenegro': { // Montenegro
    currencyCode: 'EUR',
    representativeCitySlug: 'kotor',
    averagePrices: { beer: 1.47, budgetMeal: 3.31, midRangeMeal: 7.36, expensiveMeal: 16.5 },
  },
  'albania': { // Albania
    currencyCode: 'ALL',
    representativeCitySlug: 'tirana',
    averagePrices: { beer: 152, budgetMeal: 342, midRangeMeal: 760, expensiveMeal: 1710 },
  },
  'estonia': { // Estonia
    currencyCode: 'EUR',
    representativeCitySlug: 'tallinn',
    averagePrices: { beer: 2.21, budgetMeal: 4.97, midRangeMeal: 11.0, expensiveMeal: 25.0 },
  },
  'latvia': { // Latvia
    currencyCode: 'EUR',
    representativeCitySlug: 'riga',
    averagePrices: { beer: 1.47, budgetMeal: 3.31, midRangeMeal: 7.36, expensiveMeal: 16.5 },
  },
  'lithuania': { // Lithuania
    currencyCode: 'EUR',
    representativeCitySlug: 'vilnius',
    averagePrices: { beer: 1.47, budgetMeal: 3.31, midRangeMeal: 7.36, expensiveMeal: 16.5 },
  },
  'malta': { // Malta
    currencyCode: 'EUR',
    representativeCitySlug: 'valletta',
    averagePrices: { beer: 3.13, budgetMeal: 7.04, midRangeMeal: 15.5, expensiveMeal: 35.0 },
  },
  'cyprus': { // Cyprus
    currencyCode: 'EUR',
    representativeCitySlug: 'limassol',
    averagePrices: { beer: 3.13, budgetMeal: 7.04, midRangeMeal: 15.5, expensiveMeal: 35.0 },
  },
  'luxembourg': { // Luxembourg
    currencyCode: 'EUR',
    representativeCitySlug: 'luxembourg-city',
    averagePrices: { beer: 5.89, budgetMeal: 13.0, midRangeMeal: 29.5, expensiveMeal: 66.0 },
  },
  'ukraine': { // Ukraine
    currencyCode: 'UAH',
    representativeCitySlug: 'kyiv',
    averagePrices: { beer: 41.0, budgetMeal: 92.0, midRangeMeal: 205, expensiveMeal: 461 },
  },
  'russia': { // Russia
    currencyCode: 'RUB',
    representativeCitySlug: 'moscow',
    averagePrices: { beer: 144, budgetMeal: 324, midRangeMeal: 720, expensiveMeal: 1620 },
  },
  'bosnia-and-herzegovina': { // Bosnia and Herzegovina
    currencyCode: 'BAM',
    representativeCitySlug: 'sarajevo',
    averagePrices: { beer: 2.88, budgetMeal: 6.48, midRangeMeal: 14.5, expensiveMeal: 32.5 },
  },
  'north-macedonia': { // North Macedonia
    currencyCode: 'MKD',
    representativeCitySlug: 'skopje',
    averagePrices: { beer: 89.5, budgetMeal: 202, midRangeMeal: 448, expensiveMeal: 1010 },
  },
  'moldova': { // Moldova
    currencyCode: 'MDL',
    representativeCitySlug: 'chisinau',
    averagePrices: { beer: 17.5, budgetMeal: 40.0, midRangeMeal: 88.5, expensiveMeal: 199 },
  },
  'united-states': { // United States
    currencyCode: 'USD',
    representativeCitySlug: 'new-york',
    averagePrices: { beer: 4.8, budgetMeal: 11.0, midRangeMeal: 24.0, expensiveMeal: 54.0 },
  },
  'canada': { // Canada
    currencyCode: 'CAD',
    representativeCitySlug: 'toronto',
    averagePrices: { beer: 6.58, budgetMeal: 15.0, midRangeMeal: 33.0, expensiveMeal: 74.0 },
  },
  'mexico': { // Mexico
    currencyCode: 'MXN',
    representativeCitySlug: 'cancun',
    averagePrices: { beer: 44.5, budgetMeal: 100.0, midRangeMeal: 222, expensiveMeal: 500 },
  },
  'cuba': { // Cuba
    currencyCode: 'USD',
    representativeCitySlug: 'havana',
    averagePrices: { beer: 1.6, budgetMeal: 3.6, midRangeMeal: 8.0, expensiveMeal: 18.0 },
  },
  'dominican-republic': { // Dominican Republic
    currencyCode: 'USD',
    representativeCitySlug: 'punta-cana',
    averagePrices: { beer: 2.4, budgetMeal: 5.4, midRangeMeal: 12.0, expensiveMeal: 27.0 },
  },
  'jamaica': { // Jamaica
    currencyCode: 'JMD',
    representativeCitySlug: 'montego-bay',
    averagePrices: { beer: 374, budgetMeal: 842, midRangeMeal: 1870, expensiveMeal: 4210 },
  },
  'costa-rica': { // Costa Rica
    currencyCode: 'CRC',
    representativeCitySlug: 'san-jose',
    averagePrices: { beer: 1210, budgetMeal: 2730, midRangeMeal: 6060, expensiveMeal: 13640 },
  },
  'panama': { // Panama
    currencyCode: 'USD',
    representativeCitySlug: 'panama-city',
    averagePrices: { beer: 2.4, budgetMeal: 5.4, midRangeMeal: 12.0, expensiveMeal: 27.0 },
  },
  'bahamas': { // Bahamas
    currencyCode: 'USD',
    representativeCitySlug: 'nassau',
    averagePrices: { beer: 4.8, budgetMeal: 11.0, midRangeMeal: 24.0, expensiveMeal: 54.0 },
  },
  'belize': { // Belize
    currencyCode: 'USD',
    representativeCitySlug: 'belize-city',
    averagePrices: { beer: 4.8, budgetMeal: 11.0, midRangeMeal: 24.0, expensiveMeal: 54.0 },
  },
  'guatemala': { // Guatemala
    currencyCode: 'GTQ',
    representativeCitySlug: 'antigua',
    averagePrices: { beer: 12.5, budgetMeal: 27.5, midRangeMeal: 61.5, expensiveMeal: 139 },
  },
  'honduras': { // Honduras
    currencyCode: 'HNL',
    representativeCitySlug: 'tegucigalpa',
    averagePrices: { beer: 39.5, budgetMeal: 89.0, midRangeMeal: 198, expensiveMeal: 445 },
  },
  'nicaragua': { // Nicaragua
    currencyCode: 'NIO',
    representativeCitySlug: 'managua',
    averagePrices: { beer: 58.5, budgetMeal: 132, midRangeMeal: 293, expensiveMeal: 659 },
  },
  'el-salvador': { // El Salvador
    currencyCode: 'USD',
    representativeCitySlug: 'san-salvador',
    averagePrices: { beer: 1.6, budgetMeal: 3.6, midRangeMeal: 8.0, expensiveMeal: 18.0 },
  },
  'trinidad-and-tobago': { // Trinidad and Tobago
    currencyCode: 'TTD',
    representativeCitySlug: 'port-of-spain',
    averagePrices: { beer: 16.5, budgetMeal: 36.5, midRangeMeal: 81.5, expensiveMeal: 184 },
  },
  'barbados': { // Barbados
    currencyCode: 'BBD',
    representativeCitySlug: 'bridgetown',
    averagePrices: { beer: 6.8, budgetMeal: 15.5, midRangeMeal: 34.0, expensiveMeal: 76.5 },
  },
  'brazil': { // Brazil
    currencyCode: 'BRL',
    representativeCitySlug: 'rio-de-janeiro',
    averagePrices: { beer: 13.0, budgetMeal: 29.0, midRangeMeal: 65.0, expensiveMeal: 146 },
  },
  'argentina': { // Argentina
    currencyCode: 'ARS',
    representativeCitySlug: 'buenos-aires',
    averagePrices: { beer: 2830, budgetMeal: 6370, midRangeMeal: 14160, expensiveMeal: 31860 },
  },
  'chile': { // Chile
    currencyCode: 'CLP',
    representativeCitySlug: 'santiago',
    averagePrices: { beer: 2270, budgetMeal: 5100, midRangeMeal: 11340, expensiveMeal: 25520 },
  },
  'peru': { // Peru
    currencyCode: 'PEN',
    representativeCitySlug: 'lima',
    averagePrices: { beer: 5.92, budgetMeal: 13.5, midRangeMeal: 29.5, expensiveMeal: 66.5 },
  },
  'colombia': { // Colombia
    currencyCode: 'COP',
    representativeCitySlug: 'bogota',
    averagePrices: { beer: 6560, budgetMeal: 14760, midRangeMeal: 32800, expensiveMeal: 73800 },
  },
  'ecuador': { // Ecuador
    currencyCode: 'USD',
    representativeCitySlug: 'quito',
    averagePrices: { beer: 1.6, budgetMeal: 3.6, midRangeMeal: 8.0, expensiveMeal: 18.0 },
  },
  'bolivia': { // Bolivia
    currencyCode: 'BOB',
    representativeCitySlug: 'la-paz',
    averagePrices: { beer: 6.9, budgetMeal: 15.5, midRangeMeal: 34.5, expensiveMeal: 77.5 },
  },
  'uruguay': { // Uruguay
    currencyCode: 'UYU',
    representativeCitySlug: 'montevideo',
    averagePrices: { beer: 143, budgetMeal: 321, midRangeMeal: 714, expensiveMeal: 1610 },
  },
  'paraguay': { // Paraguay
    currencyCode: 'PYG',
    representativeCitySlug: 'asuncion',
    averagePrices: { beer: 12320, budgetMeal: 27720, midRangeMeal: 61600, expensiveMeal: 138600 },
  },
  'venezuela': { // Venezuela
    currencyCode: 'USD',
    representativeCitySlug: 'caracas',
    averagePrices: { beer: 1.6, budgetMeal: 3.6, midRangeMeal: 8.0, expensiveMeal: 18.0 },
  },
  'guyana': { // Guyana
    currencyCode: 'GYD',
    representativeCitySlug: 'georgetown',
    averagePrices: { beer: 336, budgetMeal: 756, midRangeMeal: 1680, expensiveMeal: 3780 },
  },
  'japan': { // Japan
    currencyCode: 'JPY',
    representativeCitySlug: 'tokyo',
    averagePrices: { beer: 749, budgetMeal: 1680, midRangeMeal: 3740, expensiveMeal: 8420 },
  },
  'china': { // China
    currencyCode: 'CNY',
    representativeCitySlug: 'shanghai',
    averagePrices: { beer: 17.5, budgetMeal: 39.0, midRangeMeal: 87.0, expensiveMeal: 196 },
  },
  'south-korea': { // South Korea
    currencyCode: 'KRW',
    representativeCitySlug: 'seoul',
    averagePrices: { beer: 4690, budgetMeal: 10560, midRangeMeal: 23460, expensiveMeal: 52780 },
  },
  'thailand': { // Thailand
    currencyCode: 'THB',
    representativeCitySlug: 'bangkok',
    averagePrices: { beer: 55.0, budgetMeal: 124, midRangeMeal: 276, expensiveMeal: 621 },
  },
  'vietnam': { // Vietnam
    currencyCode: 'VND',
    representativeCitySlug: 'hanoi',
    averagePrices: { beer: 25400, budgetMeal: 57150, midRangeMeal: 127000, expensiveMeal: 285750 },
  },
  'indonesia': { // Indonesia
    currencyCode: 'IDR',
    representativeCitySlug: 'bali',
    averagePrices: { beer: 16200, budgetMeal: 36450, midRangeMeal: 81000, expensiveMeal: 182250 },
  },
  'malaysia': { // Malaysia
    currencyCode: 'MYR',
    representativeCitySlug: 'kuala-lumpur',
    averagePrices: { beer: 7.04, budgetMeal: 16.0, midRangeMeal: 35.0, expensiveMeal: 79.0 },
  },
  'singapore': { // Singapore
    currencyCode: 'SGD',
    representativeCitySlug: 'singapore-city',
    averagePrices: { beer: 6.48, budgetMeal: 14.5, midRangeMeal: 32.5, expensiveMeal: 73.0 },
  },
  'philippines': { // Philippines
    currencyCode: 'PHP',
    representativeCitySlug: 'manila',
    averagePrices: { beer: 93.0, budgetMeal: 209, midRangeMeal: 464, expensiveMeal: 1040 },
  },
  'india': { // India
    currencyCode: 'INR',
    representativeCitySlug: 'delhi',
    averagePrices: { beer: 86.0, budgetMeal: 194, midRangeMeal: 430, expensiveMeal: 968 },
  },
  'sri-lanka': { // Sri Lanka
    currencyCode: 'LKR',
    representativeCitySlug: 'colombo',
    averagePrices: { beer: 300, budgetMeal: 675, midRangeMeal: 1500, expensiveMeal: 3380 },
  },
  'nepal': { // Nepal
    currencyCode: 'NPR',
    representativeCitySlug: 'kathmandu',
    averagePrices: { beer: 98.5, budgetMeal: 222, midRangeMeal: 493, expensiveMeal: 1110 },
  },
  'bangladesh': { // Bangladesh
    currencyCode: 'BDT',
    representativeCitySlug: 'dhaka',
    averagePrices: { beer: 88.0, budgetMeal: 198, midRangeMeal: 439, expensiveMeal: 988 },
  },
  'cambodia': { // Cambodia
    currencyCode: 'USD',
    representativeCitySlug: 'siem-reap',
    averagePrices: { beer: 1.0, budgetMeal: 2.25, midRangeMeal: 5.0, expensiveMeal: 11.0 },
  },
  'laos': { // Laos
    currencyCode: 'LAK',
    representativeCitySlug: 'luang-prabang',
    averagePrices: { beer: 21700, budgetMeal: 48820, midRangeMeal: 108500, expensiveMeal: 244120 },
  },
  'myanmar': { // Myanmar
    currencyCode: 'MMK',
    representativeCitySlug: 'yangon',
    averagePrices: { beer: 2100, budgetMeal: 4720, midRangeMeal: 10500, expensiveMeal: 23620 },
  },
  'taiwan': { // Taiwan
    currencyCode: 'TWD',
    representativeCitySlug: 'taipei',
    averagePrices: { beer: 78.0, budgetMeal: 175, midRangeMeal: 390, expensiveMeal: 878 },
  },
  'hong-kong': { // Hong Kong
    currencyCode: 'HKD',
    representativeCitySlug: 'hong-kong-city',
    averagePrices: { beer: 37.5, budgetMeal: 84.0, midRangeMeal: 187, expensiveMeal: 421 },
  },
  'macau': { // Macau
    currencyCode: 'MOP',
    representativeCitySlug: 'macau-city',
    averagePrices: { beer: 27.0, budgetMeal: 61.0, midRangeMeal: 136, expensiveMeal: 306 },
  },
  'mongolia': { // Mongolia
    currencyCode: 'MNT',
    representativeCitySlug: 'ulaanbaatar',
    averagePrices: { beer: 5520, budgetMeal: 12420, midRangeMeal: 27600, expensiveMeal: 62100 },
  },
  'kazakhstan': { // Kazakhstan
    currencyCode: 'KZT',
    representativeCitySlug: 'almaty',
    averagePrices: { beer: 824, budgetMeal: 1850, midRangeMeal: 4120, expensiveMeal: 9270 },
  },
  'uzbekistan': { // Uzbekistan
    currencyCode: 'UZS',
    representativeCitySlug: 'tashkent',
    averagePrices: { beer: 12700, budgetMeal: 28580, midRangeMeal: 63500, expensiveMeal: 142880 },
  },
  'maldives': { // Maldives
    currencyCode: 'USD',
    representativeCitySlug: 'male',
    averagePrices: { beer: 6.4, budgetMeal: 14.5, midRangeMeal: 32.0, expensiveMeal: 72.0 },
  },
  'bhutan': { // Bhutan
    currencyCode: 'BTN',
    representativeCitySlug: 'thimphu',
    averagePrices: { beer: 206, budgetMeal: 464, midRangeMeal: 1030, expensiveMeal: 2320 },
  },
  'pakistan': { // Pakistan
    currencyCode: 'PKR',
    representativeCitySlug: 'lahore',
    averagePrices: { beer: 200, budgetMeal: 450, midRangeMeal: 1000, expensiveMeal: 2250 },
  },
  'united-arab-emirates': { // United Arab Emirates
    currencyCode: 'AED',
    representativeCitySlug: 'dubai',
    averagePrices: { beer: 17.5, budgetMeal: 39.5, midRangeMeal: 88.0, expensiveMeal: 198 },
  },
  'saudi-arabia': { // Saudi Arabia
    currencyCode: 'SAR',
    representativeCitySlug: 'riyadh',
    averagePrices: { beer: 13.0, budgetMeal: 28.5, midRangeMeal: 64.0, expensiveMeal: 143 },
  },
  'qatar': { // Qatar
    currencyCode: 'QAR',
    representativeCitySlug: 'doha',
    averagePrices: { beer: 17.5, budgetMeal: 39.5, midRangeMeal: 87.5, expensiveMeal: 197 },
  },
  'israel': { // Israel
    currencyCode: 'ILS',
    representativeCitySlug: 'tel-aviv',
    averagePrices: { beer: 18.0, budgetMeal: 40.0, midRangeMeal: 89.0, expensiveMeal: 200 },
  },
  'jordan': { // Jordan
    currencyCode: 'JOD',
    representativeCitySlug: 'amman',
    averagePrices: { beer: 1.7, budgetMeal: 3.83, midRangeMeal: 8.52, expensiveMeal: 19.0 },
  },
  'turkey': { // Turkey
    currencyCode: 'TRY',
    representativeCitySlug: 'istanbul',
    averagePrices: { beer: 51.0, budgetMeal: 115, midRangeMeal: 256, expensiveMeal: 576 },
  },
  'oman': { // Oman
    currencyCode: 'OMR',
    representativeCitySlug: 'muscat',
    averagePrices: { beer: 1.31, budgetMeal: 2.95, midRangeMeal: 6.54, expensiveMeal: 14.5 },
  },
  'bahrain': { // Bahrain
    currencyCode: 'BHD',
    representativeCitySlug: 'manama',
    averagePrices: { beer: 1.28, budgetMeal: 2.88, midRangeMeal: 6.39, expensiveMeal: 14.5 },
  },
  'kuwait': { // Kuwait
    currencyCode: 'KWD',
    representativeCitySlug: 'kuwait-city',
    averagePrices: { beer: 1.04, budgetMeal: 2.35, midRangeMeal: 5.22, expensiveMeal: 11.5 },
  },
  'lebanon': { // Lebanon
    currencyCode: 'USD',
    representativeCitySlug: 'beirut',
    averagePrices: { beer: 2.4, budgetMeal: 5.4, midRangeMeal: 12.0, expensiveMeal: 27.0 },
  },
  'egypt': { // Egypt
    currencyCode: 'EGP',
    representativeCitySlug: 'cairo',
    averagePrices: { beer: 49.0, budgetMeal: 110, midRangeMeal: 245, expensiveMeal: 551 },
  },
  'morocco': { // Morocco
    currencyCode: 'MAD',
    representativeCitySlug: 'marrakech',
    averagePrices: { beer: 15.0, budgetMeal: 34.0, midRangeMeal: 75.0, expensiveMeal: 169 },
  },
  'south-africa': { // South Africa
    currencyCode: 'ZAR',
    representativeCitySlug: 'cape-town',
    averagePrices: { beer: 43.5, budgetMeal: 98.5, midRangeMeal: 218, expensiveMeal: 491 },
  },
  'tunisia': { // Tunisia
    currencyCode: 'TND',
    representativeCitySlug: 'tunis',
    averagePrices: { beer: 4.96, budgetMeal: 11.0, midRangeMeal: 25.0, expensiveMeal: 56.0 },
  },
  'kenya': { // Kenya
    currencyCode: 'KES',
    representativeCitySlug: 'nairobi',
    averagePrices: { beer: 129, budgetMeal: 290, midRangeMeal: 645, expensiveMeal: 1450 },
  },
  'tanzania': { // Tanzania
    currencyCode: 'TZS',
    representativeCitySlug: 'zanzibar',
    averagePrices: { beer: 2700, budgetMeal: 6080, midRangeMeal: 13500, expensiveMeal: 30380 },
  },
  'ethiopia': { // Ethiopia
    currencyCode: 'ETB',
    representativeCitySlug: 'addis-ababa',
    averagePrices: { beer: 90.0, budgetMeal: 202, midRangeMeal: 450, expensiveMeal: 1010 },
  },
  'nigeria': { // Nigeria
    currencyCode: 'NGN',
    representativeCitySlug: 'lagos',
    averagePrices: { beer: 1550, budgetMeal: 3490, midRangeMeal: 7750, expensiveMeal: 17440 },
  },
  'ghana': { // Ghana
    currencyCode: 'GHS',
    representativeCitySlug: 'accra',
    averagePrices: { beer: 15.5, budgetMeal: 35.0, midRangeMeal: 78.0, expensiveMeal: 176 },
  },
  'senegal': { // Senegal
    currencyCode: 'XOF',
    representativeCitySlug: 'dakar',
    averagePrices: { beer: 605, budgetMeal: 1360, midRangeMeal: 3020, expensiveMeal: 6810 },
  },
  'mauritius': { // Mauritius
    currencyCode: 'MUR',
    representativeCitySlug: 'port-louis',
    averagePrices: { beer: 110, budgetMeal: 248, midRangeMeal: 552, expensiveMeal: 1240 },
  },
  'seychelles': { // Seychelles
    currencyCode: 'SCR',
    representativeCitySlug: 'victoria',
    averagePrices: { beer: 46.0, budgetMeal: 103, midRangeMeal: 230, expensiveMeal: 516 },
  },
  'namibia': { // Namibia
    currencyCode: 'NAD',
    representativeCitySlug: 'windhoek',
    averagePrices: { beer: 29.0, budgetMeal: 65.5, midRangeMeal: 146, expensiveMeal: 328 },
  },
  'botswana': { // Botswana
    currencyCode: 'BWP',
    representativeCitySlug: 'gaborone',
    averagePrices: { beer: 22.0, budgetMeal: 49.0, midRangeMeal: 109, expensiveMeal: 245 },
  },
  'zimbabwe': { // Zimbabwe
    currencyCode: 'USD',
    representativeCitySlug: 'harare',
    averagePrices: { beer: 1.0, budgetMeal: 2.25, midRangeMeal: 5.0, expensiveMeal: 11.0 },
  },
  'zambia': { // Zambia
    currencyCode: 'ZMW',
    representativeCitySlug: 'livingstone',
    averagePrices: { beer: 27.0, budgetMeal: 61.0, midRangeMeal: 135, expensiveMeal: 304 },
  },
  'rwanda': { // Rwanda
    currencyCode: 'RWF',
    representativeCitySlug: 'kigali',
    averagePrices: { beer: 1330, budgetMeal: 2990, midRangeMeal: 6650, expensiveMeal: 14960 },
  },
  'uganda': { // Uganda
    currencyCode: 'UGX',
    representativeCitySlug: 'kampala',
    averagePrices: { beer: 3700, budgetMeal: 8320, midRangeMeal: 18500, expensiveMeal: 41620 },
  },
  'algeria': { // Algeria
    currencyCode: 'DZD',
    representativeCitySlug: 'algiers',
    averagePrices: { beer: 134, budgetMeal: 302, midRangeMeal: 670, expensiveMeal: 1510 },
  },
  'cote-divoire': { // Cote d'Ivoire
    currencyCode: 'XOF',
    representativeCitySlug: 'abidjan',
    averagePrices: { beer: 605, budgetMeal: 1360, midRangeMeal: 3020, expensiveMeal: 6810 },
  },
  'madagascar': { // Madagascar
    currencyCode: 'MGA',
    representativeCitySlug: 'antananarivo',
    averagePrices: { beer: 3240, budgetMeal: 7290, midRangeMeal: 16200, expensiveMeal: 36450 },
  },
  'cape-verde': { // Cape Verde
    currencyCode: 'CVE',
    representativeCitySlug: 'sal',
    averagePrices: { beer: 162, budgetMeal: 364, midRangeMeal: 808, expensiveMeal: 1820 },
  },
  'australia': { // Australia
    currencyCode: 'AUD',
    representativeCitySlug: 'sydney',
    averagePrices: { beer: 7.3, budgetMeal: 16.5, midRangeMeal: 36.5, expensiveMeal: 82.0 },
  },
  'new-zealand': { // New Zealand
    currencyCode: 'NZD',
    representativeCitySlug: 'auckland',
    averagePrices: { beer: 7.92, budgetMeal: 18.0, midRangeMeal: 39.5, expensiveMeal: 89.0 },
  },
  'fiji': { // Fiji
    currencyCode: 'FJD',
    representativeCitySlug: 'nadi',
    averagePrices: { beer: 5.42, budgetMeal: 12.0, midRangeMeal: 27.0, expensiveMeal: 61.0 },
  },
  'french-polynesia': { // French Polynesia
    currencyCode: 'XPF',
    representativeCitySlug: 'tahiti',
    averagePrices: { beer: 698, budgetMeal: 1570, midRangeMeal: 3490, expensiveMeal: 7850 },
  },
  'papua-new-guinea': { // Papua New Guinea
    currencyCode: 'PGK',
    representativeCitySlug: 'port-moresby',
    averagePrices: { beer: 6.24, budgetMeal: 14.0, midRangeMeal: 31.0, expensiveMeal: 70.0 },
  },
  'vanuatu': { // Vanuatu
    currencyCode: 'VUV',
    representativeCitySlug: 'port-vila',
    averagePrices: { beer: 190, budgetMeal: 428, midRangeMeal: 952, expensiveMeal: 2140 },
  },
  'samoa': { // Samoa
    currencyCode: 'WST',
    representativeCitySlug: 'apia',
    averagePrices: { beer: 6.48, budgetMeal: 14.5, midRangeMeal: 32.5, expensiveMeal: 73.0 },
  },
  'cook-islands': { // Cook Islands
    currencyCode: 'NZD',
    representativeCitySlug: 'rarotonga',
    averagePrices: { beer: 5.61, budgetMeal: 12.5, midRangeMeal: 28.0, expensiveMeal: 63.0 },
  },
}