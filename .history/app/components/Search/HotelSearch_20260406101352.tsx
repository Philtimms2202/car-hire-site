'use client'
import { useState } from 'react'

export default function HotelSearch() {
  const [location, setLocation] = useState('')
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')

  const handleSearch = () => {
    if (!location || !checkin || !checkout) {
      alert("Please enter location, check-in, and check-out dates.")
      return
    }

    // Base Klook hotel searchresult URL (matches your working example)
    const klookUrl = `https://www.klook.com/en-US/hotels/searchresult/?check_in=${checkin}&check_out=${checkout}&room_num=1&adult_num=2&child_num=0&age=&stype=city&override=${encodeURIComponent(
      location
    )}&title=${encodeURIComponent(location)}`

    // Encode for Travelpayouts redirect
    const encoded = encodeURIComponent(klookUrl)

    // Your Travelpayouts Klook affiliate wrapper
    const finalUrl = `https://klook.tpm.li/ZPsg32NT?u=${encoded}`

    window.open(finalUrl, '_blank')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        className="input-field"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="date"
        className="input-field"
        value={checkin}
        onChange={(e) => setCheckin(e.target.value)}
      />

      <input
        type="date"
        className="input-field"
        value={checkout}
        onChange={(e) => setCheckout(e.target.value)}
      />

      <button onClick={handleSearch} className="btn-primary mt-5 w-full">
        Search Hotels
      </button>
    </div>
  )
}