import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { city } = await req.json()

  // Normalize input
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  )

  const data = await res.json()

  // Find the first CITY result (CT = City)
  const match = data?.data?.find(item => item.type === "CT")

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