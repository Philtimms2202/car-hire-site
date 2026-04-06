import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: '6ogv1wx8',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skbM2wjptIBowWbanstD1QemoyR8TUiGMMfQp7opPrwJwWLBuhgDQJ8RBZbIdPBkmWy8YOY07UjnPyGwLkjqBNk5o5At7p4OMofdoIW9EkfuT2Kphhym0bPxQcrEIWRnvQjDtuTqomKvnabHm0WxrwYSIHMmFIo8hzk75tT0oUsLYcwcv67f',
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