import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { Image, ImageRaw } from 'src/models/image/image'
import { MenuItem, MenuItemRaw } from '../menuItem/menuItem'

export type MenuGroupRaw = {
  uuid?: string
  menu: string
  external_id?: string | null
  name: string
  image?: ImageRaw
  description?: string
  sorting?: number | null
  parent?: string
  children?: MenuGroupRaw[]
  items?: MenuItemRaw[]
}

export class MenuGroup implements BaseModel {
  id: string
  menu: string
  externalId: string | null
  name: string
  image: Image | null
  description: string | null
  sorting: number | null
  parent: string | null
  children: MenuGroup[]
  items: MenuItem[]
  show: boolean

  constructor(raw: MenuGroupRaw) {
    this.id = raw.uuid || ''
    this.menu = raw.menu
    this.externalId = raw.external_id || null
    this.name = raw.name
    this.image = raw.image ? new Image(raw.image) : null
    this.description = raw.description || null
    this.sorting = raw.sorting || null
    this.parent = raw.parent || null
    this.children = raw.children
      ? raw.children.map((el) => new MenuGroup(el))
      : []
    this.items = raw.items?.map((v) => new MenuItem(v)) || []
    this.show = false
  }

  toJson(): Record<string, any> {
    return {
      name: this.name,
      menu: this.menu,
      description: this.description,
      parent: this.parent,
    }
  }
}
