<template>
  <CAdaptiveModal
    :model-value="modelValue"
    width="1094px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <CreateDeliveryAddress
      :back-callback="() => $emit('update:modelValue', false)"
      :address="address"
      @updated="$emit('create')"
    />
  </CAdaptiveModal>
</template>
<script lang="ts" setup>
import CAdaptiveModal from 'src/components/dialogs/CAdaptiveModal.vue'
import CreateDeliveryAddress from 'src/components/serviceSettings/CreateDeliveryAddress.vue'
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
