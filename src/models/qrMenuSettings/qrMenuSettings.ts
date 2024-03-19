import { BaseModel } from 'src/corexModels/apiModels/baseModel'

export type QrMenuSettingsRaw = {
  id: number
}

export class QrMenuSettings implements BaseModel {
  id: number

  constructor(raw: QrMenuSettingsRaw) {
    this.id = raw.id

  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
    }
  }
}
