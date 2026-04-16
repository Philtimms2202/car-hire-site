'use client'

import { useEffect, useRef } from 'react'

export default function HotelSearch() {
  const widgetRef = useRef(null)

  useEffect(() => {
    // If script already exists, re-run widget init
    const existing = document.querySelector('.eg-widgets-script')

    if (!existing) {
      const script = document.createElement('script')
      script.src = 'https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js'
      script.async = true
      script.className = 'eg-widgets-script'
      script.onload = () => {
        // Force widget re-init
        if (window.eg && window.eg.widgets) {
          window.eg.widgets.init()
        }
      }
      document.body.appendChild(script)
    } else {
      // Script exists → re-init widgets
      if (window.eg && window.eg.widgets) {
        window.eg.widgets.init()
      }
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
        ref={widgetRef}
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
