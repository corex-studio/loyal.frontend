<template>
  <CAdaptiveModal
    :initial-mobile-height="'500px'"
    :model-value="modelValue"
    width="490px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="pa-lg-15 pa-xs-10 text-on-background-color">
      <div class="header3 bold">Повтор заказа</div>
      <div
        class="column full-width gap-8 mt-md-7 mt-xs-4">
        <template v-if="data.active_cart_exists || data.error_message || excludedItems.length">
          <div v-if="data.active_cart_exists || data.error_message"
               class="column gap-3 full-width bg-input-color border-radius px-6 py-5">
            <div v-if="data.active_cart_exists && data.repeat_available" class="text-danger row gap-3 no-wrap">
              <CIcon color="danger" name="fa-regular fa-triangle-exclamation" size="18px" />
              <div class="secondary-text text-danger mt-1">При повторе заказа ваша корзина будет очищена</div>
            </div>
            <!--            <div v-for="(reason, index) in orderReasons" :key="index" class="text-danger row gap-3 no-wrap">-->
            <!--              <div class="secondary-text text-danger">-->
            <!--                <span class="bold">{{ reason.title }}:</span> {{ reason.value.join(', ') }}-->
            <!--              </div>-->
            <!--            </div>-->
            <div v-if="data.error_message" class="text-danger row gap-3 no-wrap">
              <CIcon color="danger" name="fa-regular fa-triangle-exclamation" size="18px" />
              <div class="text-danger secondary-text mt-1 ">{{ data.error_message }}</div>

            </div>
          </div>
          <div v-if="excludedItems.length">
            <div class="body">Следующие позиции не будут добавлены</div>
            <div class="column full-width no-wrap mt-4 pr-3" style="max-height: 240px; overflow-y: auto">
              <OrderItem
                v-for="(item, index) in excludedItems"
                :key="index" :item="item" small
                @click="$order.openMenuItemModal(item)" />
            </div>
          </div>
        </template>
        <div v-else class="body">Вы подтверждаете действие?</div>
      </div>
      <div class="row full-width gap-5 mt-10">
        <CButton class=" body col" color="secondary-button-color" label="Отменить"
                 text-color="on-secondary-button-color"
                 @click="$emit('update:modelValue', false)" />
        <CButton :disabled="!data.repeat_available" class=" body col" label="Подтвердить"
                 @click="$emit('accept')" />
      </div>
    </div>
  </CAdaptiveModal>
</template>
<script lang="ts" setup>
import { OrderAvailabilityRaw } from 'src/models/order/order'
import CButton from 'src/components/template/buttons/CButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { computed } from 'vue'
import { orderRepo } from 'src/models/order/orderRepo'
import OrderItem from 'src/pages/profile/OrderItem.vue'
import CAdaptiveModal from 'components/dialogs/CAdaptiveModal.vue'

const props = defineProps<{
  modelValue: boolean
  data: OrderAvailabilityRaw
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
  (evt: 'accept'): void
}>()

const excludedItems = computed(() => {
  return orderRepo.item?.items?.filter(el => !props.data.available_item_ids.includes(el.uuid))
})

// const orderReasons = computed(() => {
//   return Object.keys(props.data.reasons).map(v => {
//     return {
//       title: orderAvailabilityReasonNames[v],
//       value: props.data.reasons[v]
//     }
//   })
// })
</script>
