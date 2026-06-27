// lib/exchangeRates.ts
//
// Fetches live-ish exchange rates from the free, keyless ExchangeRate-API
// open endpoint (https://www.exchangerate-api.com/docs/free). Rates update
// once a day on their end, so we cache/revalidate once a day too - no point
// hitting it more often. No API key required, but their terms ask for a
// discreet attribution link wherever rates are shown (already included in
// the CurrencyConverter component).

export interface ExchangeRatesResponse {
  base: string
  rates: Record<string, number>
  lastUpdatedUtc: string
  nextUpdateUtc: string
}

const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 156,
  AUD: 1.52,
  CAD: 1.37,
  CHF: 0.88,
  CNY: 7.25,
  INR: 84,
}

/**
 * Fetches the latest exchange rates with a given base currency.
 * Cached and revalidated once every 24 hours via Next.js fetch cache.
 */
export async function getExchangeRates(base: string = 'GBP'): Promise<ExchangeRatesResponse> {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`, {
      next: { revalidate: 86400 }, // revalidate once every 24 hours
    })

    if (!res.ok) throw new Error(`Exchange rate API responded with ${res.status}`)

    const data = await res.json()

    if (data.result !== 'success' || !data.rates) {
      throw new Error('Exchange rate API returned an unexpected payload')
    }

    return {
      base,
      rates: data.rates,
      lastUpdatedUtc: data.time_last_update_utc,
      nextUpdateUtc: data.time_next_update_utc,
    }
  } catch (err) {
    // Fail soft: if the API is briefly down, fall back to a small static
    // table so the converter still works rather than the page erroring.
    console.error('Failed to fetch live exchange rates, using fallback:', err)
    return {
      base: 'USD',
      rates: FALLBACK_RATES,
      lastUpdatedUtc: 'unavailable',
      nextUpdateUtc: 'unavailable',
    }
  }
}