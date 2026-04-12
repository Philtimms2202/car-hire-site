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

    // 🔥 NEW: Primary airport IATA code
    {
      name: "primaryIATA",
      title: "Primary IATA Code",
      type: "string",
      description: "The main airport code for this city (e.g. LHR, JFK, CDG)"
    },

    // 🔥 NEW: Optional alternate airports
    {
      name: "alternateIATAs",
      title: "Alternate IATA Codes",
      type: "array",
      of: [{ type: "string" }],
      description: "Other airports serving this city (e.g. LGW, STN, LTN)"
    },

    // editorial fields
    { name: "emoji", type: "string" },
    { name: "heroDescription", type: "text" },
    {
      name: "mainContent",
      type: "array",
      of: [{ type: "block" }]
    },
    { name: "metaDescription", type: "text" }
  ]
}