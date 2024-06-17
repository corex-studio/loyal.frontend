<template>
  <div class="mt-10">
    <template v-if="currentOrders.length">
      <div class="header3 bold mb-5">Текущие заказы</div>
      <QrOrderItem
        v-for="(item, index) in currentOrders"
        :key="item.id"
        :class="{ 'mt-8': index }"
        :item="item"
        @pay-order="onPayOrder"
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
  <OrderPaymentModal v-model="paymentModal" :payment-url="paymentUrl" />
</template>
<script lang="ts" setup>
import { Order, OrderStatusType, PaymentStatusType } from 'src/models/order/order'
import { orderRepo } from 'src/models/order/orderRepo'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { padRepo } from 'src/models/pads/padRepo'
import QrOrderItem from 'pages/qrMenu/order/QrOrderItem.vue'
import Pagination from 'components/inputs/Pagination.vue'
import QROrderItemModal from 'pages/qrMenu/order/QROrderItemModal.vue'
import { useEventBus } from '@vueuse/core'
import { orderUpdatedKey } from 'src/services/eventBusKeys'
import OrderPaymentModal from 'components/OrderPaymentModal.vue'
import { useRoute, useRouter } from 'vue-router'

const loading = ref(false)
const detailOrderModal = ref(false)
const detailOrderItem = ref<Order | null>(null)
const currentOrders = ref<Order[]>([])
const paymentUrl = ref<string | null>(null)
const paymentModal = ref(false)
const route = useRoute()
const router = useRouter()

onMounted(() => {
  checkOnPaymentUrlInPath()
  void orderRepo.current(padRepo.item || undefined).then((res) => {
    currentOrders.value = res
  })
  loadOrders()

  useEventBus(orderUpdatedKey).on(({ order }) => {
    const index = currentOrders.value.findIndex(v => v.id === order.id)
    if (index > -1) currentOrders.value[index] = order
    else {
      currentOrders.value.unshift(order)
    }
    if (order.paymentStatus == PaymentStatusType.FULL_PAID) {
      paymentModal.value = false
      void router.replace({name: String(route.name), query: {...route.query, paymentUrl: undefined}, params: route.params})
    }
  })
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
      void loadOrders()
    }
  })
})

const onPayOrder = (item: Order) => {
  if (item.paymentUrl) {
    paymentUrl.value = item.paymentUrl
    paymentModal.value = true
  }
}

const clearBeforeRouterResolve = router.afterEach(() => {
  checkOnPaymentUrlInPath()
})

onBeforeUnmount(() => {
  if (clearBeforeRouterResolve) clearBeforeRouterResolve()
})

const checkOnPaymentUrlInPath = () => {
  if (route.query.paymentUrl && orderRepo.item?.paymentStatus !== PaymentStatusType.FULL_PAID) {
    paymentUrl.value = String(route.query.paymentUrl)
    void nextTick(() => {
      paymentModal.value = true
    })
  }
}

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
