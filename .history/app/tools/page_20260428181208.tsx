import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'Free Travel Tools | Timms Travel',
  description: 'Free travel planning tools — flight time calculator, packing checklist, holiday budget planner and time zone converter. Plan your next trip with confidence.',
  alternates: { canonical: 'https://timmstravel.com/tools' },
}

const TOOLS = [
  {
    slug: 'flight-time-calculator',
    emoji: '✈️',
    title: 'Flight time calculator',
    description: 'Calculate the approximate flight time and distance between any two cities. Add stopovers and toggle between kilometres and miles.',
    tags: ['Flight time', 'Distance', 'Multi-stop'],
  },
  {
    slug: 'packing-checklist',
    emoji: '🧳',
    title: 'Packing checklist',
    description: 'A smart packing list that adapts to your trip type — beach, city, business, adventure or ski. Mark items off as you pack.',
    tags: ['Beach', 'City break', 'Business', 'Ski'],
  },
  {
    slug: 'budget-planner',
    emoji: '💷',
    title: 'Holiday budget planner',
    description: 'Plan your holiday budget by category — flights, accommodation, food, activities and more. See your daily spend at a glance.',
    tags: ['Budget', 'Cost estimate', 'Per day'],
  },
  {
    slug: 'time-zone-converter',
    emoji: '🕐',
    title: 'Time zone converter',
    description: 'Convert times between your home city and your destination. Includes jet lag advice based on the time difference.',
    tags: ['Time zones', 'Jet lag', 'World clock'],
  },
]

const RELATED = [
  { href: '/flights',                          label: 'Search flights'       },
  { href: '/hotels',                           label: 'Find hotels'          },
  { href: '/other-services/travel-insurance',  label: 'Travel insurance'     },
  { href: '/other-services/airport-transfers', label: 'Airport transfers'    },
  { href: '/other-services/esims',             label: 'eSIMs for travel'     },
  { href: '/other-services',                   label: 'All travel services'  },
]

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="text-white py-20 px-6 text-center"
               style={{ background: 'linear-gradient(135deg, #022135 0%, #03989e 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.2em] text-xs font-medium text-teal-200 mb-3">
            Free travel tools
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Plan your trip with confidence
          </h1>
          <p className="text-base md:text-lg text-teal-50 max-w-2xl mx-auto leading-relaxed">
            Free tools built for travellers — from working out how long your flight is to packing the right things and budgeting for every part of your trip.
          </p>
        </div>
      </section>

      {/* ── TOOLS GRID ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TOOLS.map(tool => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}
                    className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
                <span className="text-3xl">{tool.emoji}</span>
                <div>
                  <h2 className="text-lg font-semibold group-hover:text-[#03989e] transition-colors"
                      style={{ color: '#022135' }}>
                    {tool.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed mt-1">{tool.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  {tool.tags.map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full border"
                          style={{ borderColor: '#03989e', color: '#03989e' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-sm font-semibold mt-1 transition-colors"
                      style={{ color: '#03989e' }}>
                  Open tool →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY USE TOOLS ── */}
      <section className="py-14 px-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.18em] text-[11px] font-medium mb-2"
             style={{ color: '#03989e' }}>
            Built for travellers
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#022135' }}>
            Everything in one place
          </h2>
          <p className="text-gray-600 leading-relaxed text-[15px] mb-4">
            Planning a trip involves a lot of moving parts — figuring out how long the journey takes, what to pack, how much to budget and how to deal with the time difference when you land. These tools are designed to make that easier, without needing to switch between a dozen different websites or apps.
          </p>
          <p className="text-gray-600 leading-relaxed text-[15px]">
            All four tools run entirely in your browser — nothing is stored, no account needed. Just open them, fill in your details and get on with planning.
          </p>
        </div>
      </section>

      {/* ── RELATED SERVICES ── */}
      <section className="py-10 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Also useful</p>
          <div className="flex flex-wrap gap-2">
            {RELATED.map(r => (
              <Link key={r.href} href={r.href}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition hover:opacity-80"
                    style={{ borderColor: '#03989e', color: '#03989e' }}>
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BREADCRUMBS ── */}
      <section className="py-8 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <nav className="flex flex-wrap gap-2 items-center text-sm">
            <Link href="/" className="hover:opacity-75 transition" style={{ color: '#03989e' }}>Home</Link>
            <span className="text-gray-300">→</span>
            <span className="font-semibold" style={{ color: '#022135' }}>Travel tools</span>
          </nav>
        </div>
      </section>

      <Footer />
    </main>
  )
}