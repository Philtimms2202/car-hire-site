import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { client as readClient } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const citySlug = searchParams.get('city')

  if (!citySlug) {
    return NextResponse.json({ error: 'Missing city' }, { status: 400 })
  }

  const city = await readClient.fetch(
    `*[_type == "city" && slug.current == $slug][0]{
      _id, name, country->{name}, aiIntro, aiNeighbourhoods
    }`,
    { slug: citySlug }
  )

  if (!city) {
    return NextResponse.json({ error: 'City not found' }, { status: 404 })
  }

  if (city.aiIntro && city.aiNeighbourhoods?.length) {
    return NextResponse.json({ status: 'exists' })
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

  const res = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    temperature: 0.7,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'user',
        content: `Write a "Where to Stay in ${city.name}, ${city.country.name}" guide...`
      }
    ]
  })

  const parsed = JSON.parse(res.choices[0].message.content)

  await writeClient.patch(city._id).set({
    aiIntro: parsed.intro,
    aiNeighbourhoods: parsed.neighbourhoods,
  }).commit()

  return NextResponse.json({ status: 'created' })
}
