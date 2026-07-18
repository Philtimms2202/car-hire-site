export default {
  name: 'flightHubContent',
  title: 'Flight Hub Content (AI)',
  type: 'document',
  fields: [
    {
      name: 'citySlug',
      title: 'City Slug',
      type: 'string',
      validation: (R: any) => R.required(),
    },
    {
      name: 'cityName',
      title: 'City Name',
      type: 'string',
    },
    {
      name: 'direction',
      title: 'Direction',
      type: 'string',
      options: {
        list: [
          { title: 'Flights To', value: 'to' },
          { title: 'Flights From', value: 'from' },
        ],
      },
      validation: (R: any) => R.required(),
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
      description: 'Snapshot of the specific facts fed into the AI prompt, kept for traceability.',
    },
    {
      name: 'generatedAt',
      title: 'Generated At',
      type: 'datetime',
    },
  ],
  preview: {
    select: { title: 'cityName', subtitle: 'direction' },
  },
}