import {BaseModel} from 'src/corexModels/apiModels/baseModel'

export type DeliveryAreaRaw = {
  uuid: string | undefined
  sales_point: string
  coords?: number[][]
  name: string | null
  min_delivery_minutes: number
  max_delivery_minutes: number
  active: boolean
  color?: string | null

}

export class DeliveryArea implements BaseModel {
  id: string | undefined
  salesPoint: string
  coords: number[][]
  name: string
  leafletId: number | undefined
  minDeliveryMinutes: number
  maxDeliveryMinutes: number
  updated: boolean | undefined
  created: boolean | undefined
  active: boolean
  color: string | null

  constructor(raw: DeliveryAreaRaw) {
    this.id = raw.uuid
    this.coords = (raw.coords || []).map((el) => el.reverse())
    this.salesPoint = raw.sales_point
    this.name = raw.name || ''
    this.minDeliveryMinutes = raw.min_delivery_minutes
    this.maxDeliveryMinutes = raw.max_delivery_minutes
    this.active = raw.active
    this.color = raw.color || null
  }

  toJson(): Record<string, any> {
    return {
      uuid: this.id,
      coords: this.coords,
      name: this.name,
      min_delivery_minutes: this.minDeliveryMinutes,
      max_delivery_minutes: this.maxDeliveryMinutes,
      sales_point: this.salesPoint,
      color: this.color
    }
  }
}
