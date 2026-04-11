'use client'

import { useState } from 'react'
import { useLocale } from '@/context/localeContext'
import { format } from 'date-fns'

export default function HotelSearch() {
  const { language, currency } = useLocale()

  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(2)

  const PID = 'UK.DIRECT.PHG.1011l428377'

  const handleSearch = () => {
    if (!destination) return

    const params = new URLSearchParams({
      destination,
      affcid: PID,
      lang: language,
      currency,
    })

    if (checkIn) params.append('checkIn', checkIn)
    if (checkOut) params.append('checkOut', checkOut)
    if (adults) params.append('adults', adults.toString())

    const url = `https://www.expedia.co.uk/Hotel-Search?${params.toString()}`
    window.open(url, '_blank')
  }

  return (
    <div className="w-full flex justify-center px-4 py-6">

      {/* Desktop container */}
      <div className="hidden md:block w-full max-w-[900px] rounded-xl overflow-hidden shadow-md bg-white p-6">
        <div className="grid grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Where are you going?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />

          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />

          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />

          <select
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 w-full"
          >
            {[1,2,3,4,5,6].map(n => (
              <option key={n} value={n}>{n} adult{n > 1 ? 's' : ''}</option>
            ))}
          </select>

        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search Hotels
          </button>
        </div>
      </div>

      {/* Mobile container */}
      <div className="block md:hidden w-full max-w-[480px] mx-auto rounded-xl overflow-hidden shadow-md bg-white p-4">
        <div className="flex flex-col gap-3">

          <input
            type="text"
            placeholder="Where are you going?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />

          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />

          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />

          <select
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 w-full"
          >
            {[1,2,3,4,5,6].map(n => (
              <option key={n} value={n}>{n} adult{n > 1 ? 's' : ''}</option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full"
          >
            Search Hotels
          </button>

        </div>
      </div>

    </div>
  )
}
