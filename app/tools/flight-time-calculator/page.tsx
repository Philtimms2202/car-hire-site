import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import FlightTimeCalculator from '@/app/tools/components/FlightTimeCalculator'

export const metadata: Metadata = {
  title: 'Flight Time Calculator | Timms Travel',
  description: 'Calculate the approximate flight time and distance between any two cities worldwide. Add stopovers and layovers for multi-leg journeys. Free tool, no sign-up needed.',
  alternates: { canonical: 'https://timmstravel.com/tools/flight-time-calculator' },
}

const FAQS = [
  { q: 'How accurate is the flight time calculator?', a: 'The calculator uses the haversine formula to measure the great-circle distance between two points on Earth, then estimates flight time at an average cruising speed of 900 km/h. Real flight times vary based on the aircraft type, wind conditions, routing and actual cruising altitude - so treat the result as a solid estimate rather than an exact figure. For short-haul European flights, real times are typically within 15-20 minutes of the estimate.' },
  { q: 'Which cities and airports does it support?', a: 'The calculator includes over 60 of the world\'s most commonly used airports and cities, including all major European hubs, North American gateways and popular long-haul destinations. You can enter either the city name (e.g. "London") or the IATA code (e.g. "LHR"). If your city isn\'t recognised, try the nearest major airport or IATA code.' },
  { q: 'Can I calculate a multi-stop or connecting flight?', a: 'Yes - click "Add stop" to add as many intermediate cities as you need. Each leg is calculated separately and the totals are summed. You can also add a layover time in minutes that applies to each stop, so the total journey time includes both flying and waiting time.' },
  { q: 'What is a great-circle distance?', a: 'A great-circle route is the shortest possible path between two points on the surface of a sphere - in this case, the Earth. Airlines fly close to this route because it minimises fuel use and time. The haversine formula calculates this curved distance, which is why a flight from London to Los Angeles goes over Greenland rather than across the Atlantic in a straight line on a flat map.' },
]

const TIPS = [
  { title: 'Add buffer time for connections', body: 'Most airlines recommend at least 60-90 minutes for domestic connections and 2+ hours for international ones. Factor this into your layover time for realistic journey planning.' },
  { title: 'Wind makes a real difference', body: 'Eastbound transatlantic flights (e.g. London to New York) often take 60-90 minutes longer than the return journey, because aircraft fly into the jet stream rather than with it.' },
  { title: 'Check the actual scheduled time', body: 'Always verify with the airline\'s actual schedule before booking. Flight times listed on booking sites already account for expected wind and routing adjustments that this calculator cannot predict.' },
  { title: 'Arrive early for long-haul flights', body: 'For flights over 5 hours, most airports recommend arriving 3 hours before departure. Factor in transfer time from your accommodation using our airport transfers service.' },
]

export default function FlightTimeCalculatorPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="text-white py-16 px-6 text-center"
               style={{ background: 'linear-gradient(135deg, #022135 0%, #03989e 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.2em] text-xs font-medium text-teal-200 mb-3">Free travel tool</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Flight time calculator</h1>
          <p className="text-base text-teal-50 max-w-xl mx-auto leading-relaxed">
            Work out how long your flight will take and how far you'll travel. Supports multi-stop routes and layover time.
          </p>
        </div>
      </section>

      {/* ── TOOL ── */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <FlightTimeCalculator />
        </div>
      </section>

      {/* ── INTRO CONTENT ── */}
      <section className="py-12 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="uppercase tracking-[0.18em] text-[11px] font-medium" style={{ color: '#03989e' }}>
            How it works
          </p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#022135' }}>
            How flight time is calculated
          </h2>
          <p className="text-gray-600 leading-relaxed text-[15px]">
            The calculator uses the haversine formula - the same method airlines use for route planning - to measure the shortest path between two points on the Earth's surface. This is known as the great-circle distance. It then divides that distance by a typical commercial cruising speed of 900 km/h to give an estimated flight time.
          </p>
          <p className="text-gray-600 leading-relaxed text-[15px]">
            For multi-leg journeys, each segment is calculated independently and the results are added together. Layover time is applied per stop, so the total journey time reflects both flying time and waiting time at connection airports.
          </p>
          <p className="text-gray-600 leading-relaxed text-[15px]">
            Actual flight times will differ slightly from the estimate due to factors like headwinds, tailwinds, air traffic routing and the specific aircraft used. For short-haul flights within Europe, the estimate is typically within 15-20 minutes of the scheduled time.
          </p>
        </div>
      </section>

      {/* ── TIPS ── */}
      <section className="py-12 px-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#022135' }}>Tips for planning around flight time</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TIPS.map(tip => (
              <div key={tip.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="font-semibold text-sm mb-2" style={{ color: '#022135' }}>{tip.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-12 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#022135' }}>Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQS.map(faq => (
              <div key={faq.q} className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="font-semibold text-sm mb-2" style={{ color: '#022135' }}>{faq.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED ── */}
      <section className="py-10 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Also useful</p>
          <div className="flex flex-wrap gap-2">
            {[
              ['/tools', 'All travel tools'],
              ['/tools/packing-checklist', 'Packing checklist'],
              ['/tools/budget-planner', 'Budget planner'],
              ['/tools/time-zone-converter', 'Time zone converter'],
              ['/flights', 'Search flights'],
              ['/other-services/airport-transfers', 'Airport transfers'],
              ['/other-services/travel-insurance', 'Travel insurance'],
            ].map(([href, label]) => (
              <Link key={href} href={href}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition hover:opacity-80"
                    style={{ borderColor: '#03989e', color: '#03989e' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BREADCRUMBS ── */}
      <section className="py-8 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <nav className="flex flex-wrap gap-2 items-center text-sm">
            <Link href="/" style={{ color: '#03989e' }} className="hover:opacity-75 transition">Home</Link>
            <span className="text-gray-300">→</span>
            <Link href="/tools" style={{ color: '#03989e' }} className="hover:opacity-75 transition">Travel tools</Link>
            <span className="text-gray-300">→</span>
            <span className="font-semibold" style={{ color: '#022135' }}>Flight time calculator</span>
          </nav>
        </div>
      </section>

      <Footer />
    </main>
  )
}