import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'
import { DEAL_CATEGORIES } from '@/data/dealCategories'
import { buildMetadata } from '@/app/metadata'

export async function generateMetadata() {
  return buildMetadata({
    title: 'The Best Travel Deals | Timms Travel',
    description: 'Explore live curated travel deal vaults. Real-time flight pricing tickers sorted by budget, destinations, and seasons.',
    alternates: { canonical: 'https://timmstravel.com/deals' }
  })
}

export default function DealsDashboard() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section 
        className="text-white py-24 md:py-32 px-6 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #022135 0%, #03989e 100%)' }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-6xl md:text-7xl mb-6 animate-bounce duration-1000">✈️</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-none">
            Curated Flight & Travel Deals
          </h1>
          <p className="text-base md:text-xl text-teal-50 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Real-time price updates with deals on flights, ensuring you get the best experience for your money. Handpicked parameters engineered for your ideal vacation style without the endless searching.
          </p>
          <div className="p-3 inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs md:text-sm font-semibold tracking-wide text-teal-100">
            ⚡ Live pricing tickers updating constantly
          </div>
          <p className="text-xs text-teal-200/80 mt-6 max-w-md mx-auto italic">
            At Timms Travel, we use affiliate links. If you book a place through our links, we might earn a small commission at completely zero extra cost to you.
          </p>
        </div>
      </section>

      {/* ── CATEGORIES DIRECTORY GRID ─────────────────────────────────── */}
      <section className="py-16 px-6 bg-white" aria-labelledby="directory-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Explore Collections</p>
            <h2 id="directory-heading" className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              Browse Special Deal Categories
            </h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm">
              Live pricing tickers segmented into tailored collections by budget, region, and season.
            </p>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(DEAL_CATEGORIES).map(([slug, config]) => (
              <li key={slug} className="list-none">
                <Link
                  href={`/deals/${slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:border-teal-200 hover:bg-teal-50/30 transition-all shadow-sm hover:shadow-md"
                  title={config.title}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-xl group-hover:text-[#03989e] transition-colors" style={{ color: '#232e4e' }}>
                      {config.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">{config.subtitle}</p>
                  <span className="text-xs font-bold text-[#03989e] group-hover:underline flex items-center gap-1">
                    View Live Deals →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  )
}