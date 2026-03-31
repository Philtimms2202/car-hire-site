import { defineField, defineType } from 'sanity'

export const locationType = defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  fields: [
    defineField({ name: 'city', title: 'City Name', type: 'string' }),

    defineField({
      name: 'slug',
      title: 'City Slug',
      type: 'slug',
      options: { source: 'city' }
    }),

    defineField({ name: 'country', title: 'Country Name', type: 'string' }),

    defineField({
      name: 'countrySlug',
      title: 'Country Slug',
      type: 'slug',
      options: { source: 'country' }
      isUnique: () => true // ⭐ allow duplicates
    }),

    defineField({ name: 'countryEmoji', title: 'Country Flag Emoji', type: 'string' }),

    defineField({
      name: 'continent',
      title: 'Continent',
      type: 'string',
      options: {
        list: [
          'Europe',
          'Asia',
          'North America',
          'South America',
          'Africa',
          'Middle East',
          'Oceania'
        ]
      }
    }),

    defineField({
      name: 'continentSlug',
      title: 'Continent Slug',
      type: 'slug',
      options: {
        source: 'continent',
        isUnique: () => true // ⭐ allow duplicates
      }
    }),

    defineField({ name: 'continentEmoji', title: 'Continent Emoji', type: 'string' }),

    defineField({ name: 'airport', title: 'Main Airport', type: 'string' }),

    defineField({ name: 'emoji', title: 'City Emoji', type: 'string' }),

    defineField({ name: 'heroDescription', title: 'Hero Description', type: 'text' }),

    defineField({
      name: 'mainContent',
      title: 'Main Content',
      type: 'array',
      of: [{ type: 'block' }]
    }),

    defineField({ name: 'metaDescription', title: 'SEO Meta Description', type: 'text' })
  ]
})

