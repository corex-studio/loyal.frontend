import { CartRaw, Cart } from './cart';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class CartApi extends BaseModelApi<Cart> {
  routeName = 'carts'
  fromJson = (json: CartRaw) => new Cart(json)
}

export const cartApi = new CartApi();
