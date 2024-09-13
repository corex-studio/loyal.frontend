<template>
  <div
    :class="small ? 'py-3' : 'py-5'"
    class="row full-width  justify-between body no-wrap cursor-pointer"
  >
    <div :class="small ? 'gap-4' : 'gap-6'" class="row no-wrap items-center">
      <q-img
        :height="small ? '48px' : '65px'"
        :src="item.size.image?.thumbnail || $store.images.empty"
        :style="`min-width: ${small ? '48px' : '65px'}`"
        :width="small ? '48px' : '65px'"
        class="border-radius2"
        fit="contain"
      >
        <template v-slot:error>
                  <span>
                    <q-img
                      :src="$store.images.empty"
                      class="border-radius2"
                      fit="cover"
                      height="65px"
                      style="min-width: 65px"
                      width="65px"
                    ></q-img> </span
                  ></template>
      </q-img>
      <div class="column gap-2">
        <div :class="small ? 'secondary-text' : 'body'">{{ item.size.name }}</div>
        <div
          v-if="item.modifiers.length"
          class="secondary-text text-on-background-color"
        >
          {{
            item.modifiers
              .map(
                (v) =>
                  `${v.modifier?.name}${
                    v.quantity > 1 ? ' x ' + v.quantity : ''
                  }`
              )
              .join(', ')
          }}
        </div>
        <div
          :class="{ 'secondary-text': $q.screen.lt.md || small }"
          style="opacity: 0.5"
        >
          {{ item.quantity }} шт
        </div>
      </div>
    </div>
    <div class="column items-end">
      <div
        v-if="item.total_sum !== item.discounted_total_sum"
        class="text-strike"
        style="opacity: 0.5"
      >
        {{ beautifyNumber(item.total_sum, true) }} ₽
      </div>
      <div style="text-wrap: nowrap">
        {{ beautifyNumber(item.discounted_total_sum || 0, true) }} ₽
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { beautifyNumber } from 'src/models/store'
import { OrderItemRaw } from 'src/models/order/order'

defineProps<{
  item: OrderItemRaw
  small?: boolean

}>()
</script>

<style lang="scss" scoped>

</style>
