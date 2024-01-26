<template>
  <template v-if="ready">
    <PrepareUiSettings />
    <q-layout view="lHh Lpr lFf" class="bg-background-color relative-position">
      <QRHomePadInfo v-if="$store.tableMode && $route.name === 'qrHome'" />

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
        :style="
          $q.screen.lt.md
            ? 'padding-bottom: 50px'
            : `min-height: calc(100vh - ${footerAndHeaderHeight}px); padding-bottom: 100px`
        "
        :class="{
          'c-container':
            $route.name !== 'home' &&
            $route.name !== 'qrHome' &&
            !routesWithoutContainerPaddings.some((v) =>
              $route.path.includes(v)
            ),
        }"
      >
        <!-- {{ $q.screen.width }} -->
        <router-view />
        <CartDrawer />
        <CartOverlayButton v-if="!$route.path.includes('arrangement')" />
      </q-page-container>

      <q-footer v-if="!$store.tableMode">
        <CFooter class="full-width" style="bottom: 0; z-index: 2100" />
      </q-footer>
    </q-layout>
    <AuthModal
      :model-value="$store.authModal"
      @update:model-value="$store.authModal = $event"
    />
    <ServiceSettingsModal
      :model-value="$store.serviceSettingsModal"
      @update:model-value="$store.serviceSettingsModal = false"
    />
    <SelectCompanyModal
      :model-value="$store.selectCompanyModal"
      @update:model-value="$store.selectCompanyModal = false"
      @select="companySelected($event)"
    />
    <MenuItemModal v-model="$store.menuItemModal" />
    <NewsModal
      :model-value="$store.newsModal"
      @update:model-value="closeNewsModal()"
    />

    <RegistrationModal v-model="$store.registrationModal" />
  </template>
</template>

<script setup lang="ts">
import MainHeader from './header/MainHeader.vue'
import { Screen, useQuasar } from 'quasar'
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from 'src/models/store'
import AuthModal from 'src/pages/auth/AuthModal.vue'
import { authentication } from 'src/models/authentication/authentication'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { cartRepo } from 'src/models/carts/cartRepo'
import PrepareUiSettings from 'src/components/template/PrepareUiSettings.vue'
import { handleMessage } from 'src/models/webSocket/webSocketRepo'
import { newsRepo } from 'src/models/news/newsRepo'
import { promotionsRepo } from 'src/models/promotion/promotionsRepo'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { appSettingsRepo } from 'src/models/appSettings/appSettingsRepo'
import CartDrawer from './drawer/cart/CartDrawer.vue'
import ServiceSettingsModal from 'src/components/serviceSettings/ServiceSettingsModal.vue'
import SelectCompanyModal from 'src/components/dialogs/SelectCompanyModal.vue'
import { Company } from 'src/models/company/company'
import { companyRepo } from 'src/models/company/companyRepo'
import CFooter from './footer/CFooter.vue'
import { padRepo } from 'src/models/pads/padRepo'
import { api } from 'src/boot/axios'
import { waiterCallRepo } from 'src/models/customer/waiterCall/waiterCallRepo'
import { orderRepo } from 'src/models/order/orderRepo'
import QRMobileMenu from 'src/pages/qrMenu/QRMobileMenu.vue'
import QRHomePadInfo from 'src/pages/qrMenu/home/QRHomePadInfo.vue'
import MenuItemModal from 'src/pages/menuItem/MenuItemModal.vue'
import NewsModal from 'src/pages/news/NewsModal.vue'
import RegistrationModal from 'src/pages/auth/RegistrationModal.vue'
import { NewsType } from 'src/models/news/news'
import CartOverlayButton from './drawer/cart/CartOverlayButton.vue'
import { useFavicon } from '@vueuse/core'

const webSocket = ref<WebSocket | null>(null)

const routesWithoutContainerPaddings = [
  'promotion',
  'current_order',
  'order_review',
  'menu_item',
]

const q = useQuasar()
const route = useRoute()
const router = useRouter()
const ready = ref(false)
const icon = useFavicon()

