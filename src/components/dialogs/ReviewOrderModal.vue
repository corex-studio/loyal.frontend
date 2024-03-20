<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="550px"
    no-padding
    :position="$q.screen.lt.md ? 'bottom' : undefined"
    :maximize="$q.screen.lt.md"
    :no-close="$q.screen.lt.md"
  >
    <div
      v-if="!success"
      class="py-15 py-lg-15 py-xs-10 text-on-background-color"
    >
      <div class="header bold px-xs-10 px-lg-15">Как вам заказ?</div>
      <div class="body text-secondary mt-1 px-xs-10 px-lg-15">
        Заказ
        {{
          $order.orderToReview?.number
            ? `№ ${$order.orderToReview?.number}`
            : 'б/н'
        }}
        <!-- <template v-if="$order.orderToReview?.deliveryTime">
          • доставлен {{ getDeliveryDate($order.orderToReview?.deliveryTime) }}
        </template> -->
      </div>
      <div
        class="row full-width no-wrap items-center gap-md-7 gap-xs-5 mt-10 px-xs-10 px-lg-15"
      >
        <q-img
          :src="getCurrentCompany()?.image?.thumbnail || $store.images.empty"
          :height="$q.screen.lt.md ? '47px' : '60px'"
          :width="$q.screen.lt.md ? '47px' : '60px'"
          :style="`min-width: ${$q.screen.lt.md ? '47px' : '60px'} `"
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
        <div class="column">
          <div class="subtitle-text bold">
            {{ getCurrentCompany()?.name }}
            <!-- {{ $order.orderToReview?.salesPoint.company }} -->
            <!-- // $order.orderToReview?.salesPoint.name || //
            $order.orderToReview?.salesPoint.customAddress || //
            $order.orderToReview?.salesPoint.address -->
          </div>
          <div class="body">
            Сумма заказа:
            {{
              $order.orderToReview?.discountedTotalSum
                ? beautifyNumber(
                    $order.orderToReview?.discountedTotalSum,
                    true,
                  ) + ' ₽'
                : '-'
            }}
          </div>
        </div>
      </div>
      <q-separator color="divider-color" class="my-8 mx-xs-10 mx-lg-15" />
      <div v-if="item" class="column full-width items-center px-xs-10 px-lg-15">
        <q-rating v-model="item.rating" size="2.8em" :max="5" color="primary" />
        <div class="text-secondary body mt-4">Оцените заказ</div>
        <CInput
          class="full-width mt-8"
          v-model="item.comment"
          label="Коментарий"
          auto-grow
          text-area
          width="100%"
        />
      </div>
      <template v-if="$order.orderToReview?.items?.length">
        <q-separator
          color="divider-color"
          class="mt-10 mb-8 mx-xs-10 mx-lg-15"
        />
        <div
          class="column no-wrap gap-8 pr-2 mx-xs-10 mx-lg-15"
          style="max-height: 245px; overflow-y: auto"
        >
          <div class="body text-secondary">Состав заказа:</div>
          <div class="column full-width gap-6">
            <div
              v-for="(el, index) in $order.orderToReview?.items"
              :key="index"
              class="row full-width no-wrap items-center justify-between"
            >
              <div class="row gap-4 items-center no-wrap">
                <q-img
                  height="48px"
                  width="48px"
                  style="min-width: 48px"
                  :src="el.size.image?.thumbnail"
                  class="border-radius2 order-item"
                ></q-img>
                <div class="column body gap-2">
                  <div>{{ el.size.name || '-' }}</div>
                  <div class="text-secondary">{{ el.quantity }} шт</div>
                </div>
              </div>
              <div class="body">
                {{
                  el.discounted_total_sum
                    ? beautifyNumber(el.discounted_total_sum, true)
                    : '0'
                }}
                ₽
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="border-radius bottom-block px-xs-10 px-lg-15 mt-10">
        <CButton
          @click="createReview()"
          label="Отправить"
          :loading="loading"
          :disabled="!item?.rating"
          :height="$q.screen.lt.md ? '44px' : '48px'"
          width="100%"
          class="mt-md-15 mt-xs-8 body"
        />
      </div>
    </div>
    <div v-else class="column full-width pb-lg-15 pb-xs-10 pt-8">
      <div class="row full-width justify-center">
        <q-img class="" src="/assets/successReviewed.png" />
      </div>
      <div
        class="column full-width gap-4 mt-10 px-xs-10 px-lg-15"
        style="text-align: center"
      >
        <div class="header3 bold">Спасибо за оценку!</div>
        <div class="subtitle-text">Вы помогаете нам становиться лучше</div>
      </div>
      <CButton
        @click="$emit('update:modelValue', false)"
        label="Закрыть"
        :height="$q.screen.lt.md ? '44px' : '48px'"
        class="mt-15 body mx-lg-15 mx-xs-10"
      />
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
// import moment from 'moment'
import CDialog from '../template/dialogs/CDialog.vue'
import { beautifyNumber } from 'src/models/store'
import { ref, watch } from 'vue'
import { OrderReview } from 'src/models/order/orderReview/orderReview'
import CInput from '../template/inputs/CInput.vue'
import CButton from '../template/buttons/CButton.vue'
import { orderReviewRepo } from 'src/models/order/orderReview/orderReviewRepo'
import { Notify } from 'quasar'
import { orderRepo } from 'src/models/order/orderRepo'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'

const props = defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const item = ref<OrderReview | null>(null)

const success = ref(false)

const loading = ref(false)

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      item.value = new OrderReview({
        order: orderRepo.orderToReview?.id,
        rating: 5,
      })
    }
  },
)

const getCurrentCompany = () => {
  return companyGroupRepo.item?.companies.find(
    (el) => el.id === orderRepo.orderToReview?.salesPoint.company,
  )
}

// const getDeliveryDate = (date: string | null | undefined) => {
//   return date
//     ? moment(date, 'DD.MM.YYYY HH:mm').locale('ru').format('DD MMMM HH:mm')
//     : '-'
// }

const createReview = async () => {
  try {
    loading.value = true
    await orderReviewRepo.create(item.value)
    success.value = true
    await orderReviewRepo.getOrderToReview()
  } catch {
    Notify.create({
      message: 'Ошибка при создании отзыва',
      color: 'danger',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.bottom-block {
  border-top: 1px var(--divider-color) solid;
}
</style>
