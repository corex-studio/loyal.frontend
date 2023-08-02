<template>
  <div
    v-if="$menuGroup.currentGroups?.length"
    class="row full-width bg-background-color"
    style="position: sticky; top: 0px; z-index: 10"
    :style="
      verticalScroll > 60 ? 'box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.06)' : ''
    "
  >
    <div
      class="row no-wrap c-container pt-5 pb-4 body justify-between items-center"
    >
      <div class="row gap-14 no-wrap items-center">
        <div
          v-for="(el, index) in $menuGroup.currentGroups.filter(
            (_, ind) => ind < 9
          )"
          :key="index"
        >
          <GroupButton :key="key" :item="el" />
        </div>
        <div
          v-if="$menuGroup.currentGroups.length > 9"
          class="row no-wrap cursor-pointer"
        >
          Еще
          <CIcon name="fa-light fa-angle-down" />
          <q-menu
            v-model="moreCategoriesMenu"
            class="border-radius bg-background-color pa-5 column gap-2"
          >
            <div
              v-for="(el, index) in $menuGroup.currentGroups.filter(
                (_, ind) => ind >= 9
              )"
              :key="index"
              class="row items-center cursor-pointer"
            >
              <GroupButton additional :key="key" :item="el" />
            </div>
          </q-menu>
        </div>
      </div>
      <CButton
        v-if="authentication.user && $cart.item"
        height="33px"
        class="box-shadow"
        color="blackground-color"
        text-color="primary"
        @click="$store.cartDrawer = !$store.cartDrawer"
        style="border-radius: 100px"
        icon="fa-light fa-shopping-cart"
      >
        <div>
          {{
            $cart.item && $cart.item.cartItems.length
              ? $cart.item.discountedTotalSum + ' ₽'
              : 'Корзина'
          }}
        </div></CButton
      >
    </div>
  </div>
  <CartDrawer />
</template>

<script setup lang="ts">
import CIcon from 'src/components/template/helpers/CIcon.vue';
import CButton from 'src/components/template/buttons/CButton.vue';
import { onMounted, ref, watch } from 'vue';
import { cartRepo } from 'src/models/carts/cartRepo';
import { menuRepo } from 'src/models/menu/menuRepo';
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo';
import GroupButton from './GroupButton.vue';
import CartDrawer from '../drawer/cart/CartDrawer.vue';
import { useRoute } from 'vue-router';
import { authentication } from 'src/models/authentication/authentication';

const key = ref(0);

const verticalScroll = ref(0);

const moreCategoriesMenu = ref(false);

const route = useRoute();

onMounted(() => {
  window.addEventListener('scroll', () => {
    verticalScroll.value = window.scrollY;
  });
  void menuGroupRepo
    .list({
      menu: cartRepo.item
        ? cartRepo.item?.salesPoint.menu.id
        : menuRepo.items[0].id,
    })
    .then((res) => {
      menuGroupRepo.currentGroups = res.items;
    });
});

watch(
  () => route.name,
  (v) => {
    if (v === 'home') {
      key.value++;
    }
  }
);
</script>
