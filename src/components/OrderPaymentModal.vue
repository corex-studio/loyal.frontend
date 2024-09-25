<template>
  <CDialog
    v-model="modelValue"
    :card-styles="`flex-direction: column; ${$q.screen.lt.md ? `height: ${$q.screen.height * 0.9}px;` : ''}`"
    :disable-overflow="$q.platform.is.safari"
    :height="`${$q.screen.gt.sm ? `${$q.screen.height * 0.75 > 1150 ? 1150 : $q.screen.height * 0.75}px ` : ''}`"
    :position="$q.screen.lt.md ? 'bottom' : undefined"
    content-wrapper-styles="flex-grow:1; display: flex"
    no-backdrop-dismiss
    no-padding
    width="900px"
  >
    <div class="flex" style="flex-grow: 1">
      <iframe
        v-if="modelValue && paymentUrl"
        :src="paymentUrl"
        class="full-width full-height"
        style="border: 0"
      ></iframe>
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import CDialog from 'components/template/dialogs/CDialog.vue'

defineProps<{
  paymentUrl?: string | null
}>()

const modelValue = defineModel<boolean>()
</script>
