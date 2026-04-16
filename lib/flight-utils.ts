// lib/flight-utils.ts
import airports from '@/data/airports.json';

export type Airport = {
  name: string;
  city: string;
  country: string;
  iata_code: string;
  _geoloc: {
    lat: number;
    lng: number;
  };
};

// Build a fast lookup table once
const airportsByIata: Record<string, Airport> = Object.fromEntries(
  (airports as Airport[]).map((a) => [a.iata_code.toUpperCase(), a])
);

export function getAirport(iata: string): Airport | null {
  return airportsByIata[iata.toUpperCase()] ?? null;
}

// -----------------------------
// Distance (Haversine)
// -----------------------------
const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineDistanceKm(a: Airport, b: Airport): number {
  const lat1 = toRad(a._geoloc.lat);
  const lat2 = toRad(b._geoloc.lat);
  const dLat = lat2 - lat1;
  const dLng = toRad(b._geoloc.lng - a._geoloc.lng);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

// -----------------------------
// Deterministic Flight Time
// -----------------------------
function overheadHours(distanceKm: number): number {
  if (distanceKm < 1500) return 0.5;
  if (distanceKm < 3500) return 0.75;
  return 1.0;
}

export function deterministicFlightTimeHours(distanceKm: number): number {
  const cruiseSpeedKmH = 850;
  return distanceKm / cruiseSpeedKmH + overheadHours(distanceKm);
}

// -----------------------------
// Formatting Helpers
// -----------------------------
export function roundToNearest5Minutes(hours: number) {
  const totalMinutes = Math.round((hours * 60) / 5) * 5;
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
}

export function formatFlightDuration(hours: number): string {
  const { hours: h, minutes: m } = roundToNearest5Minutes(hours);
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

// -----------------------------
// High-Level Route Helper
// -----------------------------
export function getRouteFlightInfo(originIata: string, destIata: string) {
  const origin = getAirport(originIata);
  const destination = getAirport(destIata);

  if (!origin || !destination) return null;

  const distanceKm = haversineDistanceKm(origin, destination);
  const timeHours = deterministicFlightTimeHours(distanceKm);

  return {
    origin,
    destination,
    distanceKm,
    timeHours,
    durationLabel: formatFlightDuration(timeHours),
  };
}