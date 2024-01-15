<template>
  <!-- :class="{ 'box-shadow': $store.verticalScroll > 56 }" -->

  <div
    v-if="!$q.screen.xs || $store.tableMode"
    class="row full-width bg-background-color sticky-block"
    ref="bottomHeader"
  >
    <div class="row no-wrap items-center c-container">
      <div
        :class="[
          $q.screen.xs ? ' full-width' : 'justify-between full-width',
          isSticky
            ? ''
            : 'bg-secondary-button-color text-on-secondary-button-color',
        ]"
        :style="$cart.item || categories?.length ? 'height: 62px' : ''"
        class="row border-radius no-wrap body items-center gap-10 content-row px-5 relative-position"
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
          <div
            v-if="replacementAvailable && $q.screen.gt.md"
            @click="$store.selectCompanyModal = true"
            class="row no-wrap gap-4 items-center cursor-pointer body"
            style="position: absolute"
          >
            <q-img
              height="40px"
              width="40px"
              class="border-radius"
              :src="$company.item?.image?.thumbnail"
            >
              <template v-slot:error>
                <span>
                  <q-img
                    class="border-radius"
                    style="height: 40px; width: 40px"
                    :src="$store.images.empty"
                  ></q-img>
                </span> </template
            ></q-img>
            <div class="text-primary">Изменить заведение</div>
          </div>
          <div
            v-if="categories && !$salesPoint.menuLoading"
            class="gap-lg-14 gap-xs-8 no-wrap items-center no-scrollbar row"
            :style="
              replacementAvailable
                ? `padding-left: ${$q.screen.gt.md ? '255' : '0'}px`
                : ''
            "
            style="transition: 0.25s all ease"
          >
            <div
              v-for="(el, index) in previewCategories"
              :key="index"
              ref="groupButtons"
            >
              <GroupButton :is-sticky="isSticky" :key="key" :item="el" />
            </div>
            <div
              v-if="
                replacementAvailable
                  ? categories.length > 6
                  : categories.length > 8 && !$q.screen.xs
              "
              class="row body no-wrap gap-4 cursor-pointer"
              :class="[
                isSticky
                  ? 'text-on-background-color'
                  : 'text-on-secondary-button-color',
                { 'mt-1': $q.screen.lt.lg },
              ]"
            >
              Еще
              <CIcon
                :color="
                  isSticky ? 'on-background-color' : 'on-secondary-button-color'
                "
                name="fa-regular fa-angle-down"
                style="transition: transform 0.25s ease"
                :style="moreCategoriesMenu ? 'transform:rotate(180deg)' : ''"
              />
              <q-menu
                v-model="moreCategoriesMenu"
                auto-close
                class="border-radius bg-background-color pa-5 column gap-2"
              >
                <div
                  v-for="(el, index) in additionalCategories"
                  :key="index"
                  class="row items-center cursor-pointer"
                >
                  <GroupButton additional :key="key" :item="el" />
                </div>
              </q-menu>
            </div>
          </div>
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
          height="48px"
          class="body"
          color="primary"
          :loading="$cart.loading"
          text-color="on-primary"
          @click="$store.cartDrawer = !$store.cartDrawer"
          style="position: absolute; right: 12px"
        >
          <div class="row gap-4">
            <CIcon
              size="17px"
              name="fa-regular fa-basket-shopping"
              color="on-button-color"
            />
            <div v-if="!$cart.item.cartItems.length">Корзина</div>
            <div v-else>
              {{ beautifyNumber($cart.item.discountedTotalSum, true) }} ₽
            </div>
          </div></CButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CIcon from 'src/components/template/helpers/CIcon.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import { ref, watch, computed, onMounted } from 'vue'
import GroupButton from './GroupButton.vue'
import { useRoute } from 'vue-router'
import { authentication } from 'src/models/authentication/authentication'
import { menuRepo } from 'src/models/menu/menuRepo'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
import { useQuasar } from 'quasar'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { beautifyNumber, store } from 'src/models/store'

const bottomHeader = ref<Element | null>(null)

const key = ref(0)

const moreCategoriesMenu = ref(false)

const q = useQuasar()

const route = useRoute()

const groupButtons = ref<Element[]>([])

const initWatcher = ref(false)

const isSticky = ref(false)

const categories = computed(() => {
  return menuRepo.item?.groups?.filter((v) => v.items.length)
})

const replacementAvailable = computed(() => {
  return (
    isSticky.value &&
    companyGroupRepo.item &&
    companyGroupRepo.item.companies.length > 1 &&
    !store.tableMode
  )
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

const previewCategories = computed(() => {
  return q.screen.xs
    ? categories.value
    : categories.value?.filter((_, ind) =>
        q.screen.sm
          ? ind < 5
          : q.screen.md
          ? ind < 5
          : ind < (replacementAvailable.value ? 6 : 8)
      )
})

const additionalCategories = computed(() => {
  return categories.value?.filter((_, ind) =>
    q.screen.sm || q.screen.md
      ? ind >= 5
      : replacementAvailable.value
      ? ind >= 6
      : ind >= 8
  )
})

onMounted(() => {
  const observer = new IntersectionObserver(
    ([e]) => {
      if (e.boundingClientRect.top < 200) {
        e.target.classList.toggle('isSticky', e.intersectionRatio < 1)
        isSticky.value = e.target.classList.contains('isSticky')
      }
    },
    { rootMargin: '-1px 0px 0px 0px', threshold: [1] }
  )
  if (bottomHeader.value) observer.observe(bottomHeader.value)
})
</script>

<style lang="scss" scoped>
.content-row {
  transition: background-color 0.3s ease;
}
.sticky-block {
  position: sticky;
  top: 0;
  z-index: 1;
  transition: 0.3s ease;
}
.sticky-block.isSticky {
  box-shadow: var(--box-shadow);
}
</style>
