import { MenuItem } from './menuItem';
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { menuItemApi } from './menuItemApi';
import { reactive } from 'vue';

export class MenuItemRepo extends BaseRepo<MenuItem> {
  api = menuItemApi
}

export const menuItemRepo = reactive(new MenuItemRepo());
