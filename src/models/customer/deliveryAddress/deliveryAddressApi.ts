import { DeliveryAddressRaw, DeliveryAddress } from './deliveryAddress';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class DeliveryAddressApi extends BaseModelApi<DeliveryAddress> {
  routeName = 'customer_delivery_addresses'
  fromJson = (json: DeliveryAddressRaw) => new DeliveryAddress(json)
}

export const deliveryAddressApi = new DeliveryAddressApi();
