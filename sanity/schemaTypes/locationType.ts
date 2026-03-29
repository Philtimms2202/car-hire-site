import { defineField, defineType } from 'sanity'

export const locationType = defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  fields: [
    defineField({ name: 'city', title: 'City Name', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'city' } }),
    defineField({ name: 'country', title: 'Country', type: 'string' }),
    defineField({ name: 'airport', title: 'Airport Name', type: 'string' }),
    defineField({ name: 'emoji', title: 'Emoji', type: 'string' }),
    defineField({ name: 'heroDescription', title: 'Hero Description', type: 'text' }),
    defineField({ name: 'mainContent', title: 'Main Content', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'metaDescription', title: 'SEO Meta Description', type: 'text' }),
  ]
})