<template>
  <div>
    <q-drawer
      side="right"
      style="z-index: 999999; height: 100%"
      :style="`border-radius: ${drawerBorderRadius}`"
      overlay
      v-model="$store.cartDrawer"
      no-swipe-open
      behavior="mobile"
      bordered
      :width="474"
      class="column full-height no-wrap justify-between bg-background-color text-on-background-color"
    >
      <div class="column">
        <div
          style="height: 60px"
          class="row no-wrap items-center bg-modal-header-color text-on-modal-header-color px-10 justify-between mb-10"
        >
          <div class="row items-center no-wrap gap-5">
            <div
              class="bg-white-opacity cursor-pointer box-shadow py-4 px-5 border-radius"
            >
              <CIcon
                @click="toPreviousStep()"
                hover-color="primary"
                color="on-secondary-button-color"
                name="fa-light fa-angle-left"
              />
            </div>
            <!-- <CIconButton
              icon="fa-light fa-angle-left"
              color="secondary-button-color"
              icon-color="on-secondary-button-color"
              size="37"
              @click="toPreviousStep()"
            /> -->
            <div class="header3">
              {{ cartMode === 'cart' ? 'Корзина' : 'Итого' }}
            </div>
          </div>
          <div class="bg-white-opacity box-shadow py-4 px-5 border-radius">
            <CIcon
              color="on-secondary-button-color"
              name="fa-light fa-shopping-cart"
            />
          </div>
        </div>
        <template v-if="$cart.item?.cartItems.length">
          <div v-if="cartMode === 'cart'" class="column px-10">
            <template
              v-for="(item, index) in $cart.item?.cartItems"
              :key="index"
            >
              <q-separator v-if="index" class="my-5" color="divider-color" />
              <CartDrawerItemRow :item="item" />
            </template>
            <div
              class="row box-shadow border-radius bg-background-color pa-10 mt-15 justify-between items-center"
            >
              <div class="row gap-5 items-center no-wrap">
                <div
                  class="py-4 px-5 box-shadow border-radius bg-white-opacity"
                >
                  <CIcon color="primary" name="fa-light fa-credit-card-blank" />
                </div>
                <div class="text-primary body">К оплате</div>
              </div>
              <div class="text-primary body">
                {{ $cart.item?.discountedTotalSum }} ₽
              </div>
            </div>
          </div>
          <CartOutput v-else />
        </template>
        <div v-else class="px-10">Корзина пуста</div>
      </div>
      <div
        v-if="$cart.item?.cartItems.length"
        class="row full-width justify-center bg-background-color py-8"
        style="position: sticky; bottom: 0"
      >
        <CButton
          @click="toNextStep()"
          :loading="cartRepo.loading"
          class="body"
          height="50px"
          style="min-width: 261px"
          >{{ `Оформить заказ ${$cart.item?.discountedTotalSum} ₽` }}</CButton
        >
      </div>
    </q-drawer>
  </div>
</template>
<script lang="ts" setup>
import CartDrawerItemRow from 'src/components/rows/CartDrawerItemRow.vue';
import CButton from 'src/components/template/buttons/CButton.vue';
import CIcon from 'src/components/template/helpers/CIcon.vue';
import { store } from 'src/models/store';
import { ref, computed } from 'vue';
import CartOutput from './CartOutput.vue';
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo';
import { cartRepo } from 'src/models/carts/cartRepo';

const cartMode = ref<'cart' | 'output'>('cart');

const drawerBorderRadius = computed(() => {
  return `${uiSettingsRepo.item?.borderRadius}px 0 0 ${uiSettingsRepo.item?.borderRadius}px !important`;
});

const toNextStep = () => {
  if (cartMode.value === 'cart') {
    cartMode.value = 'output';
  }
};

const toPreviousStep = () => {
  if (cartMode.value === 'output') {
    cartMode.value = 'cart';
  } else {
    store.cartDrawer = false;
  }
};
</script>

<style lang="scss" scoped></style>
