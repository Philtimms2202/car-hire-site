'use client'

import { useState } from 'react'
import { useLocale } from '@/context/localeContext'
import { LANGUAGES, CURRENCIES } from '@/data/locale-options'

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#232e4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15 15 0 0 1 0 20" />
    <path d="M12 2a15 15 0 0 0 0 20" />
  </svg>
)

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

const megaMenu = {
  Explore: {
    icon: '🌍',
    description: 'Discover your next destination',
    links: [
      { label: 'Browse by Continent', href: '/locations/continents', desc: 'Explore destinations worldwide' },
      { label: 'Popular Destinations', href: '/locations/popular', desc: 'See where everyone is going' },
      { label: 'Hidden Gems', href: '/locations/hidden-gems', desc: 'Off the beaten track' },
      { label: 'Beach Holidays', href: '/locations/beach', desc: 'Sun, sand and sea' },
    ],
  },
  Travel: {
    icon: '✈️',
    description: 'Plan every part of your trip',
    links: [
      { label: 'Flights', href: '/flights', desc: 'Search and compare flights' },
      { label: 'Hotels', href: '/hotels', desc: 'Find the perfect stay' },
      { label: 'Car Hire', href: '/car-hire', desc: 'Drive at your destination' },
      { label: 'Experiences', href: '/experiences', desc: 'Tours, activities and more' },
    ],
  },
  Inspiration: {
    icon: '✨',
    description: 'Ideas for your next adventure',
    links: [
      { label: 'Travel Blog', href: '/blog', desc: 'Tips, guides and stories' },
      { label: 'Travel Guides', href: '/guides', desc: 'In-depth destination guides' },
      { label: 'Seasonal Picks', href: '/seasonal', desc: "Best places for this time of year" },
      { label: 'Budget Travel', href: '/budget', desc: 'Travel more for less' },
    ],
  },
}

const simpleLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [localeOpen, setLocaleOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const { language, currency, setLanguage, setCurrency } = useLocale()

  const mobileLinks = [
    { label: 'Locations', href: '/locations/continents' },
    { label: 'Flights', href: '/flights' },
    { label: 'Hotels', href: '/hotels' },
    { label: 'Experiences', href: '/experiences' },
    { label: 'Car Hire', href: '/car-hire' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ]

  return (
    <nav
      className="relative z-50"
      style={{ backgroundColor: '#ffffff', borderBottom: '3px solid #2f797c' }}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <a href="/">
          <img src="/timms-travel-logo.png" alt="Timms Travel Logo" className="h-16 w-auto" />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">

          {/* Mega menu triggers */}
          {Object.keys(megaMenu).map((key) => (
            <button
              key={key}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition ${activeMenu === key ? 'bg-gray-100 text-[#2f797c]' : 'text-[#232e4e] hover:bg-gray-50'}`}
              onMouseEnter={() => setActiveMenu(key)}
              onClick={() => setActiveMenu(activeMenu === key ? null : key)}
            >
              {key}
              <span className={`transition-transform duration-200 ${activeMenu === key ? 'rotate-180' : ''}`}>
                <ChevronDown />
              </span>
            </button>
          ))}

          {/* Simple links */}
          {simpleLinks.map(link => (
            
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg font-medium text-sm text-[#232e4e] hover:bg-gray-50 transition"
              onMouseEnter={() => setActiveMenu(null)}
            >
              {link.label}
            </a>
          ))}

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 mx-2" />

          {/* Globe */}
          <button
            onClick={() => { setLocaleOpen(prev => !prev); setActiveMenu(null) }}
            onMouseEnter={() => setActiveMenu(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Language and currency"
          >
            <GlobeIcon />
          </button>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-[#232e4e] transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-6 bg-[#232e4e] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-[#232e4e] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mega menu panel */}
      {activeMenu && megaMenu[activeMenu as keyof typeof megaMenu] && (
        <div
          className="hidden md:block absolute left-0 right-0 bg-white border-t border-gray-100 shadow-2xl"
          onMouseEnter={() => setActiveMenu(activeMenu)}
        >
          <div className="max-w-5xl mx-auto px-8 py-8">
            <div className="flex gap-12">

              {/* Left: heading */}
              <div className="w-56 flex-shrink-0">
                <div className="text-3xl mb-3">{megaMenu[activeMenu as keyof typeof megaMenu].icon}</div>
                <h2 className="text-lg font-semibold text-[#232e4e] mb-1">{activeMenu}</h2>
                <p className="text-sm text-gray-500 leading-snug">
                  {megaMenu[activeMenu as keyof typeof megaMenu].description}
                </p>
              </div>

              {/* Divider */}
              <div className="w-px bg-gray-100 flex-shrink-0" />

              {/* Right: links grid */}
              <div className="flex-1 grid grid-cols-2 gap-2">
                {megaMenu[activeMenu as keyof typeof megaMenu].links.map((link) => (
                  
                    key={link.href}
                    href={link.href}
                    className="flex flex-col px-4 py-3 rounded-xl hover:bg-gray-50 transition group"
                  >
                    <span className="font-medium text-sm text-[#232e4e] group-hover:text-[#2f797c] transition">{link.label}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{link.desc}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Locale dropdown */}
      {localeOpen && (
        <div className="hidden md:block absolute right-6 top-24 bg-white shadow-xl border border-gray-100 rounded-xl p-6 w-72 z-50">
          <h3 className="font-semibold mb-2 text-sm text-[#232e4e]">Language</h3>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4 text-sm"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>

          <h3 className="font-semibold mb-2 text-sm text-[#232e4e]">Currency</h3>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            {CURRENCIES.map(cur => (
              <option key={cur.code} value={cur.code}>{cur.label}</option>
            ))}
          </select>

          <button
            onClick={() => setLocaleOpen(false)}
            className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            Apply
          </button>
        </div>
      )}

      {/* Mobile menu — unchanged */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 pb-4 border-t pt-4 px-6" style={{ borderColor: '#e5e7eb' }}>
          {mobileLinks.map(link => (
            <a key={link.href} href={link.href} className="font-medium hover:opacity-75 transition text-[#232e4e]">
              {link.label}
            </a>
          ))}

          <div className="mt-4">
            <h3 className="font-semibold mb-2 text-[#232e4e]">Language</h3>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-4">
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>

            <h3 className="font-semibold mb-2 text-[#232e4e]">Currency</h3>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full border rounded-lg px-3 py-2">
              {CURRENCIES.map(cur => (
                <option key={cur.code} value={cur.code}>{cur.label}</option>
              ))}
            </select>

            <button onClick={() => setMenuOpen(false)} className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
              Apply
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}