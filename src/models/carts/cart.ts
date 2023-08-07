import {
  DeliveryAddressRaw,
  DeliveryAddress,
} from './../customer/deliveryAddress/deliveryAddress'
import { SalesPointRaw, SalesPoint } from './../salesPoint/salesPoint'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { CartItem, CartItemRaw } from './cartItem/cartItem'
import moment from 'moment'

export type AvailableHours = {
  today: [
    {
      start: string
      end: string
    }
  ]
  tomorrow: [
    {
      start: string
      end: string
    }
  ]
}

export type CartToParams = {
  sales_point: string
  type: string
  delivery_address?: string
  delivery_time?: string
  promo_code?: string
  applied_wallet_payments?: {
    wallet_payment: string
    applied_sum: number
  }[]
}

export type CartRaw = {
  uuid: string
  customer: string
  company: string
  type: string
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
  // free_items: [];
  // wallet_payments: [];
  // tables: [];
  calculation_status: string
  delivery_area: string | null
  current_delivery_settings: string | null
  delivery_price: number
}

export class Cart implements BaseModel {
  id: string
  customer: string
  company: string
  type: string
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
  }

  toJson(): Record<string, any> {
    return {
      // id: this.id,
    }
  }
}
