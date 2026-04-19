'use client'

import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import NextImage from 'next/image'

// ---------------------------------------------
// AFFILIATE LINK
// ---------------------------------------------
const EKTA_AFFILIATE_URL = 'https://ektatraveling.tpm.li/X7ysDlQq'

// ---------------------------------------------
// TYPES
// ---------------------------------------------
type FaqItem = {
  q: string
  a: string
}

type CoverageItem = {
  title: string
  description: string
  emoji: string
  included: boolean
}

type PolicyTier = {
  name: string
  emoji: string
  color: string
  bg: string
  tagline: string
  bestFor: string
  includes: string[]
  note?: string
}

type Scenario = {
  title: string
  emoji: string
  situation: string
  withInsurance: string
  withoutInsurance: string
  cost: string
}

type Testimonial = {
  name: string
  location: string
  quote: string
  initials: string
  color: string
}

// ---------------------------------------------
// POLICY TIERS
// ---------------------------------------------
const POLICY_TIERS: PolicyTier[] = [
  {
    name: 'Single Trip',
    emoji: '🎒',
    color: '#03989e',
    bg: '#03989e15',
    tagline: 'Cover for one trip or holiday.',
    bestFor: 'Annual holiday, city break, one-off adventure',
    includes: [
      'Medical expenses up to £10m',
      'Cancellation cover up to £5,000',
      'Baggage and personal effects up to £2,000',
      'Personal liability cover',
      'Flight delay compensation',
      'Missed departure cover',
      '24/7 emergency assistance helpline',
    ],
  },
  {
    name: 'Annual Multi-Trip',
    emoji: '🌍',
    color: '#232e4e',
    bg: '#232e4e15',
    tagline: 'Better value when you travel two or more times a year.',
    bestFor: 'Frequent flyers, business travel, multiple holidays per year',
    note: 'Most popular for regular travellers',
    includes: [
      'Unlimited trips per year (up to 31 days each)',
      'Medical expenses up to £10m per trip',
      'Cancellation cover up to £5,000 per trip',
      'Baggage cover up to £2,000 per trip',
      'Winter sports add-on available',
      'Business travel cover available',
      '24/7 emergency assistance helpline',
    ],
  },
  {
    name: 'Family Cover',
    emoji: '👨‍👩‍👧‍👦',
    color: '#5a7a52',
    bg: '#5a7a5215',
    tagline: 'One policy to cover the whole family.',
    bestFor: 'Families with children, group holidays, multigenerational travel',
    includes: [
      'Up to 2 adults and 4 dependent children',
      'Children under 18 covered free',
      'Medical expenses up to £10m per person',
      'Cancellation cover for the whole group',
      'Baggage cover per person',
      'Personal liability per person',
      '24/7 emergency assistance helpline',
    ],
  },
  {
    name: 'Backpacker',
    emoji: '🧭',
    color: '#b8860b',
    bg: '#b8860b15',
    tagline: 'Long-stay cover for extended trips abroad.',
    bestFor: 'Gap years, round-the-world trips, extended travel over 31 days',
    includes: [
      'Cover for trips up to 12–18 months',
      'Medical expenses up to £10m',
      'Cancellation and curtailment cover',
      'Baggage and personal effects cover',
      'Adventure sports cover often included',
      'Multiple destination support',
      '24/7 emergency assistance helpline',
    ],
  },
]

