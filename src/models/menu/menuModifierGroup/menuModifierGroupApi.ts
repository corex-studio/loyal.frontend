import { MenuModifierGroupRaw, MenuModifierGroup } from './menuModifierGroup';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class MenuModifierGroupApi extends BaseModelApi<MenuModifierGroup> {
  routeName = 'menu_modifier_groups'
  fromJson = (json: MenuModifierGroupRaw) => new MenuModifierGroup(json)
}

export const menuModifierGroupApi = new MenuModifierGroupApi();
