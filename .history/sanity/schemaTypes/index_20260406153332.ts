import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { postType } from './postType'
import { authorType } from './authorType'
import { locationType } from './locationType'

// ⭐ NEW SCHEMAS
import continent from './continent'
import country from './country'
import city from './city'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,

    // Keep your old schema for now
    locationType,

    // ⭐ Add new structured schemas
    continent,
    country,
    city
  ],
}