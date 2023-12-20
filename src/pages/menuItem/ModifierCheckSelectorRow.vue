<template>
  <div
    class="row full-width items-center justify-between cursor-pointer body pr-5 py-3"
  >
    <div class="column gap-2">
      <div>{{ item.name }}</div>
      <div
        :class="{ 'text-primary': item.quantity }"
        :style="item.quantity ? '' : 'opacity: 0.5'"
      >
        +{{ item.price }} ₽
      </div>
    </div>
    <q-checkbox
      @click="$emit('select', item)"
      size="50px"
      dense
      :model-value="!!item.quantity"
    />
  </div>
</template>
<script lang="ts" setup>
import { MenuModifierGroupItem } from 'src/models/menu/menuModifierGroup/menuModifierGroup'

defineProps<{
  item: MenuModifierGroupItem
}>()

defineEmits<{
  (evt: 'select', val: MenuModifierGroupItem): void
}>()
</script>
