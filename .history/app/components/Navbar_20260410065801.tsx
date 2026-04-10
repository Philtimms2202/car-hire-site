'use client'

import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      style={{ backgroundColor: '#ffffff', borderBottom: '3px solid #2f797c' }}
      className="px-6 py-4"
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
          <div className="hidden md:flex gap-6">
          <a
            href="/locations/continents"
            style={{ color: '#232e4e' }}
            className="font-medium hover:opacity-75 transition"
          >
            Locations
          </a>
          <a
            href="/flights"
            style={{ color: '#232e4e' }}
            className="font-medium hover:opacity-75 transition"
          >
            Flights
          </a>
          <a
            href="/blog"
            style={{ color: '#232e4e' }}
            className="font-medium hover:opacity-75 transition"
          >
            Blog
          </a>
          <a
            href="/about"
            style={{ color: '#232e4e' }}
            className="font-medium hover:opacity-75 transition"
          >
            About
          </a>
          <a
            href="/contact"
            style={{ color: '#232e4e' }}
            className="font-medium hover:opacity-75 transition"
          >
            Contact Us
          </a>
        </div>

        {/* Hamburger Button */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            style={{ backgroundColor: '#232e4e' }}
            className={`block h-0.5 w-6 transition-all ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          ></span>
          <span
            style={{ backgroundColor: '#232e4e' }}
            className={`block h-0.5 w-6 transition-all ${
              menuOpen ? 'opacity-0' : ''
            }`}
          ></span>
          <span
            style={{ backgroundColor: '#232e4e' }}
            className={`block h-0.5 w-6 transition-all ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen ? (
        <div
          className="md:hidden mt-4 flex flex-col gap-4 pb-4 border-t pt-4"
          style={{ borderColor: '#e5e7eb' }}
        >
          <a
            href="/locations"
            style={{ color: '#232e4e' }}
            className="font-medium hover:opacity-75 transition"
          >
            Locations
          </a>
          <a
            href="/blog"
            style={{ color: '#232e4e' }}
            className="font-medium hover:opacity-75 transition"
          >
            Blog
          </a>
          <a
            href="/about"
            style={{ color: '#232e4e' }}
            className="font-medium hover:opacity-75 transition"
          >
            About
          </a>
          <a
            href="/contact"
            style={{ color: '#232e4e' }}
            className="font-medium hover:opacity-75 transition"
          >
            Contact Us
          </a>
        </div>
      ) : null}
    </nav>
  )
}