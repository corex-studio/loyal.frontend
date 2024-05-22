<template>
  <b
    @mouseover="disabled ? (hover = false) : (hover = true)"
    @mouseleave="hover = false"
  >
    <slot :hover="hover && !$q.platform.has.touch"></slot>
  </b>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  disabled?: boolean
}>()
const hover = ref(false)
</script>

<style scoped>
b {
  font-weight: inherit;
}
</style>
