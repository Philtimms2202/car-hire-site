'use client'

export default function HotelSearch() {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-4">
      <p className="text-gray-500 text-sm">
        Compare thousands of hotels worldwide
      </p>
      <a
        href="https://expedia.com/affiliate/KohMBZ5"
        target="_blank"
        rel="noopener noreferrer"
        className="px-10 py-4 rounded-xl text-white font-bold text-lg transition hover:opacity-90"
        style={{ backgroundColor: '#03989e' }}
      >
        View Hotels →
      </a>
      <p className="text-xs text-gray-400">
        Powered by Expedia · No hidden fees
      </p>
    </div>
  )
}