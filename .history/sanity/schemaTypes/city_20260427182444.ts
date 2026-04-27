// sanity/schemas/city.ts
export default {
  name: "city",
  title: "City",
  type: "document",
  groups: [
    { name: "core",      title: "Core Details",    default: true },
    { name: "editorial", title: "Editorial"                      },
    { name: "ai",        title: "AI-Generated"                   },
  ],
  fields: [

    // ── CORE ──────────────────────────────────────────────
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

    // ── EDITORIAL ─────────────────────────────────────────
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
      description: "Manually written hero subtitle. If set, this overrides the AI intro on the page.",
    },
    {
      name: "mainContent",
      title: "Main Content",
      type: "array",
      group: "editorial",
      of: [{ type: "block" }],
      description: "Rich text content for the city page. If empty, the AI fallback is used.",
    },
    {
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      group: "editorial",
      rows: 2,
      description: "SEO meta description. If empty, the AI intro is used (truncated to 155 characters).",
    },

    // ── AI-GENERATED ──────────────────────────────────────
    // All fields below are auto-populated on first page visit.
    // You can edit any of them in the Studio to override the generated content.
    {
      name: "aiIntro",
      title: "Intro",
      type: "text",
      group: "ai",
      rows: 5,
      description: "4-5 sentence introduction to staying in this city. Auto-generated on first visit.",
    },
    {
      name: "aiNeighbourhoods",
      title: "Neighbourhoods",
      type: "array",
      group: "ai",
      description: "Key areas to stay with descriptions. Auto-generated on first visit.",
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
      description: "Where to stay for first-time visitors. Auto-generated on first visit.",
    },
    {
      name: "aiBudget",
      title: "Budget Travellers",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Best areas to stay on a budget. Auto-generated on first visit.",
    },
    {
      name: "aiCouples",
      title: "Couples",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Where to stay for couples. Auto-generated on first visit.",
    },
    {
      name: "aiFamilies",
      title: "Families",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Best family-friendly areas. Auto-generated on first visit.",
    },
    {
      name: "aiWhenToVisit",
      title: "When to Visit",
      type: "text",
      group: "ai",
      rows: 5,
      description: "Best and worst times to visit. Auto-generated on first visit.",
    },
    {
      name: "aiFaqs",
      title: "FAQs",
      type: "array",
      group: "ai",
      description: "Frequently asked questions. Auto-generated on first visit.",
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
    {
      name: "aiHighlightsIntro",
      title: "Highlights Intro",
      type: "text",
      group: "ai",
      rows: 3,
      description: "Intro paragraph for the Highlights section. Auto-generated on first visit.",
    },
    {
      name: "aiHighlightCards",
      title: "Highlight Cards",
      type: "array",
      group: "ai",
      description: "4 highlight cards for the grid. Auto-generated on first visit.",
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
      description: "Fallback About text used when mainContent is empty. Auto-generated on first visit.",
    },
  ],
}