export default {
  name: "country",
  title: "Country",
  type: "document",
  fields: [
    { name: "name", type: "string", title: "Name" },
    { name: "slug", type: "slug", title: "Slug", options: { source: "name" } },
    { name: "iso2", type: "string", title: "ISO2 Code" },
    { name: "emoji", type: "string", title: "Flag Emoji" },

    {
      name: "continent",
      title: "Continent",
      type: "reference",
      to: [{ type: "continent" }]
    },

    // --- Auto-populated fields ---
    {
      name: "capital",
      title: "Capital City",
      type: "string"
    },
    {
      name: "population",
      title: "Population",
      type: "number"
    },
    {
      name: "languages",
      title: "Languages",
      type: "array",
      of: [{ type: "string" }]
    },
    {
      name: "currency",
      title: "Currency",
      type: "string"
    },
    {
      name: "flag",
      title: "Flag Emoji (from API)",
      type: "string"
    }
    
  ]
}