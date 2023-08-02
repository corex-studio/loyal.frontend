import { Cart, CartToParams, CartRaw } from './cart';
import BaseRepo from 'src/corexModels/apiModels/baseRepo';
import { cartApi } from './cartApi';
import { reactive } from 'vue';

export class CartRepo extends BaseRepo<Cart> {
  api = cartApi;
  loading = false;

  async setParams(data: CartToParams) {
    const res: CartRaw = await this.api.send({
      method: 'PUT',
      action: 'set_params',
      data: { ...data },
    });
    this.item = new Cart(res);
    return this.item;
  }

  isInCart(uuid?: string) {
    if (!uuid || !this.item) return false;
    return this.item.cartItems.map((v) => v.size.uuid).includes(uuid);
  }

  async current() {
    this.loading = true;
    const res: CartRaw = await this.api.send({
      method: 'GET',
      action: 'current',
    });
    this.item = new Cart(res);
    this.loading = false;
    return this.item;
  }
}

export const cartRepo = reactive(new CartRepo());
