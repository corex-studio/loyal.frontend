<template>
  <!-- :class="
      $cart.item?.type === 'delivery'
        ? 'bg-delivery-button-color text-on-delivery-button-color'
        : $cart.item?.type === 'pickup'
        ? 'bg-pickup-button-color text-on-pickup-button-color'
        : $cart.item?.type === 'booking'
        ? 'bg-booking-button-color text-on-booking-button-color'
        : 'background-color text-on-background-color'
    " -->
  <div
    @click="openDialog()"
    class="row no-wrap gap-20 cursor-pointer border-radius items-center bg-secondary-button-color"
    style="overflow: hidden; height: 44px; padding: 0 40px"
  >
    <div v-if="!$cart.item" class="row no-wrap gap-4 items-center">
      <div style="background-color: #ffffff7f" class="border-radius px-4 py-3">
        <q-icon size="20px" :name="'fa-light fa-square-question'" />
      </div>
      <div>Укажите тип доставки</div>
    </div>
    <template v-else>
      <div class="row no-wrap gap-4 items-center">
        <div class="border-radius bg-on-primary px-4 py-3">
          <q-icon
            size="20px"
            color="primary"
            :name="'fa-solid fa-location-dot'"
          />
        </div>
        <div>{{ currentAddress }}</div>
      </div>
      <div class="row no-wrap gap-4 items-center">
        <!-- style="background-color: #ffffff7f" -->

        <div class="border-radius px-4 py-3 bg-on-primary">
          <q-icon color="primary" size="20px" :name="'fa-solid fa-box'" />
        </div>
        <div>{{ currentDeliveryType() }}</div>
      </div>
    </template>
    <!-- <div style="background-color: #ffffff7f" class="border-radius px-4 py-3">
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
    <div v-if="!$q.screen.xs" class="column col gap-1">
      <div style="line-height: 18px" class="bold">
        {{ $cart.item ? currentDeliveryType() : 'Укажите тип доставки' }}
      </div>
      <div v-if="currentAddress" class="row full-width">
        <div class="ellipsis">
          {{ currentAddress }}
        </div>
      </div>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
import { cartRepo } from 'src/models/carts/cartRepo'
import { computed } from 'vue'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { store } from 'src/models/store'

const currentAddress = computed(() => {
  return cartRepo.item
    ? cartRepo.item.type === 'delivery'
      ? cartRepo.item.deliveryAddress?.name
      : cartRepo.item.salesPoint.customAddress ||
        cartRepo.item.salesPoint.address
    : ''
})

const openDialog = () => {
  if (!companyGroupRepo.item) return
  if (companyGroupRepo.item?.companies.length > 1) {
    store.selectCompanyModal = true
  } else {
    store.serviceSettingsModal = true
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
