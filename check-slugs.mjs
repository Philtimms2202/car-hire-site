import fs from 'fs';
import path from 'path';

const AIRPORTS_PATH = path.resolve('data/airports.json');

if (!fs.existsSync(AIRPORTS_PATH)) {
  console.error(`Could not find airports.json at ${AIRPORTS_PATH}`);
  console.error('Run this script from your project root (car-hire-site), or edit AIRPORTS_PATH.');
  process.exit(1);
}

const airports = JSON.parse(fs.readFileSync(AIRPORTS_PATH, 'utf-8'));

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getCityHubs() {
  const groups = new Map();
  for (const airport of airports) {
    const key = `${airport.city}|${airport.country}`.toLowerCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(airport);
  }

  const cityNameCounts = new Map();
  for (const key of groups.keys()) {
    const cityName = key.split('|')[0];
    cityNameCounts.set(cityName, (cityNameCounts.get(cityName) ?? 0) + 1);
  }

  const totalLinksByGroupKey = new Map();
  for (const [key, list] of groups.entries()) {
    const total = list.reduce((sum, a) => sum + (a.links_count || 0), 0);
    totalLinksByGroupKey.set(key, total);
  }

  const primaryKeyForCityName = new Map();
  for (const [key, total] of totalLinksByGroupKey.entries()) {
    const cityName = key.split('|')[0];
    const currentBestKey = primaryKeyForCityName.get(cityName);
    const currentBestTotal = currentBestKey ? totalLinksByGroupKey.get(currentBestKey) : -1;
    if (total > currentBestTotal) {
      primaryKeyForCityName.set(cityName, key);
    }
  }

  const hubs = [];
  for (const [groupKey, airportList] of groups.entries()) {
    const sorted = [...airportList].sort((a, b) => (b.links_count || 0) - (a.links_count || 0));
    const first = sorted[0];

    const nameIsAmbiguous = (cityNameCounts.get(first.city.toLowerCase()) ?? 0) > 1;
    const isThePrimaryOne = primaryKeyForCityName.get(first.city.toLowerCase()) === groupKey;

    const slug = nameIsAmbiguous && !isThePrimaryOne
      ? `${slugify(first.city)}-${slugify(first.country)}`
      : slugify(first.city);

    hubs.push({ slug, city: first.city, country: first.country, primaryIata: first.iata_code });
  }

  return hubs;
}

const hubs = getCityHubs();
const validSlugs = new Set(hubs.map(h => h.slug));

const usedSlugs = {
  featuredDestinations: ['london', 'barcelona', 'new-york', 'paris', 'dubai', 'orlando'],
  shortHaul: ['amsterdam', 'paris', 'dublin', 'barcelona', 'lisbon', 'rome'],
  midHaul: ['dubai', 'new-york', 'marrakech', 'cairo', 'istanbul', 'tenerife'],
  longHaul: ['bangkok', 'singapore', 'los-angeles', 'tokyo', 'sydney', 'cape-town'],
  seasonal: [
    'amsterdam', 'rome', 'lisbon',
    'barcelona', 'malaga', 'antalya',
    'paris', 'prague', 'budapest',
    'dubai', 'tenerife', 'marrakech',
  ],
};

console.log(`Loaded ${hubs.length} city hubs from airports.json\n`);

let anyMissing = false;
for (const [section, slugs] of Object.entries(usedSlugs)) {
  console.log(`-- ${section} --`);
  for (const slug of slugs) {
    if (validSlugs.has(slug)) {
      console.log(`  OK: ${slug}`);
    } else {
      anyMissing = true;
      const guess = hubs.filter(h => h.slug.startsWith(slug) || slugify(h.city) === slug);
      const suggestion = guess.length
        ? ` -- did you mean: ${guess.map(g => g.slug).join(', ')}?`
        : ' -- no close match found in airports.json';
      console.log(`  MISSING: ${slug}${suggestion}`);
    }
  }
  console.log('');
}

if (!anyMissing) {
  console.log('All slugs match a valid city hub. Safe to use in links.');
} else {
  console.log('Fix the MISSING slugs above before wiring up the links.');
}
