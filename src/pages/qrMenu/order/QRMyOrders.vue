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
  <!--  <div v-if="$order.item">-->
  <!--    <div class="column gap-3 bg-primary text-on-primary pa-5">-->
  <!--      <div class="header">-->
  <!--        {{ `Заказ № ${$order.item?.number || 'б/н'}` }}-->
  <!--      </div>-->
  <!--      <div class="subtitle-text light">-->
  <!--        {{ `от ${$order.item?.createdAt || ''}` }}-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div class="column gap-8 px-5 pt-8 text-on-background-color">-->
  <!--      <div class="row gap-5 no-wrap items-center">-->
  <!--        <q-icon name="fa-light fa-timer" size="20px" />-->
  <!--        <div class="bold">Статус заказа:</div>-->
  <!--        <CBadge-->
  <!--          class="body cursor-pointer"-->
  <!--          color="primary"-->
  <!--          style="line-height: 100%"-->
  <!--          text-color="on-primary"-->
  <!--        >-->
  <!--          {{ $order.item.orderStatus?.name }}-->
  <!--        </CBadge>-->
  <!--      </div>-->

  <!--      <div class="row items-center gap-5 no-wrap">-->
  <!--        <q-icon name="fa-light fa-cash-register" size="20px" />-->
  <!--        <div class="bold">Статус оплаты:</div>-->

  <!--        <div>-->
  <!--          <CBadge-->
  <!--            class="body"-->
  <!--            color="primary"-->
  <!--            style="line-height: 100%"-->
  <!--            text-color="on-primary"-->
  <!--            >{{ $order.item.getPaymentStatus?.label }}-->
  <!--          </CBadge>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--      <div class="row gap-5 no-wrap items-center">-->
  <!--        <q-icon name="fa-light fa-money-check-pen" size="20px" />-->
  <!--        <div class="bold">Тип оплаты:</div>-->
  <!--        <CBadge v-if="$order.item.paymentType" color="primary">-->
  <!--          <div class="row no-wrap items-center gap-4 body text-on-primary">-->
  <!--            &lt;!&ndash; <CIcon-->
  <!--              size="14px"-->
  <!--              :name="$order.item.getPaymentType?.icon"-->
  <!--              color="on-primary"-->
  <!--            /> &ndash;&gt;-->
  <!--            {{ $order.item.getPaymentType?.label }}-->
  <!--          </div>-->
  <!--        </CBadge>-->
  <!--        <div v-else>Не указан</div>-->
  <!--      </div>-->
  <!--      <div class="bold">Заказанные блюда:</div>-->
  <!--      <div class="column gap-5 full-width body">-->
  <!--        <template v-for="(item, index) in $order.item.items" :key="index">-->
  <!--          <q-separator v-if="index" />-->
  <!--          <div class="row no-wrap gap-5 items-center">-->
  <!--            <q-img-->
  <!--              :src="item.size.image?.thumbnail || $store.images.empty"-->
  <!--              class="rounded-5"-->
  <!--              fit="cover"-->
  <!--              height="45px"-->
  <!--              style="min-width: 45px"-->
  <!--              width="45px"-->
  <!--            >-->
  <!--              <template v-slot:error>-->
  <!--                <span>-->
  <!--                  <q-img-->
  <!--                    :src="$store.images.empty"-->
  <!--                    class="user-image"-->
  <!--                    fit="cover"-->
  <!--                    height="45px"-->
  <!--                    style="min-width: 45px"-->
  <!--                    width="45px"-->
  <!--                  ></q-img>-->
  <!--                </span>-->
  <!--              </template>-->
  <!--            </q-img>-->
  <!--            <div class="column gap-2 col">-->
  <!--              <div class="ellipsis-2-lines">-->
  <!--                {{ item.size.name }}-->
  <!--              </div>-->
  <!--              <div class="row full-width justify-between">-->
  <!--                <div>-->
  <!--                  {{ item.quantity }} x {{ beautifyNumber(item.price, true) }}-->
  <!--                </div>-->
  <!--                <div class="column items-end">-->
  <!--                  <div v-if="item.total_sum < item.sum">-->
  <!--                    {{ beautifyNumber(item.total_sum, true) }} ₽-->
  <!--                  </div>-->
  <!--                  <div :class="{ 'text-strike': item.total_sum < item.sum }">-->
  <!--                    {{ beautifyNumber(item.sum, true) }} ₽-->
  <!--                  </div>-->
  <!--                </div>-->
  <!--              </div>-->
  <!--            </div>-->
  <!--          </div>-->
  <!--        </template>-->
  <!--      </div>-->
  <!--      <div-->
  <!--        v-if="$order.item.paymentType === PaymentType.PAY_LATER"-->
  <!--        class="column gap-10"-->
  <!--      >-->
  <!--        &lt;!&ndash; <CSelect-->
  <!--          :items="paymentTypes.filter((v) => v.value !== PaymentType.PAY_LATER)"-->
  <!--          item-value="value"-->
  <!--          item-label="label"-->
  <!--          external-label="Тип оплаты"-->
  <!--          :model-value="-->
  <!--            currentPaymentType-->
  <!--              ? paymentTypeNames[currentPaymentType]-->
  <!--              : undefined-->
  <!--          "-->
  <!--          @update:model-value="currentPaymentType = $event.value"-->
  <!--        /> &ndash;&gt;-->
  <!--        <div class="row full-width justify-center mt-10">-->
  <!--          <CButton-->
  <!--            :label="'Оплатить онлайн ' + $order.item.discountedTotalSum + ' ₽'"-->
  <!--            :loading="loading"-->
  <!--            style="max-width: 350px; width: 100%"-->
  <!--            @click="applyPayments()"-->
  <!--          />-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
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

// const router = useRouter()
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

// watch(
//   () => orderRepo.item?.paymentStatus,
//   (v) => {
//     if (v !== PaymentStatusType.NOT_PAID) {
//       void router.push({
//         name: 'orderReviewPage',
//       })
//     }
//   },
// )

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

// const applyPayments = async () => {
//   try {
//     loading.value = true
//     const res = await orderRepo.applyPayments({
//       type: PaymentType.ONLINE,
//       payment_service: 'web_form',
//     })
//     orderRepo.item = res
//     if (res.paymentUrl) {
//       window.open(res.paymentUrl, '_blank')
//     }
//   } catch {
//     Notify.create({
//       message: 'Произошла ошибка при оплате закза',
//       color: 'danger',
//     })
//   } finally {
//     loading.value = false
//   }
// }
</script>
