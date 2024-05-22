<template>
  <div class="full-width">
    <div class="full-width header3 bold mb-5">Баллы</div>
    <div class="row full-width items-center gap-5 justify-between">
      <div class="row items-center gap-7 no-wrap">
        <c-icon
          name="fa-light fa-coin-vertical"
          size="44px"
          color="on-background-color"
        />
        <div class="subtitle-text">Списать {{ maxSum }} бонусов</div>
      </div>
      <q-toggle
        @update:model-value="toggleClickHandler"
        :model-value="currentChoice === 2"
        dense
        size="52px"
        color="primary"
      ></q-toggle>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { cartRepo } from 'src/models/carts/cartRepo'
import { ref, computed } from 'vue'

const currentChoice = ref(1)

const maxSum = computed(() => {
  if (!cartRepo.item) return 0
  return cartRepo.item.walletPayments[0].wallet.balance >
    cartRepo.item.walletPayments[0].max_sum
    ? cartRepo.item.walletPayments[0].max_sum
    : cartRepo.item.walletPayments[0].wallet.balance
})

const toggleClickHandler = (v: boolean) => {
  if (v) {
    applyClickHandler()
  } else {
    discard()
  }
  applyBonuses()
}

const applyClickHandler = () => {
  if (!cartRepo.item) return
  currentChoice.value = 2
  cartRepo.item.walletPayments[0].applied_sum = maxSum.value
}

const discard = () => {
  if (!cartRepo.item) return
  cartRepo.item.walletPayments[0].applied_sum = 0
  currentChoice.value = 1
}

const applyBonuses = () => {
  if (cartRepo.item?.walletPayments.some((v) => v.applied_sum)) {
    void cartRepo.setParams({
      sales_point: cartRepo.item?.salesPoint?.id,
      type: cartRepo.item?.type || undefined,
      use_bonuses: true,
      // applied_wallet_payments: [
      //   {
      //     wallet_payment: cartRepo.item.walletPayments[0].uuid,
      //     applied_sum: cartRepo.item.walletPayments[0].applied_sum,
      //   },
      // ],
    })
  } else {
    void cartRepo.setParams({
      sales_point: cartRepo.item?.salesPoint?.id,
      type: cartRepo.item?.type || undefined,
      use_bonuses: false,
    })
  }
}
</script>
