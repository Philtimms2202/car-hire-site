import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const airports = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data/airports.json'), 'utf8')
)

// Deduplicate cities
const uniqueCities = {}
airports.forEach(a => {
  const key = `${a.city}-${a.country}`
  if (!uniqueCities[key]) {
    uniqueCities[key] = {
      city: a.city,
      country: a.country
    }
  }
})

const cityList = Object.values(uniqueCities)

async function getTripCityId(cityName) {
  const url = `https://www.trip.com/hotels/list?display=${encodeURIComponent(cityName)}`
  const res = await fetch(url, { redirect: 'manual' })

  const location = res.headers.get('location')
  if (!location) return null

  // Extract the numeric ID from URLs like:
  // /hotels/manchester-hotels-list-384/
  const match = location.match(/-(\d+)\/?$/)
  return match ? match[1] : null
}

async function run() {
  const mapping = {}

  for (const city of cityList) {
    const id = await getTripCityId(city.city)
    if (id) {
      mapping[city.city] = id
      console.log(`✔ ${city.city} → ${id}`)
    } else {
      console.log(`✖ No ID found for ${city.city}`)
    }

    // Avoid hammering Trip.com
    await new Promise(r => setTimeout(r, 500))
  }

  fs.writeFileSync(
    path.join(process.cwd(), 'data/trip-city-map.json'),
    JSON.stringify(mapping, null, 2)
  )

  console.log('Done! Mapping saved to data/trip-city-map.json')
}

run()
