<template>
  <div
    @click="dialog = !dialog"
    class="row no-wrap gap-4 pt-2 pb-1 px-7 cursor-pointer box-shadow border-radius"
    :class="
      $cart.item?.type === 'delivery'
        ? 'bg-delivery-button-color text-on-delivery-button-color'
        : $cart.item?.type === 'pickup'
        ? 'bg-pickup-button-color text-on-pickup-button-color'
        : 'bg-booking-button-color text-on-booking-button-color'
    "
    style="max-width: 265px; overflow: hidden"
  >
    <q-icon
      class="pt-2"
      size="18px"
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
    <div class="column gap-1 col-grow">
      <div class="bold">
        {{ $cart.item ? currentDeliveryType() : 'Тип доставки' }}
      </div>
      <div class="row full-width">
        <div class="ellipsis">
          {{
            $cart.item
              ? $cart.item.type === 'delivery'
                ? $cart.item.deliveryAddress?.name
                : $cart.item.salesPoint.customAddress
              : 'Не выбрано'
          }}
        </div>
      </div>
    </div>
  </div>
  <ServiceSettingsModal
    :model-value="dialog"
    @update:model-value="dialog = $event"
  />
</template>
<script lang="ts" setup>
import { cartRepo } from 'src/models/carts/cartRepo';
import ServiceSettingsModal from './ServiceSettingsModal.vue';
import { ref } from 'vue';

const currentDeliveryType = () => {
  if (cartRepo.item?.type === 'pickup') {
    return 'Самовывоз';
  } else if (cartRepo.item?.type === 'delivery') {
    return 'Доставка';
  } else if (cartRepo.item?.type === 'booking') {
    return 'Бронь';
  }
};

const dialog = ref(false);
</script>
