'use client';

import { useState } from 'react';
import CityFlightSearchTo from './CityFlightSearchTo';

type Airport = {
  name: string;
  iata_code: string;
};

type OriginOption = {
  city: string;
  iata: string;
};

export default function CityFlightsInteractiveTo({
  city,
  airports,
  origins,
}: {
  city: string;
  airports: Airport[];
  origins: OriginOption[];
}) {
  const [selectedIata, setSelectedIata] = useState(airports[0]?.iata_code ?? '');

  const airportNames = airports.map((a) => `${a.name} (${a.iata_code})`).join(', ');

  return (
    <>
      {/* ── HERO + SEARCH ── */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-20 px-6 text-center">
        <p className="text-sm uppercase tracking-widest mb-3 font-semibold" style={{ color: '#03989e' }}>
          Timms Travel · Flights
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
          Find Flights to {city}
        </h1>
        <p className="text-gray-300 mb-10 max-w-xl mx-auto">
          Compare fares from destinations worldwide into {airportNames}. No hidden fees, ever.
        </p>

        {origins.length > 0 && selectedIata && (
          <CityFlightSearchTo
            destinationIATA={selectedIata}
            destinationCity={city}
            origins={origins}
          />
        )}
      </section>

      {/* ── AIRPORTS SERVING CITY ── */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Airports serving {city}
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
            {airports.length > 1
              ? `${city} is served by ${airports.length} airports. Select one below to search flights landing at that airport.`
              : `${city} is served by one main airport.`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {airports.map((airport) => {
              const isActive = airport.iata_code === selectedIata;
              return (
                <button
                  key={airport.iata_code}
                  type="button"
                  onClick={() => setSelectedIata(airport.iata_code)}
                  className="rounded-2xl p-5 shadow-sm border text-center transition-all"
                  style={
                    isActive
                      ? { backgroundColor: '#232e4e', borderColor: '#232e4e', color: '#fff' }
                      : { backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#1f2937' }
                  }
                >
                  <div className="text-3xl mb-2">✈️</div>
                  <p
                    className="font-mono text-xs mb-1"
                    style={{ color: isActive ? '#7dd3d6' : '#9ca3af' }}
                  >
                    {airport.iata_code}
                  </p>
                  <p className="font-semibold text-sm">{airport.name}</p>
                  {isActive && (
                    <p className="text-xs mt-2 font-semibold" style={{ color: '#7dd3d6' }}>
                      Selected — search box updated ↑
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}