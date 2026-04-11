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
  
      // editorial fields
      { name: "airport", type: "string" },
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
  