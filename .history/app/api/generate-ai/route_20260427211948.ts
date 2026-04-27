import { NextResponse } from "next/server";
import OpenAI from "openai";
import { client as readClient } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const citySlug = searchParams.get("city");
    const force = searchParams.get("force") === "true";

    if (!citySlug) {
      return NextResponse.json({ error: "Missing city slug" }, { status: 400 });
    }

    const city = await readClient.fetch(
      `*[_type == "city" && slug.current == $slug][0]{
        _id,
        name,
        country->{name},
        aiIntro,
        aiNeighbourhoods,
        aiFirstTimers,
        aiBudget,
        aiCouples,
        aiFamilies,
        aiWhenToVisit,
        aiFaqs,
        aiNightlife,
        aiFood,
        aiSafety,
        aiTransport,
        aiLocalTips,
        aiHowManyDays,
        aiDigitalNomads,
        aiAreasToAvoid,
        aiHighlightsIntro,
        aiHighlightCards
      }`,
      { slug: citySlug }
    );

    if (!city?._id) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    const allFieldsExist =
      city.aiIntro &&
      city.aiNeighbourhoods?.length &&
      city.aiFirstTimers &&
      city.aiBudget &&
      city.aiCouples &&
      city.aiFamilies &&
      city.aiWhenToVisit &&
      city.aiFaqs?.length &&
      city.aiNightlife &&
      city.aiFood &&
      city.aiSafety &&
      city.aiTransport &&
      city.aiLocalTips &&
      city.aiHowManyDays &&
      city.aiDigitalNomads &&
      city.aiAreasToAvoid &&
      city.aiHighlightsIntro &&
      city.aiHighlightCards?.length;

    if (allFieldsExist && !force) {
      return NextResponse.json({ status: "exists" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OpenAI API key" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const systemPrompt = `
You are a British travel writer specialising in hotel and neighbourhood advice.
Tone: warm, practical, specific, confident. Avoid clichés and AI-sounding phrases.
Use British English spelling (colour, centre, organise).
Do NOT use words like "nestled", "vibrant", "bustling", "perfect for", "boasts", "offers something for everyone".
Do NOT use bullet points inside strings.
Do NOT use markdown.
Return STRICT JSON ONLY.
`;

    const userPrompt = `
Write a hotel-focused "Where to Stay in ${city.name}, ${city.country?.name}" guide.

Return ONLY this JSON structure:

{
  "intro": "150–200 words about staying in ${city.name}. Mention layout, hotel scene, price expectations, and what visitors should know before booking.",

  "highlightsIntro": "2–3 sentences summarising what makes ${city.name} a good base. Used as a subtitle under the highlights section.",

  "highlightCards": [
    { "title": "Short punchy label", "description": "2 sentences on this aspect of staying in ${city.name}. Be specific." },
    { "title": "Short punchy label", "description": "2 sentences." },
    { "title": "Short punchy label", "description": "2 sentences." },
    { "title": "Short punchy label", "description": "2 sentences." }
  ],

  "neighbourhoods": [
    { "name": "Real neighbourhood", "description": "80–120 words about who it suits, what it's near, and why stay here." },
    { "name": "Real neighbourhood", "description": "80–120 words." },
    { "name": "Real neighbourhood", "description": "80–120 words." },
    { "name": "Real neighbourhood", "description": "80–120 words." }
  ],

  "firstTimers": "150–200 words naming specific areas ideal for first-time visitors.",
  "budget": "150–200 words naming good-value areas and trade-offs.",
  "couples": "150–200 words naming atmospheric or romantic areas.",
  "families": "150–200 words naming safe, spacious, practical areas.",
  "whenToVisit": "150–200 words about seasons, events, and timing hotel prices.",

  "nightlife": "150–200 words about the best areas for nightlife.",
  "food": "150–200 words about the best areas for restaurants.",
  "safety": "150–200 words about safety and areas to avoid.",
  "transport": "150–200 words about getting around ${city.name}.",
  "localTips": "150–200 words of insider advice.",
  "howManyDays": "150–200 words recommending trip length.",
  "digitalNomads": "150–200 words about areas suited to remote workers.",
  "areasToAvoid": "150–200 words about neighbourhoods visitors may want to avoid.",

  "faqs": [
    { "question": "Real question someone would Google", "answer": "2–3 sentence answer." },
    { "question": "Real question", "answer": "2–3 sentence answer." },
    { "question": "Real question", "answer": "2–3 sentence answer." },
    { "question": "Real question", "answer": "2–3 sentence answer." }
  ]
}

Rules:
- Use real neighbourhoods and landmarks in ${city.name}.
- No generic filler.
- No lists inside strings.
- No markdown.
- No extra keys.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json(
        { error: "OpenAI returned no content" },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON returned by OpenAI" },
        { status: 500 }
      );
    }

    const withKeys = (arr: any[]) =>
      arr.map((item) => ({ _key: crypto.randomUUID(), ...item }));

    await writeClient
      .patch(city._id)
      .set({
        aiIntro:           parsed.intro,
        aiHighlightsIntro: parsed.highlightsIntro,
        aiHighlightCards:  withKeys(parsed.highlightCards || []),
        aiNeighbourhoods:  withKeys(parsed.neighbourhoods || []),
        aiFirstTimers:     parsed.firstTimers,
        aiBudget:          parsed.budget,
        aiCouples:         parsed.couples,
        aiFamilies:        parsed.families,
        aiWhenToVisit:     parsed.whenToVisit,
        aiFaqs:            withKeys(parsed.faqs || []),
        aiNightlife:       parsed.nightlife,
        aiFood:            parsed.food,
        aiSafety:          parsed.safety,
        aiTransport:       parsed.transport,
        aiLocalTips:       parsed.localTips,
        aiHowManyDays:     parsed.howManyDays,
        aiDigitalNomads:   parsed.digitalNomads,
        aiAreasToAvoid:    parsed.areasToAvoid,
      })
      .commit();

    return NextResponse.json({ status: "created" });
  } catch (err: any) {
    console.error("AI GENERATION ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}