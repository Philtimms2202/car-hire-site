'use client'

import React, { useState } from 'react'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import NextImage from 'next/image'

// ---------------------------------------------
// AFFILIATE LINK
// ---------------------------------------------
const GETTRANSFER_AFFILIATE_URL = 'https://gettransfer.tpm.li/vL0n4gRX'

// ---------------------------------------------
// TYPES
// ---------------------------------------------
type FaqItem = {
  q: string
  a: string
}

type TransferType = {
  id: string
  name: string
  emoji: string
  color: string
  bg: string
  tagline: string
  description: string
  bestFor: string
  features: string[]
}

type Destination = {
  city: string
  country: string
  emoji: string
  airports: string
  note: string
}

type ComparisonRow = {
  feature: string
  transfer: string
  taxi: string
  rideshare: string
  transferWins: boolean
}

type Testimonial = {
  name: string
  location: string
  quote: string
  initials: string
  color: string
}

type Tip = {
  emoji: string
  title: string
  body: string
}

// ---------------------------------------------
// TRANSFER TYPES
// ---------------------------------------------
const TRANSFER_TYPES: TransferType[] = [
  {
    id: 'private',
    name: 'Private Transfer',
    emoji: '🚗',
    color: '#232e4e',
    bg: '#232e4e15',
    tagline: 'Your own vehicle, your own schedule.',
    description:
      'A private transfer means a dedicated vehicle and driver waiting exclusively for you - no shared stops, no waiting for other passengers. The driver meets you in arrivals with a name board, helps with luggage and takes you directly to your destination. Ideal when you want a stress-free, door-to-door experience after a long flight.',
    bestFor: 'Families, couples, business travellers, anyone with a lot of luggage',
    features: [
      'Driver waiting in arrivals hall',
      'Fixed price agreed in advance',
      'No meters, no surge pricing',
      'Direct route - no shared stops',
      'Luggage assistance included',
      'Flight tracking on delayed arrivals',
      'Wide vehicle selection',
    ],
  },
  {
    id: 'business',
    name: 'Business Class',
    emoji: '💼',
    color: '#b8860b',
    bg: '#b8860b15',
    tagline: 'Executive travel from kerb to meeting room.',
    description:
      'Business class transfers use premium vehicles - typically executive saloons or luxury SUVs - with professional, suited drivers. Perfect for client entertainment, important meetings or simply when you want to arrive composed rather than frazzled. Wi-Fi, bottled water and phone charging often included as standard.',
    bestFor: 'Business travel, client collections, special occasions, VIP arrivals',
    features: [
      'Premium executive vehicles',
      'Professional, suited drivers',
      'Wi-Fi and refreshments often included',
      'Meet and greet in arrivals',
      'Fixed price - expensable receipt provided',
      'Flight monitoring included',
      'Discretion and punctuality guaranteed',
    ],
  },
  {
    id: 'shuttle',
    name: 'Shared Shuttle',
    emoji: '🚌',
    color: '#5a7a52',
    bg: '#5a7a5215',
    tagline: 'The budget-friendly option for solo travellers.',
    description:
      'Shared shuttles group passengers travelling in the same direction into one vehicle, sharing the cost. You will typically wait a short time for other passengers and make one or two stops before reaching your destination. A great value option for solo travellers or pairs who are not in a rush and want to keep costs low.',
    bestFor: 'Solo travellers, budget-conscious trips, short routes, backpackers',
    features: [
      'Most affordable transfer option',
      'Fixed price agreed upfront',
      'Scheduled departure times',
      'Popular for airport to city centre routes',
      'Comfortable, air-conditioned vehicles',
      'Luggage included',
      'Book in advance for best availability',
    ],
  },
  {
    id: 'minivan',
    name: 'Minivan / Group',
    emoji: '🚐',
    color: '#03989e',
    bg: '#03989e15',
    tagline: 'Fit the whole group in one vehicle.',
    description:
      'Minivan and group transfers seat between 6 and 16 passengers in a single vehicle - ideal for family holidays, group trips or corporate away-days. One price for the whole group, split between everyone, often works out cheaper per head than individual taxis while keeping the group together.',
    bestFor: 'Groups of 6+, family holidays, hen and stag parties, corporate travel',
    features: [
      'Seats 6–16 passengers',
      'Single price for the whole group',
      'Often cheaper per head than taxis',
      'Keeps the group together',
      'Large luggage capacity',
      'Driver meets group in arrivals',
      'Suitable for families with pushchairs',
    ],
  },
]

