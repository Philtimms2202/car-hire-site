'use client'

import { createContext, useContext, useState } from 'react'

type LocaleContextType = {
  locale: string
  setLocale: (value: string) => void
  currency: string
  setCurrency: (value: string) => void
}

const LocaleContext = createContext<LocaleContextType | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState("en_gb")     // Trip.com language + currency
  const [currency, setCurrency] = useState("gbp")   // Aviasales currency

  return (
    <LocaleContext.Provider value={{ locale, setLocale, currency, setCurrency }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider")
  return ctx
}