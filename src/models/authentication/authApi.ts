import { Authentication, AuthenticationRaw } from './auth'
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi'

export class AuthenticationApi extends BaseModelApi<Authentication> {
  routeName = 'users'
  fromJson = (json: AuthenticationRaw) => new Authentication(json)
}

export const authenticationApi = new AuthenticationApi()
