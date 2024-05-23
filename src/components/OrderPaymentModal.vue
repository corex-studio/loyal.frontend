<template>
  <CDialog
    :disable-overflow="$q.platform.is.safari"
    v-model="modelValue"
    :position="$q.screen.lt.md ? 'bottom' : undefined"
    width="900px"
    :height="`${$q.screen.gt.sm ? `${$q.screen.height * 0.75 > 1150 ? 1150 : $q.screen.height * 0.75}px ` : ''}`"
    no-backdrop-dismiss
    :card-styles="`flex-direction: column; ${$q.screen.lt.md ? `height: ${$q.screen.height * 0.9}px;` : ''}`"
    content-wrapper-styles="flex-grow:1; display: flex"
  >
    <div class="flex" style="flex-grow: 1">
      <iframe
        style="border: 0"
        class="full-width full-height"
        v-if="modelValue && paymentUrl"
        :src="paymentUrl"
      ></iframe>
    </div>
  </CDialog>
</template>
<script setup lang="ts">
import CDialog from 'components/template/dialogs/CDialog.vue'

defineProps<{
  paymentUrl?: string | null
}>()

const modelValue = defineModel<boolean>()
</script>