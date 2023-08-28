<template>
  <div class="row full-width bg-background-color">
    <div
      class="row no-wrap c-container pt-5 pb-4 body justify-between items-center gap-10"
    >
      <div class="row gap-14 no-wrap items-center">
        <template v-if="$menu.item?.groups && !$salesPoint.menuLoading">
          <div
            v-for="(el, index) in $menu.item.groups.filter((_, ind) => ind < 8)"
            :key="index"
          >
            <GroupButton :key="key" :item="el" />
          </div>
          <div
            v-if="$menu.item.groups.length > 8"
            class="row no-wrap cursor-pointer text-on-background-color"
          >
            Еще
            <CIcon color="on-background-color" name="fa-light fa-angle-down" />
            <q-menu
              v-model="moreCategoriesMenu"
              class="border-radius bg-background-color pa-5 column gap-2"
            >
              <div
                v-for="(el, index) in $menu.item.groups.filter(
                  (_, ind) => ind >= 8
                )"
                :key="index"
                class="row items-center cursor-pointer"
              >
                <GroupButton additional :key="key" :item="el" />
              </div>
            </q-menu>
          </div>
        </template>
        <template v-if="$salesPoint.menuLoading">
          <q-skeleton
            v-for="(el, index) in [1, 2, 3, 4, 5, 6, 7]"
            :key="index"
            width="130px"
            class="mt-2"
            style="margin-bottom: 13px"
          >
          </q-skeleton>
        </template>
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
import CIcon from 'src/components/template/helpers/CIcon.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import { onMounted, ref, watch } from 'vue'
import { cartRepo } from 'src/models/carts/cartRepo'
import GroupButton from './GroupButton.vue'
import CartDrawer from '../drawer/cart/CartDrawer.vue'
import { useRoute } from 'vue-router'
import { authentication } from 'src/models/authentication/authentication'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { store } from 'src/models/store'

const key = ref(0)

const moreCategoriesMenu = ref(false)

const route = useRoute()

onMounted(() => {
  void store.loadCatalog(
    cartRepo.item
      ? cartRepo.item?.salesPoint
      : companyGroupRepo.item?.companies[0]?.salesPoints
      ? companyGroupRepo.item?.companies[0]?.salesPoints[0]
      : ''
  )
  // void menuRepo
  //   .retrieve(
  //     cartRepo.item
  //       ? cartRepo.item?.salesPoint.menu.id
  //       : companyGroupRepo.item?.companies[0]?.salesPoints
  //       ? companyGroupRepo.item?.companies[0]?.salesPoints[0].menu.id
  //       : ''
  //   )
  //   .then(() => {
  //     void menuGroupRepo.list({
  //       menu: menuRepo.item?.id,
  //     })
  //   })
})

watch(
  () => route.name,
  (v) => {
    if (v === 'home') {
      key.value++
    }
  }
)
</script>
