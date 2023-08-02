import { PaymentCard } from './paymentCard';
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { paymentCardApi } from './paymentCardApi';
import { reactive } from 'vue';

export class PaymentCardRepo extends BaseRepo<PaymentCard> {
  api = paymentCardApi
}

export const paymentCardRepo = reactive(new PaymentCardRepo());
