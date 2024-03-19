import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi'
import { QrMenuSettings, QrMenuSettingsRaw } from './qrMenuSettings'

export class QrMenuSettingsApi extends BaseModelApi<QrMenuSettings> {
  routeName = 'qr_menu_settings'
  fromJson = (json: QrMenuSettingsRaw) => new QrMenuSettings(json)
}

export const qrMenuSettingsApi = new QrMenuSettingsApi()
