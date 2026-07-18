'use client';

import { useState, useRef, useEffect } from 'react';
import { buildWhitelabelUrl, daysFromToday } from '@/lib/flightWhitelabel';

type OriginOption = {
  city: string;
  iata: string;
};

export default function CityFlightSearchTo({
  destinationIATA,
  destinationCity,
  origins,
}: {
  destinationIATA: string;
  destinationCity: string;
  origins: OriginOption[];
}) {
  const [originIata, setOriginIata] = useState(origins[0]?.iata ?? '');
  const [roundTrip, setRoundTrip] = useState(true);
  const [depart, setDepart] = useState(daysFromToday(30));
  const [returnDate, setReturnDate] = useState(daysFromToday(37));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabin, setCabin] = useState('economy');
  const [travellerOpen, setTravellerOpen] = useState(false);
  const travellerRef = useRef<HTMLDivElement>(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (travellerRef.current && !travellerRef.current.contains(e.target as Node)) {
        setTravellerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const cabinLabels: Record<string, string> = { economy: 'Economy', business: 'Business' };
  const total = adults + children + infants;
  const travellerSummary = `${total} passenger${total !== 1 ? 's' : ''} · ${cabinLabels[cabin]}`;

  const handleSearch = () => {
    if (!originIata) return;
    const url = buildWhitelabelUrl({
      from: originIata,
      to: destinationIATA,
      depart,
      returnDate: roundTrip ? returnDate : undefined,
      adults,
      children,
      infants,
      cabin,
    });
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto text-left">
      <div className="flex gap-2 mb-5">
        {['Return', 'One way'].map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setRoundTrip(label === 'Return')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              (label === 'Return') === roundTrip
                ? 'bg-[#232e4e] text-white border-[#232e4e]'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">
            From
          </label>
          <select
            value={originIata}
            onChange={(e) => setOriginIata(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 font-semibold text-base focus:outline-none focus:border-gray-400"
          >
            {origins.map((o) => (
              <option key={o.iata} value={o.iata}>
                {o.city} ({o.iata})
              </option>
            ))}
          </select>
        </div>

        <div className="text-2xl text-gray-300 self-end pb-3 select-none hidden sm:block">⇄</div>

        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">
            To
          </label>
          <div className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 font-semibold text-base">
            {destinationCity}
            <span className="ml-2 text-sm font-mono text-gray-400">{destinationIATA}</span>
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">
            Depart
          </label>
          <input
            type="date"
            value={depart}
            min={today}
            onChange={(e) => setDepart(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:border-gray-400"
          />
        </div>

        {roundTrip && (
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">
              Return
            </label>
            <input
              type="date"
              value={returnDate}
              min={depart || today}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:border-gray-400"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        <div className="relative flex-1" ref={travellerRef}>
          <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">
            Passengers
          </label>
          <button
            type="button"
            onClick={() => setTravellerOpen(!travellerOpen)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 font-medium text-left flex justify-between items-center hover:border-gray-300 transition"
          >
            <span>{travellerSummary}</span>
            <span className="text-gray-400 text-xs">{travellerOpen ? '▲' : '▼'}</span>
          </button>

          {travellerOpen && (
            <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl p-5 z-50 w-72">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cabin</p>
              <div className="flex gap-2 mb-4">
                {['economy', 'business'].map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setCabin(cls)}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-semibold border transition ${
                      cabin === cls
                        ? 'bg-[#232e4e] text-white border-[#232e4e]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {cls.charAt(0).toUpperCase() + cls.slice(1)}
                  </button>
                ))}
              </div>

              {[
                { label: 'Adults', sub: '16+', val: adults, set: setAdults, min: 1 },
                { label: 'Children', sub: '2–15', val: children, set: setChildren, min: 0 },
                { label: 'Infants', sub: 'Under 2', val: infants, set: setInfants, min: 0 },
              ].map((p) => (
                <div key={p.label} className="flex justify-between items-center py-2 border-t border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{p.label}</p>
                    <p className="text-xs text-gray-400">{p.sub}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => p.set(Math.max(p.min, p.val - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 font-bold hover:border-gray-500 transition flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-4 text-center font-semibold text-gray-800">{p.val}</span>
                    <button
                      type="button"
                      onClick={() => p.set(p.val + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 font-bold hover:border-gray-500 transition flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setTravellerOpen(false)}
                className="w-full mt-4 py-2 rounded-xl text-white font-semibold text-sm"
                style={{ backgroundColor: '#232e4e' }}
              >
                Done
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSearch}
            className="px-8 py-3 rounded-xl text-white font-bold text-lg transition hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: '#03989e' }}
          >
            Search Flights →
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        · Prices updated in real time · No hidden fees · Powered by Timms Travel
      </p>
    </div>
  );
}