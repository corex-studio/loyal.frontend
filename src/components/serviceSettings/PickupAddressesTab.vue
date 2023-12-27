<template>
  <div>
    <div
      class="column no-wrap full-width gap-8 pb-10"
      style="overflow: scroll; height: 314px !important"
    >
      <div
        v-for="(el, index) in availablePickupAddresses"
        :key="index"
        class="row items-center pa-10 justify-between cursor-pointer border-radius"
        @click="$emit('select', el)"
        :style="`border: 1px ${getBorderColor(el)} solid`"
      >
        <div class="row items-center gap-6 no-wrap">
          <RoundedSelector
            height="24px"
            width="24px"
            :model-value="el.id === currentPoint?.id"
          />
          <div class="subtitle-text">{{ el.address }}</div>
        </div>
        <!-- <CIcon
          class="cursor-pointer"
          hover-color="primary"
          size="22px"
          name="fa-light fa-pen"
          color="secondary-button-color"
        /> -->
      </div>
    </div>
    <div v-if="$slots.bottom" class="row bg-background-color border-radius">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import RoundedSelector from '../template/buttons/RoundedSelector.vue'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { lightColor } from 'src/models/store'
import { computed } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { SalesPoint } from 'src/models/salesPoint/salesPoint'

const props = defineProps<{
  currentPoint: SalesPoint | null
}>()

defineEmits<{
  (evt: 'select', val: SalesPoint): void
  (evt: 'confirm'): void
  (evt: 'addAddress'): void
}>()

const availablePickupAddresses = computed(() => {
  return companyRepo.cartCompany?.salesPoints?.filter(
    (v) => v.settings.pickup_enabled
  )
})

const getBorderColor = (el: SalesPoint) => {
  return props.currentPoint?.id === el.id
    ? '#' + uiSettingsRepo.item?.primaryColor.color
    : lightColor(uiSettingsRepo.item?.backgroundColor.on_color || '000', '20')
}
</script>
