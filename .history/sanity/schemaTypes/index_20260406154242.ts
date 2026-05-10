import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { postType } from './postType'
import { authorType } from './authorType'
import { locationType } from './locationType'

// ⭐ Correct imports — all in the same folder
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

    // ⭐ These must NOT be undefined
    continent,
    country,
    city
  ],
}
