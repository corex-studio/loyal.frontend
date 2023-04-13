<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <MainHeader></MainHeader>
      <div class="row no-wrap">
        <LeftMenu v-if="$q.screen.gt.xs"></LeftMenu>
        <q-separator
          vertical
          :style="`background: #${$uiSettings.item?.primaryColor}; width: 1px;`"
        >
        </q-separator>
        <router-view></router-view>
      </div>
    </q-page-container>

    <q-footer v-if="$q.screen.gt.xs">
      <CFooter class="full-width" style="bottom: 0; z-index: 2100" />
    </q-footer>
    <div class="full-width" v-else>
      <MobileMenu />
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import MainHeader from './header/MainHeader.vue';
import CFooter from 'src/layouts/footer/CFooter.vue';
import MobileMenu from './MobileMenu.vue';
import { useQuasar } from 'quasar';
import { onMounted, watch } from 'vue';
import LeftMenu from './drawer/LeftMenu.vue';
import { useRoute, useRouter } from 'vue-router';
import { store } from 'src/models/store';
import { menuRepo } from 'src/models/menu/menuRepo';

const q = useQuasar();
const route = useRoute();
const router = useRouter();

const setBodyScrollClass = () => {
  if (q.platform.is.win) {
    const body = document.getElementsByTagName('body');
    if (body.length) body[0].classList.add('custom-scroll-bar');
  }
};

watch(
  () => q.screen.name,
  () => {
    if (route.name === 'menuPage' && q.screen.lt.md) {
      void router.push({ name: 'testPage' });
    }
  }
);

onMounted(() => {
  setBodyScrollClass();
  void menuRepo.getMenu(store.salesPoint).then(() => {
    menuRepo.item?.groups[0].items[0].sizes.push({
      name: 'большая',
      code: '1',
      created_at: '1',
      external_id: '124235234',
      image: {
        background_color: null,
        image: null,
        thumbnail: null,
        uuid: '1',
      },
      menu_item: '123',
      price: 1002,
      sku: '1',
      sorting: 0,
      updated_at: '123',
      uuid: '123123213',
    });
    if (menuRepo.item)
      menuRepo.item.groups[0].items[0].sizes[0].name = 'маленькая';
  });

  // void uiSettingsRepo.fetchSettings();
});
</script>
