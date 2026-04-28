export default {
  name: "country",
  title: "Country",
  type: "document",

  groups: [
    { name: "core",      title: "Core Details", default: true },
    { name: "editorial", title: "Editorial" },
    { name: "ai",        title: "AI-Generated" }
  ],

  fields: [
    // -------------------------------------------------
    // BASIC INFO (CORE)
    // -------------------------------------------------
    {
      name: "name",
      title: "Name",
      type: "string",
      group: "core",
      validation: Rule => Rule.required()
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "core",
      options: { source: "name", maxLength: 96 }
    },
    {
      name: "iso2",
      title: "ISO2 Code",
      type: "string",
      group: "core",
      description: "Two‑letter country code (e.g., IT, FR, US)"
    },
    {
      name: "emoji",
      title: "Flag Emoji (Manual)",
      type: "string",
      group: "core"
    },

    // -------------------------------------------------
    // RELATIONSHIPS (CORE)
    // -------------------------------------------------
    {
      name: "continent",
      title: "Continent",
      type: "reference",
      to: [{ type: "continent" }],
      group: "core"
    },

    // -------------------------------------------------
    // AUTO‑POPULATED (REST Countries API) (CORE)
    // -------------------------------------------------
    {
      name: "capital",
      title: "Capital City",
      type: "string",
      group: "core"
    },
    {
      name: "population",
      title: "Population",
      type: "number",
      group: "core"
    },
    {
      name: "languages",
      title: "Languages",
      type: "array",
      of: [{ type: "string" }],
      group: "core"
    },
    {
      name: "currency",
      title: "Currency",
      type: "string",
      group: "core"
    },
    {
      name: "flag",
      title: "Flag Emoji (API)",
      type: "string",
      group: "core"
    },

    // -------------------------------------------------
    // EDITORIAL
    // -------------------------------------------------
    {
      name: "editorialNotes",
      title: "Editorial Notes",
      type: "text",
      group: "editorial",
      description: "Optional notes or overrides for editors"
    },

    // -------------------------------------------------
    // AUTO‑POPULATED TRAVEL DETAILS (AI)
    // -------------------------------------------------
    {
      name: "plugType",
      title: "Power Plug Type",
      type: "string",
      group: "ai",
      description: "e.g., Type C, Type F, Type G"
    },
    {
      name: "drivingSide",
      title: "Driving Side",
      type: "string",
      group: "ai",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" }
        ]
      }
    },
    {
      name: "emergencyNumber",
      title: "Emergency Number",
      type: "string",
      group: "ai",
      description: "e.g., 112, 911, 999"
    },
    {
      name: "tippingCulture",
      title: "Tipping Culture",
      type: "text",
      group: "ai",
      description: "Short explanation of tipping norms"
    },
    {
      name: "visaInfo",
      title: "Visa Information",
      type: "text",
      group: "ai",
      description: "General visa guidance for travellers"
    },

    // -------------------------------------------------
    // EXTENDED TRAVEL DATA (AI-GENERATED)
    // -------------------------------------------------
    {
      name: "bestTimeToVisit",
      title: "Best Time to Visit",
      type: "text",
      group: "ai",
      description: "Seasonality, weather patterns, and ideal months to visit"
    },
    {
      name: "safetyOverview",
      title: "Safety Overview",
      type: "text",
      group: "ai",
      description: "Crime, weather risks, common scams, and general safety"
    },
    {
      name: "localLaws",
      title: "Local Laws & Customs",
      type: "text",
      group: "ai",
      description: "Etiquette, alcohol rules, dress codes, and cultural norms"
    },
    {
      name: "costOfTravel",
      title: "Cost of Travel",
      type: "text",
      group: "ai",
      description: "Budget/mid-range/luxury daily costs and typical prices"
    },
    {
      name: "transportBasics",
      title: "Transport Basics",
      type: "text",
      group: "ai",
      description: "Metro, buses, taxis, ride-share, and intercity trains"
    },
    {
      name: "vaccinations",
      title: "Vaccinations",
      type: "text",
      group: "ai",
      description: "WHO-style vaccination recommendations and health notes"
    },
    {
      name: "internetConnectivity",
      title: "Internet & Connectivity",
      type: "text",
      group: "ai",
      description: "SIM/eSIM options, speeds, and coverage quality"
    },
    {
      name: "timeZone",
      title: "Time Zone",
      type: "string",
      group: "ai",
      description: "Primary time zone, e.g., CET, GMT+1"
    },
    {
      name: "mainAirports",
      title: "Main Airports",
      type: "array",
      of: [{ type: "string" }],
      group: "ai",
      description: "Key international or regional airports"
    },
    {
      name: "neighbouringCountries",
      title: "Neighbouring Countries",
      type: "array",
      of: [{ type: "string" }],
      group: "ai",
      description: "Nearby countries for suggested onward travel"
    }
  ]
}
