{/* LOCATIONS MEGA MENU */}
<div className="relative group">

  {/* Trigger */}
  <div
    className="font-medium flex items-center gap-1 cursor-pointer hover:opacity-75 transition"
    style={{ color: '#232e4e' }}
  >
    Locations
    <span className="text-xs">▼</span>
  </div>

  {/* Dropdown */}
  <div
    className="
      absolute left-0 top-full w-[600px]
      bg-white shadow-xl rounded-xl p-6
      grid grid-cols-3 gap-6 border border-gray-200

      opacity-0 invisible translate-y-2
      group-hover:opacity-100 group-hover:visible group-hover:translate-y-0

      transition-all duration-200 ease-out
      z-50
    "
  >
    <div>
      <h4 className="font-semibold mb-3 text-[#232e4e]">Continents</h4>
      <ul className="space-y-2 text-sm">
        <li><a href="/locations/europe" className="hover:text-[#2f797c]">Europe</a></li>
        <li><a href="/locations/asia" className="hover:text-[#2f797c]">Asia</a></li>
        <li><a href="/locations/north-america" className="hover:text-[#2f797c]">North America</a></li>
        <li><a href="/locations/south-america" className="hover:text-[#2f797c]">South America</a></li>
        <li><a href="/locations/africa" className="hover:text-[#2f797c]">Africa</a></li>
        <li><a href="/locations/oceania" className="hover:text-[#2f797c]">Oceania</a></li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold mb-3 text-[#232e4e]">Popular Countries</h4>
      <ul className="space-y-2 text-sm">
        <li><a href="/locations/europe/france" className="hover:text-[#2f797c]">France</a></li>
        <li><a href="/locations/europe/spain" className="hover:text-[#2f797c]">Spain</a></li>
        <li><a href="/locations/europe/italy" className="hover:text-[#2f797c]">Italy</a></li>
        <li><a href="/locations/europe/united-kingdom" className="hover:text-[#2f797c]">United Kingdom</a></li>
        <li><a href="/locations/asia/japan" className="hover:text-[#2f797c]">Japan</a></li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold mb-3 text-[#232e4e]">Popular Cities</h4>
      <ul className="space-y-2 text-sm">
        <li><a href="/locations/europe/france/paris" className="hover:text-[#2f797c]">Paris</a></li>
        <li><a href="/locations/europe/italy/rome" className="hover:text-[#2f797c]">Rome</a></li>
        <li><a href="/locations/europe/spain/barcelona" className="hover:text-[#2f797c]">Barcelona</a></li>
        <li><a href="/locations/europe/united-kingdom/london" className="hover:text-[#2f797c]">London</a></li>
        <li><a href="/locations/europe/ireland/dublin" className="hover:text-[#2f797c]">Dublin</a></li>
      </ul>
    </div>
  </div>
</div>