// ---------------------------------------------
// POPULAR DESTINATIONS
// ---------------------------------------------
const DESTINATIONS: Destination[] = [
  {
    city: 'London',
    country: 'United Kingdom',
    emoji: '🏙️',
    airports: 'Heathrow, Gatwick, Stansted, Luton, City',
    note: 'London has five airports - a pre-booked transfer is far more reliable than airport queues, especially from Heathrow or Gatwick into central London.',
  },
  {
    city: 'Dubai',
    country: 'UAE',
    emoji: '🌆',
    airports: 'Dubai International (DXB), Al Maktoum (DWC)',
    note: 'Dubai is large and distances between the airport and popular resort areas can be significant. A private transfer makes arrival seamless - especially for late night landings.',
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    emoji: '🏖️',
    airports: 'Barcelona El Prat (BCN)',
    note: 'El Prat is around 20–30 minutes from the city centre. A transfer avoids the taxi rank queue and gets you to your hotel directly - ideal if you have heavy luggage.',
  },
  {
    city: 'Rome',
    country: 'Italy',
    emoji: '🏛️',
    airports: 'Fiumicino (FCO), Ciampino (CIA)',
    note: 'Fiumicino is 30km from central Rome. With luggage and multiple passengers, a private transfer often works out cost-competitive with taxis while being far more comfortable.',
  },
  {
    city: 'Paris',
    country: 'France',
    emoji: '🗼',
    airports: 'Charles de Gaulle (CDG), Orly (ORY), Beauvais',
    note: 'CDG is a large, complex airport and the transfer into Paris takes 45–60 minutes. A pre-booked driver waiting in arrivals removes all the stress from this notoriously hectic airport.',
  },
  {
    city: 'New York',
    country: 'United States',
    emoji: '🗽',
    airports: 'JFK, Newark (EWR), LaGuardia (LGA)',
    note: 'New York taxis and rideshares can be unpredictable in price and availability, especially from JFK. A fixed-price transfer gives you certainty before you land.',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    emoji: '✈️',
    airports: 'Narita (NRT), Haneda (HND)',
    note: 'Narita is over 60km from central Tokyo. With jet lag and luggage, a private transfer direct to your hotel is a much more comfortable start to your trip than the train.',
  },
  {
    city: 'Malaga',
    country: 'Spain',
    emoji: '☀️',
    airports: 'Málaga-Costa del Sol (AGP)',
    note: 'Málaga airport serves the entire Costa del Sol. Distances to Marbella, Nerja or Ronda can be significant - a private transfer is the easiest way to reach your resort directly.',
  },
]

// ---------------------------------------------
// COMPARISON DATA
// ---------------------------------------------
const COMPARISON: ComparisonRow[] = [
  {
    feature: 'Price certainty',
    transfer: 'Fixed price agreed upfront',
    taxi: 'Metered - unknown until arrival',
    rideshare: 'Surge pricing possible',
    transferWins: true,
  },
  {
    feature: 'Driver waiting on arrival',
    transfer: 'Yes - name board in arrivals',
    taxi: 'Queue at taxi rank',
    rideshare: 'Meet outside - can be chaotic',
    transferWins: true,
  },
  {
    feature: 'Flight delay cover',
    transfer: 'Yes - driver tracks your flight',
    taxi: 'No - you find a new taxi',
    rideshare: 'No - rebook manually',
    transferWins: true,
  },
  {
    feature: 'Luggage assistance',
    transfer: 'Yes - driver helps with bags',
    taxi: 'Driver may assist',
    rideshare: 'Self-service',
    transferWins: true,
  },
  {
    feature: 'Group / large vehicles',
    transfer: 'Yes - minivans and coaches',
    taxi: 'Limited - often one car only',
    rideshare: 'Limited options',
    transferWins: true,
  },
  {
    feature: 'Advance booking',
    transfer: 'Yes - book weeks ahead',
    taxi: 'No - on demand only',
    rideshare: 'Limited pre-booking',
    transferWins: true,
  },
  {
    feature: 'Receipt for expenses',
    transfer: 'Yes - full receipt provided',
    taxi: 'Sometimes',
    rideshare: 'Digital receipt only',
    transferWins: true,
  },
]

