import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { QrMenuSettings } from './qrMenuSettings'
import { qrMenuSettingsApi } from './qrMenuSettingsApi'
import { reactive } from 'vue'
import {
  CompanyGroup,
  CompanyGroupRaw,
} from 'src/models/companyGroup/companyGroup'
import { Pad, PadRaw } from 'src/models/pads/pad'

type QRMenuDataRaw = {
  company_group: CompanyGroupRaw
  pad: PadRaw | null
  settings: { orders_bottom_bar_text: string; waiter_calls_enabled: boolean }
}

export type QRMenuData = {
  company_group: CompanyGroup
  pad: Pad | null
  settings: { orders_bottom_bar_text: string; waiter_calls_enabled: boolean }
}

export class QrMenuSettingsRepo extends BaseRepo<QrMenuSettings> {
  api = qrMenuSettingsApi

  async qrMenuData(group: string): Promise<QRMenuData> {
    const res: QRMenuDataRaw = await this.api.send({
      method: 'GET',
      action: 'qr_menu_data',
      params: { group },
    })
    return {
      ...res,
      pad: res.pad ? new Pad(res.pad) : null,
      company_group: new CompanyGroup(res.company_group),
    }
  }
}

export const qrMenuSettingsRepo = reactive(new QrMenuSettingsRepo())
