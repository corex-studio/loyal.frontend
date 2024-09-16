<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { getYandexMetrikaDefaultConfig } from 'src/services/yandexMetrikaConfig'
import {
  updateYandexMerikaByConfig,
  useYandexMetrika,
} from 'yandex-metrika-vue3'
import { useFictiveUrlStore } from 'stores/fictiveUrlStore'
import { useEventBus } from '@vueuse/core'
import { initMetrikaKey } from 'src/services/eventBusKeys'

const metrika = useYandexMetrika()
const fictiveUrlStore = useFictiveUrlStore()
const router = useRouter()
const route = useRoute()

const storeInitialProduct = () => {
  const url = window.location.href
  const res = fictiveUrlStore.extractIdsFromUrl(url)
  fictiveUrlStore.initialMenuItem = res.productId
  fictiveUrlStore.initialMenuGroupItem = res.categoryId
}

const handleInitialNews = () => {
  const url = window.location.href
  const res = fictiveUrlStore.extractIdsFromUrl(url)
  if (res.newsId) {
    fictiveUrlStore.currentNewsItem = res.newsId
  }
}

let allowInitMetrika = false

onMounted(() => {
  useEventBus(initMetrikaKey).on(() => {
    allowInitMetrika = true
  })
  storeInitialProduct()
  handleInitialNews()
  const platformIs = useQuasar().platform.is
  if (
    platformIs.safari ||
    platformIs.ios ||
    platformIs.iphone ||
    platformIs.ipad ||
    platformIs.ipod
  ) {
    document.body.classList.add('safari')
  }
  initMetrika()
})

let interval: NodeJS.Timeout

const initMetrika = () => {
  interval = setInterval(() => {
    const value = window._metrikaKey
    if (value !== undefined && (allowInitMetrika)) {
      clearInterval(interval)
      if (value) {
        const cfg = getYandexMetrikaDefaultConfig(router)
        cfg.id = value
        updateYandexMerikaByConfig(cfg as any)
        setTimeout(() => {
          metrika.hit(route.fullPath)
        })
      }
    }
  }, 50)
}
</script>
