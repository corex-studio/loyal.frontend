import { DeliveryAreaSettingsRaw, DeliveryAreaSettings } from './deliveryAreaSettings';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class DeliveryAreaSettingsApi extends BaseModelApi<DeliveryAreaSettings> {
  routeName = 'sales_point_delivery_settings'
  fromJson = (json: DeliveryAreaSettingsRaw) => new DeliveryAreaSettings(json)
}

export const deliveryAreaSettingsApi = new DeliveryAreaSettingsApi();
