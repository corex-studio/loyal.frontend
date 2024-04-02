import { BalanceOperation } from './balanceOperation';
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { balanceOperationApi } from './balanceOperationApi';
import { reactive } from 'vue';

export class BalanceOperationRepo extends BaseRepo<BalanceOperation> {
  api = balanceOperationApi
}

export const balanceOperationRepo = reactive(new BalanceOperationRepo());
