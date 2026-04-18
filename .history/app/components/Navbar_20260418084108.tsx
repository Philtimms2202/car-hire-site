'use client'

import { useState } from 'react'
import { useLocale } from '@/context/localeContext'
import { LANGUAGES, CURRENCIES } from '@/data/locale-options'

const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#232e4e"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15 15 0 0 1 0 20" />
    <path d="M12 2a15 15 0 0 0 0 20" />
  </svg>
)

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [localeOpen, setLocaleOpen] = useState(false)
  const { language, currency, setLanguage, setCurrency } = useLocale()

  // Menu links
  const menuLinks = [
    { label: 'Locations', href: '/locations/continents' },
    { label: 'Flights', href: '/flights' },
    { label: 'Hotels', href: '/hotels' },
    { label: 'Experiences', href: '/experiences' },
    { label: 'Car Hire', href: '/car-hire' }, // <-- Added
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ]

  return (
    <nav
      className="px-6 py-4 relative"
      style={{ backgroundColor: '#ffffff', borderBottom: '3px solid #2f797c' }}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a href="/">
          <img
            src="/timms-travel-logo.png"
            alt="Timms Travel Logo"
            className="h-16 w-auto"
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {menuLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="font-medium hover:opacity-75 transition"
              style={{ color: '#232e4e' }}
            >
              {link.label}
            </a>
          ))}

          {/* Locale Button */}
          <button
            onClick={() => setLocaleOpen(prev => !prev)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <GlobeIcon />
          </button>
        </div>

        {/* Hamburger Button */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-[#232e4e] transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-[#232e4e] transition-all ${menuOpen ? 'opacity-0' : ''}`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-[#232e4e] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
          ></span>
        </button>
      </div>

      {/* Desktop Locale Dropdown */}
      {localeOpen && (
        <div className="hidden md:block absolute right-6 top-20 bg-white shadow-xl border rounded-xl p-6 w-72 z-50">
          <h3 className="font-semibold mb-2" style={{ color: '#232e4e' }}>Language</h3>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>

          <h3 className="font-semibold mb-2" style={{ color: '#232e4e' }}>Currency</h3>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            {CURRENCIES.map(cur => (
              <option key={cur.code} value={cur.code}>{cur.label}</option>
            ))}
          </select>

          <button
            onClick={() => setLocaleOpen(false)}
            className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Apply
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 pb-4 border-t pt-4" style={{ borderColor: '#e5e7eb' }}>
          {menuLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="font-medium hover:opacity-75 transition"
              style={{ color: '#232e4e' }}
            >
              {link.label}
            </a>
          ))}

          {/* Mobile Locale Selector */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2" style={{ color: '#232e4e' }}>Language</h3>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>

            <h3 className="font-semibold mb-2" style={{ color: '#232e4e' }}>Currency</h3>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              {CURRENCIES.map(cur => (
                <option key={cur.code} value={cur.code}>{cur.label}</option>
              ))}
            </select>

            <button
              onClick={() => setMenuOpen(false)}
              className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}