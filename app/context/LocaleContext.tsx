'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type LocaleContextType = {
  language: string
  currency: string
  setLanguage: (lang: string) => void
  setCurrency: (cur: string) => void
}

const LocaleContext = createContext<LocaleContextType | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en')
  const [currency, setCurrency] = useState('GBP')

  // Load saved prefs
  useEffect(() => {
    const savedLang = localStorage.getItem('language')
    const savedCur = localStorage.getItem('currency')
    if (savedLang) setLanguage(savedLang)
    if (savedCur) setCurrency(savedCur)
  }, [])

  // Save prefs
  useEffect(() => {
    localStorage.setItem('language', language)
    localStorage.setItem('currency', currency)
  }, [language, currency])

  return (
    <LocaleContext.Provider value={{ language, currency, setLanguage, setCurrency }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider')
  return ctx
}
