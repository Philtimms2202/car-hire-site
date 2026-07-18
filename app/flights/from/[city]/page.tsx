import { getCityHubs, getCityHubBySlug } from '@/lib/airports';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import CityFlightSearch from './CityFlightSearch';
import CityFlightsInteractive from './CityFlightsInteractive';

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
    title: `Find Flights from ${hub.city} | Timms Travel`,
    description: `Compare cheap flights from ${hub.city} (${airportNames}) to destinations worldwide. Find the best deals with Timms Travel.`,
    alternates: {
      canonical: `https://timmstravel.com/flights/from/${hub.slug}`,
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

export default async function FlightsFromCityPage({
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
  const destinations = allHubs
    .filter((h) => h.slug !== hub.slug)
    .slice(0, 60);

  const searchDestinations = destinations
    .slice(0, 150)
    .map((d) => ({ city: d.city, iata: d.primaryIata }));

  const airportNames = hub.airports
    .map((a) => `${a.name} (${a.iata_code})`)
    .join(', ');

  const faqs = [
    {
      q: `What airports serve ${hub.city}?`,
      a: `${hub.city} is served by ${hub.airports.length > 1 ? `${hub.airports.length} airports` : 'one main airport'}: ${airportNames}.`,
    },
    {
      q: `What is the cheapest time to book flights from ${hub.city}?`,
      a: `Prices generally drop 6–8 weeks before departure. For popular routes during summer or school holidays, booking 3–4 months in advance tends to secure the best fares.`,
    },
    {
      q: `Can I search one-way and return flights from ${hub.city}?`,
      a: `Yes. Use the search box above to compare one-way, return, and flexible date options departing ${hub.city}.`,
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
              Flights from {hub.city}
            </span>
            <meta itemProp="position" content="3" />
          </li>
        </ol>
      </nav>

      {/* ── HERO + AIRPORT PICKER (interactive) ── */}
      <CityFlightsInteractive
        city={hub.city}
        airports={hub.airports.map((a) => ({ name: a.name, iata_code: a.iata_code }))}
        destinations={searchDestinations}
      />

      {/* ── POPULAR DESTINATIONS ── */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">
              Where to next
            </p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
              Popular destinations from {hub.city}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Browse popular routes below to find your next trip.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {destinations.map((destination, i) => {
              const url =
                `/flights/${hub.primaryIata}/${destination.primaryIata}/` +
                `${hub.slug}-to-${destination.slug}`;

              return (
                <Link
                  key={destination.slug}
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
                      Flights to {destination.city}
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

      {/* ── SEO TEXT ── */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-gray-600 leading-relaxed space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6" style={{ color: '#232e4e' }}>
            Flying from {hub.city}
          </h2>
          <p>
            Looking for cheap flights from {hub.city}? Timms Travel compares fares
            across hundreds of airlines departing {airportNames}, so you can find
            the best price without hunting across multiple sites.
          </p>
          <p>
            Whether you're planning a weekend break, a long-haul adventure, or a
            business trip, our search brings together real-time fares so you can
            compare and book in minutes — with flexible one-way, return, and
            multi-city options.
          </p>
          <p>
            Prices from {hub.city} vary throughout the year, so it's worth
            adjusting your travel dates by a day or two if you can — even small
            changes can make a noticeable difference to the fare.
          </p>
        </div>
      </section>

      {/* ── TRAVEL TIPS ── */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Travel tips for flying from {hub.city}
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

      {/* ── FINAL CTA ── */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-16 px-6 text-center text-white">
        <p className="text-sm uppercase tracking-widest mb-3 font-semibold" style={{ color: '#03989e' }}>
          Ready to fly?
        </p>
        <h2 className="text-3xl font-bold mb-4">
          Find the best price from {hub.city} today
        </h2>
        <p className="text-gray-300 mb-8 max-w-lg mx-auto">
          Hundreds of airlines compared instantly. No mark-ups, no hidden fees.
        </p>
        {searchDestinations.length > 0 && (
          <CityFlightSearch
            originIATA={hub.primaryIata}
            originCity={hub.city}
            destinations={searchDestinations}
          />
        )}
      </section>

      <Footer />
    </main>
  );
}