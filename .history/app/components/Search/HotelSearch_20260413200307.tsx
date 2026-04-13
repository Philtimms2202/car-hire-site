'use client'

import Script from 'next/script'

export default function HotelSearch() {
  return (
    <>
      <div
        className="eg-widget"
        data-widget="search"
        data-program="uk-expedia"
        data-lobs="stays"
        data-network="pz"
        data-camref="1110lCmpb"
        data-pubref=""
      />

      <Script
        src="https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js"
        strategy="afterInteractive"
      />
    </>
  )
}