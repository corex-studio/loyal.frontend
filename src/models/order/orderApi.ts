import { OrderRaw, Order } from './order';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class OrderApi extends BaseModelApi<Order> {
  routeName = 'orders';
  fromJson = (json: OrderRaw) => new Order(json);
}

export const orderApi = new OrderApi();
