import { Cart, CartRaw } from './../cart'
import { CartItem, CartItemModifier } from './cartItem'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { cartItemApi } from './cartItemApi'
import { reactive } from 'vue'

export class CartItemRepo extends BaseRepo<CartItem> {
  api = cartItemApi

  async createCartItem(data: {
    size: string
    cart: string
    quantity: number
    cart_item_modifiers: CartItemModifier[]
  }) {
    const res: CartRaw = await this.api.send({
      method: 'POST',
      data,
    })
    return new Cart(res)
  }
}

export const cartItemRepo = reactive(new CartItemRepo())
