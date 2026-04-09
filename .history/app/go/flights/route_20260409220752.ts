import { NextResponse } from "next/server"

export const metadata = {
  title: "Find Cheap Flights | Timms Travel",
  description: "Compare flights worldwide with Timms Travel and our trusted partners.",
  openGraph: {
    title: "Find Cheap Flights",
    description: "Search and compare flights worldwide with Timms Travel.",
    url: "https://timmstravel.com/go/flights",
    siteName: "Timms Travel",
    images: [
      {
        url: "/favicon.ico",   // You can replace this with a full OG banner later
        width: 64,
        height: 64,
        alt: "Timms Travel logo"
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
