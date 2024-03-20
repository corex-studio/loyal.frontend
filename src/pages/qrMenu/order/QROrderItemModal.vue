<template>
  <CDialog v-model="modelValue">
    <QrOrderItem :item="item" :as-card="false" />
  </CDialog>
</template>
<script lang="ts" setup>
import CDialog from 'components/template/dialogs/CDialog.vue'
import { Order } from 'src/models/order/order'
import QrOrderItem from 'pages/qrMenu/order/QrOrderItem.vue'

defineProps<{
  item: Order
}>()

const modelValue = defineModel<boolean>()
</script>
