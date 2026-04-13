'use client'

const EXPEDIA_AFFILIATE_URL = 'https://expedia.com/affiliate/KohMBZ5'

export default function HotelSearch() {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-5">

      {/* Icon + heading */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-4xl">🏨</span>
        <h3 className="text-lg font-bold text-gray-800">
          Search Hotels Worldwide
        </h3>
        <p className="text-sm text-gray-500 max-w-xs text-center">
          Compare thousands of hotels — from budget stays to five‑star luxury.
        </p>
      </div>

      {/* CTA button */}
      <a
        href={EXPEDIA_AFFILIATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="
          inline-flex items-center gap-2
          px-8 py-3.5
          rounded-xl
          text-white font-semibold text-base
          transition-all duration-200
          hover:opacity-90 hover:scale-[1.02]
          active:scale-[0.98]
          shadow-md hover:shadow-lg
        "
        style={{ backgroundColor: '#03989e' }}
      >
        <span>View Hotels</span>
        <span className="text-lg">→</span>
      </a>

      {/* Trust line */}
      <p className="text-xs text-gray-400 flex items-center gap-1.5">
        <span>✓</span>
        <span>Powered by Expedia · No hidden fees · Free cancellation on most rooms</span>
      </p>

    </div>
  )
}