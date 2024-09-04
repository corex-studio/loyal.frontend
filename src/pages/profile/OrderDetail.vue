<template>
  <div v-if="$order.item" class="text-on-background-color">
    <div class="row  gap-5 items-center">
      <CIcon class="cursor-pointer" color="on-background-color" hover-color="primary" name="fa-regular fa-angle-left"
             size="24px"
             style="margin-left: -6px" @click="$router.push({ name: 'ordersHistory' })" />
      <div class="header3 bold">Заказ № {{ $order.item?.number || 'б/н' }}</div>
    </div>
    <div class="row full-width gap-lg-25 gap-md-20 gap-xs-15 mt-15">
      <div class="col-xs-12 col-xl" style="max-width: 600px;">
        <div class="row full-width justify-between items-center subtitle-text mb-6">
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
              :src="$order.item?.salesPoint.image?.thumbnail || $store.images.empty"
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
              ></q-img>
            </span></template
              >
            </q-img>
            <div class="column gap-1">
              <div class="subtitle-text bold">
                {{ $order.item?.salesPoint.customAddress }}
              </div>
            </div>
          </div>
        </div>
        <CButton
          v-if="shouldBeReviewed"
          :width="$q.screen.lt.md ? '100%' : '150px'"
          class="mt-8 body"
          height="40px"
          label="Оценить заказ"
          @click="openReviewModal()"
        />
      </div>
      <div class="col-xl-6 col-xs-12 bordered pa-md-10 pa-xs-6 border-radius box-shadow"
           style="height: fit-content; max-width: 600px;">
        <div class="subtitle-text mb-md-6 mb-xs-3">Состав заказа</div>
        <div class="column full-width">
          <div
            v-for="(el, index) in $order.item.items"
            :key="index"
            class="row full-width py-5 justify-between body no-wrap cursor-pointer"
            @click="openMenuItemModal(el)"
          >
            <div class="row gap-6 no-wrap items-center">
              <q-img
                :src="el.size.image?.thumbnail || $store.images.empty"
                class="border-radius2"
                fit="contain"
                height="65px"
                style="min-width: 65px;"
                width="65px"
              >
                <template v-slot:error>
                  <span>
                    <q-img
                      :src="$store.images.empty"
                      class="border-radius2"
                      fit="cover"
                      height="65px"
                      style="min-width: 65px;"
                      width="65px"
                    ></q-img> </span
                  ></template>
              </q-img>
              <div class="column gap-2">
                <div class="body">{{ el.size.name }}</div>
                <div
                  v-if="el.modifiers.length"
                  class="secondary-text text-on-background-color"
                >
                  {{
                    el.modifiers
                      .map(
                        (v) =>
                          `${v.modifier?.name}${
                            v.quantity > 1 ? ' x ' + v.quantity : ''
                          }`
                      )
                      .join(', ')
                  }}
                </div>
                <div :class="{'secondary-text' : $q.screen.lt.md } " style="opacity: 0.5">{{ el.quantity }} шт</div>
              </div>
            </div>
            <div class="column items-end">
              <div
                v-if="el.total_sum !== el.discounted_total_sum"
                class="text-strike"
                style="opacity: 0.5"
              >
                {{ beautifyNumber(el.total_sum, true) }} ₽
              </div>
              <div style="text-wrap: nowrap">
                {{ beautifyNumber(el.discounted_total_sum || 0, true) }} ₽
              </div>
            </div>
          </div>
          <q-separator class="my-6" color="divider-color" />
          <OrderTotalInfo :item="$order.item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { orderRepo } from 'src/models/order/orderRepo'
import { useRoute } from 'vue-router'
import CIcon from 'components/template/helpers/CIcon.vue'
import { beautifyNumber, lightColor, store } from 'src/models/store'
import CButton from 'components/template/buttons/CButton.vue'
import { CartType } from 'src/models/carts/cart'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { menuRulesForAddingRepo } from 'src/models/menu/menuItem/menuRulesForAdding/menuRulesForAddingRepo'
import { OrderItemRaw } from 'src/models/order/order'
import { Image } from 'src/models/image/image'
import OrderTotalInfo from 'pages/arrangement/OrderTotalInfo.vue'

const route = useRoute()

const openReviewModal = () => {
  const foundOrder = orderRepo.ordersToReview.find(
    (v) => v.id === orderRepo.item?.id
  )
  if (foundOrder) {
    orderRepo.orderToReview = foundOrder
    store.reviewModal = true
  }
}

const openMenuItemModal = async (item: OrderItemRaw) => {
  if (!item.size.menu_item) return
  store.openMenuItemModal()
  store.menuItemImage = item.size.image ? new Image(item.size.image) : null
  await menuItemRepo.retrieve(item.size.menu_item, {
    sales_point: salesPointRepo.item?.id
  })
  await menuRulesForAddingRepo.list({
    menu_item: menuItemRepo.item?.id
  })
}

const shouldBeReviewed = computed(() => {
  return orderRepo.ordersToReview.map((el) => el.id).includes(orderRepo.item?.id)
})

onMounted(() => {
  void orderRepo.retrieve(String(route.params.orderId))
})

</script>

<style lang="scss" scoped>

.bordered {
  outline: 1px var(--divider-color) solid;
}
</style>
