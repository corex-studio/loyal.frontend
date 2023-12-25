<template>
  <div class="column gap-6 subtitle-text full-width">
    <div class="row full-width justify-between items-center">
      <div>Сумма за товары</div>
      <div>{{ $cart.item?.sum }} ₽</div>
    </div>
    <div class="row full-width justify-between items-center">
      <div>Доставка</div>
      <div>{{ $cart.item?.deliveryPrice }} ₽</div>
    </div>
    <!-- <div class="row full-width justify-between items-center">
      <div class="column gap-2">
        <div>Бонусы</div>
        <CButton
          text-button
          class="subtitle-text"
          label="Нажмите, чтобы списать"
          text-color="primary"
        />
      </div>
      <q-chip v-if="usedPoints" color="primary"></q-chip>
      <div v-else>0</div>
    </div> -->
    <q-separator color="divider-color" class="my-2" />
    <div class="header3 bold row justify-between items-center">
      <div>Итого</div>
      <div>{{ $cart.item?.discountedTotalSum }} ₽</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
// import { sum } from 'lodash'
// import CButton from 'src/components/template/buttons/CButton.vue'
// import { cartRepo } from 'src/models/carts/cartRepo'
// import { computed } from 'vue'

// const usedPoints = computed(() => {
//   return sum(cartRepo.item?.walletPayments.map((v) => v.applied_sum))
// })
</script>
