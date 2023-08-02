import {
  MenuModifierGroup,
  MenuModifierGroupItemRaw,
} from './menuModifierGroup';
import BaseRepo from 'src/corexModels/apiModels/baseRepo';
import { menuModifierGroupApi } from './menuModifierGroupApi';
import { reactive } from 'vue';

export class MenuModifierGroupRepo extends BaseRepo<MenuModifierGroup> {
  api = menuModifierGroupApi;

  addToMenu(data: Record<string, any>) {
    void this.api.send({
      method: 'POST',
      url: '/product_modifier_groups/add_to_menu/',
      data: data,
    });
  }

  async changeModifierVisibility(item: MenuModifierGroupItemRaw) {
    const res = await this.api.send({
      method: 'PUT',
      url: `/menu_modifiers/${item.uuid}/`,
      id: item.uuid,
      data: {
        ...item,
      },
    });
    return res;
  }
}

export const menuModifierGroupRepo = reactive(new MenuModifierGroupRepo());
