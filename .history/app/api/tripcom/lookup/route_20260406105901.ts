import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { city } = await req.json()

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
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify(body)
    }
  )

  const data = await res.json()

  // 🔥 ADD THESE LOGS
  console.log("RAW TRIP RESPONSE:", JSON.stringify(data, null, 2))
  console.log("RAW TRIP DATA FIELD:", data?.data)

  // Try both possible formats
  const list =
    Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.list)
      ? data.data.list
      : []

  console.log("PARSED LIST:", list)

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