import {
  Order,
  OrderAvailabilityRaw, OrderItemRaw,
  OrderPaymentService,
  OrderRaw,
  OrdersFilter,
  OrderSystemSource,
  PaymentType
} from './order'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { orderApi } from './orderApi'
import { reactive } from 'vue'
import { Pad } from '../pads/pad'
import { LocalStorage } from 'quasar'
import { store } from 'src/models/store'
import { Image } from 'src/models/image/image'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { menuRulesForAddingRepo } from 'src/models/menu/menuItem/menuRulesForAdding/menuRulesForAddingRepo'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import { Cart, CartRaw } from 'src/models/carts/cart'

export type ApplyPaymentsData = {
  payment_type: PaymentType
  save_next_card?: boolean
  payment_service?: OrderPaymentService
  system_source: OrderSystemSource.WEBSITE
}

export class OrderRepo extends BaseRepo<Order> {
  api = orderApi
  filters: OrdersFilter = new OrdersFilter()
  ordersToReview: Order[] = []
  orderToReview: Order | null = null

  async current(pad?: Pad, for_review?: boolean): Promise<Order[]> {
    const res: {
      results: OrderRaw[]
    } = await this.api.send({
      method: 'GET',
      action: 'current',
      params: {
        for_review,
        sales_point: pad?.salesPoint?.id,
        pad: pad?.id
      }
    })
    return res.results.map((v) => new Order(v))
  }

  async applyPayments(order: Order, data: ApplyPaymentsData) {
    const res: OrderRaw = await this.api.send({
      method: 'POST',
      action: 'apply_payments',
      id: order.id,
      data
    })
    return new Order(res)
  }

  ignoreOrderReview(orderId: string | undefined) {
    if (!orderId) return
    const resultStr = LocalStorage.getItem('Ignored-Orders') as string
    let resultArr: string[] = []
    if (resultStr) {
      resultArr = resultStr.split(',')
    }
    resultArr.push(orderId)
    LocalStorage.set('Ignored-Orders', resultArr.join(','))
  }

  async checkRepeatAvailability() {
    const res: OrderAvailabilityRaw = await this.api.send({
      method: 'GET',
      action: 'check_repeat_availability',
      id: this.item?.id
    })
    return res
  }

  async openMenuItemModal(item: OrderItemRaw) {
    if (!item.size.menu_item) return
    store.openMenuItemModal()
    store.menuItemImage = item.size.image ? new Image(item.size.image) : null
    await menuItemRepo.retrieve(item.size.menu_item, {
      sales_point: salesPointRepo.item?.id
    })
    await menuRulesForAddingRepo.list({
      menu_item: menuItemRepo.item?.id
    })
  }

  async repeat(): Promice<Cart> {
    const res: CartRaw = await this.api.send({
      method: 'POST',
      action: 'repeat',
      id: this.item?.id,
      headers: {
        'Accept-Language': 'ru'
      }
    })
    return new Cart(res)
  }
}

export const orderRepo = reactive(new OrderRepo())