// ---------------------------------------------
// WHAT'S COVERED
// ---------------------------------------------
const COVERAGE_ITEMS: CoverageItem[] = [
  {
    title: 'Medical emergencies',
    description: 'Hospital treatment, surgery, repatriation and emergency dental care abroad. This is the most important cover to have — a serious illness or accident abroad can cost hundreds of thousands of pounds without it.',
    emoji: '🏥',
    included: true,
  },
  {
    title: 'Trip cancellation',
    description: 'If you have to cancel your trip before departure due to illness, bereavement, redundancy or other covered reasons, you can claim back your pre-paid costs including flights and accommodation.',
    emoji: '✈️',
    included: true,
  },
  {
    title: 'Baggage and personal effects',
    description: 'Cover for lost, stolen or damaged luggage and personal belongings. Limits apply per item, so check the policy if you are travelling with expensive electronics or jewellery.',
    emoji: '🧳',
    included: true,
  },
  {
    title: 'Flight delays and missed departures',
    description: 'Compensation if your departure is significantly delayed, or cover if you miss your flight due to a covered reason such as a public transport failure on the way to the airport.',
    emoji: '⏳',
    included: true,
  },
  {
    title: 'Personal liability',
    description: 'Covers you if you accidentally injure someone or damage their property while abroad and face a legal claim as a result. Essential for activities and sports.',
    emoji: '⚖️',
    included: true,
  },
  {
    title: 'Curtailment',
    description: 'If you have to cut your trip short and return home early due to a covered emergency, curtailment cover reimburses your unused pre-paid costs.',
    emoji: '🔄',
    included: true,
  },
  {
    title: 'Pre-existing conditions',
    description: 'Standard policies may not cover pre-existing medical conditions unless declared at the time of purchase. Always disclose conditions — cover can usually be added, often for a small additional premium.',
    emoji: '❤️‍🩹',
    included: false,
  },
  {
    title: 'Adventure sports',
    description: 'Skiing, snowboarding, scuba diving and other adventure activities are often excluded from standard policies. A specialist add-on or adventure sports extension is usually available.',
    emoji: '🎿',
    included: false,
  },
]

// ---------------------------------------------
// REAL WORLD SCENARIOS
// ---------------------------------------------
const SCENARIOS: Scenario[] = [
  {
    title: 'Broken leg in the USA',
    emoji: '🦴',
    situation: 'You fall on the first day of your New York trip and break your leg. You need an ambulance, surgery and three nights in hospital.',
    withInsurance: 'Your insurer arranges and covers everything. You pay your excess (typically £50–£200) and fly home when medically fit.',
    withoutInsurance: 'A broken leg, surgery and hospital stay in the USA typically costs £50,000–£150,000. You are responsible for the full bill.',
    cost: 'Up to £150,000',
  },
  {
    title: 'Cancelled flight, missed holiday',
    emoji: '🚫',
    situation: 'Your outbound flight is cancelled due to an airline strike and you cannot travel. Your hotel is non-refundable.',
    withInsurance: 'Cancellation cover reimburses your non-refundable hotel, transfers and any other pre-paid costs up to your policy limit.',
    withoutInsurance: 'You lose everything you paid in advance — often £500–£3,000 depending on the trip.',
    cost: 'Up to £3,000+',
  },
  {
    title: 'Lost luggage in Dubai',
    emoji: '🧳',
    situation: 'The airline loses your checked bag on the outbound flight. It is not recovered for the duration of your trip.',
    withInsurance: 'Your policy covers the value of lost belongings up to your baggage limit, and often provides a temporary clothing allowance for the first 24–48 hours.',
    withoutInsurance: 'You replace everything at your own cost — plus buy essentials while you wait. Typical loss: £500–£2,000.',
    cost: 'Up to £2,000',
  },
  {
    title: 'Emergency evacuation in Southeast Asia',
    emoji: '🚁',
    situation: 'You fall seriously ill in a remote area of Thailand and need an air ambulance to Bangkok and then repatriation back to the UK.',
    withInsurance: 'Your insurer coordinates and pays for the entire evacuation and repatriation. A 24/7 helpline manages everything so your family does not have to.',
    withoutInsurance: 'Air ambulance repatriation from Southeast Asia can cost £30,000–£80,000. Without insurance, you or your family must find the funds urgently.',
    cost: 'Up to £80,000',
  },
]

// ---------------------------------------------
// TESTIMONIALS
// ---------------------------------------------
const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Rachel B.',
    location: 'Leeds, UK',
    quote: 'My flight was cancelled the morning I was supposed to fly to Lisbon. My travel insurance covered the full cost of my hotel and transfers. Sorted within a week.',
    initials: 'RB',
    color: '#03989e',
  },
  {
    name: 'Mark S.',
    location: 'Glasgow, UK',
    quote: 'Ended up in hospital in Florida with appendicitis. Without insurance I\'d have been looking at over £60,000. The insurer handled absolutely everything.',
    initials: 'MS',
    color: '#232e4e',
  },
  {
    name: 'Amina L.',
    location: 'Bristol, UK',
    quote: 'I had always skipped insurance to save money. After losing £1,400 worth of luggage with no cover, I will never travel without it again.',
    initials: 'AL',
    color: '#b8860b',
  },
]

