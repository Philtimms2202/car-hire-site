'use client'

import { useEffect, useState } from 'react'

export default function AdBanner() {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [])

  if (dismissed) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
      role="complementary"
      aria-label="Advertisement"
    >
      <div className="relative max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-center">

        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition text-lg leading-none"
          aria-label="Close advertisement"
        >
          ✕
        </button>

        {/* Ad label */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 uppercase tracking-wider select-none">
          Ad
        </span>

        {/* AdSense unit - leaderboard / banner format */}
        <ins
  className="adsbygoogle"
  style={{ display: 'inline-block', width: '728px', height: '90px' }}
  data-ad-client="ca-pub-6886846670145470"
  data-ad-slot="1506572254"
/>
      </div>
    </div>
  )
}