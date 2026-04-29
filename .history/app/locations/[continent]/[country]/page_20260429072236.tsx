import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { client } from '../../../../sanity/lib/client'

export const revalidate = 60

// -----------------------------
// Fetch country data
// -----------------------------
async function getCountryData(countrySlug: string) {
  return client.fetch(
    `*[_type == "country" && slug.current == $slug][0]{
      name,
      capital,
      population,
      languages,
      currency,
      flag,
      iso2,
      plugType,
      drivingSide,
      emergencyNumber,
      tippingCulture,
      visaInfo
    }`,
    { slug: countrySlug }
  )
}

// -----------------------------
// Fetch cities
// -----------------------------
async function getCities(continentSlug: string, countrySlug: string) {
  try {
    return await client.fetch(
      `*[_type == "location" && continentSlug.current == $continentSlug && countrySlug.current == $countrySlug] 
        | order(city asc) {
          city,
          country,
          countryEmoji,
          emoji,
          "citySlug": slug.current,
          "countrySlug": countrySlug.current,
          "continentSlug": continentSlug.current
        }`,
      { continentSlug, countrySlug }
    )
  } catch {
    return []
  }
}

// -----------------------------
// Metadata
// -----------------------------
export async function generateMetadata({ params }: any) {
  const resolved = await params
  const { continent, country } = resolved

  const countryData = await getCountryData(country)
  const countryName = countryData?.name || country

  return {
    title: `${countryName} Travel Guide | Cities, Tips & Essential Info `,
    description: `Discover the best experiences, attractions, and adventures across ${countryName}.`,
    alternates: {
      canonical: `https://timmstravel.com/locations/${continent}/${country}`,
    },
  }
}

