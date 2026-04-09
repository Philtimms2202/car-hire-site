import { NextResponse } from "next/server"

export const metadata = {
  title: "Find Cheap Flights | TravelSite",
  description: "Search and compare flights worldwide with our trusted partners.",
  openGraph: {
    title: "Find Cheap Flights",
    description: "Search and compare flights worldwide with our trusted partners.",
    url: "https://timmstravel.com/go/flights",
    siteName: "TimmsTravel",
images: [
  {
    url: "/favicon.ico",
    width: 64,
    height: 64,
    alt: "TravelSite logo"
  }
],
    locale: "en_GB",
    type: "website",
  },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const origin = searchParams.get("origin")
  const dest = searchParams.get("dest")

  if (!origin || !dest) {
    return NextResponse.redirect("https://timmstravel.com/flights")
  }

  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const departFormatted = `${day}${month}`

  const aviaUrl = `https://www.aviasales.com/search/${origin}${departFormatted}${dest}1?currency=gbp`
  const affiliateUrl = `https://aviasales.tpm.li/5tsfGPfB?u=${encodeURIComponent(aviaUrl)}`

  return NextResponse.redirect(affiliateUrl)
}
