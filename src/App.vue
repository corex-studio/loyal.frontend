<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { updateYandexMerikaByConfig } from '../../../vue-yandex-metrika'
import { useRouter } from 'vue-router'
import { getYandexMetrikaDefaultConfig } from 'src/services/yandexMetrikaConfig'

onMounted(() => {
  if (useQuasar().platform.is.safari) {
    document.body.classList.add('safari')
  }
  setTimeout(() => {
    const cfg = getYandexMetrikaDefaultConfig(useRouter())
    updateYandexMerikaByConfig(cfg as any)
  }, 10000)
})
</script>
