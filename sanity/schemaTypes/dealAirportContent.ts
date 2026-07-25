export default {
  name: 'dealAirportContent',
  title: 'Deal Airport Content (AI)',
  type: 'document',
  fields: [
    {
      name: 'categorySlug',
      title: 'Category Slug',
      type: 'string',
      validation: (R: any) => R.required(),
    },
    {
      name: 'airportSlug',
      title: 'Airport Slug',
      type: 'string',
      validation: (R: any) => R.required(),
    },
    {
      name: 'categoryTitle',
      title: 'Category Title',
      type: 'string',
    },
    {
      name: 'airportLabel',
      title: 'Airport Label',
      type: 'string',
    },
    {
      name: 'introText',
      title: 'Intro Paragraph',
      type: 'text',
      rows: 5,
    },
    {
      name: 'goodToKnow',
      title: 'Good To Know',
      type: 'text',
      rows: 5,
    },
    {
      name: 'travelerTip',
      title: 'Traveller Tip',
      type: 'text',
      rows: 4,
    },
    {
      name: 'factsUsed',
      title: 'Facts Used (for reference)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'generatedAt',
      title: 'Generated At',
      type: 'datetime',
    },
  ],
  preview: {
    select: { title: 'categoryTitle', subtitle: 'airportLabel' },
  },
}