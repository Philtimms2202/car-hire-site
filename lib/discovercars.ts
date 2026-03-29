const API_KEY = process.env.NEXT_PUBLIC_DISCOVERCARS_API_KEY
const AFFILIATE_ID = process.env.NEXT_PUBLIC_DISCOVERCARS_AFFILIATE_ID

export interface SearchParams {
  pickupLocation: string
  pickupDate: string
  dropoffDate: string
}

export async function searchCars(params: SearchParams) {
  // TODO: Replace with real Discover Cars API call when credentials are approved
  console.log('Searching with:', params, 'API Key:', API_KEY, 'Affiliate:', AFFILIATE_ID)

  // Placeholder response - mirrors expected real API structure
  return {
    results: [
      {
        id: 1,
        name: 'Economy Car',
        category: 'Economy',
        seats: 4,
        doors: 4,
        transmission: 'Manual',
        price: '£25',
        pricePerDay: 25,
        image: '🚗',
        supplier: 'Hertz',
        supplierLogo: 'https://placeholder.com/hertz-logo.png', // ← real URL from API goes here
        location: params.pickupLocation,
        freeCancellation: true,
      },
      {
        id: 2,
        name: 'SUV / Family',
        category: 'SUV',
        seats: 5,
        doors: 5,
        transmission: 'Automatic',
        price: '£45',
        pricePerDay: 45,
        image: '🚙',
        supplier: 'Europcar',
        supplierLogo: 'https://placeholder.com/europcar-logo.png',
        location: params.pickupLocation,
        freeCancellation: true,
      },
      {
        id: 3,
        name: 'Luxury Sedan',
        category: 'Luxury',
        seats: 4,
        doors: 4,
        transmission: 'Automatic',
        price: '£85',
        pricePerDay: 85,
        image: '🏎️',
        supplier: 'Avis',
        supplierLogo: 'https://placeholder.com/avis-logo.png',
        location: params.pickupLocation,
        freeCancellation: false,
      },
    ]
  }
}