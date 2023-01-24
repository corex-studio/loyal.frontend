import {
  uiSettingsRepo,
  UiSettingsRepo,
} from './../models/uiSettings/uiSettingsRepo';
import { menuRepo, MenuRepo } from './../models/menu/menuRepo';
import { store, Store } from 'src/models/store';
import { boot } from 'quasar/wrappers';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store;
    $menu: MenuRepo;
    $uiSettings: UiSettingsRepo;
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$store = store;
  app.config.globalProperties.$menu = menuRepo;
  app.config.globalProperties.$uiSettings = uiSettingsRepo;
});
