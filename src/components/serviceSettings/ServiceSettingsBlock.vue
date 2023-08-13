<template>
  <div
    @click="openDialog()"
    class="row no-wrap gap-3 py-2 pl-5 pr-7 cursor-pointer box-shadow border-radius items-center"
    :class="
      $cart.item?.type === 'delivery'
        ? 'bg-delivery-button-color text-on-delivery-button-color'
        : $cart.item?.type === 'pickup'
        ? 'bg-pickup-button-color text-on-pickup-button-color'
        : $cart.item?.type === 'booking'
        ? 'bg-booking-button-color text-on-booking-button-color'
        : 'background-color text-on-background-color'
    "
    :style="$cart.item ? 'max-width: 350px;' : ''"
    style="overflow: hidden"
  >
    <div style="background-color: #ffffff7f" class="border-radius px-4 py-3">
      <q-icon
        size="20px"
        :name="
          $cart.item
            ? $cart.item.type === 'pickup'
              ? 'fa-light fa-person-walking'
              : $cart.item.type === 'booking'
              ? 'fa-light fa-calendar-day'
              : 'fa-light fa-house'
            : 'fa-light fa-square-question'
        "
      />
    </div>
    <div class="column col gap-1">
      <div style="line-height: 18px" class="bold">
        {{ $cart.item ? currentDeliveryType() : 'Укажите тип доставки' }}
      </div>
      <div v-if="currentAddress" class="row full-width">
        <div class="ellipsis">
          {{ currentAddress }}
        </div>
      </div>
    </div>
  </div>
  <ServiceSettingsModal
    :model-value="dialog"
    @update:model-value="dialogCloseHandler()"
  />
  <SelectCompanyModal
    :model-value="selectCompanyModal"
    @update:model-value="companySelectModalCloseHandler"
    @select="companySelected($event)"
  />
</template>
<script lang="ts" setup>
import { cartRepo } from 'src/models/carts/cartRepo'
import ServiceSettingsModal from './ServiceSettingsModal.vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { ref, computed } from 'vue'
import SelectCompanyModal from '../dialogs/SelectCompanyModal.vue'
import { Company } from 'src/models/company/company'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'

const dialog = ref(false)
const selectCompanyModal = ref(false)

const currentAddress = computed(() => {
  return cartRepo.item
    ? cartRepo.item.type === 'delivery'
      ? cartRepo.item.deliveryAddress?.name
      : cartRepo.item.salesPoint.customAddress ||
        cartRepo.item.salesPoint.address
    : ''
})

const companySelected = (v: Company) => {
  companyRepo.cartCompany = v
  selectCompanyModal.value = false
  dialog.value = true
}

const companySelectModalCloseHandler = () => {
  selectCompanyModal.value = false
}

const dialogCloseHandler = () => {
  dialog.value = false
}

const openDialog = () => {
  if (!companyGroupRepo.item) return
  if (companyGroupRepo.item?.companies.length > 1) {
    selectCompanyModal.value = true
  } else {
    dialog.value = true
  }
}

const currentDeliveryType = () => {
  if (cartRepo.item?.type === 'pickup') {
    return 'Самовывоз'
  } else if (cartRepo.item?.type === 'delivery') {
    return 'Доставка'
  } else if (cartRepo.item?.type === 'booking') {
    return 'Бронь'
  }
}
</script>
