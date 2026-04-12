"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

const GYG_PARTNER_ID = "P7B7GRH";
const GYG_BASE_URL = `https://www.getyourguide.com`;

const categories = [
  { label: "All", value: "all" },
  { label: "Tours & Sightseeing", value: "tours" },
  { label: "Food & Drink", value: "food" },
  { label: "Adventure", value: "adventure" },
  { label: "Culture & History", value: "culture" },
  { label: "Water Sports", value: "water" },
  { label: "Day Trips", value: "daytrips" },
];

const featuredExperiences = [
  {
    id: 1,
    title: "Colosseum Skip-the-Line Tour",
    location: "Rome, Italy",
    category: "culture",
    duration: "3 hours",
    rating: 4.9,
    reviews: 12840,
    price: 49,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80",
    gygPath: "/rome-l641/colosseum-skip-the-line-guided-tour-t33523",
  },
  {
    id: 2,
    title: "Paris Seine River Cruise",
    location: "Paris, France",
    category: "tours",
    duration: "1 hour",
    rating: 4.8,
    reviews: 9320,
    price: 19,
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80",
    gygPath: "/paris-l16/seine-river-cruise-t3776",
  },
  {
    id: 3,
    title: "Barcelona Tapas & Wine Night Tour",
    location: "Barcelona, Spain",
    category: "food",
    duration: "3.5 hours",
    rating: 4.9,
    reviews: 5210,
    price: 79,
    badge: "Fan Favourite",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    gygPath: "/barcelona-l45/tapas-wine-tour-t12345",
  },
  {
    id: 4,
    title: "Queenstown Bungee Jump",
    location: "Queenstown, New Zealand",
    category: "adventure",
    duration: "2 hours",
    rating: 4.9,
    reviews: 3870,
    price: 195,
    badge: "Thrilling",
    image: "https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=600&q=80",
    gygPath: "/queenstown-l668/bungee-jump-t11111",
  },
  {
    id: 5,
    title: "Santorini Sunset Sailing",
    location: "Santorini, Greece",
    category: "water",
    duration: "5 hours",
    rating: 4.8,
    reviews: 7640,
    price: 115,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
    gygPath: "/santorini-l91949/sunset-sailing-t22222",
  },
  {
    id: 6,
    title: "Tokyo Tsukiji Market & Sushi Tour",
    location: "Tokyo, Japan",
    category: "food",
    duration: "4 hours",
    rating: 4.9,
    reviews: 4190,
    price: 89,
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    gygPath: "/tokyo-l193/tsukiji-sushi-tour-t33333",
  },
  {
    id: 7,
    title: "Machu Picchu Full Day Tour",
    location: "Cusco, Peru",
    category: "daytrips",
    duration: "Full day",
    rating: 4.9,
    reviews: 6580,
    price: 135,
    badge: "Iconic",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80",
    gygPath: "/cusco-l712/machu-picchu-day-tour-t44444",
  },
  {
    id: 8,
    title: "New York City Helicopter Tour",
    location: "New York, USA",
    category: "tours",
    duration: "15 minutes",
    rating: 4.8,
    reviews: 8100,
    price: 219,
    badge: "Spectacular",
    image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80",
    gygPath: "/new-york-city-l805/helicopter-tour-t55555",
  },
  {
    id: 9,
    title: "Pyramids of Giza Guided Tour",
    location: "Cairo, Egypt",
    category: "culture",
    duration: "6 hours",
    rating: 4.7,
    reviews: 5430,
    price: 65,
    badge: "Must-Do",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&q=80",
    gygPath: "/cairo-l91/pyramids-tour-t66666",
  },
];

function buildGygUrl(path: string) {
  return `${GYG_BASE_URL}${path}/?partner_id=${GYG_PARTNER_ID}`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="star-rating">
      {"★".repeat(Math.floor(rating))}
      <span className="star-empty">{"★".repeat(5 - Math.floor(rating))}</span>
    </span>
  );
}

