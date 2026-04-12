import { client } from "@/sanity/lib/client"

export async function getSanityCities() {
  return await client.fetch(`
    *[_type == "city" && defined(primaryIATA)]{
      "cityName": name,
      "countryName": country->name,
      primaryIATA,
      emoji
    }
  `)
}
