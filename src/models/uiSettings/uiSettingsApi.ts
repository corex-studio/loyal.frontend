import { AxiosResponse } from 'axios';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';
import { UiSetting, UiSettingsRaw } from './uiSettings';
import { api } from 'boot/axios';

export class UiSettingsApi extends BaseModelApi<UiSetting> {
  routeName = 'ui_settings';
  fromJson = (json: UiSettingsRaw) => new UiSetting(json);

  async fetchSettings(): Promise<UiSetting> {
    const res: AxiosResponse<UiSettingsRaw> = await api.get(
      `${this.routeName}/fetch/`,
      {}
    );
    return this.fromJson(res.data);
  }
}

export const uiSettingsApi = new UiSettingsApi();
