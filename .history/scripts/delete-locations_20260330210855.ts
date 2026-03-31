import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: '6ogv1wx8',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN, // this is the correct usage
  useCdn: false,
})

async function deleteAllLocations() {
  console.log('Fetching all location IDs...')
  const ids: string[] = await client.fetch(`*[_type == "location"]._id`)

  console.log(`Found ${ids.length} locations to delete.`)

  for (const id of ids) {
    await client.delete(id)
    console.log(`Deleted: ${id}`)
  }

  console.log('🎉 All locations deleted!')
}

deleteAllLocations()