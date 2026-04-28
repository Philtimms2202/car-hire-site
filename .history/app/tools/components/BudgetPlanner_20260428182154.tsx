'use client'

import { useState } from 'react'

const CATEGORIES = [
  { key: 'flights',    label: 'Flights',           perDay: false, default: 300 },
  { key: 'hotel',      label: 'Accommodation',     perDay: true,  default: 80  },
  { key: 'food',       label: 'Food & drink',      perDay: true,  default: 40  },
  { key: 'transport',  label: 'Local transport',   perDay: true,  default: 15  },
  { key: 'activities', label: 'Activities & tours', perDay: true,  default: 30  },
  { key: 'shopping',   label: 'Shopping & misc',   perDay: true,  default: 20  },
]

const CURRENCIES = [
  { symbol: '£', label: 'GBP (£)' },
  { symbol: '€', label: 'EUR (€)' },
  { symbol: '$', label: 'USD ($)' },
]

export default function BudgetPlanner() {
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState(7)
  const [currency, setCurrency] = useState('£')
  const [values, setValues] = useState<Record<string,number>>(
    Object.fromEntries(CATEGORIES.map(c => [c.key, c.default]))
  )

  function update(key: string, val: number) {
    setValues(prev => ({ ...prev, [key]: Math.max(0, val) }))
  }

  const totals = CATEGORIES.map(cat => ({
    ...cat,
    lineTotal: cat.perDay ? values[cat.key] * days : values[cat.key],
  }))
  const grandTotal = totals.reduce((sum, c) => sum + c.lineTotal, 0)
  const perDay = grandTotal / days

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Destination</label>
          <input type="text" value={destination} onChange={e=>setDestination(e.target.value)}
            placeholder="e.g. Barcelona"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#03989e]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Duration (days)</label>
          <input type="number" value={days} min={1} onChange={e=>setDays(parseInt(e.target.value)||1)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#03989e]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Currency</label>
          <div className="flex gap-2">
            {CURRENCIES.map(c => (
              <button key={c.symbol} onClick={()=>setCurrency(c.symbol)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition ${currency===c.symbol ? 'border-[#03989e] text-[#03989e] bg-teal-50' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                {c.symbol}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-4">
        {totals.map(cat => {
          const pct = grandTotal > 0 ? (cat.lineTotal / grandTotal) * 100 : 0
          return (
            <div key={cat.key}>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-sm font-medium" style={{ color: '#022135' }}>{cat.label}</span>
                  <span className="text-xs text-gray-400 ml-2">{cat.perDay ? 'per day' : 'total'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-400">{currency}</span>
                    <input type="number" value={values[cat.key]} min={0} step={5}
                      onChange={e=>update(cat.key, parseFloat(e.target.value)||0)}
                      className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#03989e]"
                    />
                  </div>
                  <span className="text-sm font-semibold w-20 text-right" style={{ color: '#022135' }}>
                    {currency}{Math.round(cat.lineTotal).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${pct}%`, backgroundColor: '#03989e' }} />
              </div>
            </div>
          )
        })}

        <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm font-semibold" style={{ color: '#022135' }}>Total estimate</span>
          <span className="text-2xl font-semibold" style={{ color: '#022135' }}>
            {currency}{Math.round(grandTotal).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Per day', value: `${currency}${Math.round(perDay).toLocaleString()}` },
          { label: 'Total days', value: String(days) },
          { label: 'Grand total', value: `${currency}${Math.round(grandTotal).toLocaleString()}` },
        ].map(stat => (
          <div key={stat.label} className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className="text-xl font-semibold" style={{ color: '#022135' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {destination && (
        <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          Estimate for {destination}. Adjust each line to match your travel style — the defaults are based on mid-range travel.
        </div>
      )}
    </div>
  )
}