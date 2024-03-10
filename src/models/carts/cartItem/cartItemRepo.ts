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

  async updateItem(item: CartItem) {
    if (!item) throw Error('Object does not exists')
    if (!item.id) throw Error('Object does not has id.')
    this.loadings.update = true
    this.loadings.save = true
    const result = (await this.api.send({
      method: 'PUT',
      data: item.toJson(),
      id: item.id,
    })) as CartRaw
    this.loadings.update = false
    this.loadings.save = false
    return new Cart(result)
  }

  async update(obj: CartItem | null = null): Promise<CartItem> {
    void obj
    throw Error('Call "updateItem" for update')
  }
}

export const cartItemRepo = reactive(new CartItemRepo())
