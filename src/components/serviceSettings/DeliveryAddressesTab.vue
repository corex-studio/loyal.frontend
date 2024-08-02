<template>
  <div
    :class="{ 'px-xs-8 px-md-0 py-md-0 py-xs-12': !noPadding }"
    class="full-width"
  >
    <div
      v-if="$q.screen.lt.md"
      class="row full-width gap-4 items-center no-wrap mb-10"
    >
      <CIcon
        class="cursor-pointer"
        color="on-background-color"
        hover-color="primary"
        name="fa-regular fa-angle-left"
        size="22px"
        @click="$emit('back')"
      />
      <div class="header3 bold">Доставка</div>
    </div>
    <div
      :style="$q.screen.gt.sm ? 'height: 374px !important' : `max-height: 80vh`"
      class="column no-wrap full-width gap-md-8 gap-xs-2 pb-md-10 pb-xs-12"
      style="overflow: scroll"
    >
      <template v-if="deliveryAddressesInSortedOrder.length">
        <div
          v-for="(el, index) in deliveryAddressesInSortedOrder"
          :key="index"
          :class="el.isAddressAvailable ? 'cursor-pointer' : 'cursor-not-allowed'"
          :style="
            $q.screen.lt.md ? '' : `border: 1px ${getBorderColor(el)} solid`
          "
          class="row items-center full-width pa-md-10 py-xs-5 justify-between  border-radius"
          @click="$emit('select', el)"
        >
          <div class="row col-10 items-center gap-6 no-wrap">
            <RoundedSelector
              :model-value="el.id === currentAddress?.id"
              height="24px"
              width="24px"
            />
            <div class="column  body">
              <div class="ellipsis-2-lines">
                {{ el.address }}
              </div>
              <div v-if="!el.isAddressAvailable" class="text-danger secondary-text">Пока не доставляем</div>
            </div>

          </div>
          <CIcon
            v-if="!selectionOnly"
            class="cursor-pointer"
            color="secondary"
            hover-color="primary"
            name="fa-light fa-pen"
            size="22px"
            @click="$emit('edit', el)"
          />
        </div>
      </template>
      <div v-else class="subtitle-text mb-xs-6 mb-md-0">
        У вас нет адресов доставки
      </div>
      <div v-if="$q.screen.lt.md && !selectionOnly" class="mt-5">
        <CButton
          class="body"
          icon="fa-regular fa-plus"
          icon-size="24px"
          label="Добавить новый адрес"
          text-button
          text-color="primary"
          @click="$emit('addAddress')"
        />
      </div>
    </div>
    <div
      v-if="$slots.bottom"
      class="row bg-background-color full-width border-radius"
    >
      <slot name="bottom"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import RoundedSelector from '../template/buttons/RoundedSelector.vue'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import CIcon from '../template/helpers/CIcon.vue'
import CButton from '../template/buttons/CButton.vue'
import { computed } from 'vue'
import { deliveryAddressRepo } from 'src/models/customer/deliveryAddress/deliveryAddressRepo'

const props = defineProps<{
  currentAddress: DeliveryAddress | null
  noPadding?: boolean
  selectionOnly?: boolean
}>()

defineEmits<{
  (evt: 'select', val: DeliveryAddress): void
  (evt: 'edit', val: DeliveryAddress): void
  (evt: 'back'): void
  (evt: 'addAddress'): void
}>()

const deliveryAddressesInSortedOrder = computed(() => {
  return deliveryAddressRepo.items.sort((a, b) => a.isAddressAvailable && !b.isAddressAvailable ? -1 : 1)
})

const getBorderColor = (el: DeliveryAddress) => {
  return props.currentAddress?.id === el.id
    ? '#' + uiSettingsRepo.item?.primaryColor.color
    : '#' + uiSettingsRepo.item?.dividerColor.color
}
</script>
