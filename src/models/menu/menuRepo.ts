import { menuApi } from './menuApi';
import { Menu } from './menu';
import BaseRepo from 'src/corexModels/apiModels/baseRepo';
import { reactive } from 'vue';

export class MenuRepo extends BaseRepo<Menu> {
  api = menuApi;

  async getMenu(salesPoint: string): Promise<Menu> {
    const res = await this.api.getMenu(salesPoint);
    return (this.item = res);
  }
}

export const menuRepo = reactive(new MenuRepo());
