<template>
  <template v-if="ready">
    <PrepareUiSettings />
    <q-layout view="lHh Lpr lFf" class="bg-background-color">
      <MainHeader />
      <BottomHeader />
      <q-page-container
        :class="{
          'c-container':
            $route.name !== 'home' &&
            !routesWithoutContainerPaddings.some((v) =>
              $route.path.includes(v)
            ),
        }"
        style="padding-bottom: 50px"
      >
        <!-- {{ $cart.item?.salesPoint.id }} -->
        <!-- {{ $route.name }} -->
        <router-view />
      </q-page-container>

      <!-- <q-footer> -->
      <CFooter />
      <!-- </q-footer> -->
    </q-layout>
    <AuthModal
      :model-value="$store.authModal"
      @update:model-value="$store.authModal = $event"
    />
    <SelectCompanyModal />
  </template>
</template>

<script setup lang="ts">
import MainHeader from './header/MainHeader.vue'
import CFooter from 'src/layouts/footer/CFooter.vue'
import { useQuasar } from 'quasar'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from 'src/models/store'
import BottomHeader from './header/BottomHeader.vue'
import AuthModal from 'src/pages/auth/AuthModal.vue'
import { authentication } from 'src/models/authentication/authentication'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { cartRepo } from 'src/models/carts/cartRepo'
import PrepareUiSettings from 'src/components/template/PrepareUiSettings.vue'
import { handleMessage } from 'src/models/webSocket/webSocketRepo'
import SelectCompanyModal from 'src/components/dialogs/SelectCompanyModal.vue'

const webSocket = ref<WebSocket | null>(null)

const routesWithoutContainerPaddings = ['promotion']

watch(
  () => authentication.user?.id,
  (v) => {
    if (!v) return

    webSocket.value = new WebSocket(
      `wss://loyal.corex.studio/ws/customers/${v}/`
    )

    webSocket.value.onmessage = (event) => {
      handleMessage(event)
    }
  }
)

const q = useQuasar()
const route = useRoute()
const router = useRouter()
const ready = ref(false)

const setBodyScrollClass = () => {
  if (q.platform.is.win) {
    const body = document.getElementsByTagName('body')
    if (body.length) body[0].classList.add('custom-scroll-bar')
  }
}

watch(
  () => q.screen.name,
  () => {
    if (route.name === 'menuPage' && q.screen.lt.md) {
      void router.push({ name: 'testPage' })
    }
  }
)

onMounted(async () => {
  store.getCompanyGroup()
  setBodyScrollClass()
  await companyGroupRepo.current()
  await uiSettingsRepo.fetchSettings()

  try {
    await authentication.validateTokens()
    await authentication.me()
    await cartRepo.current()
  } catch {
    // ready.value = true;
  }
  // await menuRepo.list({
  //   active: true,
  // })
  ready.value = true
})
</script>

<style lang="scss" scoped>
.q-page-container {
  padding-top: 0px !important;
}
</style>
