<template>
  <template v-if="ready">
    <PrepareUiSettings />
    <q-layout class="bg-background-color relative-position" view="lHh Lpr lFf">
      <QRHomePadInfo v-if="$store.tableMode" />
      <TopHeader v-if="$q.screen.gt.md" />
      <MainHeader />
      <div v-if="$q.screen.lt.md" class="full-width">
        <QRMobileMenu
          v-if="
            $store.tableMode &&
            $pad.item?.isEnabled &&
            $route.name !== 'qrMenuItemPage'
          "
        />
      </div>
      <q-page-container
        :class="{
          'c-container':
            $route.name !== 'home' &&
            $route.name !== 'qrHome' &&
            $route.name !== 'aboutUs' &&
            !routesWithoutContainerPaddings.some((v) =>
              $route.path.includes(v),
            ),
        }"
        :style="
          $q.screen.lt.md && !$store.tableMode
            ? 'padding-bottom: 50px'
            : `min-height: calc(100vh - ${footerAndHeaderHeight}px); padding-bottom: ${$store.tableMode ? '120' : '100'}px`
        "
      >
        <router-view />
        <CartDrawer />
        <BonusesDrawer />
        <LeftDrawer v-if="$q.screen.lt.lg" />
        <CartOverlayButton v-if="!$route.path.includes('arrangement')" />
        <OrderToReviewOverlay
          v-if="$order.orderToReview && $route.name === 'home'"
        />
      </q-page-container>
      <q-footer v-if="!$store.tableMode">
        <CFooter class="full-width" style="bottom: 0; z-index: 2100" />
      </q-footer>
    </q-layout>
    <AuthModal
      :model-value="$store.authModal"
      @update:model-value="$store.authModal = !!$event"
    />
    <ServiceSettingsModal
      :model-value="$store.serviceSettingsModal"
      @update:model-value="$store.serviceSettingsModal = false"
    />
    <SelectCompanyModal
      :model-value="$store.selectCompanyModal"
      @select="companySelected($event)"
      @update:model-value="$store.selectCompanyModal = false"
    />
    <MenuItemModal
      :model-value="$store.menuItemModal"
      @update:model-value="closeMenuItemModal()"
    />
    <NewsModal
      :model-value="$store.newsModal"
      @update:model-value="closeNewsModal()"
    />
    <RegistrationModal v-model="$store.registrationModal" />
    <ReviewOrderModal v-model="$store.reviewModal" />
  </template>
</template>