export default function ExperiencesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = featuredExperiences.filter((exp) => {
    const matchCat = activeCategory === "all" || exp.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Head>
        <title>Experiences | Timms Travel</title>
        <meta
          name="description"
          content="Discover unforgettable experiences around the world. Book tours, activities, and adventures with Timms Travel."
        />
      </Head>

      <style>{`
        .experiences-hero {
          background: #1a2e44;
          padding: 80px 24px 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .experiences-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 60% 0%, rgba(22,160,133,0.18) 0%, transparent 65%),
                      radial-gradient(ellipse at 20% 100%, rgba(22,160,133,0.10) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-eyebrow {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1abc9c;
          margin-bottom: 16px;
        }
        .hero-title {
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 16px;
        }
        .hero-title span {
          color: #1abc9c;
        }
        .hero-subtitle {
          font-size: 18px;
          color: rgba(255,255,255,0.65);
          max-width: 540px;
          margin: 0 auto 36px;
          line-height: 1.6;
        }
        .hero-search-wrap {
          max-width: 520px;
          margin: 0 auto;
          position: relative;
        }
        .hero-search {
          width: 100%;
          padding: 16px 56px 16px 20px;
          border-radius: 50px;
          border: none;
          font-size: 15px;
          background: #fff;
          color: #1a2e44;
          box-shadow: 0 4px 24px rgba(0,0,0,0.18);
          outline: none;
          box-sizing: border-box;
        }
        .hero-search::placeholder { color: #9aadbb; }
        .hero-search-icon {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          color: #1abc9c;
          pointer-events: none;
        }
        .hero-trust {
          margin-top: 24px;
          display: flex;
          justify-content: center;
          gap: 28px;
          flex-wrap: wrap;
        }
        .hero-trust-item {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .hero-trust-item svg { flex-shrink: 0; }

        .gyg-banner {
          background: linear-gradient(90deg, #ff6b35 0%, #ff8c42 100%);
          padding: 14px 24px;
          text-align: center;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .gyg-banner a { color: #fff; text-decoration: underline; }

        .categories-bar {
          background: #fff;
          border-bottom: 1px solid #e8ecef;
          padding: 0 24px;
          overflow-x: auto;
          display: flex;
          gap: 4px;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .categories-bar::-webkit-scrollbar { display: none; }
        .cat-btn {
          padding: 16px 20px;
          border: none;
          background: none;
          font-size: 14px;
          font-weight: 500;
          color: #6b7c8d;
          cursor: pointer;
          white-space: nowrap;
          border-bottom: 2px solid transparent;
          transition: color 0.18s, border-color 0.18s;
        }
        .cat-btn:hover { color: #1a2e44; }
        .cat-btn.active {
          color: #1abc9c;
          border-bottom-color: #1abc9c;
        }

        .section-main {
          background: #f7f9fb;
          min-height: 60vh;
          padding: 48px 24px 80px;
        }
        .section-header {
          max-width: 1200px;
          margin: 0 auto 32px;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .section-header h2 {
          font-size: 22px;
          font-weight: 700;
          color: #1a2e44;
        }
        .result-count {
          font-size: 14px;
          color: #6b7c8d;
        }
        .cards-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        .exp-card {
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #e8ecef;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
        }
        .exp-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(26,46,68,0.12);
        }
        .card-img-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #e0e8ef;
        }
        .card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s;
        }
        .exp-card:hover .card-img-wrap img { transform: scale(1.05); }
        .card-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #1abc9c;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 50px;
        }
        .card-body {
          padding: 18px 20px 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .card-location {
          font-size: 12px;
          color: #1abc9c;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .card-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a2e44;
          line-height: 1.3;
          margin-bottom: 10px;
        }
        .card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #6b7c8d;
          margin-bottom: 14px;
        }
        .card-dot { width: 3px; height: 3px; border-radius: 50%; background: #c0cdd8; }
        .card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid #f0f3f5;
        }
        .card-rating {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .star-rating { color: #f5a623; font-size: 13px; }
        .star-empty { color: #d8e0e8; }
        .rating-val { font-size: 13px; font-weight: 700; color: #1a2e44; }
        .rating-count { font-size: 12px; color: #9aadbb; }
        .card-price {
          text-align: right;
        }
        .price-from { font-size: 11px; color: #9aadbb; display: block; }
        .price-val { font-size: 20px; font-weight: 800; color: #1a2e44; }
        .card-cta {
          display: block;
          width: 100%;
          margin-top: 14px;
          padding: 12px;
          background: #1a2e44;
          color: #fff;
          text-align: center;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.18s;
          text-decoration: none;
        }
        .card-cta:hover { background: #1abc9c; color: #fff; }

        .no-results {
          text-align: center;
          padding: 80px 24px;
          color: #9aadbb;
        }
        .no-results-icon { font-size: 48px; margin-bottom: 16px; }
        .no-results h3 { font-size: 20px; color: #1a2e44; margin-bottom: 8px; }

        .gyg-cta-section {
          background: #1a2e44;
          padding: 72px 24px;
          text-align: center;
        }
        .gyg-cta-section h2 {
          font-size: clamp(26px, 4vw, 42px);
          font-weight: 800;
          color: #fff;
          margin-bottom: 12px;
        }
        .gyg-cta-section p {
          font-size: 17px;
          color: rgba(255,255,255,0.6);
          max-width: 480px;
          margin: 0 auto 32px;
          line-height: 1.6;
        }
        .cta-btn-group {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cta-btn-primary {
          padding: 16px 32px;
          background: #1abc9c;
          color: #fff;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: opacity 0.18s;
        }
        .cta-btn-primary:hover { opacity: 0.88; }
        .cta-btn-outline {
          padding: 16px 32px;
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.25);
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: border-color 0.18s;
        }
        .cta-btn-outline:hover { border-color: rgba(255,255,255,0.6); }

        .why-section {
          background: #fff;
          padding: 72px 24px;
        }
        .why-inner { max-width: 1100px; margin: 0 auto; }
        .why-title {
          text-align: center;
          font-size: clamp(22px, 3vw, 34px);
          font-weight: 800;
          color: #1a2e44;
          margin-bottom: 8px;
        }
        .why-sub {
          text-align: center;
          color: #6b7c8d;
          font-size: 16px;
          margin-bottom: 48px;
        }
        .why-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 32px;
        }
        .why-item {
          text-align: center;
        }
        .why-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: #e8f8f3;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 24px;
        }
        .why-item h3 { font-size: 16px; font-weight: 700; color: #1a2e44; margin-bottom: 8px; }
        .why-item p { font-size: 14px; color: #6b7c8d; line-height: 1.6; }

        @media (max-width: 600px) {
          .experiences-hero { padding: 56px 16px 44px; }
          .section-main { padding: 32px 16px 60px; }
          .cards-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hero */}
      <section className="experiences-hero">
        <p className="hero-eyebrow">Powered by GetYourGuide</p>
        <h1 className="hero-title">
          Experiences Worth<br /><span>Remembering</span>
        </h1>
        <p className="hero-subtitle">
          Hand-picked tours, adventures, and activities from the world's leading experiences platform.
        </p>
        <div className="hero-search-wrap">
          <input
            type="text"
            className="hero-search"
            placeholder="Search destinations, activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="hero-search-icon">🔍</span>
        </div>
        <div className="hero-trust">
          <span className="hero-trust-item">✓ Free cancellation on most</span>
          <span className="hero-trust-item">✓ Instant confirmation</span>
          <span className="hero-trust-item">✓ 70,000+ activities worldwide</span>
        </div>
      </section>

      {/* GYG Partner Banner */}
      <div className="gyg-banner">
        🌍 Booking powered by GetYourGuide — trusted by 50 million travellers worldwide.{" "}
        <a href={`${GYG_BASE_URL}/?partner_id=${GYG_PARTNER_ID}`} target="_blank" rel="noopener noreferrer">
          Browse all experiences →
        </a>
      </div>

      {/* Category Filter */}
      <div className="categories-bar">
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`cat-btn${activeCategory === cat.value ? " active" : ""}`}
            onClick={() => setActiveCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Experience Cards */}
      <section className="section-main">
        <div className="section-header">
          <h2>Featured Experiences</h2>
          <span className="result-count">{filtered.length} results</span>
        </div>

        {filtered.length > 0 ? (
          <div className="cards-grid">
            {filtered.map((exp) => (
              <div key={exp.id} className="exp-card">
                <div className="card-img-wrap">
                  <img src={exp.image} alt={exp.title} loading="lazy" />
                  <span className="card-badge">{exp.badge}</span>
                </div>
                <div className="card-body">
                  <p className="card-location">📍 {exp.location}</p>
                  <h3 className="card-title">{exp.title}</h3>
                  <div className="card-meta">
                    <span>⏱ {exp.duration}</span>
                  </div>
                  <div className="card-footer">
                    <div className="card-rating">
                      <StarRating rating={exp.rating} />
                      <span className="rating-val">{exp.rating}</span>
                      <span className="rating-count">({exp.reviews.toLocaleString()})</span>
                    </div>
                    <div className="card-price">
                      <span className="price-from">from</span>
                      <span className="price-val">£{exp.price}</span>
                    </div>
                  </div>
                  <a
                    href={buildGygUrl(exp.gygPath)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="card-cta"
                  >
                    Book on GetYourGuide →
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🗺️</div>
            <h3>No experiences found</h3>
            <p>Try a different search or category.</p>
          </div>
        )}
      </section>

      {/* Why Book Section */}
      <section className="why-section">
        <div className="why-inner">
          <h2 className="why-title">Why Book With Us?</h2>
          <p className="why-sub">We partner with GetYourGuide so you get the best.</p>
          <div className="why-grid">
            <div className="why-item">
              <div className="why-icon">🎟️</div>
              <h3>Skip the Queues</h3>
              <p>Priority access and skip-the-line tickets on the world's most popular attractions.</p>
            </div>
            <div className="why-item">
              <div className="why-icon">💬</div>
              <h3>Expert Local Guides</h3>
              <p>Vetted, passionate guides who bring destinations to life.</p>
            </div>
            <div className="why-item">
              <div className="why-icon">🔄</div>
              <h3>Free Cancellation</h3>
              <p>Most experiences offer free cancellation up to 24 hours before. Book worry-free.</p>
            </div>
            <div className="why-item">
              <div className="why-icon">⭐</div>
              <h3>Millions of Reviews</h3>
              <p>Every experience is rated by real travellers so you know exactly what to expect.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gyg-cta-section">
        <h2>Ready to Explore?</h2>
        <p>Browse over 70,000 experiences across 170+ countries, all bookable in minutes.</p>
        <div className="cta-btn-group">
          <a
            href={`${GYG_BASE_URL}/?partner_id=${GYG_PARTNER_ID}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="cta-btn-primary"
          >
            Browse All Experiences
          </a>
          <Link href="/flights" className="cta-btn-outline">
            Search Flights Instead
          </Link>
        </div>
      </section>
    </>
  );
}