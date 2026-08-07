// sanity/lib/client.ts
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // 👈 Bypasses the blocked CDN endpoint (api.sanity.io vs apicdn.sanity.io)
})