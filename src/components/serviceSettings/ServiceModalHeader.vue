<template>
  <div class="row gap-5 items-center">
    <template v-if="$slots.action">
      <slot name="action"></slot>
    </template>
    <div class="header2 bold">{{ getTitle() }}</div>
  </div>
</template>
<script lang="ts" setup>
import { CartType } from 'src/models/carts/cart'

const props = defineProps<{
  tab: CartType | null
}>()

const getTitle = () => {
  if (!props.tab) return 'Тип доставки'
  if (props.tab === CartType.DELIVERY) return 'Адреса доставки'
  if (props.tab === CartType.PICKUP) return 'Адреса заведения'
  if (props.tab === CartType.BOOKING) return 'Забронировать'
}
</script>
