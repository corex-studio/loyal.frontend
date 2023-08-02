import { Promotions } from './promotions';
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { promotionsApi } from './promotionsApi';
import { reactive } from 'vue';

export class PromotionsRepo extends BaseRepo<Promotions> {
  api = promotionsApi
}

export const promotionsRepo = reactive(new PromotionsRepo());
