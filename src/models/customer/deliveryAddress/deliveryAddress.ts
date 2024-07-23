import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { companyRepo } from 'src/models/company/companyRepo'
import { notifier } from 'src/services/notifier'

export type DeliveryAddressRaw = {
  uuid?: string | undefined
  customer?: string
  name: string | null
  address: string | null
  coords: {
    latitude: number | null
    longitude: number | null
  } | null
  city: string | null
  street: string | null
  house: string | null
  flat: string | null
  floor: string | number | null
  entrance?: string | null
  intercom?: string | null
  description?: string | null
  sales_point?: string | null
}

export class DeliveryAddress implements BaseModel {
  id: string | undefined
  customer: string
  name: string | null
  address: string
  coords: {
    latitude: number | null
    longitude: number | null
  } | null
  city: string | null
  street: string | null
  house: string | null
  flat: string | null
  floor: string | number | null
  entrance: string | null
  intercom: string | null
  description: string | null
  salesPoint: string | null

  constructor(raw: DeliveryAddressRaw) {
    this.id = raw.uuid
    this.name = raw.name
    this.customer = raw.customer || ''
    this.address = raw.address || ''
    this.coords = raw.coords
    this.city = raw.city
    this.street = raw.street
    this.house = raw.house
    this.flat = raw.flat
    this.floor = raw.floor
    this.entrance = raw.entrance || null
    this.intercom = raw.intercom || null
    this.description = raw.description || null
    this.salesPoint = raw.sales_point || null
  }

  get isAddressAvailable(): boolean {
    const isSalesPointInCurrentCity = companyRepo.currentCitySalesPoints()?.find(el => el.id === this.salesPoint)
    return !!(this.salesPoint || isSalesPointInCurrentCity)

  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      address: this.address,
      city: this.city,
      street: this.street,
      house: this.house,
      coords: this.coords,
      name: this.name,
      flat: this.flat,
      floor: this.floor,
      entrance: this.entrance,
      intercom: this.intercom?.length ? this.intercom : null,
      description: this.description?.length ? this.description : undefined
    }
  }
}
