import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import TimeZoneConverter from '@/app/tools/TimeZoneConverter'

export const metadata: Metadata = {
  title: 'Time Zone Converter | Timms Travel',
  description: 'Convert times between your home city and any destination worldwide. Includes jet lag advice based on the time difference. Free tool, no sign-up needed.',
  alternates: { canonical: 'https://timmstravel.com/tools/time-zone-converter' },
}

const FAQS = [
  { q: 'How do I use the time zone converter?', a: 'Select your home city and destination city from the dropdowns, enter the date and time you want to convert, then click "Convert time". The tool shows the equivalent local time at your destination and tells you how many hours ahead or behind it is. It also provides a short jet lag tip based on the size of the time difference.' },
  { q: 'What is jet lag and how long does it last?', a: 'Jet lag is a temporary disruption to your body\'s internal clock caused by crossing multiple time zones quickly. Symptoms include fatigue, difficulty sleeping, poor concentration and digestive issues. Eastbound travel (e.g. London to Tokyo) is typically harder to adjust to than westbound. Most people need roughly one day per hour of time difference to fully adjust.' },
  { q: 'How can I reduce jet lag?', a: 'The most effective strategies are adjusting your sleep schedule a few days before departure, staying hydrated on the flight, avoiding alcohol and caffeine during the journey, getting natural daylight at your destination and trying to sleep on local time from the first night. Melatonin supplements, taken at the right time, can also help — but consult a doctor before using them.' },
  { q: 'Which time zones are supported?', a: 'The converter covers the major time zones used by the most popular travel destinations worldwide, from Honolulu to Auckland and everywhere in between. It uses your browser\'s built-in time zone support, which automatically accounts for daylight saving time adjustments in each region.' },
]

const TIPS = [
  { title: 'Switch to destination time immediately', body: 'As soon as you board the plane, change your watch and phone to your destination\'s time zone. Start thinking in local time — it helps your brain begin adjusting earlier.' },
  { title: 'Get outside in natural daylight', body: 'Sunlight is the strongest reset signal for your body clock. Spend time outside on your first day at the destination, even if you\'re tired — it significantly speeds up adjustment.' },
  { title: 'Avoid long naps on arrival', body: 'If you arrive in the morning or afternoon, push through to local bedtime rather than napping. A short 20-minute nap is fine; anything over an hour risks disrupting your night\'s sleep.' },
  { title: 'Book a transfer in advance', body: 'Arriving tired and disoriented in a new city is not the moment to be navigating public transport. A pre-booked airport transfer means you go straight to your accommodation without the stress.' },
]

export default function TimeZoneConverterPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="text-white py-16 px-6 text-center"
               style={{ background: 'linear-gradient(135deg, #022135 0%, #03989e 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.2em] text-xs font-medium text-teal-200 mb-3">Free travel tool</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Time zone converter</h1>
          <p className="text-base text-teal-50 max-w-xl mx-auto leading-relaxed">
            Work out what time it is at your destination and get practical jet lag advice based on how far you're travelling.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <TimeZoneConverter />
        </div>
      </section>

      <section className="py-12 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="uppercase tracking-[0.18em] text-[11px] font-medium" style={{ color: '#03989e' }}>About this tool</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#022135' }}>Understanding time zones when you travel</h2>
          <p className="text-gray-600 leading-relaxed text-[15px]">
            Time zones exist because the Earth rotates 360 degrees every 24 hours, which means every 15 degrees of longitude equals roughly one hour of difference. There are 24 standard time zones, though many countries use half-hour or quarter-hour offsets. The International Date Line sits at roughly 180 degrees longitude — cross it heading east and you gain a day; heading west, you lose one.
          </p>
          <p className="text-gray-600 leading-relaxed text-[15px]">
            Daylight saving time complicates things further — most of Europe, North America and Australia shift their clocks by one hour in spring and back in autumn, but on different dates. The converter accounts for these adjustments automatically using your browser's built-in time zone data.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#022135' }}>How to beat jet lag</h2>
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
              ['/tools/budget-planner', 'Budget planner'],
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

      <section className="py-8 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <nav className="flex flex-wrap gap-2 items-center text-sm">
            <Link href="/" style={{ color: '#03989e' }} className="hover:opacity-75 transition">Home</Link>
            <span className="text-gray-300">→</span>
            <Link href="/tools" style={{ color: '#03989e' }} className="hover:opacity-75 transition">Travel tools</Link>
            <span className="text-gray-300">→</span>
            <span className="font-semibold" style={{ color: '#022135' }}>Time zone converter</span>
          </nav>
        </div>
      </section>

      <Footer />
    </main>
  )
}