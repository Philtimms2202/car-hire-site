// ============================================
// FOOTER COMPONENT - app/components/Footer.tsx
// ============================================

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#EBF5EE' }} className="py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-gray-700">

          {/* Logo + Tagline */}
          <div>
            <a href="/">
              <img
                src="/timms-travel-logo.png"
                alt="Timms Travel Logo"
                className="h-12 w-auto mb-4"
              />
            </a>
            <p className="text-black-400 text-sm leading-7">
              Discover thousands of experiences globally.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-dark font-semibold mb-4">Quick Links</h3>

            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <a href="/" className="hover:text-dark transition">Home</a>
              <a href="/locations" className="hover:text-dark transition">Locations</a>

              <a href="/locations/continents" className="hover:text-dark transition">Continents</a>
              <a href="/flights" className="hover:text-dark transition">Flights</a>

              <a href="/hotels" className="hover:text-dark transition">Hotels</a>
              <a href="/experiences" className="hover:text-dark transition">Experiences</a>

              <a href="/blog" className="hover:text-dark transition">Blog</a>
              <a href="/about" className="hover:text-dark transition">About Us</a>
              <a href="/guides" className="hover:text-dark transition">Free Travel Guides</a>

              <a href="/contact" className="hover:text-dark transition">Contact Us</a>
            </div>
          </div>

          {/* Travel Tools (NEW COLUMN) */}
          <div>
            <h3 className="text-dark font-semibold mb-4">Travel Tools</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a href="/tools" className="hover:text-dark transition">
                  All Tools
                </a>
              </li>
              <li>
                <a href="/tools/flight-time-calculator" className="hover:text-dark transition">
                  Flight Time Calculator
                </a>
              </li>
              <li>
                <a href="/tools/packing-checklist" className="hover:text-dark transition">
                  Packing Checklist
                </a>
              </li>
              <li>
                <a href="/tools/budget-planner" className="hover:text-dark transition">
                  Budget Planner
                </a>
              </li>
              <li>
                <a href="/tools/time-zone-converter" className="hover:text-dark transition">
                  Time Zone Converter
                </a>
              </li>
            </ul>
          </div>
          

          {/* Other Services */}
          <div>
            <h3 className="text-dark font-semibold mb-4">Other Services</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a href="/other-services/esims" className="hover:text-dark transition">
                  eSIMs
                </a>
              </li>
              <li>
                <a href="/other-services/travel-insurance" className="hover:text-dark transition">
                  Travel Insurance
                </a>
              </li>
              <li>
                <a href="/other-services/airport-transfers" className="hover:text-dark transition">
                  Airport Transfers
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© 2026 Timms Travel. All rights reserved.</p>
          <p className="text-gray-500 text-xs text-center">
            Timms Travel is an affiliate travel website. All bookings are made directly with our trusted suppliers.
          </p>
        </div>

      </div>
    </footer>
  )
}