watch(
  () => authentication.user?.id,
  (v) => {
    if (!v) return
    webSocket.value = new WebSocket(`wss://loyalhub.ru/ws/customers/${v}/`)
    webSocket.value.onmessage = (event) => {
      handleMessage(event)
    }
  }
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
  }
)

watch(
  () => q.screen.name,
  () => {
    if (route.name === 'menuPage' && q.screen.lt.md) {
      void router.push({ name: 'testPage' })
    }
  }
)

const footerAndHeaderHeight = computed(() => {
  return Screen.gt.sm ? store.headerHeight + store.footerHeight : 0
})

const setBodyScrollClass = () => {
  if (q.platform.is.win) {
    const body = document.getElementsByTagName('body')
    if (body.length) body[0].classList.add('custom-scroll-bar')
  }
}

const getCurrentCompanyGroup = async () => {
  try {
    await companyGroupRepo.current()
  } catch {
    authentication.tokens = new authentication.tokensClass(null, null)
    authentication.setApiHeader()
    localStorage.setItem('access', '')
    localStorage.setItem('refresh', '')
    // window.location.reload()
  }
}

function changeFavicon(src?: string) {
  if (!src) return
  icon.value = src
}

onMounted(async () => {
  window.addEventListener('scroll', () => {
    store.verticalScroll = window.scrollY
  })
  if (route.path.includes('qr_menu')) {
    store.tableMode = true
  }
  salesPointRepo.menuLoading = true
  setBodyScrollClass()
  if (!store.tableMode) {
    store.getCompanyGroup(String(route.params.companyGroup))
    await getCurrentCompanyGroup()
    changeFavicon(companyGroupRepo.item?.image?.thumbnail)
    await uiSettingsRepo.fetchSettings()
    await appSettingsRepo.getLinksSettings(String(route.params.companyGroup))
    try {
      await authentication.validateTokens()
      await authentication.me()
      await cartRepo.current()
    } catch {
      authentication.loading = false
      ready.value = true
      cartRepo.loading = false
    }
    if (!newsRepo.news.length) {
      void newsRepo
        .list({
          company_group: companyGroupRepo.item?.id,
          active: true,
          type: NewsType.DEFAULT,
        })
        .then((res) => {
          newsRepo.news = res.items
        })
    }
    if (!newsRepo.promotions.length) {
      void newsRepo
        .list({
          company_group: companyGroupRepo.item?.id,
          active: true,
          type: NewsType.PROMOTION,
        })
        .then((res) => {
          newsRepo.promotions = res.items
        })
    }
    const currentPoint = cartRepo.item
      ? cartRepo.item?.salesPoint
      : companyGroupRepo.item?.companies[0]?.salesPoints &&
        companyGroupRepo.item?.companies[0]?.salesPoints.length
      ? companyGroupRepo.item?.companies[0]?.salesPoints[0]
      : null
    if (currentPoint) void store.loadCatalog(currentPoint)
  } else {
    Object.assign(api.defaults.headers, {
      ['User-Role']: 'pad_manager',
    })
    Object.assign(api.defaults.headers, {
      ['Company-Group']: route.params.companyGroup,
    })
    void uiSettingsRepo.fetchSettings()
    await padRepo.retrieve(String(route.params.padId))
    if (!padRepo.item?.companyGroup) return
    await companyGroupRepo.retrieve(padRepo.item.companyGroup)
    changeFavicon(companyGroupRepo.item?.image?.thumbnail)
    store.getCompanyGroup(String(companyGroupRepo.item?.externalId))
    void store.loadCatalog(padRepo.item?.salesPoint?.id || '')
    void waiterCallRepo
      .list({
        pad: padRepo.item.id,
      })
      .then(() => {
        waiterCallRepo.item = waiterCallRepo.items[0]
      })
    void orderRepo.current(padRepo.item)
    void cartRepo.current(padRepo.item.salesPoint?.id, padRepo.item)
  }

  ready.value = true
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
