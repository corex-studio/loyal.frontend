import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { reactive } from 'vue'
import { Authentication } from './auth'
import { authenticationApi } from './authApi'

export class AuthenticationRepo extends BaseRepo<Authentication> {
  api = authenticationApi
  // availableCustomers: Customer[] = []
  // currentUser: Customer = this.availableCustomers[0]

  // async getAvailableAdmins(data?: Record<string, any>) {
  //   const result: {
  //     results: CustomerRaw[]
  //   } = await this.api.send({
  //     action: 'get_available_admins',
  //     method: 'get',
  //     data,
  //   })
  //   const res = result.results.map((el) => new Customer(el))
  //   this.availableCustomers = res
  // }
}

export const authRepo = reactive(new AuthenticationRepo())
