<template>
  <div class="bordered pa-10 border-radius column full-width">
    <div class="row full-width justify-between items-center header3 mb-2">
      <div class="bold">
        {{ order.deliveryType }}
      </div>
      <div class="bold">
        {{ beautifyNumber(order.discountedTotalSum, true) }} ₽
      </div>
    </div>
    <div
      style="opacity: 0.6"
      class="row full-width justify-between items-center body mb-2"
    >
      <div>{{ order.salesPoint.customAddress }}</div>
      <div>{{ order.deliveryTime }}</div>
    </div>
    <q-separator color="divider-color" class="my-6" />
    <div class="row full-width justify-between">
      <div class="row items-center gap-6 no-wrap">
        <q-img
          width="40px"
          height="40px"
          style="min-width: 40px; min-height: 40px"
          class="border-radius"
          fit="cover"
          :src="order.salesPoint.image?.thumbnail || $store.images.empty"
        >
          <template v-slot:error>
            <span>
              <q-img
                :ratio="1"
                fit="cover"
                style="min-width: 40px; min-height: 40px"
                height="40px"
                width="40px"
                :src="$store.images.empty"
              ></q-img>
            </span> </template
        ></q-img>
        <div class="column gap-1">
          <div class="subtitle-text bold">
            Заказ № {{ order.number || '-' }}
          </div>
          <div style="opacity: 0.6" class="body">
            {{ order.getPaymentStatus?.label }}
          </div>
        </div>
      </div>
      <div class="column gap-4 items-end body">
        <div
          class="px-5 py-3 row items-center gap-2"
          :style="`color: ${
            order.orderStatus.color
          };background-color: ${lightColor(order.orderStatus.color, '20')}`"
          style="border-radius: 8px"
        >
          {{ order.orderStatus.name }}
        </div>
        <div v-if="order.receivedBonuses">
          + {{ order.receivedBonuses }} бонусов
        </div>
      </div>
    </div>
    <CButton
      v-if="shouldBeReviewed"
      @click="openReviewModal()"
      class="mt-8 body"
      label="Оценить заказ"
      height="40px"
      :width="$q.screen.lt.md ? '100%' : '150px'"
    />
  </div>
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import { Order } from 'src/models/order/order'
import { orderRepo } from 'src/models/order/orderRepo'
import { beautifyNumber, lightColor, store } from 'src/models/store'
import { computed } from 'vue'

const props = defineProps<{
  order: Order
}>()

const shouldBeReviewed = computed(() => {
  return orderRepo.ordersToReview.map((el) => el.id).includes(props.order.id)
})

const openReviewModal = () => {
  const foundOrder = orderRepo.ordersToReview.find(
    (v) => v.id === props.order.id,
  )
  if (foundOrder) {
    orderRepo.orderToReview = foundOrder
    store.reviewModal = true
  }
}
</script>

<style lang="scss" scoped>
.bordered {
  outline: 1px var(--secondary) solid;
}
</style>
