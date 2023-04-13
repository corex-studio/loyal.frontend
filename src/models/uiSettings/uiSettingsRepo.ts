import { uiSettingsApi } from './uiSettingsApi';
import { UiSetting } from './uiSettings';

import BaseRepo from 'src/corexModels/apiModels/baseRepo';
import { reactive } from 'vue';

export class UiSettingsRepo extends BaseRepo<UiSetting> {
  api = uiSettingsApi;

  async fetchSettings(header: string): Promise<UiSetting> {
    const res = await this.api.fetchSettings(header);
    this.item = res;
    return res;
  }
}

export const uiSettingsRepo = reactive(new UiSettingsRepo());
