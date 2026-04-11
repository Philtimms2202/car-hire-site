// app/metadata.ts

export const defaultMetadata = {
  title: 'Timms Travel',
  description: 'Discover destinations, flights, hotels and experiences worldwide.',
  openGraph: {
    siteName: 'Timms Travel',
    locale: 'en_GB',
    type: 'website',
  },
}

// Helper to merge defaults + overrides
export function buildMetadata(overrides: any = {}) {
  return {
    ...defaultMetadata,
    ...overrides,
    openGraph: {
      ...defaultMetadata.openGraph,
      ...(overrides.openGraph || {}),
    },
  }
}