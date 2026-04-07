'use client'

import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      style={{ backgroundColor: '#ffffff', borderBottom: '3px solid #2f797c' }}
      className="px-6 py-4 relative"
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

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-8 items-center">

          {/* LOCATIONS MEGA MENU */}
          <div
            className="relative"
          >
            {/* Hover wrapper */}
            <div className="group inline-block">
              {/* Trigger */}
              <button
                className="font-medium flex items-center gap-1 hover:opacity-75 transition"
                style={{ color: '#232e4e' }}
              >
                Locations
                <span className="text-xs">▼</span>
              </button>

              {/* Dropdown */}
              <div
                className="
                  absolute left-0 top-full mt-3 w-[600px]
                  bg-white shadow-xl rounded-xl p-6
                  grid grid-cols-3 gap-6 z-50 border border-gray-200
                  opacity-0 invisible
                  group-hover:opacity-100 group-hover:visible
                  transition-all duration-200
                "
              >
                <div>
                  <h4 className="font-semibold mb-3 text-[#232e4e]">Continents</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/locations/europe" className="hover:text-[#2f797c]">Europe</a></li>
                    <li><a href="/locations/asia" className="hover:text-[#2f797c]">Asia</a></li>
                    <li><a href="/locations/north-america" className="hover:text-[#2f797c]">North America</a></li>
                    <li><a href="/locations/south-america" className="hover:text-[#2f797c]">South America</a></li>
                    <li><a href="/locations/africa" className="hover:text-[#2f797c]">Africa</a></li>
                    <li><a href="/locations/oceania" className="hover:text-[#2f797c]">Oceania</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-[#232e4e]">Popular Countries</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/locations/europe/france" className="hover:text-[#2f797c]">France</a></li>
                    <li><a href="/locations/europe/spain" className="hover:text-[#2f797c]">Spain</a></li>
                    <li><a href="/locations/europe/italy" className="hover:text-[#2f797c]">Italy</a></li>
                    <li><a href="/locations/europe/united-kingdom" className="hover:text-[#2f797c]">United Kingdom</a></li>
                    <li><a href="/locations/asia/japan" className="hover:text-[#2f797c]">Japan</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-[#232e4e]">Popular Cities</h4>
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
          </div>

          {/* Standard Links */}
          <a href="/blog" className="font-medium hover:opacity-75 transition" style={{ color: '#232e4e' }}>Blog</a>
          <a href="/about" className="font-medium hover:opacity-75 transition" style={{ color: '#232e4e' }}>About</a>
          <a href="/contact" className="font-medium hover:opacity-75 transition" style={{ color: '#232e4e' }}>Contact</a>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`block h-0.5 w-6 bg-[#232e4e] transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-[#232e4e] transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-[#232e4e] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 pb-4 border-t pt-4">
          <a href="/locations" className="font-medium hover:opacity-75 transition" style={{ color: '#232e4e' }}>Locations</a>
          <a href="/blog" className="font-medium hover:opacity-75 transition" style={{ color: '#232e4e' }}>Blog</a>
          <a href="/about" className="font-medium hover:opacity-75 transition" style={{ color: '#232e4e' }}>About</a>
          <a href="/contact" className="font-medium hover:opacity-75 transition" style={{ color: '#232e4e' }}>Contact</a>
        </div>
      )}
    </nav>
  )
}