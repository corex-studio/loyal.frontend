<template>
  <div class="fixed-bottom bg-black" style="z-index: 3005">
    <div class="row pa-5"></div>
    <div class="row no-wrap items-center justify-around py-3">
      <div
        class="justify-center items-start row"
        style="width: 50px; height: 34px"
        v-for="(item, index) in buttons"
        :key="index"
      >
        <CButton
          :icon="item.icon"
          icon-no-gutters
          :class="
            item.label === 'Заказы'
              ? 'mt-0'
              : item.label === 'Профиль'
              ? ''
              : ''
          "
          :style="item.label === 'Заказы' ? 'margin-top: -100px' : ''"
          content-column
          text-button
          :label="item.label"
          @click.capture="item.click ? item.click() : undefined"
          :text-color="item.textColor()"
          icon-size="20px"
          text-size="8px"
          height="34px"
          color="transparent"
          hover-text-color="accent4"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CButton from 'src/components/template/buttons/CButton.vue';

const router = useRouter();
const route = useRoute();

const buttons = ref([
  {
    label: 'Меню',
    icon: 'fas fa-bars',
    click: () => {
      void router.push({ name: 'menuPage' });
    },
    textColor: () => {
      return route.name === 'menuPage' ? 'accent4' : 'white';
    },
  },
  {
    label: 'Главная',
    icon: 'fas fa-home ',
    click: () => {
      void router.push({ name: 'testPage' });
    },

    textColor: () => {
      return route.name === 'testPage' ? 'accent4' : 'white';
    },
  },
  //   {
  //     label: 'Заказы',
  //     icon: 'fas fa-shopping-cart',
  //     to: null,

  //     textColor: () => {
  //       return cartDrawer.value || route.name === 'cart' ? 'accent4' : 'white';
  //     },
  //   },
  //   {
  //     label: 'Хранилище',
  //     icon: 'fas fa-heart',
  //     click: () => {
  //       void router.push({ name: 'storage' });
  //     },
  //     textColor: () => {
  //       return !someDrawerOpened.value && route.path.split('/')[1] === 'storage'
  //         ? 'accent4'
  //         : 'white';
  //     },
  //   },
  //   {
  //     label: 'Профиль',
  //     icon: 'fas fa-user',

  //     textColor: () => {
  //       return !someDrawerOpened.value && route.path.split('/')[1] === 'cabinet'
  //         ? 'accent4'
  //         : 'white';
  //     },
  //   },
]);
</script>

<style lang="scss" scoped>
.quantityChip {
  background: $accent3;
}
</style>
