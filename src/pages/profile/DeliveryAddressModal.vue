<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="1094px"
    no-padding
  >
    <CreateDeliveryAddress :address="address" @updated="$emit('create')" />
  </CDialog>
</template>
<script lang="ts" setup>
import CreateDeliveryAddress from 'src/components/serviceSettings/CreateDeliveryAddress.vue'
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'

defineProps<{
  modelValue: boolean
  address?: DeliveryAddress
}>()

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
  (evt: 'create'): void
}>()
</script>
