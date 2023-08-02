import { Order, OrdersFilter } from './order'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { orderApi } from './orderApi'
import { reactive } from 'vue'

export class OrderRepo extends BaseRepo<Order> {
  api = orderApi
  filters: OrdersFilter = new OrdersFilter()
}

export const orderRepo = reactive(new OrderRepo())
