<template>
  <slot :value="newValue"></slot>
</template>

<script setup lang="ts" generic="T">
import { ref, watch } from 'vue'
import { cloneDeep } from 'lodash'

const props = defineProps<{
  value: T
  disabled?: boolean
  debounce?: number
}>()
const newValue = ref(cloneDeep(props.value))

let timeout: NodeJS.Timeout | null = null

watch(
  () => props.value,
  (v) => {
    if (timeout) clearTimeout(timeout)
    if (!props.disabled)
      timeout = setTimeout(() => {
        newValue.value = v as typeof newValue.value
      }, props.debounce ?? 50)
    else newValue.value = v  as typeof newValue.value
  },
)
</script>

<style scoped lang="scss"></style>
