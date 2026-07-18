// lib/airports.ts

import airports from '@/data/airports.json';
// ⬆️ Adjust this path to wherever your airports.json actually lives.
// e.g. if it's at data/airports.json in your project root, this is correct.

type Airport = {
  name: string;
  city: string;
  country: string;
  iata_code: string;
  _geoloc: { lat: number; lng: number };
  links_count: number;
  objectID: string;
};

export type CityHub = {
  slug: string;          // used in the URL, e.g. "london"
  city: string;
  country: string;
  airports: Airport[];   // all airports serving this city
  primaryIata: string;   // the busiest airport's code, e.g. "LHR"
};

// Turns "London" into "london", "New York" into "new-york" — safe for URLs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getCityHubs(): CityHub[] {
  // Step A: group every airport into a bucket by "city + country"
  const groups = new Map<string, Airport[]>();

  for (const airport of airports as Airport[]) {
    const key = `${airport.city}|${airport.country}`.toLowerCase();
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(airport);
  }

  // Step B: figure out which city NAMES appear in more than one country
  // (so we know when we need to add the country to the slug to avoid clashes)
  const cityNameCounts = new Map<string, number>();
  for (const key of groups.keys()) {
    const cityName = key.split('|')[0];
    cityNameCounts.set(cityName, (cityNameCounts.get(cityName) ?? 0) + 1);
  }

  // Step C: build one CityHub object per group
  const hubs: CityHub[] = [];

// First pass: for ambiguous city names, work out which one is the
  // "primary" (busiest) — that one gets the clean slug.
  const totalLinksByGroupKey = new Map<string, number>();
  for (const [key, list] of groups.entries()) {
    const total = list.reduce((sum, a) => sum + a.links_count, 0);
    totalLinksByGroupKey.set(key, total);
  }

  const primaryKeyForCityName = new Map<string, string>();
  for (const [key, total] of totalLinksByGroupKey.entries()) {
    const cityName = key.split('|')[0];
    const currentBestKey = primaryKeyForCityName.get(cityName);
    const currentBestTotal = currentBestKey ? totalLinksByGroupKey.get(currentBestKey)! : -1;
    if (total > currentBestTotal) {
      primaryKeyForCityName.set(cityName, key);
    }
  }

  for (const [groupKey, airportList] of groups.entries()) {
    const sorted = [...airportList].sort((a, b) => b.links_count - a.links_count);
    const first = sorted[0];

    const nameIsAmbiguous = (cityNameCounts.get(first.city.toLowerCase()) ?? 0) > 1;
    const isThePrimaryOne = primaryKeyForCityName.get(first.city.toLowerCase()) === groupKey;

    const slug = nameIsAmbiguous && !isThePrimaryOne
      ? `${slugify(first.city)}-${slugify(first.country)}`
      : slugify(first.city);

    hubs.push({
      slug,
      city: first.city,
      country: first.country,
      airports: sorted,
      primaryIata: first.iata_code,
    });
  }

  return hubs;
}

export function getCityHubBySlug(slug: string): CityHub | undefined {
  return getCityHubs().find((hub) => hub.slug === slug);
}

export function getCityHubByName(cityName: string): CityHub | undefined {
  const target = cityName.trim().toLowerCase();
  return getCityHubs().find((hub) => hub.city.trim().toLowerCase() === target);
}