// ---------------------------------------------
// TESTIMONIALS
// ---------------------------------------------
const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Claire H.',
    location: 'Manchester, UK',
    quote: 'Our flight landed two hours late and the driver was still there waiting. No extra charge, no stress. Absolute lifesaver after a nightmare journey.',
    initials: 'CH',
    color: '#03989e',
  },
  {
    name: 'David M.',
    location: 'London, UK',
    quote: 'Used GetTransfer for a client collection from Heathrow. Executive car, professional driver, on time. Client was impressed. Will use every time.',
    initials: 'DM',
    color: '#232e4e',
  },
  {
    name: 'Lena T.',
    location: 'Bristol, UK',
    quote: 'Eight of us flying into Barcelona for a hen weekend. One minivan, fixed price, driver waiting with a sign. So much easier than trying to get three taxis.',
    initials: 'LT',
    color: '#b8860b',
  },
]

// ---------------------------------------------
// FAQS
// ---------------------------------------------
const FAQS: FaqItem[] = [
  {
    q: 'What is an airport transfer?',
    a: 'An airport transfer is a pre-booked private vehicle that takes you from the airport directly to your hotel, home or other destination - or vice versa. Unlike taxis or rideshares, the price is fixed in advance, your driver is waiting when you land, and the vehicle is exclusively yours for the journey.',
  },
  {
    q: 'What happens if my flight is delayed?',
    a: 'GetTransfer drivers monitor your flight in real time. If your flight is delayed, your driver will adjust their arrival time accordingly - you will not be charged extra and you will not need to contact anyone. Simply walk out of arrivals and your driver will be there.',
  },
  {
    q: 'How do I find my driver at the airport?',
    a: 'Your driver will be waiting in the arrivals hall with a name board displaying your name or your booking reference. You will also receive the driver\'s contact details in advance so you can reach them directly if needed.',
  },
  {
    q: 'Can I book a transfer for a large group?',
    a: 'Yes. GetTransfer offers a wide range of vehicle sizes from standard saloons to minivans and coaches. When booking, select the number of passengers and luggage and the system will show you suitable vehicle options. Group transfers often work out cheaper per head than multiple individual taxis.',
  },
  {
    q: 'How far in advance do I need to book?',
    a: 'You can book a transfer at any point before your departure, from months ahead to a few hours before your flight. That said, booking in advance guarantees your vehicle type and gives you one less thing to think about on travel day.',
  },
  {
    q: 'Is the price really fixed?',
    a: 'Yes. The price you see when you book is the price you pay - there are no meters, no surge pricing and no unexpected extras at the end of the journey. Tolls and parking fees, if applicable, are typically included in the quoted price.',
  },
  {
    q: 'What vehicle types are available?',
    a: 'GetTransfer offers a wide range of vehicles including standard saloons, estate cars, MPVs, minivans for groups of up to 16, executive and luxury cars, and larger coaches for bigger groups. You can filter by vehicle type, passenger capacity and luggage allowance when booking.',
  },
  {
    q: 'Can I book a return transfer at the same time?',
    a: 'Yes - you can book both legs of your journey (outbound and return airport transfers) in the same booking, which is often more convenient and can be better value.',
  },
  {
    q: 'Is GetTransfer available worldwide?',
    a: 'GetTransfer operates in over 100 countries across Europe, the Americas, Asia, the Middle East and Africa. Coverage is strongest in major tourist destinations and gateway airports, with thousands of local drivers and operators on the platform.',
  },
  {
    q: 'What if I need to cancel my transfer?',
    a: 'Cancellation policies vary by booking, but most GetTransfer bookings offer free cancellation up to a certain point before your pickup time. Full details are shown at the time of booking before you confirm your purchase.',
  },
]

