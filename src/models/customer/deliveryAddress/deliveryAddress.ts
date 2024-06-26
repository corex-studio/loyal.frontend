import { BaseModel } from 'src/corexModels/apiModels/baseModel'

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
      description: this.description?.length ? this.description : undefined,
    }
  }
}
