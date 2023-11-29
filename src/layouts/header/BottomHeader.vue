<template>
  <div
    v-if="!$q.screen.xs || $store.tableMode"
    class="row full-width bg-background-color"
  >
    <div
      :class="[
        $q.screen.xs ? ' full-width' : 'justify-between',
        { 'pt-5 pb-4': $cart.item || categories?.length },
      ]"
      class="row no-wrap body items-center gap-10 c-container"
    >
      <div
        v-if="!$q.screen.xs || $store.tableMode"
        class="row gap-sm-14 gap-xs-8 no-wrap items-center no-scrollbar"
        :style="
          $q.screen.xs
            ? 'overflow-x: scroll; scroll-behavior: smooth;'
            : undefined
        "
      >
        <template v-if="categories && !$salesPoint.menuLoading">
          <div
            v-for="(el, index) in $q.screen.xs
              ? categories
              : categories.filter((_, ind) =>
                  $q.screen.sm ? ind < 5 : ind < 8
                )"
            :key="index"
            ref="groupButtons"
          >
            <GroupButton :key="key" :item="el" />
          </div>
          <div
            v-if="categories.length > 8 && !$q.screen.xs"
            class="row no-wrap cursor-pointer text-on-background-color"
          >
            Еще
            <CIcon color="on-background-color" name="fa-light fa-angle-down" />
            <q-menu
              v-model="moreCategoriesMenu"
              class="border-radius bg-background-color pa-5 column gap-2"
            >
              <div
                v-for="(el, index) in categories.filter((_, ind) =>
                  $q.screen.sm ? ind >= 5 : ind >= 8
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
</template>

<script setup lang="ts">
import CIcon from 'src/components/template/helpers/CIcon.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import { ref, watch, computed } from 'vue'
import GroupButton from './GroupButton.vue'
import { useRoute } from 'vue-router'
import { authentication } from 'src/models/authentication/authentication'
import { menuRepo } from 'src/models/menu/menuRepo'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
import { useQuasar } from 'quasar'

const key = ref(0)

const moreCategoriesMenu = ref(false)

const q = useQuasar()

const route = useRoute()

const groupButtons = ref<Element[]>([])

const initWatcher = ref(false)

const categories = computed(() => {
  return menuRepo.item?.groups?.filter((v) => v.items.length)
})

watch(
  () => menuGroupRepo.elementsInViewport[0],
  (v) => {
    if (!initWatcher.value) {
      initWatcher.value = true
      return
    }

    if (menuGroupRepo.scrollingToGroup || !q.screen.xs) return
    const foundElementIndex = categories.value?.findIndex((el) => el.id === v)
    if (foundElementIndex !== undefined && foundElementIndex > -1) {
      groupButtons.value[foundElementIndex].scrollIntoView()
    }
  }
)

watch(
  () => route.name,
  (v) => {
    if (v === 'home' || v === 'qrHome') {
      key.value++
    }
  }
)
</script>
