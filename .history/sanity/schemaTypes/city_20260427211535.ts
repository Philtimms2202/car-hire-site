// sanity/schemas/city.ts
export default {
  name: "city",
  title: "City",
  type: "document",

  groups: [
    { name: "core",      title: "Core Details", default: true },
    { name: "editorial", title: "Editorial" },
    { name: "ai",        title: "AI-Generated" },
  ],

  fields: [

    // ───────────────────────────────────────────────
    // CORE DETAILS
    // ───────────────────────────────────────────────
    {
      name: "name",
      title: "City Name",
      type: "string",
      group: "core",
      validation: (R: any) => R.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "core",
      options: { source: "name" },
      validation: (R: any) => R.required(),
    },
    {
      name: "country",
      title: "Country",
      type: "reference",
      to: [{ type: "country" }],
      group: "core",
    },
    {
      name: "state",
      title: "State / Region",
      type: "string",
      group: "core",
    },
    {
      name: "latitude",
      title: "Latitude",
      type: "number",
      group: "core",
    },
    {
      name: "longitude",
      title: "Longitude",
      type: "number",
      group: "core",
    },
    {
      name: "primaryIATA",
      title: "Primary IATA Code",
      type: "string",
      group: "core",
      description: "The main airport code for this city (e.g. LHR, JFK, CDG)",
    },
    {
      name: "alternateIATAs",
      title: "Alternate IATA Codes",
      type: "array",
      group: "core",
      of: [{ type: "string" }],
      description: "Other airports serving this city (e.g. LGW, STN, LTN)",
    },
    {
      name: "airport",
      title: "Airport Name",
      type: "string",
      group: "core",
      description: "Full name of the primary airport (e.g. Heathrow Airport)",
    },

    // ───────────────────────────────────────────────
    // EDITORIAL (manual overrides)
    // ───────────────────────────────────────────────
    {
      name: "emoji",
      title: "Emoji",
      type: "string",
      group: "editorial",
      description: "A single emoji representing the city (e.g. 🗼)",
    },
    {
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      group: "editorial",
      rows: 3,
      description: "Manually written hero subtitle. Overrides AI intro if set.",
    },
    {
      name: "mainContent",
      title: "Main Content",
      type: "array",
      group: "editorial",
      of: [{ type: "block" }],
      description: "Rich text content for the city page. AI fallback used if empty.",
    },
    {
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      group: "editorial",
      rows: 2,
      description: "SEO meta description. AI intro used if empty.",
    },

    // ───────────────────────────────────────────────
    // AI-GENERATED HOTEL CONTENT
    // Auto-populated on first visit
    // ───────────────────────────────────────────────

    {
      name: "aiIntro",
      title: "Intro",
      type: "text",
      group: "ai",
      rows: 5,
      description: "4–5 sentence intro to staying in this city.",
    },

    {
      name: "aiNeighbourhoods",
      title: "Neighbourhoods",
      type: "array",
      group: "ai",
      description: "Key areas to stay with descriptions.",
      of: [
        {
          type: "object",
          fields: [
            { name: "name",        title: "Neighbourhood Name", type: "string" },
            { name: "description", title: "Description",        type: "text"   },
          ],
          preview: {
            select: { title: "name", subtitle: "description" },
          },
        },
      ],
    },

    {
      name: "aiFirstTimers",
      title: "First-Time Visitors",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Where to stay for first-time visitors.",
    },
    {
      name: "aiBudget",
      title: "Budget Travellers",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Best areas to stay on a budget.",
    },
    {
      name: "aiCouples",
      title: "Couples",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Where to stay for couples.",
    },
    {
      name: "aiFamilies",
      title: "Families",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Best family-friendly areas.",
    },
    {
      name: "aiWhenToVisit",
      title: "When to Visit",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Best and worst times to visit.",
    },

    {
      name: "aiFaqs",
      title: "FAQs",
      type: "array",
      group: "ai",
      description: "Frequently asked questions.",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "string" },
            { name: "answer",   title: "Answer",   type: "text"   },
          ],
          preview: {
            select: { title: "question", subtitle: "answer" },
          },
        },
      ],
    },

    // ───────────────────────────────────────────────
    // AI HOTEL PAGE — NEW EXTENDED SECTIONS
    // ───────────────────────────────────────────────

    {
      name: "aiNightlife",
      title: "Nightlife & Going Out",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Best areas for nightlife.",
    },
    {
      name: "aiFood",
      title: "Food & Restaurants",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Best areas for food lovers.",
    },
    {
      name: "aiSafety",
      title: "Safety & Areas to Avoid",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Safety notes and areas to avoid.",
    },
    {
      name: "aiTransport",
      title: "Getting Around",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Transport and connectivity overview.",
    },
    {
      name: "aiLocalTips",
      title: "Local Tips",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Local insider tips.",
    },
    {
      name: "aiHowManyDays",
      title: "How Many Days?",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Recommended trip length.",
    },
    {
      name: "aiDigitalNomads",
      title: "Digital Nomads",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Best areas for remote workers.",
    },
    {
      name: "aiAreasToAvoid",
      title: "Areas to Avoid",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Neighbourhoods that may not suit visitors.",
    },

    // ───────────────────────────────────────────────
    // EXISTING HIGHLIGHTS + ABOUT FALLBACK
    // ───────────────────────────────────────────────

    {
      name: "aiHighlightsIntro",
      title: "Highlights Intro",
      type: "text",
      group: "ai",
      rows: 3,
      description: "Intro paragraph for the Highlights section.",
    },
    {
      name: "aiHighlightCards",
      title: "Highlight Cards",
      type: "array",
      group: "ai",
      description: "4 highlight cards for the grid.",
      of: [
        {
          type: "object",
          fields: [
            { name: "title",       title: "Title",       type: "string" },
            { name: "description", title: "Description", type: "text"   },
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        },
      ],
    },
    {
      name: "aiAboutFallback",
      title: "About Fallback",
      type: "text",
      group: "ai",
      rows: 4,
      description: "Fallback About text used when mainContent is empty.",
    },

// ───────────────────────────────────────────────
// AI THINGS TO DO
// Auto-populated on first visit to /things-to-do
// ───────────────────────────────────────────────

{
  name: "ttdIntro",
  title: "TTD: Intro",
  type: "text",
  group: "ai",
  rows: 5,
  description: "4–5 sentence intro to activities and experiences in this city.",
},
{
  name: "ttdHighlights",
  title: "TTD: Highlight Cards",
  type: "array",
  group: "ai",
  description: "4 cards summarising why this city is worth visiting for experiences.",
  of: [
    {
      type: "object",
      fields: [
        { name: "title",       title: "Title",       type: "string" },
        { name: "description", title: "Description", type: "text"   },
      ],
      preview: {
        select: { title: "title", subtitle: "description" },
      },
    },
  ],
},
{
  name: "ttdNeighbourhoods",
  title: "TTD: Areas by Activity Type",
  type: "array",
  group: "ai",
  description: "Which areas are best for which kind of activity.",
  of: [
    {
      type: "object",
      fields: [
        { name: "name",        title: "Area Name",   type: "string" },
        { name: "description", title: "Description", type: "text"   },
      ],
      preview: {
        select: { title: "name", subtitle: "description" },
      },
    },
  ],
},
{
  name: "ttdWithKids",
  title: "TTD: With Kids",
  type: "text",
  group: "ai",
  rows: 5,
  description: "Best activities and areas for families with children.",
},
{
  name: "ttdOnABudget",
  title: "TTD: On a Budget",
  type: "text",
  group: "ai",
  rows: 5,
  description: "Free and cheap things to do.",
},
{
  name: "ttdForCouples",
  title: "TTD: For Couples",
  type: "text",
  group: "ai",
  rows: 5,
  description: "Romantic and atmospheric experiences for couples.",
},
{
  name: "ttdDayTrips",
  title: "TTD: Day Trips",
  type: "text",
  group: "ai",
  rows: 5,
  description: "Best day trips and excursions from the city.",
},
{
  name: "ttdWhenToGo",
  title: "TTD: When to Go",
  type: "text",
  group: "ai",
  rows: 5,
  description: "Best time of year for activities — festivals, weather, events.",
},
{
  name: "ttdLocalTips",
  title: "TTD: Local Tips",
  type: "text",
  group: "ai",
  rows: 5,
  description: "Things most tourists miss, booking advice, local etiquette.",
},
{
  name: "ttdFaqs",
  title: "TTD: FAQs",
  type: "array",
  group: "ai",
  description: "4 Q&As targeting People Also Ask queries about visiting this city.",
  of: [
    {
      type: "object",
      fields: [
        { name: "question", title: "Question", type: "string" },
        { name: "answer",   title: "Answer",   type: "text"   },
      ],
      preview: {
        select: { title: "question", subtitle: "answer" },
      },
    },
  ],
},
  ],
}
