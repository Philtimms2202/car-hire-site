"use client";

import { useState, FormEvent } from "react";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/Footer";
import Script from "next/script";

interface ThingsToDoPageProps {
  params: {
    continent: string;
    country: string;
    city: string;
  };
}

export default function ThingsToDoPage({ params }: ThingsToDoPageProps) {
  const { continent, country, city } = params;

  const formattedCity = city
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const [query, setQuery] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(query);
  };

  const widgetSrc =
    searchTerm.length > 0
      ? `https://widget.getyourguide.com/v2/search/${encodeURIComponent(
          formattedCity
        )}/?q=${encodeURIComponent(
          searchTerm
        )}&partner_id=P7B7GRH&currency=GBP`
      : null;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* GYG Script */}
      <Script
        src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
        data-gyg-partner-id="P7B7GRH"
        strategy="afterInteractive"
      />

      {/* HERO */}
      <section
        style={{ backgroundColor: "#232e4e" }}
        className="text-white py-20 px-6 text-center"
      >
        <h1 className="text-5xl font-bold mb-4">
          Things to do in {formattedCity}
        </h1>

        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Search the best tours, attractions and experiences in {formattedCity}.
        </p>

        {/* Search Box */}
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto mt-10 flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder={`Search experiences in ${formattedCity} (e.g. nightlife, food tours, museums)`}
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

      {/* RESULTS SECTION */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {widgetSrc ? (
            <>
              <h2
                className="text-3xl font-bold text-center mb-2"
                style={{ color: "#232e4e" }}
              >
                Results for “{searchTerm}” in {formattedCity}
              </h2>

              <p className="text-center text-gray-500 mb-10">
                Powered by GetYourGuide
              </p>

              <iframe
                src={widgetSrc}
                width="100%"
                height="1200"
                style={{ border: "none" }}
                loading="lazy"
              />
            </>
          ) : (
            <>
              <h2
                className="text-3xl font-bold text-center mb-2"
                style={{ color: "#232e4e" }}
              >
                Start Searching
              </h2>
              <p className="text-center text-gray-500">
                Try searching for “nightlife”, “food tours”, “museums”, “boat
                trips”, or anything you want to explore.
              </p>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}