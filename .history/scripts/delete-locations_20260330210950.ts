import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: '6ogv1wx8',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.skeN4GcFwGW4SWZezsnJPjnnjJPN255WdyAQHFS9YS8anrNKVz3odzb1Btx0Y36FC7DH4AgwU4LZx1fuLAwvm7X4lbMwhfnokr4wrCTYhNT9DEqMaHS5mp7u5InHWA0TBvI2ckhn74j3kECZkxvFPwWvjXDz6w1fVQsZ5iZoZ29kbB2uxtBM, // safer
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