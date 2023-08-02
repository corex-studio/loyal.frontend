import { MenuGroupRaw, MenuGroup } from './menuGroup'
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi'
import { ImageRaw } from 'src/models/image/image'
import { AxiosResponse } from 'axios'
import { api } from 'src/boot/axios'

export class MenuGroupApi extends BaseModelApi<MenuGroup> {
  routeName = 'menu_groups'
  fromJson = (json: MenuGroupRaw) => new MenuGroup(json)

  async setImage(menuGroupUuid: string, formData: FormData): Promise<ImageRaw> {
    const res: AxiosResponse<ImageRaw> = await api.post(
      `${this.routeName}/${menuGroupUuid}/add_image/`,
      formData
    )
    return res.data
  }
}

export const menuGroupApi = new MenuGroupApi()