// -----------------------------
// Tip Card Component
// -----------------------------
function TipCard({
  icon,
  title,
  children,
  wide = false,
}: {
  icon: string
  title: string
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <div
      className={`flex gap-4 p-5 rounded-xl border border-gray-100 bg-white transition hover:shadow-md${wide ? ' md:col-span-2' : ''}`}
    >
      <div
        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl"
        style={{ backgroundColor: '#eef6f6', color: '#2f797c' }}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wide mb-1" style={{ color: '#2f797c' }}>
          {title}
        </h3>
        <div className="text-gray-700 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

// -----------------------------
// FAQ Item Component
// -----------------------------
function FaqItem({ question, answer }: { question: string; answer: React.ReactNode }) {
  return (
    <details className="group border border-gray-100 rounded-xl bg-white overflow-hidden transition hover:shadow-sm">
      <summary className="flex justify-between items-center gap-4 px-5 py-4 cursor-pointer list-none select-none">
        <span className="font-medium text-sm sm:text-base" style={{ color: '#232e4e' }}>
          {question}
        </span>
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-transform group-open:rotate-45"
          style={{ backgroundColor: '#eef6f6', color: '#2f797c' }}
        >
          +
        </span>
      </summary>
      <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
        {answer}
      </div>
    </details>
  )
}

// -----------------------------
// PAGE
// -----------------------------
export default async function CountryPage({ params }: { params: Promise<{ continent: string; country: string }> }) {
  const resolved = await params
  const { continent, country } = resolved

  if (!continent || !country) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24 px-6">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>Invalid Route</h1>
          <a href="/locations" style={{ color: '#2f797c' }} className="font-semibold hover:opacity-75 transition">
            Back to all continents
          </a>
        </div>
        <Footer />
      </main>
    )
  }

  const cities = await getCities(continent, country)
  const countryData = await getCountryData(country)

  const countryName = countryData?.name || cities[0]?.country || country
  const countryEmoji = countryData?.flag || cities[0]?.countryEmoji || '🌍'

  const capital = countryData?.capital || 'Unknown'
  const population = countryData?.population ? Intl.NumberFormat().format(countryData.population) : 'Unknown'
  const languages = countryData?.languages?.join(', ') || 'Unknown'
  const currency = countryData?.currency || 'Unknown'

  const plugType = countryData?.plugType || 'Unknown'
  const drivingSide = countryData?.drivingSide || 'Unknown'
  const emergencyNumber = countryData?.emergencyNumber || 'Unknown'
  const tippingCulture = countryData?.tippingCulture || 'Information not available.'
  const visaInfo = countryData?.visaInfo || 'Visa requirements vary by nationality.'

  const basePath = `/locations/${continent}/${country}`

  if (!cities || cities.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24 px-6">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>No Cities Found</h1>
          <a
            href={`/locations/${continent}`}
            style={{ color: '#2f797c' }}
            className="font-semibold hover:opacity-75 transition capitalize"
          >
            Back to {continent}
          </a>
        </div>
        <Footer />
      </main>
    )
  }

  const cityCards = cities.map((city: any) => {
    const href = `${basePath}/${city.citySlug}`
    return (
      <a
        key={city.citySlug}
        href={href}
        className="group flex flex-col items-center text-center p-5 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition cursor-pointer"
      >
        <div className="text-4xl mb-3">{city.emoji}</div>
        <p className="font-semibold text-sm" style={{ color: '#232e4e' }}>{city.city}</p>
        <p className="text-xs mt-1 group-hover:opacity-80 transition" style={{ color: '#2f797c' }}>
          Get ready to explore →
        </p>
      </a>
    )
  })

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-20 px-6 text-center">
        <div className="text-6xl mb-4">{countryEmoji}</div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Explore {countryName}</h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
          Discover incredible experiences across {countryName}. Browse cities below to find tours, activities, and adventures.
        </p>
      </section>

      {/* Cities */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>
            Cities in {countryName}
          </h2>
          <p className="text-gray-500 mb-10 text-sm sm:text-base">Select a city to explore experiences and adventures.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {cityCards}
          </div>

          <div className="mt-8 flex flex-wrap gap-2 items-center text-sm">
            <a href="/locations/continents" style={{ color: '#2f797c' }} className="hover:opacity-75 transition">
              All Continents
            </a>
            <span className="text-gray-300">›</span>
            <a
              href={`/locations/${continent}`}
              style={{ color: '#2f797c' }}
              className="hover:opacity-75 transition capitalize"
            >
              {continent}
            </a>
          </div>
        </div>
      </section>

      {/* TRAVEL TIPS SECTION */}
      <section className="py-16 sm:py-20 px-6" style={{ backgroundColor: '#f8fafa' }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#2f797c' }}>
              Before you go
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#232e4e' }}>
              Travel tips for {countryName}
            </h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Useful things to know that apply across the whole country.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <TipCard icon="🔌" title="Power plugs">
              {countryName} uses <strong>{plugType}</strong> type plugs. Check your adapter before you travel.
            </TipCard>

            <TipCard icon="🚗" title="Driving side">
              Traffic drives on the <strong>{drivingSide}</strong> side of the road in {countryName}.
            </TipCard>

            <TipCard icon="🚨" title="Emergency number">
              The national emergency number is <strong>{emergencyNumber}</strong>. Save it before you arrive.
            </TipCard>

            <TipCard icon="💳" title="Tipping culture">
              {tippingCulture}
            </TipCard>

            <TipCard icon="🛂" title="Visa information" wide>
              {visaInfo}
            </TipCard>
          </div>
        </div>
      </section>

    {/* -----------------------------------------------------------------------
    ADD THESE COMPONENTS near your TipCard / FaqItem components
------------------------------------------------------------------------ */}


// Renders the structured AI text: opening line, bullets, closing line
function StructuredText({ text }: { text: string }) {
  if (!text) return null

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  return (
    <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('•')) {
          return (
            <div key={i} className="flex gap-2">
              <span style={{ color: '#2f797c' }} className="mt-0.5 flex-shrink-0">•</span>
              <span>{line.replace(/^•\s*/, '')}</span>
            </div>
          )
        }
        return <p key={i}>{line}</p>
      })}
    </div>
  )
}

