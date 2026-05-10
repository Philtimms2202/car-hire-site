export type Category = {
  title: string
  slug: string
  description: string
  emoji: string
  metaTitle: string
  metaDescription: string
}

export const categories: Category[] = [
  {
    title: 'Aviation & Flight Science',
    slug: 'aviation-flight-science',
    description: 'Understand how aircraft work, how flights are operated and what happens behind the scenes every time you fly.',
    emoji: '✈️',
    metaTitle: 'Aviation & Flight Science Guides | Timms Travel',
    metaDescription: 'Explore our aviation and flight science guides. Learn how aircraft fly, how airlines operate and what to expect at every stage of your journey.',
  },
  {
    title: 'Travel Planning & Logistics',
    slug: 'travel-planning-logistics',
    description: 'Everything you need to plan a trip properly — from choosing destinations to building itineraries and managing bookings.',
    emoji: '🗺️',
    metaTitle: 'Travel Planning & Logistics Guides | Timms Travel',
    metaDescription: 'Plan your trip with confidence. Our travel planning guides cover itineraries, booking strategies, packing and everything in between.',
  },
  {
    title: 'Money, Visas & Essentials',
    slug: 'money-visas-essentials',
    description: 'Practical guidance on travel money, currency, visas, entry requirements and the admin that every traveller needs to get right.',
    emoji: '💳',
    metaTitle: 'Money, Visas & Travel Essentials Guides | Timms Travel',
    metaDescription: 'Get the admin right before you travel. Guides on visas, travel money, currency exchange, entry requirements and essential trip preparation.',
  },
  {
    title: 'Hotels & Accommodation',
    slug: 'hotels-accommodation',
    description: 'How to find, compare and book the right place to stay — from budget hostels and boutique hotels to serviced apartments and resorts.',
    emoji: '🏨',
    metaTitle: 'Hotels & Accommodation Guides | Timms Travel',
    metaDescription: 'Find the right place to stay every time. Our accommodation guides cover hotels, hostels, apartments and resorts across every budget.',
  },
  {
    title: 'Transport & Navigation',
    slug: 'transport-navigation',
    description: 'Getting around once you arrive — trains, buses, taxis, car hire, airport transfers and navigating unfamiliar cities with confidence.',
    emoji: '🚆',
    metaTitle: 'Transport & Navigation Guides | Timms Travel',
    metaDescription: 'Navigate any destination with ease. Guides on trains, buses, taxis, car hire, airport transfers and getting around abroad.',
  },
  {
    title: 'Travel Gear & Tech',
    slug: 'travel-gear-tech',
    description: 'The kit, gadgets and apps that make travel easier, lighter and more connected — from luggage and packing cubes to eSIMs and travel cameras.',
    emoji: '🎒',
    metaTitle: 'Travel Gear & Tech Guides | Timms Travel',
    metaDescription: 'Pack smarter and travel better. Guides on luggage, travel gadgets, packing essentials, eSIMs, apps and the tech worth taking on your trip.',
  },
  {
    title: 'Safety & Etiquette',
    slug: 'safety-etiquette',
    description: 'Stay safe and respectful wherever you go. Practical safety advice, cultural etiquette and how to handle the unexpected when you are abroad.',
    emoji: '🛡️',
    metaTitle: 'Travel Safety & Etiquette Guides | Timms Travel',
    metaDescription: 'Travel safely and respectfully. Our guides cover personal safety, travel insurance, cultural etiquette and what to do when things go wrong.',
  },
]