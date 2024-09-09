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
        <template v-if="data.active_cart_exists || orderReasons.length || excludedItems.length">
          <div v-if="data.active_cart_exists || orderReasons.length"
               class="column gap-3 full-width bg-input-color border-radius px-6 py-5">
            <div v-if="data.active_cart_exists" class="text-danger row gap-3 no-wrap">
              <CIcon color="danger" name="fa-regular fa-triangle-exclamation" size="18px" />
              <div class="secondary-text text-danger mt-1">При повторе заказа ваша корзина будет очищена</div>
            </div>
            <div v-for="(reason, index) in orderReasons" :key="index" class="text-danger row gap-3 no-wrap">
              <div class="secondary-text text-danger">
                <span class="bold">{{ reason.title }}:</span> {{ reason.value.join(', ') }}
              </div>
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
        <CButton :disabled="!data.repeat_available" :loading="loading" class=" body col" label="Подтвердить"

                 @click="repeatOrder()" />
      </div>
    </div>
  </CAdaptiveModal>
</template>
<script lang="ts" setup>
import { OrderAvailabilityRaw, orderAvailabilityReasonNames } from 'src/models/order/order'
import CButton from 'src/components/template/buttons/CButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { computed, ref } from 'vue'
import { orderRepo } from 'src/models/order/orderRepo'
import OrderItem from 'src/pages/profile/OrderItem.vue'
import { notifier } from 'src/services/notifier'
import { cartRepo } from 'src/models/carts/cartRepo'
import CAdaptiveModal from 'components/dialogs/CAdaptiveModal.vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  modelValue: boolean
  data: OrderAvailabilityRaw
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const router = useRouter()
const loading = ref(false)

const excludedItems = computed(() => {
  return orderRepo.item?.items?.filter(el => !props.data.available_item_ids.includes(el.uuid))
})

const orderReasons = computed(() => {
  return Object.keys(props.data.reasons).map(v => {
    return {
      title: orderAvailabilityReasonNames[v],
      value: props.data.reasons[v]
    }
  })
})

const repeatOrder = async () => {
  try {
    loading.value = true
    cartRepo.item = await orderRepo.repeat()
    emit('update:modelValue', false)
    void router.push({
      name: 'arrangementPage'
    })
  } catch {
    notifier.error('Не удалось повторить заказ')
  } finally {
    loading.value = false
  }
}
</script>
