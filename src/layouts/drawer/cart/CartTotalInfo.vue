<template>
  <div class="column gap-6 subtitle-text full-width">
    <div v-if="$cart.item" class="row full-width justify-between items-center">
      <div>Сумма за товары</div>
      <div>
        {{ beautifyNumber($cart.item?.discountedSumWithoutBonuses, true) }} ₽
      </div>
    </div>
    <template v-if="deliverySettings">
      <CartDeliveryPriceInfo :delivery-settings="deliverySettings" />
    </template>
  </div>
</template>
<script lang="ts" setup>
import { beautifyNumber } from 'src/models/store'
import { DeliveryAreaSettings } from 'src/models/deliveryAreas/deliveryAreaSettings/deliveryAreaSettings'
import CartDeliveryPriceInfo from 'layouts/drawer/cart/CartDeliveryPriceInfo.vue'

defineProps<{
  deliverySettings?: DeliveryAreaSettings[]
}>()
</script>
