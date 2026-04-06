import { defineType, defineField } from "sanity";

export default defineType({
  name: "city",
  title: "City",
  type: "document",
  fields: [
    defineField({ name: "name", title: "City Name", type: "string" }),

    defineField({
      name: "slug",
      title: "City Slug",
      type: "slug",
      options: { source: "name" }
    }),

    defineField({
      name: "country",
      title: "Country",
      type: "reference",
      to: [{ type: "country" }]
    }),

    defineField({ name: "state", title: "State / Region", type: "string" }),
    defineField({ name: "latitude", type: "number" }),
    defineField({ name: "longitude", type: "number" }),

    // Your editorial fields stay here
    defineField({ name: "airport", title: "Main Airport", type: "string" }),
    defineField({ name: "emoji", title: "City Emoji", type: "string" }),
    defineField({ name: "heroDescription", title: "Hero Description", type: "text" }),
    defineField({
      name: "mainContent",
      title: "Main Content",
      type: "array",
      of: [{ type: "block" }]
    }),
    defineField({ name: "metaDescription", title: "SEO Meta Description", type: "text" })
  ]
});