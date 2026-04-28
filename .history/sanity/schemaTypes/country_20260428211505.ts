export default {
  name: "country",
  title: "Country",
  type: "document",

  fields: [
    // -------------------------------------------------
    // BASIC INFO
    // -------------------------------------------------
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: Rule => Rule.required()
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 }
    },
    {
      name: "iso2",
      title: "ISO2 Code",
      type: "string",
      description: "Two‑letter country code (e.g., IT, FR, US)"
    },
    {
      name: "emoji",
      title: "Flag Emoji (Manual)",
      type: "string"
    },

    // -------------------------------------------------
    // RELATIONSHIPS
    // -------------------------------------------------
    {
      name: "continent",
      title: "Continent",
      type: "reference",
      to: [{ type: "continent" }]
    },

    // -------------------------------------------------
    // AUTO‑POPULATED (REST Countries API)
    // -------------------------------------------------
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
      title: "Flag Emoji (API)",
      type: "string"
    },

    // -------------------------------------------------
    // AUTO‑POPULATED TRAVEL DETAILS
    // -------------------------------------------------
    {
      name: "plugType",
      title: "Power Plug Type",
      type: "string",
      description: "e.g., Type C, Type F, Type G"
    },
    {
      name: "drivingSide",
      title: "Driving Side",
      type: "string",
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
      description: "e.g., 112, 911, 999"
    },
    {
      name: "tippingCulture",
      title: "Tipping Culture",
      type: "text",
      description: "Short explanation of tipping norms"
    },
    {
      name: "visaInfo",
      title: "Visa Information",
      type: "text",
      description: "General visa guidance for travellers"
    }
  ]
}