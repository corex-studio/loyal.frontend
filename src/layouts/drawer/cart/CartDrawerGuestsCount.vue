<template>
  <div
    v-if="$cart.item"
    class="mt-15 border-radius no-wrap bg-backing-color row full-width items-center justify-between gap-5 text-on-backing-color px-6 py-3"
  >
    <div class="row gap-5 no-wrap items-center">
      <CIcon
        size="19px"
        name="fa-regular fa-utensils"
        color="on-backing-color"
      />
      <div class="body">
        {{ $uiSettings.item?.guestCountSetterText || 'Приборы' }}
      </div>
    </div>
    <ChangeAmount
      :model-value="$cart.item.guestCount"
      @update:model-value="changeGuestsCount"
      :min-value="1"
      small
    />
  </div>
</template>
<script lang="ts" setup>
import ChangeAmount from 'src/components/inputs/ChangeAmount.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { cartRepo } from 'src/models/carts/cartRepo'
import { notifier } from 'src/services/notifier'

const changeGuestsCount = async (val: number) => {
  try {
    if (!cartRepo.item) throw new Error('Object is null')
    cartRepo.item.guestCount = val
    await cartRepo.setParams({
      guest_count: cartRepo.item.guestCount,
    })
  } catch {
    notifier.error('Ошибка при задании параметров корзины')
  }
}
</script>
