<template>
  <div class="column full-width gap-6 no-wrap">
    <!--    {{item}}-->
    <div v-if="item.sum != item.discountedTotalSumWithFee" class="row full-width justify-between">
      <div class="body bold">Сумма заказа</div>
      <div class="body bold">
        {{ beautifyNumber(item.sum || 0, true) }} ₽
      </div>
    </div>
    <div
      v-if="item.type === CartType.DELIVERY"
      class="row full-width justify-between"
    >
      <div class="body bold">Стоимость доставки</div>
      <div class="body bold">
        {{ beautifyNumber(item.deliveryPrice, true) }} ₽
      </div>
    </div>
    <div
      v-if="item.appliedBonuses"
      class="row full-width justify-between text-primary"
    >
      <div class="body bold">Списано бонусов</div>
      <div class="body bold">
        -{{ beautifyNumber(item.appliedBonuses, true) }} ₽
      </div>
    </div>
    <div
      v-if="item.totalDiscountWithoutBonuses"
      class="row full-width justify-between"
    >
      <div class="body bold">Скидка</div>
      <div class="body bold">
        {{
          beautifyNumber(
            item.totalDiscountWithoutBonuses || 0,
            true
          )
        }}
        ₽
      </div>
    </div>
    <div
      v-if="item.fee"
      class="row full-width justify-between text-secondary"
    >
      <div class="body bold">Сервисный сбор</div>
      <div class="body bold">
        {{ beautifyNumber(item.fee || 0, true) }} ₽
      </div>
    </div>
    <div class="row full-width justify-between">
      <div class="body bold">{{ isOrder ? 'Итого' : 'К оплате' }}</div>
      <div class="body bold">
        {{ beautifyNumber(item.discountedTotalSumWithFee, true)
        }} ₽
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { beautifyNumber } from 'src/models/store'
import { Cart, CartType } from 'src/models/carts/cart'
import { Order } from 'src/models/order/order'
import { computed } from 'vue'

const props = defineProps<{
  item: Cart | Order
}>()

const isOrder = computed(() => {
  return 'items' in props.item
})
</script>


<style lang="scss" scoped>

</style>
