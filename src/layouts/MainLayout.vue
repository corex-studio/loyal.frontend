<template>
  <template v-if="ready">
    <PrepareUiSettings />
    <q-layout class="bg-background-color relative-position" view="lHh Lpr lFf">
      <QRHomePadInfo v-if="$store.tableMode" />
      <TopHeader v-if="$q.screen.gt.md && !$store.tableMode" />
      <MainHeader />
      <div v-if="$q.screen.lt.md" class="full-width">
        <QRMobileMenu v-if="showQrMobileMenu" />
      </div>
      <q-page-container
        :class="{
          'c-container':
            !$router.isIncludesRouteName(['home', 'qrHome', 'aboutUs']) &&
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
          v-if="$order.orderToReview && $router.isIncludesRouteName(['home'])"
        />
      </q-page-container>
      <q-footer>
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
import {
  computed,
  defineAsyncComponent,
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import { menuRepo } from 'src/models/menu/menuRepo'
import { useFictiveUrlStore } from 'stores/fictiveUrlStore'
import { withCityRouteKey, withCompanyRouteKey } from 'src/router/mainRoutes'
import { useEventBus } from '@vueuse/core'
import { onCloseProductModalKey } from 'src/services/eventBusKeys'
import { RouterResolver } from 'src/models/utils/routerResolver'

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

// const webSocket = ref<WebSocket | null>(null)
const routesWithoutContainerPaddings = computed(() => {
  const items = ['promotion', 'current_order', 'order_review', 'menu_item']
  return items.flatMap((v) => [
    v,
    v + withCityRouteKey,
    v + withCompanyRouteKey,
    v + withCityRouteKey + withCompanyRouteKey,
  ])
})
const route = useRoute()
const ready = ref(false)
const router = useRouter()

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
    const ws = store.setWebSocket(`wss://loyalhub.ru/ws/customers/${v}/`)
    if (!ws.ws) return
    ws.ws.onmessage = (event) => {
      handleMessage(event)
    }
  },
)

watch(
  () => padRepo.item?.id,
  (v) => {
    if (!v) return
    if (store.tableMode) {
      const ws = store.setWebSocket(`wss://loyalhub.ru/ws/pads/${v}/`)
      if (!ws.ws) return
      ws.ws.onmessage = (event) => {
        handleMessage(event)
      }
    }
  },
)

const footerAndHeaderHeight = computed(() => {
  return Screen.gt.sm ? store.headerHeight + store.footerHeight : 0
})

const showQrMobileMenu = computed(() => {
  return (
    store.tableMode &&
    padRepo.item?.isEnabled &&
    !router.isIncludesRouteName(['qrMenuItemPage']) &&
    padRepo.item.salesPoint &&
    menuRepo.item
  )
})

const setScroll = () => {
  void nextTick(() => {
    if (store.scrollPositionBeforeOpenProductModal)
      window.scrollTo(0, store.scrollPositionBeforeOpenProductModal)
  })
}

const fictiveUrlStore = useFictiveUrlStore()

const closeMenuItemModal = async () => {
  if (String(route.name) === 'home__withCategories__withProducts')
    await router.push({ name: 'home' })
  useEventBus(onCloseProductModalKey).emit()
  fictiveUrlStore.initialMenuItem = null
  fictiveUrlStore.setFictiveCategoryUrl()
  setMeta(route.meta)
  store.freeItem = null
  store.closeMenuItemModal()
  setScroll()
}

const telegramAuth = async () => {
  let tg: any = window.Telegram.WebApp
  tg.expand()
  let user = tg.initDataUnsafe.user
  if (user) {
    const telegramId = user.id
    authentication.user = null
    authentication.tokens.removeTokens()
    authentication.logout()
    await authentication.tgAuth(telegramId)
  } else return false
}

onMounted(async () => {
  if (route.path.includes('qr_menu')) {
    store.tableMode = true
  }
  const manager = new AppManager({
    companyGroupId: route.query.group ? String(route.query.group) : undefined,
    initMenuPage: true,
  })
  await telegramAuth()
  await manager.initApp()
  if (authentication.user) {
    void orderReviewRepo.getOrderToReview()
  }
  ready.value = true
  setMeta(route.meta)
})

const routerResolver = new RouterResolver()

const companySelected = async (v: Company | null) => {
  companyRepo.cartCompany = v
  await routerResolver.detect().resolve()
  if (!authentication.user) {
    if (!v || !v.salesPoints || !v.salesPoints.length) return
    void store.loadCatalog(v.salesPoints[0])
    store.selectCompanyModal = false
  } else {
    store.selectCompanyModal = false
    store.serviceSettingsModal = true
    store.noCloseServiceSettingsModal = true
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
