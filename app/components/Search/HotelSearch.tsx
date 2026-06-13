'use client'

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function HotelSearch() {
  const pathname = usePathname()

  // Extract city + country from URL
  const segments = pathname.split("/").filter(Boolean)
  const countrySlug = segments[2]
  const citySlug = segments[3]

  const toName = (slug?: string) =>
    slug
      ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : null

  const cityName = toName(citySlug)
  const countryName = toName(countrySlug)

  // Load Travelpayouts Booking.com widget
  useEffect(() => {
    const script = document.createElement("script")
    script.src =
      "https://tpemb.com/content?trs=513651&shmarker=714930&locale=en&sustainable=false&deals=false&border_radius=5&plain=false&powered_by=false&promo_id=2693&campaign_id=84"
    script.async = true
    script.charset = "utf-8"

    const container = document.getElementById("tp-hotels-widget")
    if (container) container.appendChild(script)

    return () => {
      if (container) container.innerHTML = ""
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-6">

      {/* Icon + heading */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-4xl">🏨</span>
        <h3 className="text-lg font-bold text-gray-800">
          Hotels in {cityName || "Your Destination"}
        </h3>
        <p className="text-sm text-gray-500 max-w-xs text-center">
          Powered by Booking.com via Travelpayouts
        </p>
      </div>

      {/* Widget container */}
      <div
        id="tp-hotels-widget"
        className="w-full max-w-xl"
      />

    </div>
  )
}
