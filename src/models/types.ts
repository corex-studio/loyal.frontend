export type Contact = {
  active: boolean
  contact_phone: string | null
  created_at: string | null
  emails: string[]
  updated_at: string | null
  uuid: string | undefined
}

export type Address = {
  address: string
  city: string
  street: string
  house: string

  coords: number[]
  floor: number | string | null
  flat: string | null
}
