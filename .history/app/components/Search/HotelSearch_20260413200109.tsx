'use client'

import { useEffect } from 'react'

export default function HotelSearch() {
  useEffect(() => {
    // Remove any existing widget script to avoid duplicates on re-mount
    const existing = document.querySelector('.eg-widgets-script')
    if (existing) existing.remove()

    const script = document.createElement('script')
    script.src = 'https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js'
    script.className = 'eg-widgets-script'
    script.async = true
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return (
    <div
      className="eg-widget"
      data-widget="search"
      data-program="uk-expedia"
      data-lobs="stays"
      data-network="pz"
      data-camref="1110lCmpb"
      data-pubref=""
    />
  )
}