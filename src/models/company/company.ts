import { SalesPoint } from './../salesPoint/salesPoint'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { Image, ImageRaw } from '../image/image'
import { PaymentSettings, SalesPointRaw } from '../salesPoint/salesPoint'

export enum LinkType {
  VK = 'vk',
  TELEGRAM = 'telegram',
  WEBSITE = 'website',
  MAPS = 'maps',
  OK = 'ok',
  INSTAGRAM = 'instagram',
  WHATSAPP = 'whatsapp'
}

export enum AggregatorType {
  YANDEX = 'yandex',
  DELIVERY_CLUB = 'delivery_club',
}

export type DeliveryAggregatorRaw = {
  active: boolean
  company: string | null
  link: string | null
  name: string | null
  type: AggregatorType
}

export type GuestContactRaw = {
  active: boolean
  messages: {
    value?: string
    name?: string
    link: string
    link_type: string | null
    foreground: boolean
    image: string | null
  }[]
  phones: {
    value?: string
    name?: string
    link: string
    link_type: string | null
    foreground: boolean
    image: string | null
  }[]
  emails: {
    value?: string
    name?: string
    link: string
    link_type: string | null
    foreground: boolean
    image: string | null
  }[]
  socials: {
    value?: string
    name?: string
    link: string
    link_type: LinkType
    foreground: boolean
    image: string | null
  }[]
  others: {
    value?: string
    name?: string
    link: string
    link_type: LinkType | null
    foreground: boolean
  }[]
}

export type CompanyRaw = {
  uuid: string | undefined
  alias?: string | null
  name?: string | null
  code: string | null
  external_id?: string | undefined
  company_group: string
  sales_points?: SalesPointRaw[]
  visible: boolean
  image: ImageRaw | null
  logo?: ImageRaw | null
  description_image?: ImageRaw | null
  header_image?: ImageRaw | null
  images?: ImageRaw[]
  settings: {
    uuid: string
    show_items_with_no_image: boolean
    auto_upload_menu: boolean
    created_at: string
    updated_at: string
  } | null
  payment_settings?: PaymentSettings | null
  contacts: {
    uuid: string
    active: boolean
    emails: string[]
    contact_phone: string | null
    created_at: string
    updated_at: string
  } | null
  guest_contacts: GuestContactRaw | null
  description?: string | null
  conditions?: string | null
  delivery_aggregators?: DeliveryAggregatorRaw[]
  created_at: string
  updated_at: string
}

export class GuestContact {
  active: boolean
  messages: {
    value?: string
    name?: string
    link: string
    link_type: string | null
    foreground: boolean
    image: string | null
  }[]
  phones: {
    value?: string
    name?: string
    link: string
    link_type: string | null
    foreground: boolean
    image: string | null
  }[]
  emails: {
    value?: string
    name?: string
    link: string
    link_type: string | null
    foreground: boolean
    image: string | null
  }[]
  socials: {
    value?: string
    name?: string
    link: string
    link_type: LinkType | null
    foreground: boolean
    image: string | null
  }[]
  others: {
    value?: string
    name?: string
    link: string
    link_type: LinkType | null
    foreground: boolean
  }[]

  constructor(raw: GuestContactRaw) {
    this.active = raw.active
    this.messages = raw.messages
    this.phones = raw.phones
    this.emails = raw.emails
    this.socials = raw.socials
    this.others = raw.others
  }

  toJson(): Record<string, any> {
    return {
      active: this.active,
      messages: this.messages.map((v) => {
        return {
          value: v.value,
          name: v.name,
          link: v.link,
          link_type: v.link_type,
          foreground: v.foreground,
          image: v.image
        }
      }),
      phones: this.phones.map((v) => {
        return {
          value: v.value,
          name: v.name,
          link: v.link,
          link_type: v.link_type,
          foreground: v.foreground,
          image: v.image
        }
      }),
      emails: this.emails.map((v) => {
        return {
          value: v.value,
          name: v.name,
          link: v.link,
          link_type: v.link_type,
          foreground: v.foreground,
          image: v.image
        }
      }),
      socials: this.socials.map((v) => {
        return {
          value: v.value,
          name: v.name,
          link: v.link,
          link_type: v.link_type,
          foreground: v.foreground,
          image: v.image
        }
      }),
    }
  }
}

export class Company implements BaseModel {
  id: string | undefined
  alias: string | null
  name: string | null
  code: string | null
  externalId?: string | undefined
  companyGroup: string
  salesPoints?: SalesPoint[]
  visible: boolean
  image: Image | null
  logo: Image | null
  descriptionImage: Image | null
  headerImage: Image | null
  images: Image[]
  settings: {
    uuid: string
    show_items_with_no_image: boolean
    auto_upload_menu: boolean
    created_at: string
    updated_at: string
  }
  paymentSettings: PaymentSettings | null
  contacts: {
    uuid: string | undefined
    active: boolean
    emails: string[]
    contact_phone: string | null
    created_at: string
    updated_at: string
  }

  description: string
  conditions: string | undefined | null
  createdAt: string
  updatedAt: string
  deliveryAggregators: DeliveryAggregatorRaw[]
  guestContacts: GuestContact

  constructor(raw: CompanyRaw) {
    this.id = raw.uuid || undefined
    this.alias = raw.alias || null
    this.name = raw.name || null
    this.code = raw.code
    this.externalId = raw.external_id
    this.companyGroup = raw.company_group
    this.salesPoints = raw.sales_points?.map((v) => new SalesPoint(v)) || []
    this.visible = raw.visible
    this.image = raw.image ? new Image(raw.image) : null
    this.logo = raw.logo ? new Image(raw.logo) : null
    this.descriptionImage = raw.description_image
      ? new Image(raw.description_image)
      : null
    this.headerImage = raw.header_image ? new Image(raw.header_image) : null
    this.images = raw.images ? raw.images.map((el) => new Image(el)) : []
    this.settings = raw.settings || {
      auto_upload_menu: false,
      created_at: '',
      show_items_with_no_image: false,
      updated_at: '',
      uuid: '',
    }
    this.paymentSettings = raw.payment_settings || null
    this.contacts = raw.contacts
      ? raw.contacts
      : {
          uuid: undefined,
          active: false,
          emails: [],
          contact_phone: null,
          created_at: '',
          updated_at: '',
        }
    this.description = raw.description || ''
    this.conditions = raw.conditions
    this.createdAt = raw.created_at
    this.updatedAt = raw.updated_at
    this.guestContacts = new GuestContact(
      raw.guest_contacts || {
        active: false,
        emails: [],
        messages: [],
        phones: [],
        socials: [],
        others: [],
      },
    )
    this.deliveryAggregators = raw.delivery_aggregators || []
  }

  toJson(): Record<string, any> {
    return {
      uuid: this.id,
      name: this.name,
      code: this.code,
      external_id: this.externalId,
      company_group: this.companyGroup,
      sales_points: this.salesPoints,
      visible: this.visible,
      image: this.image,
      images: this.images,
      description: this.description || undefined,
      settings: { ...this.settings, uuid: undefined },
      contacts: { ...this.contacts, uuid: undefined },
    }
  }
}
