import { Theme, ThemeRaw } from './theme'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { themeApi } from './themeApi'
import { reactive } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'

export class ThemeRepo extends BaseRepo<Theme> {
  api = themeApi
  promotions: Theme[] = []

  async fetch() {
    const result = await this.api.send<ThemeRaw>({
        action: 'fetch',
        method: 'get'
      }
    )
    this.item = new Theme(result)
  }

  get currentCompanyTheme() {
    return this.item?.companies.find(v => v.company === companyRepo.cartCompany?.id)
  }
}

export const themeRepo = reactive(new ThemeRepo())
