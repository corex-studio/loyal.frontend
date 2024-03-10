<template>
  <CDialog v-model="modelValue" width="350px">
    <div class="header3 text-center mb-6 px-10 text-on-background-color">
      Цены на доставку
    </div>
    <div class="small-text mb-10 text-center text-on-background-color">
      Цена доставки зависит от суммы корзины
    </div>
    <div class="row body text-on-background-color">
      <div v-for="(item, index) in items" :key="item.id" class="row col-12">
        <q-separator v-if="index" style="height: 1px" class="col-12 my-3" />
        Заказ от {{ item.minimalOrderSum }} ₽
        <q-space />
        {{ item.deliveryPrice }} ₽
      </div>
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import CDialog from 'components/template/dialogs/CDialog.vue'
import { DeliveryAreaSettings } from 'src/models/deliveryAreas/deliveryAreaSettings/deliveryAreaSettings'
import { computed } from 'vue'
import { clone } from 'lodash'

const modelValue = defineModel()

const props = defineProps<{
  items: DeliveryAreaSettings[]
}>()

const items = computed(() => {
  return clone(props.items).sort(
    (a, b) => a.minimalOrderSum - b.minimalOrderSum,
  )
})
</script>
