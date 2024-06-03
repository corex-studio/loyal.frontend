import { BaseModel } from 'src/corexModels/apiModels/baseModel'

export type AuthSettingsRaw = {
  id: number | undefined
}

export enum AuthType {
  SMS = 1,
  FLASHCALL = 2,
  TELEGRAM = 3,
}

export type AuthSettingsDataRaw = {
  uuid: string | null
  company_group: string | null
  created_at: string | null
  telegram_auth: boolean
  flashcall_auth: boolean
  updated_at: string | null
}

export class AuthSettings implements BaseModel {
  id: number | undefined

  constructor(raw: AuthSettingsRaw) {
    this.id = raw.id
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
    }
  }
}
