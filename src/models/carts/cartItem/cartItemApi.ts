import { CartItemRaw, CartItem } from './cartItem';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class CartItemApi extends BaseModelApi<CartItem> {
  routeName = 'cart_items'
  fromJson = (json: CartItemRaw) => new CartItem(json)
}

export const cartItemApi = new CartItemApi();
