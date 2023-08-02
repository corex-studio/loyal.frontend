import { PaymentCardRaw, PaymentCard } from './paymentCard';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class PaymentCardApi extends BaseModelApi<PaymentCard> {
  routeName = 'customer_payment_cards'
  fromJson = (json: PaymentCardRaw) => new PaymentCard(json)
}

export const paymentCardApi = new PaymentCardApi();
