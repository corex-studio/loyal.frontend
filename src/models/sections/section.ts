import moment from 'moment'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { ImageRaw } from '../image/image'
import { TableRaw } from './tables/table'
export type FigureRaw = {
  uuid: string
  x: number
  y: number
  z: number
  text?: string
  type: string
  angle: number
  width: number
  height: number
  color: string
  image?: ImageRaw
  font_size?: number
  table: TableRaw
  scheme?: string
  active: boolean
}

export type SchemeRaw = {
  uuid?: string
  width: number
  height: number
  section?: string
  image?: ImageRaw | null
  figures: FigureRaw[]
  active: boolean
}

export type SectionRaw = {
  uuid: string
  name?: string
  external_id: string
  terminal_group: string
  tables: TableRaw[]
  sales_point: string
  scheme: SchemeRaw | null
  active: boolean
  created_at: string
  updated_at: string
}

export class Section implements BaseModel {
  id: string
  name?: string
  external_id: string
  terminal_group: string
  tables: TableRaw[]
  sales_point: string
  scheme: SchemeRaw | null
  active: boolean
  createdAt: string
  updatedAt: string

  constructor(raw: SectionRaw) {
    this.id = raw.uuid
    this.name = raw.name
    this.external_id = raw.external_id
    this.terminal_group = raw.terminal_group
    this.tables = raw.tables
    this.sales_point = raw.sales_point
    this.scheme = raw.scheme
    this.active = raw.active
    this.createdAt = moment(raw.created_at).local().format('DD.MM.YYYY')
    this.updatedAt = moment(raw.updated_at).local().format('DD.MM.YYYY')
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      active: this.active,
      name: this.name,
      sales_point: this.sales_point,
    }
  }
}
