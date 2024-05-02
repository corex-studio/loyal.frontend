import { BaseModel } from 'src/corexModels/apiModels/baseModel'

export type ProductRaw = {
  uuid: string
  name: string
  company: string
  sku: string | null
  external_id: string | null
  type: string | null
  price: number
  category: string | null
  nutritions?: {
    uuid: string
    product: string
    type: string
    fats: number
    proteins: number
    carbohydrates: number
    calories: number
  }[]
  group: {
    uuid: string
    name: string
    company: string
    parent: string | null
    external_parent: string | null
    external_id: string
  } | null
  created_from_menu: boolean
}
export class Product implements BaseModel {
  id: string
  name: string
  company: string
  sku: string | null
  externalId: string | null
  type: string | null
  price: number
  category: string | null
  nutritions?: {
    uuid: string
    product: string
    type: string
    fats: number
    proteins: number
    carbohydrates: number
    calories: number
  }[]
  group: {
    uuid: string
    name: string
    company: string
    parent: string | null
    external_parent: string | null
    external_id: string
  } | null
  createdFromMenu: boolean

  constructor(raw: ProductRaw) {
    this.id = raw.uuid
    this.category = raw.category
    this.company = raw.company
    this.createdFromMenu = raw.created_from_menu
    this.price = raw.price
    this.type = raw.type
    this.externalId = raw.external_id
    this.group = raw.group
    this.name = raw.name
    this.nutritions = raw.nutritions
    this.sku = raw.sku
  }

  toJson(): Record<string, any> {
    return {}
  }
}
