// ============================================
// FOOTER COMPONENT - app/components/Footer.tsx
// ============================================

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#232e4e"
    className="w-5 h-5"
  >
    <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
  </svg>
)

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#232e4e"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#232e4e"
    className="w-5 h-5"
  >
    <path d="M16.5 2h-3.2v13.3a2.9 2.9 0 1 1-2.06-2.78V9.3a6.1 6.1 0 1 0 5.26 6.05V8.44a7.6 7.6 0 0 0 4.4 1.4V6.6a4.3 4.3 0 0 1-4.4-4.3V2z" />
  </svg>
)

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61573241227532', Icon: FacebookIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/timms_travel', Icon: InstagramIcon },
  { label: 'TikTok', href: 'https://www.tiktok.com/@timms.travel', Icon: TikTokIcon },
]

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

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-4">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 bg-white rounded-lg hover:opacity-75 transition shadow-sm"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-dark font-semibold mb-4">Quick Links</h3>

            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <a href="/" className="hover:text-dark transition">Home</a>
              <a href="/locations" className="hover:text-dark transition">Locations</a>

              <a href="/flights" className="hover:text-dark transition">Flights</a>
              <a href="/deals" className="hover:text-dark transition">Special Offers</a>

              <a href="/hotels" className="hover:text-dark transition">Hotels</a>
              <a href="/experiences" className="hover:text-dark transition">Experiences</a>

              <a href="/blog" className="hover:text-dark transition">Blog</a>
              <a href="/about" className="hover:text-dark transition">About Us</a>
              <a href="/guides" className="hover:text-dark transition">Free Travel Guides</a>

              <a href="/contact" className="hover:text-dark transition">Contact Us</a>
            </div>
          </div>

          {/* Travel Tools */}
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
               <li>
                <a href="/tools/currency-converter" className="hover:text-dark transition">
                  Currency Converter
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