// ---------------------------------------------
// TIPS
// ---------------------------------------------
const TIPS: Tip[] = [
  {
    emoji: '📅',
    title: 'Book before you fly',
    body: 'Booking in advance locks in the price, guarantees your vehicle type and means one less thing to sort on a busy travel day. Availability is best when you book early.',
  },
  {
    emoji: '✈️',
    title: 'Enter your flight number',
    body: 'Always include your flight number when booking. This allows your driver to track your arrival in real time and adjust for any delays - at no extra cost to you.',
  },
  {
    emoji: '🧳',
    title: 'Be accurate about luggage',
    body: 'Select the correct number of bags when booking so the right size vehicle is assigned. Arriving with more luggage than declared can cause problems - especially with smaller cars.',
  },
  {
    emoji: '📱',
    title: 'Save the driver\'s number',
    body: 'You will receive your driver\'s contact details before your trip. Save the number before you fly so you can reach them quickly if you have any trouble locating them in arrivals.',
  },
  {
    emoji: '⏰',
    title: 'Allow time for customs and baggage',
    body: 'Your driver will wait, but be realistic about how long you need after landing. Long-haul flights with checked luggage can take 45–60 minutes from landing to arrivals.',
  },
  {
    emoji: '💷',
    title: 'Compare with taxis for your route',
    body: 'For longer routes - Heathrow to central London, CDG to Paris, Narita to Tokyo - a fixed-price transfer is often price-competitive with metered taxis and far less stressful.',
  },
]

// ---------------------------------------------
// HOW IT WORKS
// ---------------------------------------------
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Enter your details',
    body: 'Add your pickup location, destination, date, time, number of passengers and luggage. Include your flight number for automatic delay tracking.',
    emoji: '📍',
  },
  {
    step: '02',
    title: 'Choose your vehicle',
    body: 'Browse available vehicles with fixed prices shown upfront - no hidden fees. Filter by car type, capacity and rating to find the right option for your trip.',
    emoji: '🚗',
  },
  {
    step: '03',
    title: 'Book and confirm',
    body: 'Complete your booking securely in minutes. You will receive a confirmation with your driver\'s details and a full receipt - perfect for expenses.',
    emoji: '✅',
  },
  {
    step: '04',
    title: 'Your driver meets you',
    body: 'Your driver arrives at the agreed time with a name board in arrivals. They handle your luggage and take you directly to your destination.',
    emoji: '🙋',
  },
]

