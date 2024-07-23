import {
  DeliveryAddressRaw,
  DeliveryAddress
} from './../customer/deliveryAddress/deliveryAddress'
import { SalesPointRaw, SalesPoint } from './../salesPoint/salesPoint'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { CartItem, CartItemRaw } from './cartItem/cartItem'
import moment from 'moment'
import { WalletRaw } from '../customer/customer'
import { sum } from 'lodash'
import { MenuItem, MenuItemRaw } from '../menu/menuItem/menuItem'

export enum CalculationStatus {
  INACTIVE = 'inactive',
  IN_PROGRESS = 'in_progress',
  FAILED = 'failed',
  CALCULATED = 'calculated',
}

export enum CartType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
  BOOKING = 'booking',
  TABLE = 'table',
}

export const cartTypeName = {
  [CartType.BOOKING]: 'Бронь',
  [CartType.PICKUP]: 'Самовывоз',
  [CartType.DELIVERY]: 'Доставка',
  [CartType.TABLE]: 'В стол'
}

export type WalletPaymentRaw = {
  active: boolean
  applied_sum: number
  cart: string
  max_sum: number
  uuid: string
  wallet: WalletRaw
}

export type AvailableHours = {
  today: [
    {
      start: string
      end: string
    },
  ]
  tomorrow: [
    {
      start: string
      end: string
    },
  ]
}

export type CartParams = {
  sales_point?: string
  type?: CartType
  pad?: string
  delivery_address?: string
  delivery_time?: string | null
  eat_inside?: boolean
  promo_code?: string | null
  applied_wallet_payments?: {
    wallet_payment: string
    applied_sum: number
  }[]
  comment?: string | null
  guest_count?: number
  use_bonuses?: boolean
  cart?: string
}

export type CartRaw = {
  uuid: string
  customer: string
  company: string
  type: CartType
  sales_point: SalesPointRaw
  delivery_address: DeliveryAddressRaw | null
  sum: number
  total_sum: number
  total_discount: number
  created_at: string
  delivery_time: string | null
  discounted_total_sum: number
  discounted_sum: number
  applied_bonuses: number
  promo_code: string | null
  comment: string | null
  cart_items: CartItemRaw[]
  free_items: {
    uuid: string
    active: boolean
    cart: string
    cart_item: string
    menu_item: MenuItemRaw
    applied: boolean
  }[]
  calculation_status?: CalculationStatus
  delivery_area: string | null
  current_delivery_settings: string | null
  delivery_price: number
  wallet_payments: WalletPaymentRaw[]
  errors: {
    description: string | null
    title: string | null
  }[]
  user_errors: {
    additional?: string[]
    address?: string | null
    payment?: string | null
    time?: string | null
  }
  eat_inside: boolean
  guest_count: number
  closest_time_text?: string | null
  use_bonuses?: boolean
  total_discount_without_bonuses?: number
}

export class Cart implements BaseModel {
  id: string
  customer: string
  company: string
  type: CartType
  salesPoint: SalesPoint
  deliveryAddress: DeliveryAddress | null
  sum: number
  totalSum: number
  totalDiscount: number
  createdAt: string
  deliveryTime: string | null
  discountedTotalSum: number
  discountedSum: number
  appliedBonuses: number
  promoCode: string | null
  comment: string | null
  cartItems: CartItem[]
  deliveryPrice: number
  walletPayments: WalletPaymentRaw[]
  deliveryArea: string | null
  errors: {
    description: string | null
    title: string | null
  }[]
  userErrors: {
    additional: string[]
    address: string | null
    payment: string | null
    time: string | null
  }
  freeItems: {
    uuid: string
    active: boolean
    cart: string
    cartItem: string
    menuItem: MenuItem
    applied: boolean
  }[]
  eatInside: boolean
  guestCount: number
  closestTimeText: string | null
  calculationStatus: CalculationStatus
  useBonuses: boolean
  totalDiscountWithoutBonuses: number | undefined

  constructor(raw: CartRaw) {
    this.id = raw.uuid
    this.customer = raw.customer
    this.company = raw.company
    this.type = raw.type
    this.salesPoint = new SalesPoint(raw.sales_point)
    this.deliveryAddress = raw.delivery_address
      ? new DeliveryAddress(raw.delivery_address)
      : null
    this.sum = raw.sum
    this.totalSum = raw.total_sum
    this.totalDiscount = raw.total_discount
    this.createdAt = raw.created_at
    this.deliveryTime = raw.delivery_time
      ? moment
        .utc(raw.delivery_time, 'YYYY-MM-DD HH:mm:ss')
        .local()
        .format('DD.MM.YYYY HH:mm')
      : null
    this.discountedTotalSum = raw.discounted_total_sum
    this.discountedSum = raw.discounted_sum
    this.appliedBonuses = raw.applied_bonuses
    this.promoCode = raw.promo_code
    this.comment = raw.comment
    this.cartItems = raw.cart_items.map((item) => new CartItem(item))
    this.deliveryPrice = raw.delivery_price
    this.walletPayments = raw.wallet_payments
    this.deliveryArea = raw.delivery_area
    this.errors = raw.errors
    this.freeItems = raw.free_items.map((el) => {
      return {
        uuid: el.uuid,
        active: el.active,
        cart: el.cart,
        cartItem: el.cart_item,
        menuItem: new MenuItem(el.menu_item),
        applied: el.applied
      }
    })
    this.eatInside = raw.eat_inside
    this.guestCount = raw.guest_count
    this.closestTimeText = raw.closest_time_text || null
    this.calculationStatus =
      raw.calculation_status || CalculationStatus.INACTIVE
    this.useBonuses = raw.use_bonuses || false
    this.totalDiscountWithoutBonuses = raw.total_discount_without_bonuses
    this.userErrors = {
      additional: raw.user_errors.additional || [],
      address: raw.user_errors.address || null,
      payment: raw.user_errors.payment || null,
      time: raw.user_errors.time || null
    }
  }

  get cartItemsQuantitySum() {
    return sum(
      this.cartItems.filter((el) => !el.attachedTo).map((v) => v.quantity)
    )
  }

  get discountedSumWithoutBonuses() {
    return this.discountedSum + this.appliedBonuses
  }

  get currentAddress() {
    return this.type === CartType.DELIVERY
      ? this.deliveryAddress?.address
      : this.salesPoint.customAddress || this.salesPoint.address
  }

  get isDelivery() {
    return this.type === CartType.DELIVERY
  }

  get currentDeliveryType() {
    return cartTypeName[this.type]
  }

  toJson(): Record<string, any> {
    return {}
  }
}
