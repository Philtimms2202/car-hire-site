"use client";

import { useState, FormEvent } from "react";

export default function ThingsToDoClient({
  city,
  country,
  emoji,
}: {
  city: string;
  country: string;
  emoji?: string;
}) {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
        )}&partner_id=P7B7GRH&currency=GBP`
      : null;

  return (
    <>
      {/* HERO */}
      <section
        style={{ backgroundColor: "#232e4e" }}
        className="text-white py-20 px-6 text-center"
      >
        <div className="text-6xl mb-4">{emoji}</div>

        <h1 className="text-5xl font-bold mb-4">Things to do in {city}</h1>

        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover amazing experiences in {city}, {country}.
        </p>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto mt-10 flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder={`Search experiences in ${city}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-4 rounded-lg text-black text-lg border border-gray-300"
          />

          <button
            type="submit"
            className="w-full py-4 rounded-lg text-lg font-semibold transition"
            style={{ backgroundColor: "#2f797c", color: "white" }}
          >
            Search
          </button>
        </form>
      </section>

      {/* RESULTS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {widgetSrc ? (
            <>
              <h2
                className="text-3xl font-bold text-center mb-2"
                style={{ color: "#232e4e" }}
              >
                Results for “{searchTerm}”
              </h2>

              <iframe
                src={widgetSrc}
                width="100%"
                height="1200"
                style={{ border: "none" }}
                loading="lazy"
              />
            </>
          ) : (
            <p className="text-center text-gray-500">
              Try searching for “nightlife”, “food tours”, “museums”, etc.
            </p>
          )}
        </div>
      </section>
    </>
  );
}