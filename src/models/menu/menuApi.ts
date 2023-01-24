import { AxiosResponse } from 'axios';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';
import { Menu, MenuRaw } from './menu';
import { api } from 'boot/axios';

export class MenuApi extends BaseModelApi<Menu> {
  routeName = 'sales_points';
  fromJson = (json: MenuRaw) => new Menu(json);

  async getMenu(salesPoint: string): Promise<Menu> {
    const res: AxiosResponse<MenuRaw> = await api.get(
      `${this.routeName}/${salesPoint}/menu/`
    );
    return this.fromJson(res.data);
  }
}

export const menuApi = new MenuApi();
