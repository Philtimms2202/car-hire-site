'use client'

import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      style={{ backgroundColor: '#ffffff', borderBottom: '3px solid #2f797c' }}
      className="px-6 py-4 relative z-50"
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
        <div className="hidden md:flex gap-8 items-center">

          {/* MEGA MENU */}
          <div className="relative group">

            {/* Trigger */}
            <a
              href="/locations/continents"
              style={{ color: '#232e4e' }}
              className="font-medium hover:opacity-75 transition flex items-center gap-1"
            >
              Locations
              <span className="text-xs">▼</span>
            </a>

            {/* Dropdown */}
            <div
              className="
                absolute left-0 top-full w-[700px]
                bg-white shadow-2xl rounded-2xl p-8
                grid grid-cols-3 gap-8 border border-gray-200

                opacity-0 invisible translate-y-2
                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0

                transition-all duration-200 ease-out
              "
            >
              {/* Column 1 */}
              <div>
                <h4 className="font-semibold mb-4 text-[#232e4e]">Continents</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/locations/europe" className="hover:text-[#2f797c]">Europe</a></li>
                  <li><a href="/locations/asia" className="hover:text-[#2f797c]">Asia</a></li>
                  <li><a href="/locations/north-america" className="hover:text-[#2f797c]">North America</a></li>
                  <li><a href="/locations/south-america" className="hover:text-[#2f797c]">South America</a></li>
                  <li><a href="/locations/africa" className="hover:text-[#2f797c]">Africa</a></li>
                  <li><a href="/locations/oceania" className="hover:text-[#2f797c]">Oceania</a></li>
                </ul>
              </div>

              {/* Column 2 */}
              <div>
                <h4 className="font-semibold mb-4 text-[#232e4e]">Popular Countries</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/locations/europe/france" className="hover:text-[#2f797c]">France</a></li>
                  <li><a href="/locations/europe/spain" className="hover:text-[#2f797c]">Spain</a></li>
                  <li><a href="/locations/europe/italy" className="hover:text-[#2f797c]">Italy</a></li>
                  <li><a href="/locations/europe/united-kingdom" className="hover:text-[#2f797c]">United Kingdom</a></li>
                  <li><a href="/locations/asia/japan" className="hover:text-[#2f797c]">Japan</a></li>
                </ul>
              </div>

              {/* Column 3 */}
              <div>
                <h4 className="font-semibold mb-4 text-[#232e4e]">Popular Cities</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/locations/europe/france/paris" className="hover:text-[#2f797c]">Paris</a></li>
                  <li><a href="/locations/europe/italy/rome" className="hover:text-[#2f797c]">Rome</a></li>
                  <li><a href="/locations/europe/spain/barcelona" className="hover:text-[#2f797c]">Barcelona</a></li>
                  <li><a href="/locations/europe/united-kingdom/london" className="hover:text-[#2f797c]">London</a></li>
                  <li><a href="/locations/europe/ireland/dublin" className="hover:text-[#2f797c]">Dublin</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Standard Links */}
          <a href="/blog" style={{ color: '#232e4e' }} className="font-medium hover:opacity-75 transition">Blog</a>
          <a href="/about" style={{ color: '#232e4e' }} className="font-medium hover:opacity-75 transition">About</a>
          <a href="/contact" style={{ color: '#232e4e' }} className="font-medium hover:opacity-75 transition">Contact Us</a>
        </div>

        {/* Hamburger Button */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-[#232e4e] transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-[#232e4e] transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-[#232e4e] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 pb-4 border-t pt-4">
          <a href="/locations" className="font-medium hover:opacity-75 transition text-[#232e4e]">Locations</a>
          <a href="/blog" className="font-medium hover:opacity-75 transition text-[#232e4e]">Blog</a>
          <a href="/about" className="font-medium hover:opacity-75 transition text-[#232e4e]">About</a>
          <a href="/contact" className="font-medium hover:opacity-75 transition text-[#232e4e]">Contact Us</a>
        </div>
      )}
    </nav>
  )
}