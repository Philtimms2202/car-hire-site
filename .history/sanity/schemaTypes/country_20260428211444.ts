export default {
  name: "country",
  title: "Country",
  type: "document",

  groups: [
    { name: "core",      title: "Core Details", default: true },
    { name: "editorial", title: "Editorial" },
    { name: "ai",        title: "AI‑Generated" }
  ],

  fields: [
    // -------------------------------------------------
    // CORE DETAILS
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
      group: "core"
    },
    {
      name: "emoji",
      title: "Flag Emoji (Manual)",
      type: "string",
      group: "core"
    },
    {
      name: "continent",
      title: "Continent",
      type: "reference",
      to: [{ type: "continent" }],
      group: "core"
    },

    // -------------------------------------------------
    // AUTO‑POPULATED (REST Countries API)
    // -------------------------------------------------
    { name: "capital", title: "Capital City", type: "string", group: "core" },
    { name: "population", title: "Population", type: "number", group: "core" },
    { name: "languages", title: "Languages", type: "array", of: [{ type: "string" }], group: "core" },
    { name: "currency", title: "Currency", type: "string", group: "core" },
    { name: "flag", title: "Flag Emoji (API)", type: "string", group: "core" },

    // -------------------------------------------------
    // EDITORIAL (Manual Overrides / Future Use)
    // -------------------------------------------------
    {
      name: "editorialNotes",
      title: "Editorial Notes",
      type: "text",
      group: "editorial",
      description: "Optional notes or overrides for editors"
    },

    // -------------------------------------------------
    // AI‑GENERATED TRAVEL DETAILS
    // -------------------------------------------------
    {
      name: "plugType",
      title: "Power Plug Type",
      type: "string",
      group: "ai"
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
      group: "ai"
    },
    {
      name: "tippingCulture",
      title: "Tipping Culture",
      type: "text",
      group: "ai"
    },
    {
      name: "visaInfo",
      title: "Visa Information",
      type: "text",
      group: "ai"
    }
  ]
}
