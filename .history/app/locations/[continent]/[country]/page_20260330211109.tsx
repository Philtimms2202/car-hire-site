<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {countries.map((country: any) => (
    <a
      key={country.countrySlug}
      href={`/locations/${continent}/${country.countrySlug}`}
      className="card text-center hover:shadow-xl transition cursor-pointer"
    >
      <div className="text-4xl mb-2">{country.countryEmoji}</div>
      <p className="font-semibold text-sm" style={{ color: '#232e4e' }}>
        {country.country}
      </p>
      <p className="text-xs mt-1" style={{ color: '#2f797c' }}>
        View cities
      </p>
    </a>
  ))}
</div>