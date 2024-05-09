<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { getYandexMetrikaDefaultConfig } from 'src/services/yandexMetrikaConfig'
import { updateYandexMerikaByConfig } from 'yandex-metrika-vue3'
import { useYandexMetrika } from 'yandex-metrika-vue3'
import { store } from './models/store'

const metrika = useYandexMetrika()

const storeInitialProduct = () => {
  if (window.location.href.includes('product/')) {
    const regex = /\/product\/(\w+-\w+-\w+-\w+-\w+)/
    const match = window.location.href.match(regex)
    if (match && match[1]) {
      store.initialMenuItem = match[1]
    }
  }
}

onMounted(() => {
  storeInitialProduct()
  const platformIs = useQuasar().platform.is
  if (platformIs.safari || platformIs.ios || platformIs.iphone || platformIs.ipad || platformIs.ipod) {
    document.body.classList.add('safari')
  }
  initMetrika()
})

const router = useRouter()
const route = useRoute()
let interval: NodeJS.Timeout

const initMetrika = () => {
  interval = setInterval(() => {
    const value = window._metrikaKey
    if (value !== undefined) {
      clearInterval(interval)
      if (value) {
        const cfg = getYandexMetrikaDefaultConfig(router)
        cfg.id = value
        updateYandexMerikaByConfig(cfg as any)
        metrika.hit(route.fullPath)
      }
    }
  }, 100)
}
</script>
