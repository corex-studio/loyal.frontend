import { OrderReview, OrderReviewsFilter } from './orderReview'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { orderReviewApi } from './orderReviewApi'
import { reactive } from 'vue'
import { orderRepo } from '../orderRepo'
import { LocalStorage } from 'quasar'

export class OrderReviewRepo extends BaseRepo<OrderReview> {
  api = orderReviewApi
  filters: OrderReviewsFilter = new OrderReviewsFilter()

  async getOrderToReview() {
    const orders = await orderRepo.current(undefined, true)
    orderRepo.ordersToReview = orders
    const resultStr = LocalStorage.getItem('Ignored-Orders') as string
    if (resultStr) {
      const resultArr = resultStr.split(',')
      const foundUnviewedOrder = orders.find((el) => {
        if (!el.id) return
        return !resultArr.includes(el.id)
      })
      if (foundUnviewedOrder) {
        orderRepo.orderToReview = foundUnviewedOrder
      }
    } else {
      orderRepo.orderToReview = orders[0]
    }
  }
}

export const orderReviewRepo = reactive(new OrderReviewRepo())
