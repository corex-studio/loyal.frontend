<template>
  <div class="row justify-between items-center no-wrap">
    <div
      v-for="(el, index) in orderingSteps"
      :key="index"
      :style="index !== orderingSteps.length - 1 ? 'width: 50%' : ''"
    >
      <div
        class="row no-wrap full-height"
        :class="[
          index !== orderingSteps.length - 1 ? 'col' : '',
          { 'mb-10': $q.screen.sm && index !== currentStep },
          { 'ml-11': !index },
        ]"
      >
        <div
          class="bold 3 row justify-center items-center step"
          :class="[
            index <= currentStep
              ? 'bg-primary text-background-color'
              : 'bg-background-color text-on-background-color unselected-step',
            ,
          ]"
        >
          <div v-if="index >= currentStep" style="margin-top: 1px">
            {{ index + 1 }}
          </div>
          <CIcon
            v-else
            color="background-color"
            size="22"
            name="far fa-check"
          ></CIcon>
        </div>
        <div
          v-if="index !== orderingSteps.length - 1"
          class="devider col-grow bg-on-background-color"
          :style="`margin-top: ${
            $q.screen.sm ? (index === currentStep ? '12' : '10') : '23'
          }px`"
        ></div>
      </div>
      <div
        v-if="!$q.screen.sm || index === currentStep"
        class="mt-2 text-on-background-color"
        style="white-space: nowrap"
        :style="getTitleStyle(index)"
      >
        {{ el.title }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { CSSProperties, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cartRepo } from 'src/models/carts/cartRepo'
import { PaymentType } from 'src/models/order/order'
import { orderRepo } from 'src/models/order/orderRepo'

const route = useRoute()
const router = useRouter()

const currentStep = computed(() => {

  if (router.isIncludesRouteName(['orderingPage'])) return 1
  else if (
    router.isIncludesRouteName(['qrMenuSuccessOrderPage', 'successOrderPage'])
  )
    return 2
  else return 0
})


const orderingSteps = computed(() => {
  const values = [
    {
      title: 'Корзина',
      to: ''
    },
    {
      title: 'Оформление заказа',
      to: ''
    }
  ]
  if ((router.isIncludesRouteName(['orderingPage']) &&
      cartRepo.selectedPaymentType?.type === PaymentType.ONLINE)
    || (router.isIncludesRouteName(['successOrderPage']) &&
      orderRepo.item?.paymentType === PaymentType.ONLINE)) {
    values.push({
      title: 'Оплата заказа',
      to: ''
    })
  }
  values.push({
    title: 'Заказ принят',
    to: ''
  })
  return values
})

const getTitleStyle = (index: number): CSSProperties => {
  return {
    marginLeft: `${
      !index
        ? '15'
        : index === 1
          ? '-47'
          : index === 2
            ? '-23'
            : router.isIncludesRouteName(['cart','cartReview'])
              ? '0'
              : '-40'
    }px`
  }
}
</script>

<style lang="scss" scoped>
.step {
  width: 46px;
  height: 46px;
  border-radius: 50%;
}

.devider {
  height: 0.5px !important;
}

.unselected-step {
  border: 1px var(--on-background-color) solid;
}
</style>
