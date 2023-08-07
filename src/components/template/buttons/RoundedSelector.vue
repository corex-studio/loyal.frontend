<template>
  <div
    :class="modelValue ? 'bg-primary' : 'unselected'"
    style="border-radius: 50%; padding: 4px 6px"
    :style="modelValue ? '' : 'border: 1px on-background-color solid'"
  >
    <CIcon
      :style="`visibility: ${modelValue ? 'visible' : 'hidden'}`"
      name="fa-solid fa-check"
      color="background-color"
    />
  </div>
</template>
<script lang="ts" setup>
import CIcon from '../helpers/CIcon.vue'

defineProps<{
  modelValue: boolean
}>()
</script>

<style scoped lang="scss">
.unselected {
  border: 1px var(--on-background-color) solid;
}
</style>
