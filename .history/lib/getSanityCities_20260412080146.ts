import { client } from "@/sanity/lib/client"

export async function getSanityCities() {
  return await client.fetch(`
    *[_type == "location" && defined(primaryIATA)]{
      cityName,
      countryName,
      primaryIATA,
      "emoji": emoji,
    }
  `)
}
