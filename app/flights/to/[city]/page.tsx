import { getCityHubs, getCityHubBySlug } from '@/lib/airports';
import { getDistanceKm, estimateFlightDurationLabel } from '@/lib/geo';
import { getFlightHubAiContent } from '@/lib/getFlightHubAiContent';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import CityFlightSearchTo from './CityFlightSearchTo';
import CityFlightsInteractiveTo from './CityFlightsInteractiveTo';
import FlightHubAiContent from '@/app/components/flights/FlightHubAiContent';

export async function generateStaticParams() {
  const hubs = getCityHubs();
  return hubs.slice(0, 500).map((hub) => ({ city: hub.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const hub = getCityHubBySlug(city);

  if (!hub) {
    return {};
  }

  const airportNames = hub.airports.map((a) => a.iata_code).join(', ');

  return {
    title: `Find Cheap Flights to ${hub.city} | Timms Travel`,
    description: `Compare cheap flights to ${hub.city} (${airportNames}) from destinations worldwide. Find the best deals with Timms Travel.`,
    alternates: {
      canonical: `https://timmstravel.com/flights/to/${hub.slug}`,
    },
  };
}

const TRAVEL_TIPS = [
  {
    icon: '📅',
    title: 'Book early for the best prices',
    body: 'Flights typically get cheaper 6–8 weeks before departure. For peak summer routes, book 3–4 months ahead.',
  },
  {
    icon: '🧳',
    title: 'Check baggage allowances',
    body: "Budget airlines often charge extra for hold luggage. Always check what's included before you book.",
  },
  {
    icon: '🔔',
    title: 'Search regularly for price drops',
    body: 'Prices fluctuate daily. Checking back every few days can help you catch a fare drop.',
  },
  {
    icon: '🛂',
    title: 'Check visa requirements',
    body: "Entry rules vary by nationality. Always verify requirements with your destination country's embassy.",
  },
];

export default async function FlightsToCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const hub = getCityHubBySlug(city);

  if (!hub) {
    notFound();
  }

  const allHubs = getCityHubs();
  const origins = allHubs
    .filter((h) => h.slug !== hub.slug)
    .slice(0, 60);

  const searchOrigins = origins
    .slice(0, 150)
    .map((h) => ({ city: h.city, iata: h.primaryIata }));

  const airportNames = hub.airports
    .map((a) => `${a.name} (${a.iata_code})`)
    .join(', ');

  const topDestinations = origins.slice(0, 5).map((o) => {
    const distanceKm = getDistanceKm(hub.latitude, hub.longitude, o.latitude, o.longitude);
    return {
      city: o.city,
      distanceKm,
      durationLabel: estimateFlightDurationLabel(distanceKm),
    };
  });

  const cachedAiContent = await getFlightHubAiContent(hub.slug, 'to');

  const faqs = [
    {
      q: `What airports serve ${hub.city}?`,
      a: `${hub.city} is served by ${hub.airports.length > 1 ? `${hub.airports.length} airports` : 'one main airport'}: ${airportNames}.`,
    },
    {
      q: `What is the cheapest time to book flights to ${hub.city}?`,
      a: `Prices generally drop 6–8 weeks before departure. For popular routes during summer or school holidays, booking 3–4 months in advance tends to secure the best fares.`,
    },
    {
      q: `Can I search one-way and return flights to ${hub.city}?`,
      a: `Yes. Use the search box above to compare one-way, return, and flexible date options arriving into ${hub.city}.`,
    },
    {
      q: `Does Timms Travel charge booking fees?`,
      a: `No. You will never pay extra to search or compare on Timms Travel — the price you see when you click through to book is the price set by our travel partner.`,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── BREADCRUMB ── */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-100 px-6 py-2">
        <ol
          className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-500"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/" className="hover:text-blue-600 transition-colors" itemProp="item">
              <span itemProp="name">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li aria-hidden="true" className="text-gray-300">/</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/flights" className="hover:text-blue-600 transition-colors" itemProp="item">
              <span itemProp="name">Flights</span>
            </Link>
            <meta itemProp="position" content="2" />
          </li>
          <li aria-hidden="true" className="text-gray-300">/</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span className="text-gray-800 font-medium" itemProp="name">
              Flights to {hub.city}
            </span>
            <meta itemProp="position" content="3" />
          </li>
        </ol>
      </nav>

      {/* ── HERO + AIRPORT PICKER (interactive) ── */}
      <CityFlightsInteractiveTo
        city={hub.city}
        airports={hub.airports.map((a) => ({ name: a.name, iata_code: a.iata_code }))}
        origins={searchOrigins}
      />

      {/* ── AI-GENERATED SEO CONTENT (unique per city, cached in Sanity) ── */}
      <FlightHubAiContent
        citySlug={hub.slug}
        cityName={hub.city}
        countryName={hub.country}
        direction="to"
        airportNames={hub.airports.map((a) => a.name)}
        topDestinations={topDestinations}
        cachedIntroText={cachedAiContent?.introText}
        cachedGoodToKnow={cachedAiContent?.goodToKnow}
        cachedTravelerTip={cachedAiContent?.travelerTip}
      />

      {/* ── TRAVEL TIPS ── */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Travel tips for flying to {hub.city}
          </h2>
          <p className="text-center text-gray-500 mb-10">
            A few things worth knowing before you book.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TRAVEL_TIPS.map((tip) => (
              <div
                key={tip.title}
                className="flex gap-4 bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <span className="text-3xl shrink-0">{tip.icon}</span>
                <div>
                  <p className="font-bold text-gray-800 mb-1">{tip.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: '#232e4e' }}>
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <details
                key={q}
                className="group border border-gray-100 rounded-2xl bg-white px-5 py-4 cursor-pointer"
              >
                <summary className="font-semibold text-sm list-none flex items-center justify-between gap-4" style={{ color: '#232e4e' }}>
                  {q}
                  <span className="shrink-0 text-gray-400 group-open:rotate-45 transition-transform duration-200 text-lg leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR ORIGINS ── */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">
              Flying in
            </p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
              Popular routes to {hub.city}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Browse popular routes below to find your next trip.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {origins.map((origin, i) => {
              const url =
                `/flights/${origin.primaryIata}/${hub.primaryIata}/` +
                `${origin.slug}-to-${hub.slug}`;

              return (
                <Link
                  key={origin.slug}
                  href={url}
                  className="group flex items-center gap-4 px-5 py-4 rounded-2xl border border-gray-100 bg-white hover:border-teal-200 hover:shadow-sm transition-all duration-200"
                >
                  <span
                    className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: '#232e4e10', color: '#232e4e' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate" style={{ color: '#232e4e' }}>
                      Flights from {origin.city}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">View route</p>
                  </div>
                  <span
                    className="shrink-0 text-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                    style={{ color: '#03989e' }}
                  >
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-16 px-6 text-center text-white">
        <p className="text-sm uppercase tracking-widest mb-3 font-semibold" style={{ color: '#03989e' }}>
          Ready to fly?
        </p>
        <h2 className="text-3xl font-bold mb-4">
          Find the best price to {hub.city} today
        </h2>
        <p className="text-gray-300 mb-8 max-w-lg mx-auto">
          Hundreds of airlines compared instantly. No mark-ups, no hidden fees.
        </p>
        {searchOrigins.length > 0 && (
          <CityFlightSearchTo
            destinationIATA={hub.primaryIata}
            destinationCity={hub.city}
            origins={searchOrigins}
          />
        )}
      </section>

      <Footer />
    </main>
  );
}