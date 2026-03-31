"use client";

import { useState } from "react";
import { locationHierarchy } from "@/data/locationHierarchy";

export default function LocationDropdown() {
  const [continent, setContinent] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const continents = Object.keys(locationHierarchy);
  const countries = continent ? Object.keys(locationHierarchy[continent]) : [];
  const cities =
    continent && country ? locationHierarchy[continent][country] : [];

  return (
    <div className="flex flex-col gap-4">
      {/* CONTINENT */}
      <select
        value={continent}
        onChange={(e) => {
          setContinent(e.target.value);
          setCountry("");
          setCity("");
        }}
        className="border p-2 rounded"
      >
        <option value="">Select Continent</option>
        {continents.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* COUNTRY */}
      <select
        value={country}
        onChange={(e) => {
          setCountry(e.target.value);
          setCity("");
        }}
        disabled={!continent}
        className="border p-2 rounded"
      >
        <option value="">Select Country</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* CITY */}
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={!country}
        className="border p-2 rounded"
      >
        <option value="">Select City</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}