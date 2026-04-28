import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import BudgetPlanner from '@/app/tools/components/BudgetPlanner'

export const metadata: Metadata = {
  title: 'Holiday Budget Planner | Timms Travel',
  description: 'Plan your holiday budget by category — flights, accommodation, food, activities, transport and shopping. See your daily spend and total cost at a glance.',
  alternates: { canonical: 'https://timmstravel.com/tools/budget-planner' },
}

const FAQS = [
  { q: 'How do I use the budget planner?', a: 'Enter your destination, the number of days you\'ll be travelling, and your preferred currency. Then adjust the per-day amounts for each category — accommodation, food, transport, activities and shopping — to match your travel style. The planner updates in real time, showing your estimated total and a daily breakdown.' },
  { q: 'Are the default figures realistic?', a: 'The defaults are based on mid-range travel — comfortable but not luxury. Accommodation is set at £80 per night, which covers a solid 3-4 star hotel in most European cities. For more expensive destinations like Scandinavia, Switzerland or Tokyo, you\'d typically increase accommodation and food. For Southeast Asia or Eastern Europe, you can often halve the defaults and still travel comfortably.' },
  { q: 'What should I include in the "activities" category?', a: 'Include any entrance fees, guided tours, day trips, experiences and events you plan to book. If you\'re visiting a museum-heavy city like Rome or Vienna, or planning a day trip to a UNESCO site, activities can add up quickly. Using our things-to-do pages for specific cities can help you estimate what to budget.' },
  { q: 'Should I budget for emergencies?', a: 'It\'s always worth adding a contingency — most seasoned travellers suggest 10-15% on top of your planned budget for unexpected costs like delayed transport, medical expenses, or spontaneous extras. Travel insurance is strongly recommended to cover larger unexpected costs like flight cancellations or medical treatment abroad.' },
]

const TIPS = [
  { title: 'Book flights early for best prices', body: 'For European short-haul flights, 6-8 weeks ahead tends to offer the best balance of availability and price. For long-haul, 3-6 months in advance is generally the sweet spot.' },
  { title: 'Accommodation is your biggest lever', body: 'Shifting from a central 4-star hotel to a well-located 3-star or aparthotel can save £30-50 per night without meaningfully affecting your trip. Use our hotels pages for area guides.' },
  { title: 'Set a daily cash budget', body: 'Decide on a daily cash allowance before you go and stick to it. Paying in cash for markets, local transport and smaller restaurants helps avoid overspending.' },
  { title: 'Get travel insurance before you book', body: 'Travel insurance is one of the best-value things you can add to your budget. A comprehensive policy typically costs £15-30 for a week in Europe and covers cancellations, delays, medical treatment and lost luggage.' },
]

export default function BudgetPlannerPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="text-white py-16 px-6 text-center"
               style={{ background: 'linear-gradient(135deg, #022135 0%, #03989e 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.2em] text-xs font-medium text-teal-200 mb-3">Free travel tool</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Holiday budget planner</h1>
          <p className="text-base text-teal-50 max-w-xl mx-auto leading-relaxed">
            Build a realistic budget for your trip. Adjust by category, see your daily spend and total cost, and know exactly what you need before you go.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <BudgetPlanner />
        </div>
      </section>

      <section className="py-12 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="uppercase tracking-[0.18em] text-[11px] font-medium" style={{ color: '#03989e' }}>About this tool</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#022135' }}>How the budget planner works</h2>
          <p className="text-gray-600 leading-relaxed text-[15px]">
            The planner breaks your holiday spend into six categories — flights, accommodation, food and drink, local transport, activities and shopping. Flights are treated as a fixed total cost, while everything else is calculated on a per-day basis and multiplied by your trip length.
          </p>
          <p className="text-gray-600 leading-relaxed text-[15px]">
            Each category shows a proportional bar so you can see at a glance where most of your money is going. Adjust any figure and the totals update immediately. The planner supports GBP, EUR and USD — switch currency at any time without losing your figures.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#022135' }}>Budgeting tips for travellers</h2>
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

      <section className="py-10 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Also useful</p>
          <div className="flex flex-wrap gap-2">
            {[
              ['/tools', 'All travel tools'],
              ['/tools/flight-time-calculator', 'Flight time calculator'],
              ['/tools/packing-checklist', 'Packing checklist'],
              ['/tools/time-zone-converter', 'Time zone converter'],
              ['/other-services/travel-insurance', 'Travel insurance'],
              ['/flights', 'Search flights'],
              ['/hotels', 'Find hotels'],
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

      <section className="py-8 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <nav className="flex flex-wrap gap-2 items-center text-sm">
            <Link href="/" style={{ color: '#03989e' }} className="hover:opacity-75 transition">Home</Link>
            <span className="text-gray-300">→</span>
            <Link href="/tools" style={{ color: '#03989e' }} className="hover:opacity-75 transition">Travel tools</Link>
            <span className="text-gray-300">→</span>
            <span className="font-semibold" style={{ color: '#022135' }}>Holiday budget planner</span>
          </nav>
        </div>
      </section>

      <Footer />
    </main>
  )
}