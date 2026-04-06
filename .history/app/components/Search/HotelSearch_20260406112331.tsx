'use client'

export default function HotelSearch() {
  return (
    <div className="w-full flex justify-center px-4 py-6">

      {/* Desktop widget */}
      <div className="hidden md:block w-full max-w-[900px] rounded-xl overflow-hidden shadow-md bg-white">
        <iframe
          id="S15169730-desktop"
          src="https://www.trip.com/partners/ad/S15169730?Allianceid=8052073&SID=304662590&trip_sub1="
          style={{
            width: '100%',
            height: '400px',
            border: 'none',
          }}
          scrolling="no"
        />
      </div>

      {/* Mobile widget */}
      <div className="block md:hidden w-full max-w-[480px] mx-auto rounded-xl overflow-hidden shadow-md bg-white">
        <iframe
          id="S15169730-mobile"
          src="https://www.trip.com/partners/ad/S15169730?Allianceid=8052073&SID=304662590&trip_sub1="
          style={{
            width: '100%',
            height: '350px',
            border: 'none',
          }}
          scrolling="no"
        />
      </div>

    </div>
  )
}