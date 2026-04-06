import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { postType } from './postType'
import { authorType } from './authorType'
import { locationType } from './locationType'

// ⭐ FIXED PATHS — these must point to schemaTypes/
import continent from './continent'
import country from './country'
import city from './city'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    locationType,

    // New structured types
    continent,
    country,
    city
  ],
}