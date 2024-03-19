<template>
  <div class="column gap-6 subtitle-text full-width">
    <div v-if="$cart.item" class="row full-width justify-between items-center">
      <div>Сумма за товары</div>
      <div>{{ beautifyNumber($cart.item?.discountedTotalSum, true) }} ₽</div>
    </div>
    <!--    <div-->
    <!--      v-if="$cart.item && $cart.item.deliveryPrice"-->
    <!--      class="row full-width justify-between items-center"-->
    <!--    >-->
    <!--      <div>Доставка</div>-->
    <!--      <div>{{ beautifyNumber($cart.item?.deliveryPrice) }} ₽</div>-->
    <!--    </div>-->
    <template v-if="deliverySettings">
      <CartDeliveryPriceInfo :delivery-settings="deliverySettings" />
    </template>

    <!--    <q-separator color="divider-color" class="my-2" />-->
    <!--    <div v-if="$cart.item" class="header3 row justify-between items-center">-->
    <!--      <div class="bold">Итого</div>-->
    <!--      <div class="bold">-->
    <!--        {{ beautifyNumber($cart.item.discountedTotalSum, true) }} ₽-->
    <!--      </div>-->
    <!--    </div>-->
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
