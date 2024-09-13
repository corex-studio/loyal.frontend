<template>
  <div v-if="$order.item" class="text-on-background-color">
    <div class="row gap-5 items-center">
      <CIcon
        class="cursor-pointer"
        color="on-background-color"
        hover-color="primary"
        name="fa-regular fa-angle-left"
        size="24px"
        style="margin-left: -6px"
        @click="$router.push({ name: 'ordersHistory' })"
      />
      <div class="header3 bold">Заказ № {{ $order.item?.number || 'б/н' }}</div>
    </div>
    <div class="row full-width gap-lg-25 gap-md-20 gap-xs-15 mt-15">
      <div class="col-xs-12 col-xl" style="max-width: 600px">
        <div
          class="row full-width justify-between items-center subtitle-text mb-6"
        >
          <div class="bold">
            {{ $order.item.deliveryType }}
          </div>
          <div class="column gap-4 items-end body">
            <div
              :style="`color: ${
                $order.item?.orderStatus.color
              };background-color: ${lightColor($order.item?.orderStatus.color, '20')}`"
              class="px-5 py-3 row items-center gap-2"
              style="border-radius: 8px"
            >
              {{ $order.item?.orderStatus.name }}
            </div>
          </div>
        </div>
        <div
          class="row full-width justify-between items-center body mb-2"
          style="opacity: 0.6"
        >
          <div>
            {{ $order.item?.getPaymentStatus?.label }}
          </div>
          <div>{{ $order.item?.deliveryTime }}</div>
        </div>
        <q-separator class="my-8" color="divider-color" />
        <div class="row full-width justify-between">
          <div class="row items-center gap-6 no-wrap">
            <q-img
              :src="
                $order.item?.salesPoint.image?.thumbnail || $store.images.empty
              "
              class="border-radius2"
              fit="cover"
              height="40px"
              style="min-width: 40px; min-height: 40px"
              width="40px"
            >
              <template v-slot:error>
                <span>
                  <q-img
                    :ratio="1"
                    :src="$store.images.empty"
                    class="border-radius2"
                    fit="cover"
                    height="40px"
                    style="min-width: 40px; min-height: 40px"
                    width="40px"
                  ></q-img> </span
                ></template>
            </q-img>
            <div class="column gap-1">
              <div class="subtitle-text bold">
                {{ $order.item?.salesPoint.customAddress }}
              </div>
            </div>
          </div>
        </div>
        <div class="column full-width gap-8 mt-12">
          <CButton
            v-if="shouldBeReviewed"
            :width="$q.screen.lt.md ? '100%' : '250px'"
            class="body"
            height="40px"
            label="Оценить заказ"
            @click="openReviewModal()"
          />
          <CButton
            v-if="!availabilityData?.order_is_outdated"
            :loading="repeatLoading"
            :width="$q.screen.lt.md ? '100%' : '250px'"
            class="body"
            height="40px"
            label="Повторить заказ"
            @click="repeatOrderClickHandler()"
          />
        </div>
      </div>
      <div
        class="col-xl-6 col-xs-12 bordered pa-md-10 pa-xs-6 border-radius box-shadow"
        style="height: fit-content; max-width: 600px"
      >
        <div class="subtitle-text mb-md-6 mb-xs-3">Состав заказа</div>
        <div class="column full-width">
          <OrderItem v-for="(el, index) in $order.item.items"
                     :key="index" :item="el" @click="$order.openMenuItemModal(el)" />
          <q-separator class="my-6" color="divider-color" />
          <OrderTotalInfo :item="$order.item" />
        </div>
      </div>
    </div>
  </div>
  <OrderRepeatModal v-model="repeatOrderModal" :data="availabilityData" @accept="repeatOrder()" />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { orderRepo } from 'src/models/order/orderRepo'
import { useRoute, useRouter } from 'vue-router'
import CIcon from 'components/template/helpers/CIcon.vue'
import { lightColor, store } from 'src/models/store'
import CButton from 'components/template/buttons/CButton.vue'
import { OrderAvailabilityRaw } from 'src/models/order/order'
import OrderTotalInfo from 'pages/arrangement/OrderTotalInfo.vue'
import OrderRepeatModal from 'pages/profile/OrderRepeatModal.vue'
import OrderItem from 'pages/profile/OrderItem.vue'
import { cartRepo } from 'src/models/carts/cartRepo'
import { notifier } from 'src/services/notifier'

const route = useRoute()
const availabilityData = ref<OrderAvailabilityRaw | null>(null)
const repeatOrderModal = ref(false)
const repeatLoading = ref(false)
const router = useRouter()

const repeatOrderClickHandler = async () => {
  if (!availabilityData.value?.active_cart_exists && !availabilityData.value?.error_message && availabilityData.value?.available_item_ids.length === orderRepo.item?.items?.length) {
    await repeatOrder()
  } else {
    repeatOrderModal.value = true
  }
}

const repeatOrder = async () => {
  try {
    repeatOrderModal.value = false
    repeatLoading.value = true
    cartRepo.item = await orderRepo.repeat()
    void router.push({
      name: 'home'
    }).then(() => {
      store.cartDrawer = true
    })
  } catch {
    notifier.error('Не удалось повторить заказ')
  } finally {
    repeatLoading.value = false
  }
}

const openReviewModal = () => {
  const foundOrder = orderRepo.ordersToReview.find(
    (v) => v.id === orderRepo.item?.id
  )
  if (foundOrder) {
    orderRepo.orderToReview = foundOrder
    store.reviewModal = true
  }
}

const shouldBeReviewed = computed(() => {
  return orderRepo.ordersToReview
    .map((el) => el.id)
    .includes(orderRepo.item?.id)
})


onMounted(() => {
  void orderRepo.retrieve(String(route.params.orderId)).then(() => {
    void orderRepo
      .checkRepeatAvailability()
      .then((res) => {
        availabilityData.value = res
      })
  })
})
</script>

<style lang="scss" scoped>
.bordered {
  outline: 1px var(--divider-color) solid;
}
</style>
