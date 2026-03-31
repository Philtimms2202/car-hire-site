import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '6ogv1wx8',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skeN4GcFwGW4SWZezsnJPjnnjJPN255WdyAQHFS9YS8anrNKVz3odzb1Btx0Y36FC7DH4AgwU4LZx1fuLAwvm7X4lbMwhfnokr4wrCTYhNT9DEqMaHS5mp7u5InHWA0TBvI2ckhn74j3kECZkxvFPwWvjXDz6w1fVQsZ5iZoZ29kbB2uxtBM',
  useCdn: false,
})

async function deleteAllLocations() {
  console.log('Deleting all locations...')
  const locations = await client.fetch(`*[_type == "location"]._id`)
  for (const id of locations) {
    await client.delete(id)
    console.log(`Deleted: ${id}`)
  }
  console.log('All locations deleted!')
}

deleteAllLocations()