// Full-width content card used in the extended sections
function ContentCard({
  icon,
  title,
  children,
}: {
  icon: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="p-6 rounded-xl border border-gray-100 bg-white hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: '#eef6f6', color: '#2f797c' }}
        >
          {icon}
        </div>
        <h3 className="font-bold text-base" style={{ color: '#232e4e' }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  )
}

// -----------------------------------------------------------------------
// FETCH EXTENDED FIELDS — add these to your existing getCountryData query
// -----------------------------------------------------------------------

// In getCountryData(), add these fields to the GROQ projection:
//   bestTimeToVisit,
//   safetyOverview,
//   localLaws,
//   costOfTravel,
//   transportBasics,
//   vaccinations,
//   internetConnectivity,
//   timeZone,
//   mainAirports,
//   neighbouringCountries


// -----------------------------------------------------------------------
// DESTRUCTURE — add inside CountryPage after existing destructuring
// -----------------------------------------------------------------------

// const bestTimeToVisit     = countryData?.bestTimeToVisit     || null
// const safetyOverview      = countryData?.safetyOverview      || null
// const localLaws           = countryData?.localLaws           || null
// const costOfTravel        = countryData?.costOfTravel        || null
// const transportBasics     = countryData?.transportBasics     || null
// const vaccinations        = countryData?.vaccinations        || null
// const internetConnectivity = countryData?.internetConnectivity || null
// const timeZone            = countryData?.timeZone            || null
// const mainAirports        = countryData?.mainAirports        || []
// const neighbouringCountries = countryData?.neighbouringCountries || []

// -----------------------------------------------------------------------
// SECTIONS — paste these between your TRAVEL TIPS section and FAQ section
// -----------------------------------------------------------------------

{/* EXTENDED GUIDE SECTION */}
{(bestTimeToVisit || safetyOverview || localLaws || costOfTravel ||
  transportBasics || vaccinations || internetConnectivity) && (
  <section className="py-16 sm:py-20 px-6 bg-white">
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#2f797c' }}>
          Your complete guide
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#232e4e' }}>
          Everything you need to know about {countryName}
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Practical information to help you plan, prepare, and travel with confidence.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">

        {bestTimeToVisit && (
          <ContentCard icon="🌤️" title="Best time to visit">
            <StructuredText text={bestTimeToVisit} />
          </ContentCard>
        )}

        {safetyOverview && (
          <ContentCard icon="🛡️" title="Safety overview">
            <StructuredText text={safetyOverview} />
          </ContentCard>
        )}

        {costOfTravel && (
          <ContentCard icon="💷" title="Cost of travel">
            <StructuredText text={costOfTravel} />
          </ContentCard>
        )}

        {transportBasics && (
          <ContentCard icon="🚌" title="Getting around">
            <StructuredText text={transportBasics} />
          </ContentCard>
        )}

        {localLaws && (
          <ContentCard icon="⚖️" title="Local laws & customs">
            <StructuredText text={localLaws} />
          </ContentCard>
        )}

        {vaccinations && (
          <ContentCard icon="💉" title="Health & vaccinations">
            <StructuredText text={vaccinations} />
          </ContentCard>
        )}

        {internetConnectivity && (
          <ContentCard icon="📶" title="Internet & connectivity">
            <StructuredText text={internetConnectivity} />
          </ContentCard>
        )}

        {timeZone && (
          <ContentCard icon="🕐" title="Time zone">
            <StructuredText text={timeZone} />
          </ContentCard>
        )}

      </div>
    </div>
  </section>
)}

{/* AIRPORTS & NEIGHBOURS SECTION */}
{(mainAirports.length > 0 || neighbouringCountries.length > 0) && (
  <section className="py-16 sm:py-20 px-6" style={{ backgroundColor: '#f8fafa' }}>
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#2f797c' }}>
          Getting there & beyond
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#232e4e' }}>
          Airports & nearby countries
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Key entry points and suggested onward destinations from {countryName}.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">

        {mainAirports.length > 0 && (
          <div className="p-6 rounded-xl border border-gray-100 bg-white">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: '#eef6f6' }}
              >
                ✈️
              </div>
              <h3 className="font-bold text-base" style={{ color: '#232e4e' }}>
                Main airports
              </h3>
            </div>
            <ul className="space-y-2">
              {mainAirports.map((airport: string, i: number) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-gray-700 py-2 border-b border-gray-50 last:border-0"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: '#2f797c' }}
                  />
                  {airport}
                </li>
              ))}
            </ul>
          </div>
        )}

        {neighbouringCountries.length > 0 && (
          <div className="p-6 rounded-xl border border-gray-100 bg-white">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: '#eef6f6' }}
              >
                🗺️
              </div>
              <h3 className="font-bold text-base" style={{ color: '#232e4e' }}>
                Neighbouring countries
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {neighbouringCountries.map((c: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{ backgroundColor: '#eef6f6', color: '#2f797c' }}
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Consider extending your trip with a visit to a neighbouring country.
            </p>
          </div>
        )}

      </div>
    </div>
  </section>
)}

      {/* FAQ SECTION */}
      <section className="py-16 sm:py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#2f797c' }}>
              Common questions
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#232e4e' }}>
              About {countryName}
            </h2>
          </div>

          <div className="space-y-2">
            <FaqItem
              question={`What is the capital of ${countryName}?`}
              answer={<>The capital city of {countryName} is <strong>{capital}</strong>.</>}
            />
            <FaqItem
              question={`What language is spoken in ${countryName}?`}
              answer={<>The main languages spoken are <strong>{languages}</strong>.</>}
            />
            <FaqItem
              question={`What currency is used in ${countryName}?`}
              answer={<>{countryName} uses the <strong>{currency}</strong>.</>}
            />
            <FaqItem
              question={`How many people live in ${countryName}?`}
              answer={<>The population is approximately <strong>{population}</strong>.</>}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-16 px-6 text-center text-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to explore {countryName}?</h2>
        <p className="text-gray-300 mb-8 text-sm sm:text-base">Find amazing experiences and get there your way.</p>
        <a href="/" className="btn-primary inline-block">Get started</a>
      </section>

      <Footer />
    </main>
  )
}