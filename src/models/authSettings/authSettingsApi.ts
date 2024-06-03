import { AuthSettings, AuthSettingsRaw } from './authSettings'
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi'

export class AuthSettingsApi extends BaseModelApi<AuthSettings> {
  routeName = 'auth_settings'
  fromJson = (json: AuthSettingsRaw) => new AuthSettings(json)
}

export const authSettingsApi = new AuthSettingsApi()
