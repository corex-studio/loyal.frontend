<template>
  <div
    :class="modelValue ? 'radio-selected' : 'radio'"
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
      v-if="modelValue"
      class="bg-primary"
      style="height: 10px; width: 10px; border-radius: 50%"
    ></div>
    <!-- <CIcon
      :style="`visibility: ${modelValue ? 'visible' : 'hidden'}`"
      name="fa-solid fa-check"
      color="background-color"
      size="17px"
    /> -->
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  modelValue: boolean
  height?: string
  width?: string
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
