import { BaseModel } from 'src/corexModels/apiModels/baseModel'

export type UtilsRaw = {
  id: number | undefined
}

export class Utils implements BaseModel {
  id: number | undefined

  constructor(raw: UtilsRaw) {
    this.id = raw.id
  }

  toJson(): Record<string, any> {
    return {}
  }
}