<script lang="ts" setup>
import MainHeader from './header/MainHeader.vue'
import { Screen } from 'quasar'
import { computed, defineAsyncComponent, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { store } from 'src/models/store'
import { authentication } from 'src/models/authentication/authentication'
import PrepareUiSettings from 'src/components/template/PrepareUiSettings.vue'
import { handleMessage } from 'src/models/webSocket/webSocketRepo'
import { newsRepo } from 'src/models/news/newsRepo'
import { promotionsRepo } from 'src/models/promotion/promotionsRepo'
import { Company } from 'src/models/company/company'
import { companyRepo } from 'src/models/company/companyRepo'
import CFooter from './footer/CFooter.vue'
import { padRepo } from 'src/models/pads/padRepo'
import TopHeader from './header/TopHeader.vue'
import { AppManager } from 'src/models/utils/appManager'
import { orderReviewRepo } from 'src/models/order/orderReview/orderReviewRepo'
import { setMeta } from 'src/models/metaTags/metaTags'

const ServiceSettingsModal = defineAsyncComponent(
  () => import('src/components/serviceSettings/ServiceSettingsModal.vue'),
)
const SelectCompanyModal = defineAsyncComponent(
  () => import('src/components/dialogs/SelectCompanyModal.vue'),
)
const QRMobileMenu = defineAsyncComponent(
  () => import('src/pages/qrMenu/QRMobileMenu.vue'),
)
const QRHomePadInfo = defineAsyncComponent(
  () => import('src/pages/qrMenu/home/QRHomePadInfo.vue'),
)
const MenuItemModal = defineAsyncComponent(
  () => import('src/pages/menuItem/MenuItemModal.vue'),
)
const NewsModal = defineAsyncComponent(
  () => import('src/pages/news/NewsModal.vue'),
)
const ReviewOrderModal = defineAsyncComponent(
  () => import('src/components/dialogs/ReviewOrderModal.vue'),
)
const RegistrationModal = defineAsyncComponent(
  () => import('src/pages/auth/RegistrationModal.vue'),
)
const LeftDrawer = defineAsyncComponent(() => import('./drawer/LeftDrawer.vue'))
const CartOverlayButton = defineAsyncComponent(
  () => import('./drawer/cart/CartOverlayButton.vue'),
)
const OrderToReviewOverlay = defineAsyncComponent(
  () => import('src/components/cards/OrderToReviewOverlay.vue'),
)
const BonusesDrawer = defineAsyncComponent(
  () => import('./drawer/bonuses/BonusesDrawer.vue'),
)
const AuthModal = defineAsyncComponent(
  () => import('src/pages/auth/AuthModal.vue'),
)
const CartDrawer = defineAsyncComponent(
  () => import('./drawer/cart/CartDrawer.vue'),
)

const webSocket = ref<WebSocket | null>(null)
const routesWithoutContainerPaddings = [
  'promotion',
  'current_order',
  'order_review',
  'menu_item',
]
const route = useRoute()
const ready = ref(false)

watch(
  () => route.name,
  () => {
    setMeta(route.meta)
  },
)

watch(
  () => authentication.user?.id,
  (v) => {
    if (!v) return
    webSocket.value = new WebSocket(`wss://loyalhub.ru/ws/customers/${v}/`)
    webSocket.value.onmessage = (event) => {
      handleMessage(event)
    }
  },
)

watch(
  () => padRepo.item?.id,
  (v) => {
    if (!v) return
    if (store.tableMode) {
      webSocket.value = new WebSocket(`wss://loyalhub.ru/ws/pads/${v}/`)
      webSocket.value.onmessage = (event) => {
        handleMessage(event)
      }
    }
  },
)

const footerAndHeaderHeight = computed(() => {
  return Screen.gt.sm ? store.headerHeight + store.footerHeight : 0
})

const setScroll = () => {
  void nextTick(() => {
  if (store.scrollPositionBeforeOpenProductModal)
      window.scrollTo(0, store.scrollPositionBeforeOpenProductModal)
  })
}

const closeMenuItemModal = () => {
  history.pushState({}, '', `${route.path}`)
  setMeta(route.meta)
  store.freeItem = null
  store.closeMenuItemModal()
  setScroll()
}

onMounted(async () => {
  if (route.path.includes('qr_menu')) {
    store.tableMode = true
  }
  const manager = new AppManager({
    companyGroupId: route.query.group ? String(route.query.group) : undefined,
    initMenuPage: true,
  })
  await manager.initApp()
  if (authentication.user) {
    void orderReviewRepo.getOrderToReview()
  }
  // salesPointRepo.menuLoading = true
  ready.value = true
  setMeta(route.meta)
})

const companySelected = (v: Company | null) => {
  if (!authentication.user) {
    if (!v || !v.salesPoints || !v.salesPoints.length) return
    void store.loadCatalog(v.salesPoints[0])
    store.selectCompanyModal = false
  } else {
    companyRepo.cartCompany = v
    store.selectCompanyModal = false
    store.serviceSettingsModal = true
  }
}

const closeNewsModal = () => {
  newsRepo.item = null
  promotionsRepo.item = null
  store.newsModal = false
}
</script>

<style lang="scss" scoped>
.q-page-container {
  padding-top: 0px !important;
}

.q-footer {
  position: relative;
}
</style>
