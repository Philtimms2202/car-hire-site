import { createClient } from "next-sanity"
import { apiVersion, dataset, projectId } from "../env"

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // MUST be false for writes
  token: process.env.SANITY_WRITE_TOKEN, // MUST exist
})