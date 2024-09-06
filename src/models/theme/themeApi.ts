import { Theme, ThemeRaw } from './theme'
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi'

export class ThemeApi extends BaseModelApi<Theme> {
  routeName = 'company_group_themes'
  fromJson = (json: ThemeRaw) => new Theme(json)

}

export const themeApi = new ThemeApi()
