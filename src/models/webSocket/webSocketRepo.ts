import { Customer, CustomerRaw } from './../customer/customer';
import { authentication } from './../authentication/authentication';
import { cartRepo } from './../carts/cartRepo';
import { Cart, CartRaw } from 'src/models/carts/cart';
export type WebSocketMessage = {
  type: 'cart.updated' | 'user.updated';
  data: any;
};

export const handleMessage = (v: MessageEvent<string>) => {
  const response = JSON.parse(v.data) as WebSocketMessage;
  if (response.type === 'cart.updated') {
    cartRepo.item = new Cart(response.data as CartRaw);
    cartRepo.loading = false;
  }
  if (response.type === 'user.updated') {
    authentication.user = new Customer(response.data as CustomerRaw);
  }

  return response;
};
