import { api } from 'boot/axios'
import { CustomerRaw, Customer, WalletRaw } from './customer'
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi'
import { AxiosResponse } from 'axios'

export class CustomerApi extends BaseModelApi<Customer> {
  routeName = 'customers'
  fromJson = (json: CustomerRaw) => new Customer(json)

  async updateBalance(
    walletUuid: string,
    quantity: number,
    comment?: string
  ): Promise<WalletRaw> {
    const res: AxiosResponse<WalletRaw> = await api.put(
      `wallets/${walletUuid}/update_balance/`,
      { sum: Number(quantity), comment: comment?.length ? comment : null }
    )
    return res.data
  }
}

export const customerApi = new CustomerApi()
