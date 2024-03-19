import { Customer, CustomerRaw } from './../customer/customer'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { reactive } from 'vue'
import { Authentication } from './auth'
import { authenticationApi } from './authApi'
import { authHelper } from 'src/services/authKeyManager'
import {
  BaseAuthenticationTokens,
  TokensRaw,
} from 'src/corexModels/authentication/baseAuthenticationTokens'

export class AuthenticationRepo extends BaseRepo<Authentication> {
  api = authenticationApi
  // availableCustomers: Customer[] = []
  // currentUser: Customer = this.availableCustomers[0]

  async register(data?: Record<string, any>) {
    const result: CustomerRaw = await this.api.send({
      action: 'register',
      method: 'POST',
      data,
    })
    return new Customer(result)
  }

  async getServerTime() {
    const res: { server_time: string } = await this.api.send({
      method: 'GET',
      action: 'server_configuration',
    })
    return res
  }

  async initAnonymousUser() {
    const [key, fingerprint] = await Promise.all([
      authHelper.getAuthKey(),
      authHelper.getFingerPrint(),
    ])
    const res: TokensRaw = await this.api.send({
      method: 'POST',
      action: 'init_anonymous_user',
      data: { key, fingerprint },
    })
    new BaseAuthenticationTokens(res.access, res.refresh)
  }
}

export const authRepo = reactive(new AuthenticationRepo())
