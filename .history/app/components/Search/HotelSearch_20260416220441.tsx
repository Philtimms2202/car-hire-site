'use client'

import { useEffect } from 'react'

export default function HotelSearch() {
  useEffect(() => {
    // Prevent duplicate script injection
    if (!document.querySelector('.eg-widgets-script')) {
      const script = document.createElement('script')
      script.src = 'https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js'
      script.async = true
      script.className = 'eg-widgets-script'
      document.body.appendChild(script)
    }
  }, [])

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

      {/* Expedia Widget */}
      <div
        className="w-full max-w-xl"
        dangerouslySetInnerHTML={{
          __html: `
            <div 
              class="eg-widget"
              data-widget="search"
              data-program="uk-expedia"
              data-lobs="stays"
              data-network="pz"
              data-camref="1110lCmpb"
              data-pubref=""
            ></div>
          `,
        }}
      />

      {/* Trust line */}
      <p className="text-xs text-gray-400 flex items-center gap-1.5">
        <span>✓</span>
        <span>Powered by Expedia Group · No hidden fees · Free cancellation on most rooms</span>
      </p>

    </div>
  )
}
