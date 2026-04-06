import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { city } = await req.json()

  // Normalise input for Trip.com (they match lowercase far more reliably)
  const keyword = city.trim().toLowerCase()

  const body = {
    keyword,
    head: {
      cid: "09031014111416709",
      ctok: "",
      cver: "1.0",
      lang: "en-GB",
      sid: "8888",
      syscode: "09"
    }
  }

  const res = await fetch(
    "https://www.trip.com/restapi/soa2/16709/json/getDestinationList",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0" // prevents Trip.com from blocking localhost
      },
      body: JSON.stringify(body)
    }
  )

  const data = await res.json()

  // Log raw response so we can see EXACTLY what Trip.com returns
  console.log("TRIP RAW RESPONSE:", JSON.stringify(data, null, 2))

  // Trip.com sometimes returns:
  // - data: [...]
  // - data: { list: [...] }
  // - data: null
  // - data: undefined
  const list =
    Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.list)
      ? data.data.list
      : []

  console.log("TRIP RESULTS ARRAY:", list)

  // Filter for CITY results only (CT = City)
  const match = list.find((item: any) => item.type === "CT")

  if (!match) {
    return NextResponse.json({ error: "City not found" }, { status: 404 })
  }

  return NextResponse.json({
    cityId: match.cityId,
    countryId: match.countryId,
    optionId: match.optionId,
    destName: match.destName,
    searchType: match.type
  })
}