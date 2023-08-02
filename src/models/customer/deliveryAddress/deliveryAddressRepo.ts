import { DeliveryAddress } from './deliveryAddress';
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { deliveryAddressApi } from './deliveryAddressApi';
import { reactive } from 'vue';

export class DeliveryAddressRepo extends BaseRepo<DeliveryAddress> {
  api = deliveryAddressApi
}

export const deliveryAddressRepo = reactive(new DeliveryAddressRepo());
