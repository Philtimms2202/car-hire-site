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

  // 🔥 Read raw text instead of JSON
  const text = await res.text()

  console.log("🔥 RAW TRIP.COM RESPONSE:", text)

  // Return it so we can inspect it in the browser too
  return NextResponse.json({ debug: text })
}