import { getCityHubs } from '@/lib/airports';

export const revalidate = 3600;

export async function GET() {
  const hubs = getCityHubs();

  const urls = hubs
    .map((hub) => {
      return `  <url>
    <loc>https://timmstravel.com/flights/to/${hub.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}