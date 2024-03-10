<template>
  <div
    :style="{
      '--bottom-border-width': progress,
    }"
    class="bg-backing-color pa-10 full-width delivery-info-wrapper"
    style="border-radius: var(--border-radius)"
  >
    <template v-if="deliverySteps.currentStep">
      <div class="row body bold text-on-backing-color">
        Доставка {{ deliverySteps.currentStep?.deliveryPrice || 'бесплатно' }}
        {{ deliverySteps.currentStep.deliveryPrice ? '₽' : '' }}
      </div>
      <div v-if="deliverySteps.nextStep" class="helper-text mt-3">
        При заказе от {{ deliverySteps.nextStep.minimalOrderSum }} ₽ - доставка
        {{ deliverySteps.nextStep.deliveryPrice || 'бесплатно' }}
        {{ deliverySteps.nextStep.deliveryPrice ? '₽' : '' }}
      </div>
    </template>
    <div v-else class="body text-on-backing-color">
      Доставка осуществляется при заказе от
      <span class="bold"> {{ deliverySteps.minimalRequiredSum }} ₽ </span>
    </div>
    <div class="row steps-wrapper">
      <div
        v-for="(el, index) in deliverySteps.steps"
        :key="index"
        :style="{
          left: `calc(${el.leftOffset + '%'} - 3px)`,
          display: el.hidden ? 'none' : '',
        }"
        v-html="el.orderSum"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { DeliveryAreaSettings } from 'src/models/deliveryAreas/deliveryAreaSettings/deliveryAreaSettings'
import { computed, toRef } from 'vue'
import { cartRepo } from 'src/models/carts/cartRepo'
import { clone, last } from 'lodash'
import { DeliverySteps } from 'layouts/drawer/cart/types/types'

const props = defineProps<{
  deliverySettings: DeliveryAreaSettings[]
}>()

const deliverySettings = computed(() => {
  const items = props.deliverySettings.filter(
    (v) => v.deliveryType !== 'default',
  )
  return items.length ? items : props.deliverySettings
})

const cartSum = toRef(() => cartRepo.item?.discountedSum || 0)

const deliverySteps = computed(() => {
  const items = clone(deliverySettings.value).sort(
    (a, b) => b.minimalOrderSum - a.minimalOrderSum,
  )
  const data: DeliverySteps = {
    nextStep: null,
    currentStep: null,
    minimalRequiredSum: 0,
    steps: [],
  }
  for (const [index, el] of clone(items).reverse().entries()) {
    data.steps.push({
      orderSum: el.minimalOrderSum,
      deliveryPrice: el.deliveryPrice,
      leftOffset: ((index + 1) / items.length) * 100,
      hidden: index + 1 === items.length,
    })
  }
  data.minimalRequiredSum = last(items)?.minimalOrderSum || 0
  let index = items.findIndex((v) => cartSum.value >= v.minimalOrderSum)
  if (index > -1) data.currentStep = items[index]
  else {
    data.nextStep = last(items) || null
    return data
  }
  if (index > 0) data.nextStep = items[index - 1]
  return data
})

const progress = computed(() => {
  let val = 0
  const steps = deliverySteps.value.steps
  if (steps.length) {
    const lastStepValue = last(steps)?.orderSum || 0
    const nextStep = deliverySteps.value.nextStep
    if (nextStep) {
      const currentStepOffset =
        steps.find((v) => v.orderSum === nextStep.minimalOrderSum)
          ?.leftOffset || 1
      const prevStepOffset =
        clone(steps)
          .reverse()
          .find((v) => v.orderSum < nextStep.minimalOrderSum)?.leftOffset || 1
      val =
        ((cartSum.value / nextStep.minimalOrderSum) * 100 * currentStepOffset) /
        100
      if (prevStepOffset > val) val = prevStepOffset
    } else val = (cartSum.value / lastStepValue) * 100
    if (val >= 98.5 && val < 100) val -= 2.5
    if (val >= 100) val = 100
  }
  return val + '%'
})
</script>
<style lang="scss" scoped>
.delivery-info-wrapper {
  overflow: hidden;
  position: relative;

  &::after {
    display: block;
    content: '';
    height: 5px;
    width: var(--bottom-border-width);
    background: var(--q-primary);
    position: absolute;
    bottom: 0;
    left: 0;
    transition: width 0.28s ease-out;
    border-radius: 3px;
  }
}

.steps-wrapper {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  width: 100%;

  div {
    position: absolute;
    background: var(--q-primary);
    width: 3px;
    height: 5px;
    bottom: 0;
    z-index: 1;
    border-radius: 1px;
  }
}
</style>
