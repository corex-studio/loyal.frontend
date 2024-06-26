import { waiterCallRepo } from './../customer/waiterCall/waiterCallRepo'
import {
  WaiterCall,
  WaiterCallRaw
} from 'src/models/customer/waiterCall/waiterCall'
import { orderRepo } from './../order/orderRepo'
import { Customer, CustomerRaw } from './../customer/customer'
import { authentication } from './../authentication/authentication'
import { cartRepo } from './../carts/cartRepo'
import { Cart, CartRaw } from 'src/models/carts/cart'
import { Order, OrderRaw } from '../order/order'
import { useEventBus } from '@vueuse/core'
import { orderUpdatedKey } from 'src/services/eventBusKeys'
import { orderReviewRepo } from '../order/orderReview/orderReviewRepo'
import { notifier } from 'src/services/notifier'
import { store } from 'src/models/store'

export type WebSocketMessage = {
  type:
    | 'cart.updated'
    | 'user.updated'
    | 'order.updated'
    | 'waiter_call.updated'
    | 'services.telegram_authorization'
  data: any
}

export const handleMessage = (v: MessageEvent<string>) => {
  const response = JSON.parse(v.data) as WebSocketMessage
  if (response.type === 'cart.updated') {
    cartRepo.item = new Cart(response.data as CartRaw)
    cartRepo.item.errors.forEach((error) => {
      if (error.title === 'Промокод') {
        cartRepo.promocodeError = true
      } else if (error.description) notifier.error(error.description)
    })
    cartRepo.loading = false
    cartRepo.setParamsLoading = false
    if (store.cartDrawer) {
      void cartRepo.getUpsales()
    }
  }
  if (response.type === 'user.updated') {
    authentication.user = new Customer(response.data as CustomerRaw)
  }
  if (response.type === 'order.updated') {
    const order = new Order(response.data as OrderRaw)
    useEventBus(orderUpdatedKey).emit({ order })
    orderRepo.item = order
    if (authentication.user) void orderReviewRepo.getOrderToReview()
  }
  if (response.type === 'waiter_call.updated') {
    waiterCallRepo.item = new WaiterCall(response.data as WaiterCallRaw)
  }
  if (response.type === 'services.telegram_authorization') {
    void authentication.tokenAuth(response.data.access, response.data.refresh)
  }

  return response
}
