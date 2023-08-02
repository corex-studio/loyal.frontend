import { AxiosResponse } from 'axios'
import { MenuRaw, Menu } from './menu'
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi'
import { api } from 'src/boot/axios'
import { ImageRaw } from '../image/image'
import { MenuItemRaw } from './menuItem/menuItem'

export class MenuApi extends BaseModelApi<Menu> {
  routeName = 'menus'
  fromJson = (json: MenuRaw) => new Menu(json)

  async getMenuItems(uuid: string): Promise<MenuItemRaw> {
    const res: AxiosResponse<MenuItemRaw> = await api.get(`menu_items/${uuid}`)
    return res.data
  }

  async setMenuItemImage(
    menuItemID: string,
    formData: FormData
  ): Promise<ImageRaw> {
    const res: AxiosResponse<ImageRaw> = await api.post(
      `menu_items/${menuItemID}/add_image/`,
      formData
    )
    return res.data
  }

  async setItemSizeImage(
    itemSizeID: string,
    formData: FormData
  ): Promise<ImageRaw> {
    const res: AxiosResponse<ImageRaw> = await api.post(
      `menu_item_sizes/${itemSizeID}/add_image/`,
      formData
    )
    return res.data
  }
}

export const menuApi = new MenuApi()
