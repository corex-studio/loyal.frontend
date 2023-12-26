<template>
  <div class="full-width">
    <div class="full-width header2 bold mb-8">Баллы</div>
    <div
      class="row bg-selector-color text-on-selector-color no-wrap full-width border-radius pa-1 body"
    >
      <div
        @click="discard()"
        :class="{
          'bg-selector-active-color bold text-on-selector-active-color':
            currentChoice === 1,
        }"
        class="col py-5 cursor-pointer row justify-center border-radius"
      >
        Не списывать
      </div>
      <div
        @click="applyClickHandler()"
        :class="{
          'bg-selector-active-color bold text-on-selector-active-color':
            currentChoice === 2,
        }"
        class="col row py-5 cursor-pointer justify-center border-radius"
      >
        Списать {{ maxSum }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
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
</script>