// ---------------------------------------------
// TRANSFER TYPE SECTION
// ---------------------------------------------
function TransferTypesSection() {
  const [active, setActive] = useState(0)
  const t = TRANSFER_TYPES[active]

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Vehicle options</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            Which transfer is right for you?
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            From solo budget travel to executive airport collections - GetTransfer has a vehicle for every trip.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TRANSFER_TYPES.map((type, i) => (
            <button
              key={type.id}
              onClick={() => setActive(i)}
              className="px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border"
              style={
                i === active
                  ? { backgroundColor: type.color, color: '#fff', borderColor: type.color }
                  : { backgroundColor: `${type.color}10`, color: type.color, borderColor: `${type.color}30` }
              }
            >
              {type.emoji} {type.name}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{t.emoji}</span>
            <span
              className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ backgroundColor: t.bg, color: t.color }}
            >
              {t.name}
            </span>
          </div>

          <h3 className="text-xl font-bold mb-1" style={{ color: '#232e4e' }}>{t.tagline}</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">{t.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl px-5 py-4 border border-gray-100" style={{ backgroundColor: t.bg }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: t.color }}>
                Best for
              </p>
              <p className="text-sm font-medium text-slate-700">{t.bestFor}</p>
            </div>
            <div className="rounded-2xl px-5 py-4 border border-gray-100" style={{ backgroundColor: t.bg }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: t.color }}>
                What's included
              </p>
              <ul className="space-y-1.5">
                {t.features.map(f => (
                  <li key={f} className="text-sm font-medium text-slate-700 flex items-start gap-2">
                    <svg
                      className="w-3.5 h-3.5 mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: t.color }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a
            href={GETTRANSFER_AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
            style={{ backgroundColor: t.color }}
          >
            Book a {t.name} →
          </a>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// HOW IT WORKS
// ---------------------------------------------
function HowItWorksSection() {
  return (
    <section className="py-16 px-6 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Simple booking</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            Booked in minutes, sorted for your trip
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            From search to confirmed booking - the whole process takes less time than waiting in a taxi queue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {HOW_IT_WORKS.map(({ step, title, body, emoji }, i) => (
            <div key={step} className="relative">
              {i < HOW_IT_WORKS.length - 1 && (
                <div
                  className="hidden lg:block absolute top-8 left-full w-full h-px z-0"
                  style={{ backgroundColor: '#03989e30' }}
                />
              )}
              <div className="relative z-10 rounded-2xl border border-gray-100 bg-gray-50 p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: '#03989e' }}
                  >
                    {step}
                  </span>
                  <span className="text-xl">{emoji}</span>
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: '#232e4e' }}>{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href={GETTRANSFER_AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
            style={{ backgroundColor: '#03989e' }}
          >
            Book your transfer now →
          </a>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// POPULAR DESTINATIONS
// ---------------------------------------------
function DestinationsSection() {
  const [active, setActive] = useState(0)
  const dest = DESTINATIONS[active]

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Popular routes</p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
              Transfers at popular destinations
            </h2>
          </div>
          <a
            href={GETTRANSFER_AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#03989e' }}
          >
            Search all destinations →
          </a>
        </div>

        {/* Destination tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {DESTINATIONS.map((d, i) => (
            <button
              key={d.city}
              onClick={() => setActive(i)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all border"
              style={
                i === active
                  ? { backgroundColor: '#232e4e', color: '#fff', borderColor: '#232e4e' }
                  : { backgroundColor: '#fff', color: '#232e4e', borderColor: '#e5e7eb' }
              }
            >
              {d.emoji} {d.city}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 md:p-10 shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-4xl shrink-0">{dest.emoji}</span>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#232e4e' }}>
                {dest.city}, {dest.country}
              </h3>
              <span
                className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full inline-block mt-1"
                style={{ backgroundColor: '#03989e15', color: '#03989e' }}
              >
                {dest.airports}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-6">{dest.note}</p>

          <a
            href={GETTRANSFER_AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
            style={{ backgroundColor: '#03989e' }}
          >
            Book a transfer in {dest.city} →
          </a>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// COMPARISON
// ---------------------------------------------
function ComparisonSection() {
  return (
    <section className="py-16 px-6 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Why pre-book</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            Private transfer vs taxi vs rideshare
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            The honest comparison - so you can decide what works best for your trip.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <div className="grid grid-cols-4 gap-0 border-b border-gray-100">
            <div className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Feature
            </div>
            <div
              className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-center text-white"
              style={{ backgroundColor: '#03989e' }}
            >
              Private Transfer
            </div>
            <div className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-center text-gray-500 bg-gray-50">
              Street Taxi
            </div>
            <div className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-center text-gray-500 bg-gray-50">
              Rideshare App
            </div>
          </div>

          {COMPARISON.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-4 gap-0 border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
            >
              <div className="px-5 py-4 text-xs font-semibold text-gray-600 flex items-center">
                {row.feature}
              </div>
              <div
                className="px-5 py-4 text-xs font-semibold text-center flex items-center justify-center gap-1.5"
                style={{ backgroundColor: '#03989e08', color: '#03989e' }}
              >
                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                {row.transfer}
              </div>
              <div className="px-5 py-4 text-xs text-center text-gray-500 flex items-center justify-center">
                {row.taxi}
              </div>
              <div className="px-5 py-4 text-xs text-center text-gray-500 flex items-center justify-center">
                {row.rideshare}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// TIPS SECTION
// ---------------------------------------------
function TipsSection() {
  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Travel smarter</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            Getting the most from your transfer
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIPS.map(({ emoji, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-100 bg-white p-6"
            >
              <span className="text-2xl block mb-3">{emoji}</span>
              <h3 className="font-bold text-sm mb-2" style={{ color: '#232e4e' }}>{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// TESTIMONIALS
// ---------------------------------------------
function TestimonialsSection() {
  return (
    <section className="py-16 px-6 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Traveller stories</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            What our travellers say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, location, quote, initials, color }) => (
            <div key={name} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="#f59e0b" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5 italic">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#232e4e' }}>{name}</p>
                  <p className="text-xs text-gray-400">{location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// FAQ
// ---------------------------------------------
function FaqSection() {
  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Help</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="group border border-gray-100 rounded-2xl bg-white px-5 py-4 cursor-pointer"
            >
              <summary
                className="font-semibold text-sm list-none flex items-center justify-between gap-4"
                style={{ color: '#232e4e' }}
              >
                {q}
                <span className="shrink-0 text-gray-400 group-open:rotate-45 transition-transform duration-200 text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// CTA BANNER
// ---------------------------------------------
function CtaBanner() {
  return (
    <section className="py-16 px-6 border-t border-gray-100" style={{ backgroundColor: '#232e4e' }}>
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-4xl mb-4 block">🚗</span>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Start your trip the right way
        </h2>
        <p className="text-gray-300 text-sm md:text-base mb-8 max-w-xl mx-auto">
          No taxi queues, no surge pricing, no stress. Book a fixed-price airport transfer with GetTransfer and arrive at your destination feeling like the holiday has already started.
        </p>
        <a
          href={GETTRANSFER_AFFILIATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
          style={{ backgroundColor: '#03989e', color: '#fff' }}
        >
          Book Your Airport Transfer →
        </a>
        <p className="text-gray-500 text-xs mt-4">
          Powered by GetTransfer · 100+ countries · Fixed prices · Flight tracking included
        </p>
      </div>
    </section>
  )
}

// ---------------------------------------------
// PAGE
// ---------------------------------------------
export default function TransfersPageClient() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden text-white py-24 px-6 text-center">
        <NextImage
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1740"
          alt="Car driving at night through a city"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[#232e4e]/80 z-0" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
            Timms Travel · Airport Transfers
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Your driver. Your price. No surprises.
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Pre-book a private airport transfer with GetTransfer and arrive stress-free. Fixed prices, flight tracking, drivers waiting in arrivals - in over 100 countries worldwide.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { emoji: '💷', label: 'Fixed price upfront' },
              { emoji: '✈️', label: 'Flight tracking included' },
              { emoji: '🙋', label: 'Driver meets you in arrivals' },
              { emoji: '🌍', label: '100+ countries' },
            ].map(({ emoji, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/20"
              >
                {emoji} {label}
              </span>
            ))}
          </div>

          <a
            href={GETTRANSFER_AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
            style={{ backgroundColor: '#03989e', color: '#fff' }}
          >
            Book Your Transfer on GetTransfer →
          </a>
          <p className="text-gray-400 text-xs mt-3">
            Powered by GetTransfer · Trusted by millions of travellers worldwide
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <HowItWorksSection />

      {/* ── TRANSFER TYPES ── */}
      <TransferTypesSection />

      {/* ── POPULAR DESTINATIONS ── */}
      <DestinationsSection />

      {/* ── COMPARISON ── */}
      <ComparisonSection />

      {/* ── TIPS ── */}
      <TipsSection />

      {/* ── TESTIMONIALS ── */}
      <TestimonialsSection />

      {/* ── WHY GETTRANSFER ── */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Our partner</p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
              Why we partner with GetTransfer
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                emoji: '🌍',
                title: '100+ countries covered',
                body: 'GetTransfer operates at airports, ports, train stations and city locations across Europe, the Americas, Asia, the Middle East and Africa.',
              },
              {
                emoji: '💷',
                title: 'Fixed, transparent pricing',
                body: 'Every booking shows the full price upfront - no meters running, no surge pricing, no extras at the end of the journey. What you see is what you pay.',
              },
              {
                emoji: '✈️',
                title: 'Real-time flight tracking',
                body: 'Drivers monitor your flight automatically. If you land early or late, your driver adjusts accordingly - you never pay extra for a delay.',
              },
            ].map(({ emoji, title, body }) => (
              <div key={title} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-bold mb-2" style={{ color: '#232e4e' }}>{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
            <p>
              The first and last moments of any trip set the tone for everything that follows. A long queue for a taxi, a surge-priced rideshare or the stress of navigating an unfamiliar public transport system after a long-haul flight can take the shine off even the most eagerly anticipated holiday.
            </p>
            <p>
              GetTransfer removes all of that. You book your vehicle in advance, agree on a fixed price, and arrive at your destination to find a driver waiting with your name on a board - ready to take you directly where you need to go. It is a simple idea, executed extremely well across more than 100 countries.
            </p>
            <p>
              Timms Travel partners with GetTransfer because they consistently deliver on price, reliability and coverage. Whether you are collecting clients from Heathrow in a business class saloon, getting the family to their villa in Malaga or sharing a shuttle with fellow travellers into Barcelona - GetTransfer has the right vehicle for the job.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection />

      {/* ── CTA ── */}
      <CtaBanner />

      <Footer />
    </main>
  )
}
