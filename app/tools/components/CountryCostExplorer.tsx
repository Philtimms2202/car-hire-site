'use client'

import Link from 'next/link'
import { getCurrency } from '@/app/tools/data/currencies'

// ASSUMPTION - adjust to match your real Sanity schema/field names.
// I don't have your actual country schema, so this is the shape I'm
// querying for in page.tsx. Rename fields there + here if yours differ.
export interface CountryCostData {
  name: string
  countrySlug: string
  continentSlug: string
  currencyCode: string
  // Optional: the slug of a representative city used for your /hotels/[slug]
  // pages (e.g. Austria -> "vienna"). If you don't have this mapped yet,
  // leave it undefined and the card will link to the general /hotels page
  // instead of guessing a city slug that might not exist.
  representativeCitySlug?: string
  averagePrices: {
    beer: number
    budgetMeal: number
    midRangeMeal: number
    expensiveMeal: number
  }
}

interface CountryCostExplorerProps {
  countries: CountryCostData[]
  selectedSlug: string
  onSelectCountry: (slug: string) => void
}

export default function CountryCostExplorer({
  countries,
  selectedSlug,
  onSelectCountry,
}: CountryCostExplorerProps) {
  const country = countries.find(c => c.countrySlug === selectedSlug) ?? countries[0]

  if (!country) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        No country cost data available yet.
      </div>
    )
  }

  const currency = getCurrency(country.currencyCode)
  const locationHref = `/locations/${country.continentSlug}/${country.countrySlug}`

  const priceRows: { label: string; value: number; note: string }[] = [
    { label: 'Pint of local beer', value: country.averagePrices.beer, note: 'Bar or pub, not supermarket' },
    { label: 'Budget meal', value: country.averagePrices.budgetMeal, note: 'Street food or casual cafe' },
    { label: 'Mid-range meal', value: country.averagePrices.midRangeMeal, note: 'Two courses, sit-down restaurant' },
    { label: 'Expensive meal', value: country.averagePrices.expensiveMeal, note: 'Three courses, nicer restaurant' },
  ]

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">
            Select a country
          </label>
          <select
            value={country.countrySlug}
            onChange={(e) => onSelectCountry(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium focus:outline-none"
            style={{ color: '#022135' }}
          >
            {countries.map(c => (
              <option key={c.countrySlug} value={c.countrySlug}>{c.name}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-gray-400 max-w-xs">
          Prices shown in {currency.code} ({currency.symbol}), converted in the tool above using today's rates.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {priceRows.map(row => (
          <div key={row.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm font-semibold" style={{ color: '#022135' }}>{row.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#03989e' }}>
              {currency.symbol}{row.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">{row.note}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
        <Link
          href={locationHref}
          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white transition hover:opacity-90"
          style={{ backgroundColor: '#03989e' }}
        >
          Explore {country.name} →
        </Link>
        <Link
          href="/hotels"
          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition hover:opacity-80"
          style={{ borderColor: '#03989e', color: '#03989e' }}
        >
          Find hotels
        </Link>
        <Link
          href="/flights"
          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition hover:opacity-80"
          style={{ borderColor: '#03989e', color: '#03989e' }}
        >
          Search flights
        </Link>
        <Link
          href="/experiences"
          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition hover:opacity-80"
          style={{ borderColor: '#03989e', color: '#03989e' }}
        >
          Things to do
        </Link>
        <Link
          href="/car-hire"
          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition hover:opacity-80"
          style={{ borderColor: '#03989e', color: '#03989e' }}
        >
          Car hire
        </Link>
      </div>
    </div>
  )
}