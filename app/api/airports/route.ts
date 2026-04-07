import airports from '@/data/airports.json'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const term = searchParams.get('q')?.toLowerCase() || ''

  if (!term || term.length < 2) {
    return Response.json([])
  }

  const results = airports
    .filter((a: any) => {
      return (
        a.iata_code?.toLowerCase().includes(term) ||
        a.city?.toLowerCase().includes(term) ||
        a.country?.toLowerCase().includes(term) ||
        a.name?.toLowerCase().includes(term)
      )
    })
    .slice(0, 20)

  return Response.json(results)
}