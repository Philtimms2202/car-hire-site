import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, token } from "../env.js";

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});
