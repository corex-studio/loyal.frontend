import { Pad, PadRaw } from './pad'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { padApi } from './padApi'
import { reactive } from 'vue'
import { SalesPoint } from '../salesPoint/salesPoint'
import { Company } from '../company/company'
import { store } from 'src/models/store'
import { QrMenuWorkingMode } from 'src/models/qrMenuSettings/qrMenuSettingsRepo'
import moment, { Moment } from 'moment'

export class PadRepo extends BaseRepo<Pad> {
  api = padApi
  search: string | null = null
  filters: {
    sales_point: SalesPoint | null
    active: boolean | null
    company: Company | null
  } = {
    sales_point: null,
    active: null,
    company: null,
  }
  lastSynchronizeOrders: Moment | null = null

  async detach(): Promise<Pad> {
    const res: PadRaw = await this.api.send({
      method: 'POST',
      action: 'detach',
      id: this.item?.id,
    })

    return new Pad(res)
  }

  async synchronizeData() {
    const res: boolean = await this.api.send({
      method: 'POST',
      action: 'synchronize_data',
    })

    return res
  }

  async synchronizeOrdersForRestaurant(pad: Pad) {
    if (
      store.qrMenuData?.settings.working_mode === QrMenuWorkingMode.RESTAURANT
    )
      return this.synchronizeOrders(pad)
  }

  async synchronizeOrders(pad: Pad, minSecondsFromLastRequest: number = 1) {
    if (this.lastSynchronizeOrders && minSecondsFromLastRequest !== null) {
      const now = moment()
      if (
        now.diff(this.lastSynchronizeOrders, 'seconds') <
        minSecondsFromLastRequest
      ) {
        return
      }
    }
    this.lastSynchronizeOrders = moment()
    const res: { success: boolean } = await this.api.send({
      method: 'POST',
      action: 'synchronize_orders',
      id: pad.id,
    })
    return res
  }
}

export const padRepo = reactive(new PadRepo())
