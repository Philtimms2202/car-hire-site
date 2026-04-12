import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    deskTool(),
    visionTool({ defaultApiVersion: apiVersion }),
    unsplashImageAsset(),   // ← added here
  ],
})