// ---------------------------------------------
// FAQS
// ---------------------------------------------
const FAQS: FaqItem[] = [
  {
    q: 'When should I buy travel insurance?',
    a: 'As soon as you book your trip — not the day before you fly. Buying early means you are covered if you have to cancel before departure due to illness, bereavement or other covered events. Buying late only covers you from that point onwards.',
  },
  {
    q: 'Does travel insurance cover pre-existing medical conditions?',
    a: 'Standard policies may exclude pre-existing conditions unless you declare them at the time of purchase. Always disclose any conditions — cover can usually be added, often for a small additional premium. Failure to disclose can invalidate your entire policy.',
  },
  {
    q: 'Is travel insurance a legal requirement?',
    a: 'No — travel insurance is not legally required for most destinations. However, some countries and activities do require proof of insurance (certain Schengen visa applications, for example). More importantly, without it you could face life-changing costs if something goes wrong abroad.',
  },
  {
    q: 'Does my bank account or credit card include travel insurance?',
    a: 'Some premium bank accounts and credit cards include travel insurance as a perk, but the cover is often limited — low medical limits, short trip durations, or exclusions for certain destinations and activities. Always read the policy terms and check it meets your actual needs before relying on it.',
  },
  {
    q: 'What is an excess on a travel insurance policy?',
    a: 'An excess is the amount you contribute towards any claim before your insurer pays out. For example, if you have a £100 excess and make a £500 claim, you receive £400. Higher excess policies usually have lower premiums — worth considering if you are healthy and mainly want catastrophic cover.',
  },
  {
    q: 'Does travel insurance cover adventure sports?',
    a: 'Standard policies typically exclude activities like skiing, snowboarding, scuba diving, bungee jumping and other adventure sports. If you are planning any activities beyond gentle walking or swimming, check your policy carefully and add a sports or adventure extension if needed.',
  },
  {
    q: 'Can I get travel insurance if I have already departed?',
    a: 'Most standard travel insurance policies must be purchased before you leave home. Some specialist providers offer policies for travellers who are already abroad, but cover may be limited and premiums higher. It is always better to sort insurance before you leave.',
  },
  {
    q: 'What is the difference between single trip and annual multi-trip insurance?',
    a: 'Single trip insurance covers one specific trip from your departure date to your return. Annual multi-trip insurance covers unlimited trips (usually up to 31 days each) within a 12-month period. If you travel twice or more a year, annual cover almost always works out better value.',
  },
  {
    q: 'Does travel insurance cover Covid-19?',
    a: 'Many travel insurance policies now include some Covid-19 cover — typically for medical costs if you catch Covid abroad, and sometimes cancellation if you test positive before departure. Cover varies significantly between providers, so check the specific policy terms carefully.',
  },
  {
    q: 'What should I do if I need to make a claim?',
    a: 'Contact your insurer\'s 24/7 emergency helpline as soon as possible — do not wait until you return home if it is a medical emergency. Keep all documentation: medical reports, police reports for theft, receipts and airline correspondence. Most insurers now accept claims online or via an app.',
  },
]

