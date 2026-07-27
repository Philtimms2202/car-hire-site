export default {
  name: 'dealCategoryContent',
  title: 'Deal Category Content (AI)',
  type: 'document',
  fields: [
    {
      name: 'categorySlug',
      title: 'Category Slug',
      type: 'string',
      validation: (R: any) => R.required(),
    },
    {
      name: 'categoryTitle',
      title: 'Category Title',
      type: 'string',
    },
    {
      name: 'introText',
      title: 'Intro Paragraph',
      type: 'text',
      rows: 5,
    },
    {
      name: 'goodToKnowHeading',
      title: 'Good To Know Heading',
      type: 'string',
    },
    {
      name: 'goodToKnow',
      title: 'Good To Know',
      type: 'text',
      rows: 5,
    },
    {
      name: 'travelerTipHeading',
      title: 'Traveller Tip Heading',
      type: 'string',
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
    select: { title: 'categoryTitle', subtitle: 'categorySlug' },
  },
}