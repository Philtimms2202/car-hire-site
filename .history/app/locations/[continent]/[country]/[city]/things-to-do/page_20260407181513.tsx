"use client";

import { useState, FormEvent } from "react";

interface ThingsToDoPageProps {
  params: {
    continent: string;
    country: string;
    city: string;
  };
}

export default function ThingsToDoPage({ params }: ThingsToDoPageProps) {
  const { city } = params;

  const [query, setQuery] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(query);
  };

  const widgetSrc =
    searchTerm.length > 0
      ? `https://widget.getyourguide.com/v2/search/${encodeURIComponent(
          city
        )}/?q=${encodeURIComponent(
          searchTerm
        )}&partner_id=YOUR_AFFILIATE_ID&currency=GBP`
      : null;

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Things to do in {city}</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
        <input
          type="text"
          placeholder={`Search experiences in ${city} (e.g. nightlife, tours, food)`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "1rem",
            fontSize: "1.1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            marginTop: "1rem",
            padding: "1rem",
            width: "100%",
            background: "#0070f3",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "1.1rem",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {widgetSrc && (
        <div style={{ marginTop: "2rem" }}>
          <iframe
            src={widgetSrc}
            width="100%"
            height="1200"
            style={{ border: "none" }}
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}