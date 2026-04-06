'use client'

export default function CarSearch() {
  const carUrl =
    "https://www.trip.com/carhire/?Allianceid=8052073&SID=304662590&trip_sub1=&trip_sub3=D15170094"

  return (
    <div className="w-full flex justify-center px-4 py-6">

      {/* Desktop version */}
      <div className="hidden md:block w-full max-w-[900px] rounded-xl overflow-hidden shadow-md bg-white p-6 text-center">
        <h3 className="text-xl font-semibold mb-4">Find Car Rentals</h3>
        <p className="text-gray-600 mb-4">
          Compare prices from top providers worldwide
        </p>
        <a
          href={carUrl}
          target="_blank"
          className="btn-primary inline-block px-6 py-3 text-lg"
        >
          Search Car Hire
        </a>
      </div>

      {/* Mobile version */}
      <div className="block md:hidden w-full max-w-[480px] mx-auto rounded-xl overflow-hidden shadow-md bg-white p-4 text-center">
        <h3 className="text-lg font-semibold mb-3">Find Car Rentals</h3>
        <p className="text-gray-600 mb-3 text-sm">
          Compare global car hire deals instantly
        </p>
        <a
          href={carUrl}
          target="_blank"
          className="btn-primary inline-block w-full py-3 text-base"
        >
          Search Car Hire
        </a>
      </div>

    </div>
  )
}