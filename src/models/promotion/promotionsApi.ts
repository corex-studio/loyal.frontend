import { PromotionsRaw, Promotions } from './promotions';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class PromotionsApi extends BaseModelApi<Promotions> {
  routeName = 'promotions'
  fromJson = (json: PromotionsRaw) => new Promotions(json)
}

export const promotionsApi = new PromotionsApi();
