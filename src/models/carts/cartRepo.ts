import { OrderRaw, Order } from './../order/order'
import { Cart, CartToParams, CartRaw, AvailableHours } from './cart'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { cartApi } from './cartApi'
import { reactive } from 'vue'

export class CartRepo extends BaseRepo<Cart> {
  api = cartApi
  loading = false
  arrangeLoading = false

  async setParams(data: CartToParams) {
    const res: CartRaw = await this.api.send({
      method: 'PUT',
      action: 'set_params',
      data: { ...data },
    })
    this.item = new Cart(res)
    return this.item
  }

  isInCart(uuid?: string) {
    if (!uuid || !this.item) return false
    return this.item.cartItems.map((v) => v.size.uuid).includes(uuid)
  }

  async current() {
    this.loading = true
    const res: CartRaw = await this.api.send({
      method: 'GET',
      action: 'current',
    })
    this.item = new Cart(res)
    this.loading = false
    return this.item
  }

  async getAvailableHours(): Promise<AvailableHours> {
    const res: AvailableHours = await this.api.send({
      method: 'GET',
      action: 'get_available_hours',
      params: {
        sales_point: this.item?.salesPoint.id,
      },
    })
    return res
  }

  async arrange(data: Record<string, any>): Promise<Order> {
    this.arrangeLoading = true
    const res: OrderRaw = await this.api.send({
      method: 'POST',
      action: 'arrange',
      data,
    })
    this.arrangeLoading = false
    return new Order(res)
  }
}

export const cartRepo = reactive(new CartRepo())
