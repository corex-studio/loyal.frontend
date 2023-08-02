import { MenuItemRaw, MenuItem } from './menuItem';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class MenuItemApi extends BaseModelApi<MenuItem> {
  routeName = 'menu_items'
  fromJson = (json: MenuItemRaw) => new MenuItem(json)
}

export const menuItemApi = new MenuItemApi();
