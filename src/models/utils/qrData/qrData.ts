import { SalesPointRaw, SalesPoint } from 'src/models/salesPoint/salesPoint'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { Image, ImageRaw } from 'src/models/image/image'

export type QrDataRaw = {
  id: string | null
  type: string
  data?: {
    images?: ImageRaw[]
    sales_point?: SalesPointRaw
  }
  errors: string[]
}

export class QrData implements BaseModel {
  id: string | undefined
  type: string
  data: {
    images: Image[]
    salesPoint: SalesPoint | null
  } | null
  errors: string[]
  constructor(raw: QrDataRaw) {
    this.id = raw.id || undefined
    this.type = raw.type
    this.data = raw.data
      ? {
          images: raw.data.images
            ? raw.data.images.map((v) => new Image(v))
            : [],
          salesPoint: raw.data.sales_point
            ? new SalesPoint(raw.data.sales_point)
            : null,
        }
      : null
    this.errors = raw.errors
  }

  toJson(): Record<string, any> {
    return {
      // id: this.id,
    }
  }
}
