<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="456px"
  >
    <template v-slot:header>
      <div class="row justify-between full-width items-center">
        {{ address ? 'Изменить адрес' : 'Создать адреса' }}
        <div
          style="width: 36px; height: 36px"
          class="bg-white-opacity row justify-center items-center border-radius box-shadow"
        >
          <CIcon
            name="fa-light fa-location-dot"
            color="on-secondary-button-color"
          />
        </div>
      </div>
    </template>
    <CreateDeliveryAddress :address="address" @create="$emit('create')" />
  </CDialog>
</template>
<script lang="ts" setup>
import CreateDeliveryAddress from 'src/components/serviceSettings/CreateDeliveryAddress.vue'
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
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
