// sanity/schemas/city.ts

export default {
  name: "city",
  title: "City",
  type: "document",
  fields: [
    { name: "name", type: "string" },
    { name: "slug", type: "slug", options: { source: "name" } },

    {
      name: "country",
      type: "reference",
      to: [{ type: "country" }]
    },

    { name: "state", type: "string" },
    { name: "latitude", type: "number" },
    { name: "longitude", type: "number" },

    {
      name: "primaryIATA",
      title: "Primary IATA Code",
      type: "string",
      description: "The main airport code for this city (e.g. LHR, JFK, CDG)"
    },

    {
      name: "alternateIATAs",
      title: "Alternate IATA Codes",
      type: "array",
      of: [{ type: "string" }],
      description: "Other airports serving this city (e.g. LGW, STN, LTN)"
    },

    // Editorial
    { name: "emoji", type: "string" },
    { name: "heroDescription", type: "text" },
    {
      name: "mainContent",
      type: "array",
      of: [{ type: "block" }]
    },
    { name: "metaDescription", type: "text" },

    {
      name: "airport",
      title: "Airport Name",
      type: "string",
      description: "Full name of the primary airport (e.g. Abu Dhabi International Airport)"
    },

    // -------------------------
    // AI-Generated Fields
    // All auto-populated on first page visit. Edit in Studio to override.
    // -------------------------

    {
      name: "aiIntro",
      title: "AI Intro (Hero)",
      type: "text",
      description: "Auto-generated hero description. Edit to override.",
      readOnly: false,
    },

    {
      name: "aiHighlightsIntro",
      title: "AI Highlights Intro",
      type: "text",
      description: "Intro paragraph for the Highlights section. Auto-generated on first visit.",
      readOnly: false,
    },

    {
      name: "aiHighlightCards",
      title: "AI Highlight Cards",
      type: "array",
      description: "4 highlight cards for the grid. Auto-generated on first visit.",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "description", title: "Description", type: "text" },
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        },
      ],
    },

    {
      name: "aiAboutFallback",
      title: "AI About Fallback",
      type: "text",
      description: "Fallback About text used when mainContent is empty. Auto-generated on first visit.",
      readOnly: false,
    },

    {
      name: "aiNeighbourhoods",
      title: "AI Neighbourhoods",
      type: "array",
      description: "Auto-generated on first visit. Edit to override.",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Name", type: "string" },
            { name: "description", title: "Description", type: "text" },
          ],
          preview: {
            select: { title: "name", subtitle: "description" },
          },
        },
      ],
    },
  ],
}