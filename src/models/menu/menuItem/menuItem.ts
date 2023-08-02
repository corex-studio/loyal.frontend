import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { Image, ImageRaw } from 'src/models/image/image'
import { Product, ProductRaw } from 'src/models/product/product'
import { ItemSize, ItemSizeRaw } from '../menu'

export type MenuItemRaw = {
  uuid: string
  menu: string
  name: string | null
  product: ProductRaw | string | null
  sku: string | null
  image: ImageRaw | null
  images?: ImageRaw[]
  description: string | null
  external_id: string | null
  group: string | null
  sizes: ItemSizeRaw[] | null
  active?: boolean
}

export class MenuItem implements BaseModel {
  id: string
  menu: string
  name: string | null
  product: Product | string | null
  sku: string | null
  image: Image | null
  images?: Image[]
  description: string | null
  externalId: string | null
  group: string | null
  sizes: ItemSize[]
  active?: boolean

  constructor(raw: MenuItemRaw) {
    this.id = raw.uuid
    this.menu = raw.menu
    this.name = raw.name
    this.product =
      typeof raw.product === 'string'
        ? raw.product
        : raw.product
        ? new Product(raw.product)
        : null
    this.sku = raw.sku
    this.image = raw.image ? new Image(raw.image) : null
    this.images = raw.images?.map((v) => new Image(v))
    this.description = raw.description
    this.externalId = raw.external_id
    this.group = raw.group
    this.sizes = raw.sizes ? raw.sizes.map((v) => new ItemSize(v)) : []
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      menu: this.menu,
      name: this.name,
      product: this.product,
      sku: this.sku,
      sizes: this.sizes,
      description: this.description,
      externalId: this.externalId,
      group: this.group,
    }
  }
}
