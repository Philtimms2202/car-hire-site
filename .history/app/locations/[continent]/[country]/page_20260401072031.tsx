import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { client } from '../../../../sanity/lib/client'

export const revalidate = 60

async function getCities(continentSlug: string, countrySlug: string) {
  try {
    const cities = await client.fetch(
      `*[_type == "location" && continentSlug.current == $continentSlug && countrySlug.current == $countrySlug] 
        | order(city asc) {
          city,
          country,
          countryEmoji,
          continent,
          emoji,
          heroDescription,
          "citySlug": slug.current,
          "countrySlug": countrySlug.current,
          "continentSlug": continentSlug.current
        }`,
      { continentSlug, countrySlug }
    )
    return cities
  } catch (error) {
    return []
  }
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ continent: string; country: string }>
}) {
  const resolved = await params
  const continent = resolved?.continent
  const country = resolved?.country

  if (!continent || !country) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>Invalid Route</h1>
          <a href="/locations" style={{ color: '#2f797c' }} className="font-semibold hover:opacity-75 transition">Back to all continents</a>
        </div>
        <Footer />
      </main>
    )
  }

  const cities = await getCities(continent, country)
  const countryName = cities[0]?.country || country
  const countryEmoji = cities[0]?.countryEmoji || '🌍'
  const continentName = cities[0]?.continent || continent
  const basePath = '/locations/' + continent + '/' + country

  if (!cities || cities.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>No Cities Found</h1>
          <a href={'/locations/' + continent} style={{ color: '#2f797c' }} className="font-semibold hover:opacity-75 transition">Back to {continentName}</a>
        </div>
        <Footer />
      </main>
    )
  }

  const cityCards = cities.map((city: any) => {
    const href = basePath + '/' + city.citySlug
    return (
      <a key={city.citySlug} href={href} className="card hover:shadow-xl transition cursor-pointer">
        <div className="text-4xl mb-3">{city.emoji}</div>
        <h3 className="font-bold text-lg mb-2" style={{ color: '#232e4e' }}>{city.city}</h3>
        {city.heroDescription && (
          <p className="text-gray-500 text-sm leading-6 line-clamp-3">{city.heroDescription}</p>
        )}
        <p className="text-sm font-semibold mt-3" style={{ color: '#2f797c' }}>Explore {city.city} →</p>
      </a>
    )
  })

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-20 px-6 text-center">
        <div className="text-6xl mb-4">{countryEmoji}</div>
        <h1 className="text-5xl font-bold mb-4">Discover {countryName}</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          From world class cities to hidden gems, {countryName} is packed with extraordinary experiences. Explore our guide to find the best things to do, places to stay and how to get around.
        </p>
      </section>

      {/* Why Visit */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>Why Visit {countryName}?</h2>
          <p className="text-gray-500 mb-10">Everything you need to know before you go.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="text-4xl mb-3">🎭</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#232e4e' }}>Experiences</h3>
              <p className="text-gray-500 text-sm leading-7">{countryName} offers an incredible range of experiences for every type of traveller. From cultural landmarks and world class museums to outdoor adventures and local food scenes, there is always something extraordinary waiting to be discovered.</p>
            </div>
            <div className="card">
              <div className="text-4xl mb-3">🚗</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#232e4e' }}>Getting Around</h3>
              <p className="text-gray-500 text-sm leading-7">Hiring a car in {countryName} is one of the best ways to explore at your own pace. You can discover hidden corners that public transport simply cannot reach and make the most of your time without being tied to a timetable. Search for the best deals using our tool above.</p>
            </div>
            <div className="card">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#232e4e' }}>When to Go</h3>
              <p className="text-gray-500 text-sm leading-7">{countryName} has something to offer year round. The shoulder seasons often provide the best balance of good weather, manageable crowds and competitive prices on flights, accommodation and car hire. Plan ahead and book early for the best deals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>Explore Cities in {countryName}</h2>
          <p className="text-gray-500 mb-10">Select a city to discover experiences, tours, activities and car hire options.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cityCards}
          </div>
        </div>
      </section>

      {/* Experiences CTA */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>Things to Do in {countryName}</h2>
          <p className="text-gray-500 mb-8">Browse tours, activities and experiences across {countryName} and book directly with trusted local operators.</p>
          <div
            data-gyg-widget="auto"
            data-gyg-partner-id="P7B7GRH"
            data-gyg-cmp="Country Page Widget"
            data-gyg-q={countryName}
          />
        </div>
      </section>

      {/* Travel Tips */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>Travel Tips for {countryName}</h2>
          <p className="text-gray-500 mb-10">Practical advice to help you make the most of your trip.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="text-3xl mb-3">✈️</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#232e4e' }}>Getting There</h3>
              <p className="text-gray-500 text-sm leading-7">{countryName} is well served by international airlines with flights available from most major UK airports. Book in advance for the best fares and consider flying into smaller regional airports which can sometimes offer better value and less busy car hire desks.</p>
            </div>
            <div className="card">
              <div className="text-3xl mb-3">🏨</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#232e4e' }}>Where to Stay</h3>
              <p className="text-gray-500 text-sm leading-7">{countryName} has accommodation options to suit every budget and travel style. Hiring a car gives you the freedom to stay in smaller towns and villages away from the tourist centres, often at much better prices with a far more authentic experience of local life.</p>
            </div>
            <div className="card">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#232e4e' }}>Budgeting</h3>
              <p className="text-gray-500 text-sm leading-7">Costs in {countryName} vary significantly depending on where you go and how you travel. A hire car gives you the flexibility to seek out local restaurants and markets rather than being limited to tourist area prices. Compare car hire deals early for the best rates.</p>
            </div>
            <div className="card">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#232e4e' }}>Staying Connected</h3>
              <p className="text-gray-500 text-sm leading-7">Having a reliable data connection is essential when exploring {countryName} by car. Download offline maps before you set off and consider picking up a local SIM card or international data package to ensure you can navigate confidently wherever the road takes you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb and CTA */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-16 px-6 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Explore {countryName}?</h2>
        <p className="text-gray-300 mb-8">Search for car hire deals and book your next adventure today.</p>
        <a href="/" className="btn-primary inline-block">Search Cars</a>
        <div className="mt-8 flex justify-center gap-4 text-sm text-gray-400">
          <a href="/locations" className="hover:text-white transition">All Continents</a>
          <span>→</span>
          <a href={'/locations/' + continent} className="hover:text-white transition capitalize">{continentName}</a>
          <span>→</span>
          <span className="text-white">{countryName}</span>
        </div>
      </section>

      <Footer />
    </main>
  )
}