'use client'

import { useState, useMemo } from 'react'
import { CURRENCIES } from '@/app/tools/data/currencies'

interface CurrencyConverterProps {
  rates: Record<string, number>
  base: string // the currency the rates object is relative to (e.g. 'GBP')
  lastUpdatedUtc: string
  // Allows the cost-of-living explorer below to drive this converter's
  // "to" currency + amount when someone picks a country, while still
  // letting the user override it manually.
  toCurrency: string
  amount: string
  onToCurrencyChange: (code: string) => void
  onAmountChange: (value: string) => void
}

export default function CurrencyConverter({
  rates,
  base,
  lastUpdatedUtc,
  toCurrency,
  amount,
  onToCurrencyChange,
  onAmountChange,
}: CurrencyConverterProps) {
  const [fromCurrency, setFromCurrency] = useState('GBP')

  // Rates are relative to `base`. To convert fromCurrency -> toCurrency we
  // first convert into the base, then into the target.
  const convertedAmount = useMemo(() => {
    const numericAmount = parseFloat(amount)
    if (Number.isNaN(numericAmount)) return null

    const fromRate = fromCurrency === base ? 1 : rates[fromCurrency]
    const toRate = toCurrency === base ? 1 : rates[toCurrency]
    if (!fromRate || !toRate) return null

    const amountInBase = numericAmount / fromRate
    return amountInBase * toRate
  }, [amount, fromCurrency, toCurrency, rates, base])

  const rate = useMemo(() => {
    const fromRate = fromCurrency === base ? 1 : rates[fromCurrency]
    const toRate = toCurrency === base ? 1 : rates[toCurrency]
    if (!fromRate || !toRate) return null
    return toRate / fromRate
  }, [fromCurrency, toCurrency, rates, base])

  function handleSwap() {
    const prevFrom = fromCurrency
    setFromCurrency(toCurrency)
    onToCurrencyChange(prevFrom)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
        {/* From */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">
            Amount
          </label>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2" style={{ '--tw-ring-color': '#03989e' } as React.CSSProperties}>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="bg-gray-50 px-3 text-sm font-medium border-r border-gray-200 focus:outline-none"
              style={{ color: '#022135' }}
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              className="w-full px-3 py-3 text-lg font-semibold focus:outline-none"
              style={{ color: '#022135' }}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Swap button */}
        <button
          onClick={handleSwap}
          aria-label="Swap currencies"
          className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:opacity-75 transition mb-1 mx-auto"
          style={{ color: '#03989e' }}
        >
          ⇄
        </button>
        <button
          onClick={handleSwap}
          aria-label="Swap currencies"
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:opacity-75 transition mx-auto"
          style={{ color: '#03989e' }}
        >
          ⇄
        </button>

        {/* To */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">
            Converted to
          </label>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            <select
              value={toCurrency}
              onChange={(e) => onToCurrencyChange(e.target.value)}
              className="bg-gray-50 px-3 text-sm font-medium border-r border-gray-200 focus:outline-none"
              style={{ color: '#022135' }}
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>
            <div className="w-full px-3 py-3 text-lg font-semibold bg-gray-50" style={{ color: '#022135' }}>
              {convertedAmount !== null
                ? convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })
                : '—'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm">
        <p className="text-gray-500">
          {rate !== null
            ? <>1 {fromCurrency} = {rate.toLocaleString(undefined, { maximumFractionDigits: 4 })} {toCurrency}</>
            : 'Rate unavailable for this pair'}
        </p>
        <p className="text-xs text-gray-400">
          Rates updated daily{lastUpdatedUtc !== 'unavailable' ? ` · last update ${new Date(lastUpdatedUtc).toUTCString()}` : ''}
          {' · '}
          <a
            href="https://www.exchangerate-api.com"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="underline hover:opacity-75"
          >
            Rates by ExchangeRate-API
          </a>
        </p>
      </div>
    </div>
  )
}