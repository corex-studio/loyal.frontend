import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { CompanyThemeSchema } from 'src/models/theme/schema/company_theme_schema'
import { OrderType } from 'src/models/menu/menuItem/menuRulesForAdding/menuRulesForAdding'
import { CompanyGroupThemeSchema } from 'src/models/theme/schema/company_group_schema_schema'


export type CompanyThemeRaw = {
  uuid?: string
  company?: string
  settings: CompanyThemeSchema
}

export class CompanyTheme implements BaseModel {
  id: string | undefined
  company?: string
  settings: CompanyThemeSchema

  constructor(raw: CompanyThemeRaw) {
    this.id = raw.uuid
    this.company = raw.company
    this.settings = raw.settings
  }

  getDeliveryTypeSchema(delivery_type?: OrderType | string) {
    if (!delivery_type) return undefined
    return this.settings.delivery_types.find(v => v.delivery_type === delivery_type)
  }

  toJson(): any {
  }
}


export type ThemeRaw = {
  uuid?: string
  settings: CompanyGroupThemeSchema
  companies: CompanyThemeRaw[]
}


export class Theme implements BaseModel {
  id: string | undefined
  companies: CompanyTheme[]
  settings: CompanyGroupThemeSchema

  constructor(raw: ThemeRaw) {
    this.id = raw.uuid
    this.settings = raw.settings
    this.companies = raw.companies.map(v => new CompanyTheme(v))
  }

  toJson(): any {

  }
}
