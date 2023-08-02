import { QrData, QrDataRaw } from './qrData'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { qrDataApi } from './qrDataApi'
import { reactive } from 'vue'

export class QrDataRepo extends BaseRepo<QrData> {
  api = qrDataApi

  async parseQrData(id: string, type: string): Promise<QrData> {
    const result: QrDataRaw = await this.api.send({
      method: 'POST',
      action: 'parse_qr_data',
      data: {
        id,
        type,
      },
    })
    return new QrData(result)
  }
}

export const qrDataRepo = reactive(new QrDataRepo())
