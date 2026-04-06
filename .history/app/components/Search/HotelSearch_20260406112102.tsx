'use client'

export default function HotelSearch() {
  return (
    <div className="w-full flex justify-center px-4 py-4">
      <div className="w-full max-w-[900px] rounded-xl overflow-hidden shadow-md bg-white">
        <div className="w-full overflow-hidden">
          <iframe
            id="S15169730"
            src="https://www.trip.com/partners/ad/S15169730?Allianceid=8052073&SID=304662590&trip_sub1="
            style={{
              width: '100%',
              height: '260px',        // Taller for mobile comfort
              border: 'none',
            }}
            scrolling="no"
          />
        </div>
      </div>
    </div>
  )
}