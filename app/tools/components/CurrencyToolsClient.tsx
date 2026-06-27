'use client'

import { useState } from 'react'
import CurrencyConverter from '@/app/tools/components/CurrencyConverter'
import CountryCostExplorer, { CountryCostData } from '@/app/tools/components/CountryCostExplorer'

interface CurrencyToolsClientProps {
  rates: Record<string, number>
  base: string
  lastUpdatedUtc: string
  countries: CountryCostData[]
}

export default function CurrencyToolsClient({
  rates,
  base,
  lastUpdatedUtc,
  countries,
}: CurrencyToolsClientProps) {
  const [selectedSlug, setSelectedSlug] = useState(countries[0]?.countrySlug ?? '')
  const [toCurrency, setToCurrency] = useState(countries[0]?.currencyCode ?? 'EUR')
  const [amount, setAmount] = useState('1')

  // When the user picks a different country below, sync the converter:
  // switch its "to" currency to match, and pre-fill the amount with that
  // country's mid-range meal price, so the converter instantly shows
  // "this meal costs roughly £X" without the user doing any typing.
  function handleSelectCountry(slug: string) {
    setSelectedSlug(slug)
    const country = countries.find(c => c.countrySlug === slug)
    if (country) {
      setToCurrency(country.currencyCode)
      setAmount(String(country.averagePrices.midRangeMeal))
    }
  }

  return (
    <div className="space-y-6">
      <CurrencyConverter
        rates={rates}
        base={base}
        lastUpdatedUtc={lastUpdatedUtc}
        toCurrency={toCurrency}
        amount={amount}
        onToCurrencyChange={setToCurrency}
        onAmountChange={setAmount}
      />
      <CountryCostExplorer
        countries={countries}
        selectedSlug={selectedSlug}
        onSelectCountry={handleSelectCountry}
      />
    </div>
  )
}