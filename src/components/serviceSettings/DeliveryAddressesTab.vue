<template>
  <div>
    <div
      class="column no-wrap full-width full-height gap-8 pb-34"
      style="overflow: scroll"
    >
      <div
        v-for="(el, index) in $deliveryAddress.items"
        :key="index"
        class="row items-center pa-10 justify-between cursor-pointer border-radius"
        @click="$emit('select', el)"
        :style="`border: 1px ${getBorderColor(el)} solid`"
      >
        <div class="row items-center gap-6 no-wrap">
          <RoundedSelector
            height="24px"
            width="24px"
            :model-value="el.id === currentAddress?.id"
          />
          <div class="subtitle-text">{{ el.address }}</div>
        </div>
        <!-- <CIcon
          class="cursor-pointer"
          hover-color="primary"
          size="22px"
          name="fa-light fa-pen"
          color="secondary-button-color"
        /> -->
      </div>
    </div>
    <div
      style="position: absolute; bottom: 0; left: 0"
      class="row bg-background-color full-width py-10 border-radius px-15"
    >
      <template v-if="$slots.bottom">
        <slot name="bottom"></slot>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import RoundedSelector from '../template/buttons/RoundedSelector.vue'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { lightColor } from 'src/models/store'

const props = defineProps<{
  currentAddress: DeliveryAddress | null
}>()

defineEmits<{
  (evt: 'select', val: DeliveryAddress): void
  (evt: 'confirm'): void
  (evt: 'addAddress'): void
}>()

const getBorderColor = (el: DeliveryAddress) => {
  return props.currentAddress?.id === el.id
    ? '#' + uiSettingsRepo.item?.primaryColor.color
    : lightColor(uiSettingsRepo.item?.backgroundColor.on_color || '000', '20')
}
</script>
