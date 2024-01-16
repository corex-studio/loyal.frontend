<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="py-3 row full-width item-center justify-between">
    <div class="column gap-2 body">
      <div>{{ item.name }}</div>
      <div
        :class="{ 'text-primary': item.quantity }"
        :style="item.quantity ? '' : 'opacity: 0.5'"
      >
        +{{ item.price ? item.price * item.quantity : 0 }} ₽
      </div>
    </div>

    <ChangeAmount
      small
      :model-value="item.quantity"
      @update:model-value="item.quantity = $event"
      :disable-adding="
        (group.restrictions &&
          sum(group.items.map((v) => v.quantity)) >=
            group.restrictions.max_quantity) ||
        item.quantity >= item.restrictions.max_quantity
      "
    />
  </div>
</template>
<script lang="ts" setup>
import { sum } from 'lodash'
import ChangeAmount from 'src/components/inputs/ChangeAmount.vue'
import {
  MenuModifierGroupItem,
  MenuModifierGroup,
} from 'src/models/menu/menuModifierGroup/menuModifierGroup'

defineProps<{
  group: MenuModifierGroup
  item: MenuModifierGroupItem
}>()
</script>
