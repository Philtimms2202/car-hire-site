import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { postType } from './postType'
import { authorType } from './authorType'
import { locationType } from './locationType'

import continent from './continent'
import country from './country'
import city from './city'
import guideCategory from './guideCategory'
import guide from './guide'
import flightHubContent from './flightHubContent'
import dealCategoryContent from './dealCategoryContent'
import dealAirportContent from './dealAirportContent'
import table from './table'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    locationType,
    continent,
    country,
    city,
    guideCategory,  // ← must come before guide
    guide,
    flightHubContent,
    dealCategoryContent,
    dealAirportContent,
    table,
  ],
}