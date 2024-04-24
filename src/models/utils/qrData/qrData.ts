import { SalesPointRaw, SalesPoint } from 'src/models/salesPoint/salesPoint'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { Image, ImageRaw } from 'src/models/image/image'
import { PadRaw, Pad } from 'src/models/pads/pad'
import {
  CompanyGroup,
  CompanyGroupRaw,
} from 'src/models/companyGroup/companyGroup'

export type QrDataRaw = {
  id: string | null
  type: string
  data?: {
    images?: ImageRaw[]
    sales_point?: SalesPointRaw
    pad?: PadRaw | null
    company_group?: CompanyGroupRaw
  }
  errors: string[]
}

export class QrData implements BaseModel {
  id: string | undefined
  type: string
  data: {
    images: Image[]
    salesPoint: SalesPoint | null
    pad: Pad | null
    companyGroup: CompanyGroup | null
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
          pad: raw.data.pad ? new Pad(raw.data.pad) : null,
          companyGroup: raw.data.company_group
            ? new CompanyGroup(raw.data.company_group)
            : null,
        }
      : null
    this.errors = raw.errors
  }

  toJson(): Record<string, any> {
    return {}
  }
}
