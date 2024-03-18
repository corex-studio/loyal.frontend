<template>
  <!-- <div class="parent-button"> -->
  <!-- <div class="c-container row justify-end"> -->
  <div
    class="review-block relative-position pa-10 border-radius bg-background-color box-shadow column"
  >
    <CIconButton
      @click="close()"
      icon="fa-regular fa-xmark"
      class="close-button"
      circle
      size="44px"
      :icon-class="$q.screen.lt.md ? undefined : 'box-shadow'"
      :icon-size="$q.screen.lt.md ? '22px' : '19px'"
      icon-color="secondary"
      color="background-color"
    />

    <div class="header3 bold">Как вам заказ?</div>
    <div class="row full-width items-center gap-5 mt-5 no-wrap">
      <q-img
        :src="
          $order.orderToReview?.salesPoint.image?.thumbnail ||
          $store.images.empty
        "
        height="60px"
        width="60px"
        style="min-width: 60px"
        class="border-radius2"
      >
        <template v-slot:error>
          <span>
            <q-img
              fit="cover"
              style="max-width: 60px; min-width: 60px; height: 60px"
              :src="$store.images.empty"
            ></q-img>
          </span>
        </template>
      </q-img>
      <div class="column gap-2">
        <div class="body bold">
          {{
            $order.orderToReview?.salesPoint.name ||
            $order.orderToReview?.salesPoint.customAddress ||
            $order.orderToReview?.salesPoint.address
          }}
        </div>
        <div
          v-if="$order.orderToReview?.deliveryTime"
          class="body text-secondary"
        >
          Заказ получен
          {{ getDeliveryDate($order.orderToReview?.deliveryTime) }}
        </div>
      </div>
    </div>
    <q-separator color="divider-color" class="my-7" />

    <div
      v-if="$order.orderToReview?.items?.length"
      :class="{ 'justify-center': $q.screen.lt.md }"
      class="row no-wrap full-width items-center gap-6"
    >
      <q-img
        v-for="(el, index) in $order.orderToReview?.items?.slice(0, 4)"
        :key="index"
        :src="el.size.image?.thumbnail"
        class="border-radius2 order-item"
      ></q-img>
      <div
        v-if="$order.orderToReview?.items?.length > 4"
        :style="`background-color: ${lightColor(
          $uiSettings.item?.primaryColor.color || '000',
          '27',
        )} !important`"
        class="order-item row justify-center items-center text-on-background-color border-radius2 subtitle-text bold"
      >
        {{ $order.orderToReview?.items?.slice(4).length }}+
      </div>
    </div>
    <CButton
      @click="$store.reviewModal = true"
      class="mt-10 body"
      label="Оцените заказ"
      height="40px"
    />
  </div>
  <!-- </div> -->
  <!-- </div> -->
</template>

<script lang="ts" setup>
import moment from 'moment'
import CIconButton from '../template/buttons/CIconButton.vue'
import CButton from '../template/buttons/CButton.vue'
import { lightColor } from 'src/models/store'
import { orderRepo } from 'src/models/order/orderRepo'

const getDeliveryDate = (date: string | null | undefined) => {
  return date
    ? moment(date, 'DD.MM.YYYY HH:mm').locale('ru').format('MMMM DD')
    : '-'
}

const close = () => {
  if (!orderRepo.orderToReview) return
  orderRepo.ignoreOrderReview(orderRepo.orderToReview.id)
  orderRepo.orderToReview = null
}
</script>

<style lang="scss" scoped>
body.screen--xl {
  .review-block {
    right: 100px;
  }
}

body.screen--lg {
  .review-block {
    right: 50px;
  }
}

body.screen--md {
  .review-block {
    left: 14px;
  }
}

body.screen--sm,
body.screen--xs {
  .review-block {
    left: 0;
    max-width: unset;
    bottom: 0px;
  }

  .close-button {
    position: absolute;
    top: 4px;
    right: 2px;
  }
}

.review-block {
  z-index: 52 !important;
  max-width: 310px;
  width: 100%;
  position: fixed;
  bottom: 30px;
}

.close-button {
  position: absolute;
  top: -14px;
  right: -14px;
}

.parent-button {
  position: fixed;
  bottom: 60px;
  width: 100%;
}

.order-item {
  height: 44px;
  width: 44px;
  min-width: 44px;
}
</style>
