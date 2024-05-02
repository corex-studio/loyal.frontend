import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { ImageRaw } from 'src/models/image/image'

export type TableRaw = {
  uuid: string | null
  name: string
  number: number
  external_id?: string
  images: ImageRaw[]
  capacity?: number | null
  min_capacity?: number | null
  section?: string
  active?: boolean
  description: string | null
  image: ImageRaw | null
}

export class Table implements BaseModel {
  id: string
  name: string
  number: number
  externalId?: string
  images: ImageRaw[]
  capacity?: number | null
  minCapacity?: number | null
  section?: string
  active?: boolean
  description: string | null
  image: ImageRaw | null

  constructor(raw: TableRaw) {
    this.id = raw.uuid || ''
    this.name = raw.name
    this.number = raw.number
    this.externalId = raw.external_id
    this.images = raw.images
    this.capacity = raw.capacity
    this.minCapacity = raw.min_capacity
    this.section = raw.section
    this.active = raw.active
    this.description = raw.description
    this.image = raw.image
  }

  toJson(): Record<string, any> {
    return {}
  }
}
