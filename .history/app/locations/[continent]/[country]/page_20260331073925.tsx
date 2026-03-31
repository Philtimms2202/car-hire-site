import { client } from "@/sanity/lib/client";

export default async function CountryPage({ params }: any) {
  const { continent, country } = params;

  // Fetch all cities in this country
  const cities = await client.fetch(
    `*[_type == "location" && countrySlug.current == $country]{
      _id,
      city,
      citySlug,
      cityEmoji
    }`,
    { country }
  );

  return (
    <main className="px-6 py-16">

      <h1 className="text-3xl font-bold mb-6" style={{ color: "#232e4e" }}>
        Cities in {country}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cities.map((city: any) => (
          <a
            key={city.citySlug?.current}
            href={`/locations/${continent}/${country}/${city.citySlug?.current}`}
            className="card text-center hover:shadow-xl transition cursor-pointer"
          >
            <div className="text-4xl mb-2">{city.cityEmoji}</div>

            <p className="font-semibold text-sm" style={{ color: "#232e4e" }}>
              {city.city}
            </p>

            <p className="text-xs mt-1" style={{ color: "#2f797c" }}>
              View car hire
            </p>
          </a>
        ))}
      </div>

    </main>
  );
}