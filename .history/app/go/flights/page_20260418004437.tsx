import { redirect } from "next/navigation"

export const metadata = {
  title: "Find Cheap Flights | Timms Travel",
  description: "Search and compare flights worldwide with Timms Travel.",
  openGraph: {
    title: "Compare Flights Across Worldwide Routes",
    description: "Search and compare flights worldwide with Timms Travel.",
    url: "https://timmstravel.com/go/flights",
    siteName: "Timms Travel",
    images: [
      {
        url: "/favicon.ico",
        width: 64,
        height: 64,
        alt: "Timms Travel logo"
      }
    ],
    locale: "en_GB",
    type: "website",
  },
}

export default function RedirectPage({ searchParams }: { searchParams: any }) {
  const origin = searchParams.origin
  const dest = searchParams.dest

  if (!origin || !dest) {
    redirect("/flights")
  }

  const today = new Date()
  const day = String(today.getDate()).padStart(2, "0")
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const departFormatted = `${day}${month}`

  const aviaUrl = `https://www.aviasales.com/search/${origin}${departFormatted}${dest}1?currency=gbp`
  const affiliateUrl = `https://aviasales.tpm.li/5tsfGPfB?u=${encodeURIComponent(aviaUrl)}`

  redirect(affiliateUrl)
}
