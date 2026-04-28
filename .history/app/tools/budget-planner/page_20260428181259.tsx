import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import PackingChecklist from '@/app/tools/components/PackingChecklist'

export const metadata: Metadata = {
  title: 'Packing Checklist | Timms Travel',
  description: 'A free packing checklist that adapts to your trip type — beach holiday, city break, business trip, adventure or ski. Mark items off as you go.',
  alternates: { canonical: 'https://timmstravel.com/tools/packing-checklist' },
}

const FAQS = [
  { q: 'Can I customise the packing list?', a: 'The checklist adapts automatically based on your trip type, duration and whether you\'re using carry-on luggage only. Select the options that match your trip and the list adjusts to include the most relevant items. Within the list you can check off items you\'ve already packed and reset the whole list to start again.' },
  { q: 'What\'s the difference between carry-on and checked bag packing?', a: 'When you select carry-on only, the checklist adds a section of airport security reminders — including the 100ml liquids rule, laptop removal and wearing your bulkiest shoes on the plane. Most airlines allow one cabin bag and one personal item, so check your airline\'s specific size and weight limits before you travel.' },
  { q: 'How much should I pack for a long trip?', a: 'A common mistake is overpacking for longer trips. For trips over 10 nights, consider packing for a week and planning to do laundry rather than bringing more clothes. Many destinations have affordable laundry services or self-service laundrettes. Travelling lighter makes everything easier — from getting through airports to moving between accommodation.' },
  { q: 'What should always be in my carry-on bag?', a: 'Regardless of trip type, always keep your passport, travel insurance documents, phone charger, any essential medication, a change of clothes and your hotel booking confirmation in your carry-on. If your checked bag is delayed, you\'ll have everything you need to get through the first night.' },
]

const TIPS = [
  { title: 'Pack your carry-on the night before', body: 'Packing in a rush at the airport is how things get forgotten. Pack your carry-on bag the evening before departure and keep it separate from your main luggage.' },
  { title: 'Roll clothes instead of folding', body: 'Rolling clothes instead of folding them saves space and reduces creasing — especially for casual wear, swimwear and lightweight fabrics.' },
  { title: 'Check airline weight limits', body: 'Most short-haul carriers allow 23kg for checked bags and around 10kg for cabin bags, but budget airlines vary significantly. Check before you pack to avoid fees at the airport.' },
  { title: 'Use a separate toiletries bag', body: 'Keep all liquids, creams and toiletries in a dedicated clear zip-lock bag for carry-on travel. It speeds up security and keeps the rest of your luggage dry if anything leaks.' },
]

export default function PackingChecklistPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="text-white py-16 px-6 text-center"
               style={{ background: 'linear-gradient(135deg, #022135 0%, #03989e 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.2em] text-xs font-medium text-teal-200 mb-3">Free travel tool</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Packing checklist</h1>
          <p className="text-base text-teal-50 max-w-xl mx-auto leading-relaxed">
            A smart packing list that adapts to your trip type. Select your destination style, tick items off as you pack and never leave home without the essentials again.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <PackingChecklist />
        </div>
      </section>

      <section className="py-12 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="uppercase tracking-[0.18em] text-[11px] font-medium" style={{ color: '#03989e' }}>About this tool</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#022135' }}>How the checklist works</h2>
          <p className="text-gray-600 leading-relaxed text-[15px]">
            The checklist is organised into four sections — essentials, clothing, toiletries and extras — and adapts based on the type of trip you select. A beach holiday list includes high-SPF suncream and a waterproof phone case; an adventure trip includes a first aid kit and water purification tablets; a business trip includes a dedicated section for work essentials.
          </p>
          <p className="text-gray-600 leading-relaxed text-[15px]">
            If you're travelling carry-on only, an additional section appears with airport security reminders to make the process smoother. Tap or click any item to mark it as packed — it's highlighted and struck through so you can see at a glance what's left to do.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#022135' }}>Packing tips</h2>
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
              ['/tools/budget-planner', 'Budget planner'],
              ['/tools/time-zone-converter', 'Time zone converter'],
              ['/other-services/travel-insurance', 'Travel insurance'],
              ['/other-services/airport-transfers', 'Airport transfers'],
              ['/other-services/esims', 'eSIMs'],
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
            <span className="font-semibold" style={{ color: '#022135' }}>Packing checklist</span>
          </nav>
        </div>
      </section>

      <Footer />
    </main>
  )
}