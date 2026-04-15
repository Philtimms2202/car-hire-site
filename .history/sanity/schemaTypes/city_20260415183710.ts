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

    // AI-generated (auto-populated on first page visit, never regenerated)
    {
      name: "aiIntro",
      title: "AI Intro",
      type: "text",
      description: "Auto-generated on first visit. Edit to override.",
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