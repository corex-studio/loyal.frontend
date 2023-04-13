import { AppSettingsRaw, AppSettings } from './appSettings'
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi'

export class AppSettingsApi extends BaseModelApi<AppSettings> {
  routeName = 'app_settings'
  fromJson = (json: AppSettingsRaw) => new AppSettings(json)
}

export const appSettingsApi = new AppSettingsApi()
