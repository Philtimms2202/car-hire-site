"use client";

import { useState, FormEvent } from "react";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/Footer";
import Script from "next/script";
import { client } from "../../../../../../sanity/lib/client";
import { PortableText } from "@portabletext/react";

interface ThingsToDoPageProps {
  params: {
    continent: string;
    country: string;
    city: string;
  };
}

async function getCityData(
  continentSlug: string,
  countrySlug: string,
  citySlug: string
) {
  try {
    return await client.fetch(
      `*[_type == "location" 
        && continentSlug.current == $continentSlug 
        && countrySlug.current == $countrySlug
        && slug.current == $citySlug][0]{
          city,
          country,
          emoji,
          countryEmoji,
          description,
          mainContent,
          "citySlug": slug.current,
          "countrySlug": countrySlug.current,
          "continentSlug": continentSlug.current
      }`,
      { continentSlug, countrySlug, citySlug }
    );
  } catch {
    return null;
  }
}

export default function ThingsToDoPage({ params }: ThingsToDoPageProps) {
  const { continent, country, city } = params;

  const [query, setQuery] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const formattedCity = city
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const [cityData, setCityData] = useState<any>(null);

  // Fetch Sanity data on mount
  useState(() => {
    getCityData(continent, country, city).then((data) => {
      setCityData(data);
    });
  });

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
        <div className="text-6xl mb-4">{cityData?.emoji}</div>

        <h1 className="text-5xl font-bold mb-4">
          Things to do in {cityData?.city || formattedCity}
        </h1>

        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover amazing experiences in{" "}
          {cityData?.city || formattedCity}, {cityData?.country || country}.
        </p>

        {/* Search Box */}
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto mt-10 flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder={`Search experiences in ${
              cityData?.city || formattedCity
            } (e.g. nightlife, food tours, museums)`}
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
                Results for “{searchTerm}” in {cityData?.city || formattedCity}
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

      {/* OPTIONAL: ABOUT SECTION */}
      {cityData?.mainContent && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: "#03989e" }}
            >
              About {cityData.city}
            </h2>

            <div className="prose max-w-none mt-8">
              <PortableText value={cityData.mainContent} />
            </div>
          </div>
        </section>
      )}

      {/* BREADCRUMBS */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto flex gap-4 text-sm">
          <a
            href="/locations"
            style={{ color: "#2f797c" }}
            className="hover:opacity-75 transition"
          >
            All Continents
          </a>
          <span className="text-gray-400">→</span>

          <a
            href={`/locations/${continent}`}
            style={{ color: "#2f797c" }}
            className="hover:opacity-75 transition capitalize"
          >
            {continent}
          </a>
          <span className="text-gray-400">→</span>

          <a
            href={`/locations/${continent}/${country}`}
            style={{ color: "#2f797c" }}
            className="hover:opacity-75 transition capitalize"
          >
            {country}
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}