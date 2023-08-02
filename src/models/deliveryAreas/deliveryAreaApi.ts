import { DeliveryAreaRaw, DeliveryArea } from './deliveryArea';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class DeliveryAreaApi extends BaseModelApi<DeliveryArea> {
  routeName = 'sales_point_delivery_areas'
  fromJson = (json: DeliveryAreaRaw) => new DeliveryArea(json)
}

export const deliveryAreaApi = new DeliveryAreaApi();
