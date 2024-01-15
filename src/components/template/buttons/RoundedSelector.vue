<template>
  <div
    :class="modelValue ? (check ? 'bg-primary' : 'radio-selected') : 'radio'"
    style="border-radius: 50%"
    class="row items-center justify-center"
    :style="[
      `height: ${height || '29px'}; width: ${width || '29px'}; max-width:${
        width || '29px'
      }; min-width: ${width || '29px'}; max-height:${
        height || '29px'
      }; min-height:${height || '29px'}`,
    ]"
  >
    <div
      v-if="modelValue && !check"
      class="bg-primary"
      style="height: 10px; width: 10px; border-radius: 50%"
    ></div>
    <CIcon
      v-if="modelValue && check"
      color="on-primary"
      name="fa-regular fa-check"
      size="17px"
    />
  </div>
</template>
<script lang="ts" setup>
import CIcon from '../helpers/CIcon.vue'

defineProps<{
  modelValue: boolean
  height?: string
  width?: string
  check?: boolean
}>()
</script>

<style scoped lang="scss">
.radio-selected {
  border: 1px var(--primary) solid;
}
.radio {
  border: 1px var(--secondary-button-color) solid;
}
</style>
