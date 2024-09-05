import { CompanyRaw, Company } from './../company/company'
import moment from 'moment'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { Contact } from '../types'
import { Image, ImageRaw } from '../image/image'
import { Schedule, ScheduleRaw } from './schedule/schedule'

export enum SalesPointPromocodesSettingTypes {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
}

export enum PromoCodeMode {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
  ENABLED_ALWAYS = 'enabled_always',
}

export const salesPointPromocodesSettingNames = {
  [SalesPointPromocodesSettingTypes.ENABLED]: 'Включено',
  [SalesPointPromocodesSettingTypes.DISABLED]: 'Отключено',
}

export const salesPointPromocodesSettingValues = Object.keys(
  salesPointPromocodesSettingNames,
).map((v) => {
  const key = v as keyof typeof salesPointPromocodesSettingNames
  return {
    label: salesPointPromocodesSettingNames[key],
    value: key,
  }
})

export type SalesPointSettings = {
  delivery_enabled: boolean
  pickup_enabled: boolean
  table_orders_enabled: boolean
  booking_enabled: boolean
  booking_table_pick_enabled: boolean
  cart_enabled: boolean
  allow_order_arrangement_without_delivery_time: boolean
  allow_arrange_from_qr: boolean
  promo_codes: PromoCodeMode
  allow_set_guest_count: boolean
  allow_pickup_orders_inside: boolean
  delivery_date_picker?: {
    end_offset: number
    must_be_confirmed_if_more_then_hours: number
    start_offset: number
  } | null
}

export type AvailablePaymentType = {
  uuid: string
  sales_point: string
  terminal_groups: Array<string>
  external_type: string
  external_id: string
  external_code: string
}

export type PaymentSettings = {
  cash_enabled: boolean
  card_enabled: boolean
  online_payment_enabled: boolean
  bonus_using_enabled: boolean
  payment_types_mapping: {
    bonus: string
    cash: string
    card: string
    online: string
  }
  update_on_parent_change?: boolean
  net_monet_enabled: boolean
  pay_later_enabled: boolean
}

export type SalesPointRaw = {
  uuid: string
  name?: string
  code: string
  settings: SalesPointSettings
  payment_settings: PaymentSettings
  external_id: string
  address: string
  custom_address: string | null
  coords: {
    latitude: number | null
    longitude: number | null
  }
  company: CompanyRaw | string | null
  company_group: string
  test_settings: SalesPointSettings
  test_payment_settings: PaymentSettings
  active: boolean
  visible: boolean
  created_at: string
  updated_at: string
  menu: string | null
  price: number
  image: ImageRaw | null
  images?: ImageRaw[]
  contacts: Contact
  schedule: ScheduleRaw | null
  legal_entity?: string
}

export class SalesPoint implements BaseModel {
  id: string | undefined
  name: string
  code: string
  settings: SalesPointSettings
  paymentSettings: PaymentSettings
  externalId: string
  address: string
  customAddress: string | null
  coords: {
    latitude: number | null
    longitude: number | null
  }
  company: Company | string | null
  companyGroup: string
  testSettings: SalesPointSettings
  testPaymentSettings: PaymentSettings
  active: boolean
  visible: boolean
  createdAt: string
  updatedAt: string
  menu: string | null
  price: number
  image: Image | null
  images: Image[]
  contacts: Contact
  schedule: Schedule | null
  legalEntity: string

  constructor(raw: SalesPointRaw) {
    this.id = raw.uuid
    this.name = raw.name || ''
    this.code = raw.code
    this.settings = raw.settings
    this.paymentSettings = raw.payment_settings
    this.externalId = raw.external_id
    this.address = raw.address
    this.customAddress = raw.custom_address
    this.coords = raw.coords
    this.company =
      typeof raw.company === 'string'
        ? raw.company
        : raw.company
          ? new Company(raw.company)
          : null
    this.companyGroup = raw.company_group
    this.testSettings = raw.test_settings
    this.testPaymentSettings = raw.test_payment_settings
    this.active = raw.active
    this.visible = raw.visible
    this.createdAt = moment
      .utc(raw.created_at, 'YYYY-MM-DD HH:mm:ss')
      .format('DD.MM.YYYY')
    this.updatedAt = raw.updated_at
    this.menu = raw.menu
    this.price = raw.price
    this.image = raw.image ? new Image(raw.image) : null
    this.images = raw.images ? raw.images.map((v) => new Image(v)) : []
    this.contacts = raw.contacts
    this.schedule = raw.schedule
      ? new Schedule(raw.schedule)
      : new Schedule({
          days: [1, 2, 3, 4, 5, 6, 7].map((v) => {
            return {
              active: false,
              day: v,
              times: [],
            }
          }),
        })
    this.legalEntity = raw.legal_entity || ''
  }

  get currentAddress() {
    return this.customAddress || this.address
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      settings: this.settings,
      active: this.active,
      custom_address: this.customAddress,
      company: this.company,
      company_group: this.companyGroup,
      visible: this.visible,
      contacts: {
        active: this.contacts.active,
        contact_phone: this.contacts.contact_phone,
        created_at: this.contacts.created_at,
        emails: this.contacts.emails,
        updated_at: this.contacts.updated_at,
      },
      menu: this.menu,
    }
  }
}
