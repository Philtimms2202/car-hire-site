'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client'; // adjust to your sanity client path

type City = {
  name: string;
  slug: string;
};

const CITIES_QUERY = `*[_type == "city"] | order(name asc) {
  name,
  "slug": slug.current
}`;

export default function PopularDestinationsDropdown() {
  const [cities, setCities] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    client.fetch<City[]>(CITIES_QUERY).then(setCities);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border-2 transition-all hover:shadow-md"
        style={{ borderColor: '#232e4e', color: '#232e4e', backgroundColor: 'white' }}
      >
        View Popular Destinations
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 w-56 rounded-xl shadow-lg bg-white border border-gray-100 py-1 overflow-hidden">
          {cities.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">Loading…</p>
          ) : (
            cities.map(city => (
              <Link
                key={city.slug}
                href={`/hotels/${city.slug}`}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#03989e] transition-colors"
              >
                {city.name}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}