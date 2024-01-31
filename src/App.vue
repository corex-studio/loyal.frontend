<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'

onMounted(() => {
  if (useQuasar().platform.is.safari) {
    document.body.classList.add('safari')
  }
})
</script>
