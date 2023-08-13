<template>
  <div
    class="border-radius box-shadow column full-width"
    style="overflow: overlay"
  >
    <div
      class="row full-width justify-between px-5 py-6 bg-backing-color text-on-backing-color body bold"
    >
      <div>
        {{ order.number ? '№ ' + order.number : 'Без номера' }}
      </div>
      <div class="column gap-2">
        <div :class="`text-${order.orderStatus.color}`">
          {{ order.orderStatus.name }}
        </div>
      </div>
    </div>
    <div
      class="column gap-5 full-width bg-white-opacity px-5 py-6 secondary-text"
    >
      <div
        v-for="(field, index2) in getDataFields(order)"
        :key="index2"
        class="row no-wrap items-center justify-between full-width"
      >
        <div class="row items-center no-wrap gap-4">
          <div
            style="width: 40px; height: 40px"
            class="row items-center justify-center border-radius box-shadow bg-white-opacity"
          >
            <CIcon :name="field.icon" />
          </div>
          <div>{{ field.label }}</div>
        </div>
        <div class="col-8 column gap-2" style="text-align: end">
          <div class="ellipsis-2-lines">{{ field.val || '-' }}</div>
          <div>{{ field.date }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { Order } from 'src/models/order/order'

defineProps<{
  order: Order
}>()

const getDataFields = (order: Order) => {
  const result: {
    label: string
    icon: string
    val: string | null | number
    date?: string | null
  }[] = [
    {
      label: 'Списано баллов',
      icon: 'fa-light fa-piggy-bank',
      val: order.appliedBonuses,
      date: undefined,
    },
    {
      label: 'Итого',
      icon: 'fa-light fa-piggy-bank',
      val: order.totalSum ? order.totalSum + ' ₽' : '-',
      date: undefined,
    },
  ]

  if (order.type === 'pickup') {
    result.unshift({
      icon: 'fa-light fa-person-dolly',
      label: 'Самовывоз',
      val: order.salesPoint.customAddress || order.salesPoint.address,
      date: order.deliveryTime,
    })
  } else if (order.type === 'delivery') {
    result.unshift({
      label: 'Доставка',
      icon: 'fa-light fa-truck',
      val: order.salesPoint.customAddress || order.salesPoint.address,
      date: order.deliveryTime,
    })
  } else {
    result.unshift({
      label: 'Бронь',
      icon: 'fa-light fa-calendar-day',
      val: order.salesPoint.customAddress || order.salesPoint.address,
      date: order.deliveryTime,
    })
  }
  return result
}
</script>
