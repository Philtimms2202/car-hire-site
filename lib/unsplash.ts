const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

export type UnsplashPhoto = {
  url: string
  altDescription: string | null
  photographerName: string
  photographerUrl: string
  found: boolean
}

const FALLBACK: UnsplashPhoto = {
  url: '',
  altDescription: null,
  photographerName: '',
  photographerUrl: '',
  found: false,
}

/**
 * Searches Unsplash for a single best-match photo for a query (e.g. a city name,
 * or "city + neighbourhood"). Cached for 7 days — city photography doesn't go stale,
 * and this keeps us comfortably under Unsplash's 50 req/hour demo-tier limit.
 */
export async function searchUnsplashPhoto(query: string): Promise<UnsplashPhoto> {
  if (!UNSPLASH_ACCESS_KEY) throw new Error('Missing UNSPLASH_ACCESS_KEY env variable')

  const params = new URLSearchParams({
    query,
    per_page: '1',
    orientation: 'landscape',
    content_filter: 'high',
  })

  const res = await fetch(`https://api.unsplash.com/search/photos?${params.toString()}`, {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    next: { revalidate: 604800 }, // 7 days
  })

  if (!res.ok) return FALLBACK

  const json = await res.json()
  const photo = json?.results?.[0]
  if (!photo) return FALLBACK

  return {
    url: photo.urls?.regular ?? '',
    altDescription: photo.alt_description ?? null,
    photographerName: photo.user?.name ?? 'Unknown',
    photographerUrl: photo.user?.links?.html ?? 'https://unsplash.com',
    found: Boolean(photo.urls?.regular),
  }
}