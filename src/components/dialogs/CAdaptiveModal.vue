<template>
  <CDialog
    v-if="$q.screen.gt.sm"
    v-model="modelValue"
    :height="height"
    :width="width"
    :no-close="noClose"
    :no-backdrop-dismiss="noBackdropDismiss"
    :height-percent="heightPercent"
    no-padding
  >
    <slot></slot>
  </CDialog>
  <CSwipeModal
    v-else
    :width="width"
    v-model="modelValue"
    :breakpoint="initialMobileHeight"
  >
    <slot></slot>
  </CSwipeModal>
</template>

<script lang="ts" setup>
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import CSwipeModal from 'src/components/dialogs/CSwipeModal.vue'

const modelValue = defineModel<boolean>()

defineProps<{
  width?: string
  height?: string
  initialMobileHeight?: string
  noBackdropDismiss?: boolean
  noClose?: boolean
  heightPercent?: string
}>()
</script>

<style lang="scss" scoped></style>
