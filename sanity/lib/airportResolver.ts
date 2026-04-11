import airports from "@/data/airports.json";

export function getAirportsForCity(cityName: string) {
  return airports.filter(
    (a) => a.city.toLowerCase() === cityName.toLowerCase()
  );
}

export function getPrimaryAirport(cityName: string) {
  const matches = getAirportsForCity(cityName);
  if (matches.length === 0) return null;

  return matches.sort((a, b) => b.links_count - a.links_count)[0];
}

export function getAlternateAirports(cityName: string) {
  const matches = getAirportsForCity(cityName);
  if (matches.length <= 1) return [];

  const primary = getPrimaryAirport(cityName);

  return matches
    .filter((a) => a.iata_code !== primary.iata_code)
    .map((a) => a.iata_code);
}