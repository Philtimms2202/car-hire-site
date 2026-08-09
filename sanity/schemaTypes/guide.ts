const guide = {
  name: 'guide',
  title: 'Guide',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'guideCategory' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    },
    {
      // FIXED: was a plain array of "block" only, so Studio never offered
      // an option to insert images or tables. This now points at the same
      // shared blockContent type your blog posts already use, which
      // includes block, image, and table array members.
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    },
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
    },
    {
      name: 'ogDescription',
      title: 'OG Description',
      type: 'text',
      rows: 2,
    },
    {
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
    },
  ],
}

export default guide