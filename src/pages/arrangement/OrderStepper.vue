<template>
  <div class="row justify-between items-center no-wrap">
    <div
      v-for="(el, index) in steps"
      :key="index"
      :style="index !== steps.length - 1 ? 'width: 50%' : ''"
    >
      <div
        class="row no-wrap full-height"
        :class="[
          index !== steps.length - 1 ? 'col' : '',
          { 'mb-10': $q.screen.sm && index !== currentStep },
        ]"
      >
        <div
          class="bold header2 row justify-center items-center step"
          :class="[
            index <= currentStep
              ? 'bg-primary text-on-primary'
              : 'bg-background-color text-on-background-color unselected-step',
            ,
          ]"
          :style="
            index <= currentStep ? '' : `border: 1px ${getBorderColor} solid`
          "
        >
          <!-- <div v-if="index >= currentStep" style="margin-top: 1px">
            {{ index + 1 }}
          </div> -->
          <!-- <CIcon v-else color="white" size="22" name="far fa-check"></CIcon> -->
          <CIcon
            size="20px"
            :name="el.icon"
            :color="
              index <= currentStep ? 'background-color' : 'on-background-color'
            "
          />
        </div>
        <div
          v-if="index !== steps.length - 1"
          class="devider col-grow"
          :style="`margin-top: ${
            $q.screen.sm ? (index === currentStep ? '12' : '10') : '25'
          }px; background-color: ${getBorderColor}`"
        ></div>
      </div>
      <!-- <div
        v-if="!$q.screen.sm || index === currentStep"
        class="mt-2 text-on-background-color"
        style="white-space: nowrap"
        :style="getTitleStyle(index)"
      >
        {{ el.title }}
      </div> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { OrderStatusType } from 'src/models/order/order'
import { orderRepo } from 'src/models/order/orderRepo'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { computed } from 'vue'

const currentStep = computed(() => {
  if (
    orderRepo.item?.status === OrderStatusType.CREATED ||
    orderRepo.item?.status === OrderStatusType.VALIDATED ||
    orderRepo.item?.status === OrderStatusType.ACCEPTED
  )
    return 0
  else if (orderRepo.item?.status === OrderStatusType.COOKING) return 1
  else if (orderRepo.item?.status === OrderStatusType.ON_WAY) return 2
  else if (orderRepo.item?.status === OrderStatusType.READY) return 3
  else return 0
})

const getBorderColor = computed(() => {
  if (uiSettingsRepo.item?.backgroundColor.on_color.length === 6) {
    return `#${uiSettingsRepo.item?.backgroundColor.on_color}27`
  } else {
    return `#${uiSettingsRepo.item?.backgroundColor.on_color.slice(0, 6)}27`
  }
})

const steps = computed(() => {
  return [
    {
      icon: 'fa-regular fa-check',
    },
    {
      icon: 'fa-regular fa-hat-chef',
    },
    {
      icon: 'fa-regular fa-moped',
    },
    {
      icon: 'fa-regular fa-flag',
    },
  ]
})
</script>

<style lang="scss" scoped>
.step {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.devider {
  // min-width: 119px;
  height: 0.5px !important;
}

// .unselected-step {
//   border: 1px var(--on-background-color) solid;
// }
</style>
