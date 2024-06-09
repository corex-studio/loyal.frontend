import { Order, OrderRaw, OrdersFilter } from './order'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { orderApi } from './orderApi'
import { reactive } from 'vue'
import { Pad } from '../pads/pad'
import { LocalStorage } from 'quasar'

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

  async applyPayments(data: Record<string, any>) {
    const res: OrderRaw = await this.api.send({
      method: 'POST',
      action: 'apply_payments',
      id: this.item?.id,
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
}

export const orderRepo = reactive(new OrderRepo())
