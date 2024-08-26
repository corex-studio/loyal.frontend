<template>
  <CDialog no-padding v-if="$q.screen.gt.sm" :width="width" :height="height"
           v-model="modelValue">
    <slot></slot>
  </CDialog>
  <CSwipeModal v-else allow-open-full-height  v-model="modelValue">
    <slot></slot>
  </CSwipeModal>
</template>

<script setup lang="ts">
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import CSwipeModal from 'src/components/dialogs/CSwipeModal.vue'

const modelValue = defineModel<boolean>()

defineProps<{
  width?: string
  height?: string
}>()

</script>

<style scoped lang="scss">

</style>
