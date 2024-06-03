import { AuthSettings, AuthSettingsDataRaw } from './authSettings'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { authSettingsApi } from './authSettingsApi'
import { reactive } from 'vue'

export class AuthSettingsRepo extends BaseRepo<AuthSettings> {
  api = authSettingsApi
  authSettingsData: AuthSettingsDataRaw | null = null

  async getAuthSettings(header?: string) {
    const headers = header ? { 'Company-Group': header } : undefined
    const res: AuthSettingsDataRaw = await this.api.send({
      method: 'GET',
      action: 'fetch',
      headers,
    })
    this.authSettingsData = res
    return res
  }
}

export const authSettingsRepo = reactive(new AuthSettingsRepo())
