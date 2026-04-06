export default {
    name: "continent",
    title: "Continent",
    type: "document",
    fields: [
      { name: "name", type: "string" },
      { name: "slug", type: "slug", options: { source: "name" } },
      { name: "emoji", type: "string" }
    ]
  }
  