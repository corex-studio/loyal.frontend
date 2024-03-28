import { BalanceOperationRaw, BalanceOperation } from './balanceOperation';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class BalanceOperationApi extends BaseModelApi<BalanceOperation> {
  routeName = 'balance_operations'
  fromJson = (json: BalanceOperationRaw) => new BalanceOperation(json)
}

export const balanceOperationApi = new BalanceOperationApi();
