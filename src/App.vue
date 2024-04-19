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

const metrika = useYandexMetrika()

onMounted(() => {
  if (useQuasar().platform.is.safari) {
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
