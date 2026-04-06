export default {
    name: "country",
    title: "Country",
    type: "document",
    fields: [
      { name: "name", type: "string" },
      { name: "slug", type: "slug", options: { source: "name" } },
      { name: "iso2", type: "string" },
      { name: "emoji", type: "string" },
      {
        name: "continent",
        type: "reference",
        to: [{ type: "continent" }]
      },
      { name: "capital", type: "string" },
      { name: "population", type: "number" },
      { name: "languages", type: "array", of: [{ type: "string" }] },
      { name: "currency", type: "string" },
      { name: "flag", type: "string" }
    ]
  }
  