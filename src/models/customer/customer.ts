import { ImageRaw } from './../image/image'
import moment from 'moment'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'

export enum SexType {
  MALE = 'male',
  FEMALE = 'female',
  NOT_STATED = 'not_stated',
}

export const sexNames = {
  [SexType.MALE]: 'Мужской',
  [SexType.FEMALE]: 'Женский',
  [SexType.NOT_STATED]: 'Не указан',
}

export const sexValues = Object.keys(sexNames).map((v) => {
  const key = v as keyof typeof sexNames
  return {
    label: sexNames[key],
    value: key,
  }
})

export type WalletRaw = {
  uuid: string
  name: string | null
  external_id: string | null
  type: string
  active: boolean
  balance: number
  customer: string
  loyalty_programm: string
  created_at: string | null
  updated_at: string | null
}

export type CustomersFilters = {
  search?: string
  registered_at?: string
}

export type LoyaltyCardRaw = {
  uuid: string
  name: string | null
  customer: string
  active: boolean
  created_at: string | null
  updated_at: string | null
  card_number: number | null
  expiration_date: string | null
  company_group: string | null
  external_id: string | null
}

export type CategoryRaw = {
  uuid: string
  name: string
  external_id: string | null
  company_group: string
  customers: string[]
}

export type CustomerRaw = {
  uuid: string | undefined
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  birthday: string | null
  sex: SexType | null
  email: string | null
  receive_promo: boolean
  username: string | null
  company_group: string | null
  referrer: string | null
  external_id: string | null
  loyalty_cards: LoyaltyCardRaw[]
  categories: {
    company_group: string
    customers: string[]
    external_id: string
    name: string
    uuid: string
  }[]
  wallets: WalletRaw[]
  loyalty_system: string | null
  active: boolean
  user: number
  phone: number | null
  last_authorization: string | null
  registered_at: string | null
  description: string | null
  technical_information: string | null
  image?: ImageRaw | null
  is_anonymous?: boolean
}

export class Customer implements BaseModel {
  id: string | undefined
  firstName: string
  middleName: string
  lastName: string
  birthday: string | null
  sex: SexType
  email: string | null
  receivePromo: boolean
  username: string | null
  companyGroup: string | null
  referrer: string | null
  externalId: string | null
  loyaltyCards: LoyaltyCardRaw[]
  categories: {
    company_group: string
    customers: string[]
    external_id: string
    name: string
    uuid: string
  }[]
  wallets: WalletRaw[]
  loyaltySystem: string | null
  active: boolean
  user: number
  phone: number | null
  lastAuthorization: string | null
  registeredAt: string | null
  description: string | null
  technicalInformation: string | null
  image: ImageRaw | null
  isAnonymous?: boolean

  constructor(raw: CustomerRaw) {
    this.id = raw.uuid
    this.firstName = raw.first_name || ''
    this.middleName = raw.middle_name || ''
    this.lastName = raw.last_name || ''
    this.birthday = raw.birthday
      ? moment.utc(raw.birthday).local().format('DD.MM.YYYY')
      : null
    this.sex = raw.sex || SexType.NOT_STATED
    this.email = raw.email
    this.receivePromo = raw.receive_promo
    this.username = raw.username
    this.companyGroup = raw.company_group
    this.referrer = raw.referrer
    this.externalId = raw.external_id
    this.loyaltyCards = raw.loyalty_cards
    this.categories = raw.categories
    this.wallets = raw.wallets
    this.loyaltySystem = raw.loyalty_system
    this.active = raw.active
    this.user = raw.user
    this.phone = raw.phone
    this.lastAuthorization = raw.last_authorization
      ? moment.utc(raw.last_authorization).local().format('DD.MM.YYYY HH:mm')
      : '-'
    this.registeredAt = raw.registered_at
      ? moment.utc(raw.registered_at).local().format('DD.MM.YYYY HH:mm')
      : null
    this.description = raw.description
    this.technicalInformation = raw.technical_information
    this.image = raw.image || null
    this.isAnonymous = raw.is_anonymous
  }

  get loyaltyCard() {
    return this.loyaltyCards.find((v) => v.active)
  }

  get fullName() {
    const array = []
    if (this.firstName) array.push(this.firstName)
    if (this.middleName) array.push(this.middleName)
    if (this.lastName) array.push(this.lastName)

    return array.join(' ')
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      sex: this.sex,
      email: this.email,
    }
  }
}
