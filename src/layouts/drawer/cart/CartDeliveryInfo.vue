<template>
  <div
    class="bg-backing-color text-on-backing-color border-radius row no-wrap full-width pa-10 gap-8 items-center"
  >
    <img
      v-if="$company.item?.image?.thumbnail"
      height="50"
      class="border-radius"
      style="object-fit: contain"
      :src="$company.item?.image?.thumbnail"
    />
    <div style="height: fit-content" class="body column gap-2">
      <div class="bold">{{ cartDateInfo }}</div>
      <div class="row no-wrap gap-2">
        <div>Адрес:</div>
        <div class="ellipsis-2-lines">
          {{ $cart.item?.currentAddress }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { cartRepo } from 'src/models/carts/cartRepo'
import { computed } from 'vue'
const cartDateInfo = computed(() => {
  return `${cartRepo.item?.currentDeliveryType}`
})
</script>