// ---------------------------------------------
// POLICY TIER SELECTOR
// ---------------------------------------------
function PolicyTierSection() {
  const [active, setActive] = useState(0)
  const tier = POLICY_TIERS[active]

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Policy types</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            Which cover is right for you?
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            The right policy depends on how often you travel, who's coming and how long you're going for.
          </p>
        </div>

        {/* Tier tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {POLICY_TIERS.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActive(i)}
              className="relative px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border"
              style={
                i === active
                  ? { backgroundColor: t.color, color: '#fff', borderColor: t.color }
                  : { backgroundColor: `${t.color}10`, color: t.color, borderColor: `${t.color}30` }
              }
            >
              {t.emoji} {t.name}
              {t.note && i !== active && (
                <span
                  className="absolute -top-2 -right-2 text-xs font-bold px-1.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: '#03989e', fontSize: '9px' }}
                >
                  Popular
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{tier.emoji}</span>
            <span
              className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ backgroundColor: tier.bg, color: tier.color }}
            >
              {tier.name}
            </span>
            {tier.note && (
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: '#03989e' }}
              >
                {tier.note}
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold mb-4" style={{ color: '#232e4e' }}>
            {tier.tagline}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl px-5 py-4 border border-gray-100" style={{ backgroundColor: tier.bg }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: tier.color }}>
                Best for
              </p>
              <p className="text-sm font-medium text-slate-700">{tier.bestFor}</p>
            </div>
            <div className="rounded-2xl px-5 py-4 border border-gray-100" style={{ backgroundColor: tier.bg }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: tier.color }}>
                What's included
              </p>
              <ul className="space-y-1.5">
                {tier.includes.map(item => (
                  <li key={item} className="text-sm font-medium text-slate-700 flex items-start gap-2">
                    <svg
                      className="w-3.5 h-3.5 mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: tier.color }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a
            href={EKTA_AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
            style={{ backgroundColor: tier.color }}
          >
            Get a {tier.name} quote →
          </a>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// WHAT'S COVERED SECTION
// ---------------------------------------------
function WhatsCoveredSection() {
  const [showAll, setShowAll] = useState(false)
  const standard = COVERAGE_ITEMS.filter(i => i.included)
  const addons = COVERAGE_ITEMS.filter(i => !i.included)

  return (
    <section className="py-16 px-6 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Coverage breakdown</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            What travel insurance covers
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            Understanding exactly what is and isn't covered helps you choose the right policy — and avoid nasty surprises when you need to claim.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#03989e15', color: '#03989e' }}
            >
              Typically included
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {standard.map(({ title, description, emoji }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-5"
              >
                <span className="text-2xl shrink-0">{emoji}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-sm" style={{ color: '#232e4e' }}>{title}</p>
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#03989e">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
            >
              Often excluded — check your policy
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addons.map(({ title, description, emoji }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-2xl border border-red-100 bg-red-50/40 px-5 py-5"
              >
                <span className="text-2xl shrink-0">{emoji}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-sm" style={{ color: '#232e4e' }}>{title}</p>
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#dc2626">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// REAL WORLD SCENARIOS
// ---------------------------------------------
function ScenariosSection() {
  const [active, setActive] = useState(0)
  const scenario = SCENARIOS[active]

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Real world</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            What happens when things go wrong
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            The real cost of travelling uninsured — and why cover is worth every penny.
          </p>
        </div>

        {/* Scenario tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {SCENARIOS.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setActive(i)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all border"
              style={
                i === active
                  ? { backgroundColor: '#232e4e', color: '#fff', borderColor: '#232e4e' }
                  : { backgroundColor: '#fff', color: '#232e4e', borderColor: '#e5e7eb' }
              }
            >
              {s.emoji} {s.title}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 md:p-10 shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-4xl shrink-0">{scenario.emoji}</span>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#232e4e' }}>
                {scenario.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-1">{scenario.situation}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl px-5 py-5 border" style={{ backgroundColor: '#03989e10', borderColor: '#03989e30' }}>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#03989e">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#03989e' }}>
                  With insurance
                </p>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{scenario.withInsurance}</p>
            </div>
            <div className="rounded-2xl px-5 py-5 border border-red-100 bg-red-50/40">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#dc2626">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p className="text-xs font-bold uppercase tracking-widest text-red-500">
                  Without insurance
                </p>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{scenario.withoutInsurance}</p>
            </div>
          </div>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-6"
            style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
          >
            ⚠️ Potential uninsured cost: {scenario.cost}
          </div>

          <div>
            <a
              href={EKTA_AFFILIATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
              style={{ backgroundColor: '#232e4e' }}
            >
              Get covered before you fly →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// TIPS SECTION
// ---------------------------------------------
const TIPS = [
  {
    emoji: '📅',
    title: 'Buy as soon as you book',
    body: 'The moment you pay for flights or accommodation, buy your insurance. Cancellation cover only applies from the purchase date — not from when your trip starts.',
  },
  {
    emoji: '📋',
    title: 'Always declare pre-existing conditions',
    body: 'Failure to disclose a medical condition can invalidate your entire policy — not just the medical claim. Declare everything and pay the extra premium if needed. It is worth it.',
  },
  {
    emoji: '📞',
    title: 'Call before you pay medical bills',
    body: 'In a medical emergency, call your insurer\'s 24/7 helpline before authorising treatment if at all possible. They can liaise directly with hospitals and ensure you receive the right level of care.',
  },
  {
    emoji: '📸',
    title: 'Document everything',
    body: 'Photograph your luggage before you check it in. Keep receipts for everything. Get a police report for any theft within 24 hours. Evidence makes claims faster and smoother.',
  },
  {
    emoji: '🧾',
    title: 'Read the excess before you buy',
    body: 'The excess is the amount you pay towards any claim. A low-premium policy often has a high excess. For smaller losses, this can mean a claim isn\'t worth making.',
  },
  {
    emoji: '🎿',
    title: 'Check activity exclusions',
    body: 'If you\'re skiing, diving, cycling or doing anything more adventurous than sightseeing, double-check your policy covers it. Add a sports extension if needed — it is usually inexpensive.',
  },
]

function TipsSection() {
  return (
    <section className="py-16 px-6 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Travel smarter</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            Six things every traveller should know about insurance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIPS.map(({ emoji, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-6"
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
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Traveller stories</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            Why cover matters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, location, quote, initials, color }) => (
            <div
              key={name}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col"
            >
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
    <section className="py-16 px-6 bg-white border-t border-gray-100">
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
              className="group border border-gray-100 rounded-2xl bg-gray-50 px-5 py-4 cursor-pointer"
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
        <span className="text-4xl mb-4 block">🛡️</span>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Don't travel without cover
        </h2>
        <p className="text-gray-300 text-sm md:text-base mb-8 max-w-xl mx-auto">
          A single medical emergency abroad can cost more than your entire trip — many times over. Get a quote in minutes and travel with genuine peace of mind.
        </p>
        <a
          href={EKTA_AFFILIATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
          style={{ backgroundColor: '#03989e', color: '#fff' }}
        >
          Get Your Travel Insurance Quote →
        </a>
        <p className="text-gray-500 text-xs mt-4">
          Powered by Ekta · Instant quotes · Single trip, annual and family policies
        </p>
      </div>
    </section>
  )
}

// ---------------------------------------------
// PAGE
// ---------------------------------------------
export default function TravelInsurancePageClient() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden text-white py-24 px-6 text-center">
        <NextImage
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1740"
          alt="Traveller with luggage at airport"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[#232e4e]/82 z-0" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
            Timms Travel · Travel Insurance
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Travel with genuine peace of mind
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            One medical emergency abroad can cost more than your entire holiday. Get comprehensive travel insurance from Ekta — quotes in minutes, cover that actually works.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { emoji: '🏥', label: 'Medical cover up to £10m' },
              { emoji: '✈️', label: 'Cancellation protection' },
              { emoji: '🧳', label: 'Baggage cover' },
              { emoji: '📞', label: '24/7 emergency helpline' },
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
            href={EKTA_AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
            style={{ backgroundColor: '#03989e', color: '#fff' }}
          >
            Get Your Free Quote →
          </a>
          <p className="text-gray-400 text-xs mt-3">Powered by Ekta · No obligation · Takes less than 2 minutes</p>
        </div>
      </section>

      {/* ── POLICY TIERS ── */}
      <PolicyTierSection />

      {/* ── WHAT'S COVERED ── */}
      <WhatsCoveredSection />

      {/* ── REAL WORLD SCENARIOS ── */}
      <ScenariosSection />

      {/* ── TIPS ── */}
      <TipsSection />

      {/* ── TESTIMONIALS ── */}
      <TestimonialsSection />

      {/* ── WHY EKTA ── */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Our partner</p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
              Why we partner with Ekta
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                emoji: '⚡',
                title: 'Quotes in minutes',
                body: 'No lengthy forms, no phone calls. Get a comprehensive travel insurance quote in under two minutes and purchase instantly online.',
              },
              {
                emoji: '🛡️',
                title: 'Comprehensive cover',
                body: 'Ekta policies cover the things that matter most — medical emergencies, cancellations, baggage and more — with clear, plain-English terms.',
              },
              {
                emoji: '📞',
                title: '24/7 emergency support',
                body: 'If something goes wrong while you are abroad, Ekta\'s emergency helpline is available around the clock to help coordinate care and guide you through the claims process.',
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
              Travel insurance is one of those things that feels optional until you actually need it — and then it feels indispensable. Timms Travel partners with Ekta because they make the process of getting properly covered as fast and friction-free as possible.
            </p>
            <p>
              Whether you are after a straightforward single trip policy for a summer holiday in Spain, an annual multi-trip plan that covers every trip you take this year, or specialist cover for a longer backpacking adventure, Ekta has a policy that fits. Quotes are instant, terms are clear and the cover is comprehensive.
            </p>
            <p>
              Our advice is simple: sort your insurance the same day you book your flights. It costs very little, and the peace of mind it provides is worth far more than the premium.
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