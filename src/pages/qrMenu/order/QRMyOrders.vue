<template>
  <div class="mt-10">
    <template v-if="currentOrders.length">
      <div class="header3 bold mb-5">Текущие заказы</div>
      <QrOrderItem
        v-for="(item, index) in currentOrders"
        :key="item.id"
        :class="{ 'mt-8': index }"
        :item="item"
      />
    </template>
    <div class="header3 bold mb-5 mt-10">История заказов</div>
    <div v-if="!$order.items.length && !$order.loadings.list">
      Список заказов пуст
    </div>
    <QrOrderItem
      v-for="(item, index) in $order.items"
      :key="item.id"
      :class="{ 'mt-8': index }"
      :item="item"
      @click="openOrderData(item)"
      :loading="loading && item.id === detailOrderItem?.id"
    />
  </div>
  <Pagination
    :page="$order.pagination.page"
    class="mt-15"
    @append-items="loadOrders($event, true)"
    @update:model-value="loadOrders"
  />
  <QROrderItemModal v-model="detailOrderModal" :item="detailOrderItem" />
</template>
<script lang="ts" setup>
import { Order, OrderStatusType } from 'src/models/order/order'
import { orderRepo } from 'src/models/order/orderRepo'
import { onMounted, ref } from 'vue'
import { padRepo } from 'src/models/pads/padRepo'
import QrOrderItem from 'pages/qrMenu/order/QrOrderItem.vue'
import Pagination from 'components/inputs/Pagination.vue'
import QROrderItemModal from 'pages/qrMenu/order/QROrderItemModal.vue'
import { useEventBus } from '@vueuse/core'
import { orderUpdatedKey } from 'src/services/eventBusKeys'

const loading = ref(false)
const detailOrderModal = ref(false)
const detailOrderItem = ref<Order | null>(null)
const currentOrders = ref<Order[]>([])

onMounted(() => {
  void orderRepo.current(padRepo.item || undefined).then((res) => {
    currentOrders.value = res
  })
  loadOrders()

  useEventBus(orderUpdatedKey).on((e) => {
    const index = currentOrders.value.findIndex((v) => v.id === e.order.id)
    if (index > -1) currentOrders.value[index] = e.order
  })
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
      void loadOrders()
    }
  })
})

const loadOrders = (page = 1, appendItems = false) => {
  void orderRepo.list(
    {
      sales_point: padRepo.item?.salesPoint?.id,
      status: OrderStatusType.CLOSED,
    },
    { page, appendItems },
  )
}

const openOrderData = async (item: Order) => {
  if (!item.id) return
  try {
    loading.value = true
    detailOrderItem.value = item
    detailOrderItem.value = await orderRepo.retrieve(item.id)
    detailOrderModal.value = true
  } catch (e) {
    console.log(e)
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 200)
  }
}
</script>
