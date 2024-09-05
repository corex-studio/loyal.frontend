<template>
  <CAdaptiveModal
    :model-value="modelValue"
    initial-mobile-height="240px"
    width="433px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="pa-md-15 pt-xs-12 pb-xs-12 px-xs-8 text-on-background-color">
      <div class="header3 bold">Вы уверены, что хотите сделать заказ к указанному времени?</div>
      <div class="mt-10 body">{{ getFormatedDate() }}</div>
      <div class="row full-width gap-sm-10 gap-xs-5 mt-10">
        <CButton
          :height="$q.screen.md ? '44px' : $q.screen.lt.md ? '40px' : '48px'"
          :width="$q.screen.xs ? '100%' : '46%'"
          class="body"
          color="secondary-button-color"
          label="Отменить"
          text-color="on-secondary-button-color"
          @click="$emit('update:modelValue', false)"
        />
        <CButton
          :height="$q.screen.md ? '44px' : $q.screen.lt.md ? '40px' : '48px'"
          :width="$q.screen.xs ? '100%' : '46%'"
          class="body"
          label="Подтвердить"
          @click="$emit('accept')"
        />
      </div>
    </div>
  </CAdaptiveModal>
</template>
<script lang="ts" setup>
import CAdaptiveModal from 'components/dialogs/CAdaptiveModal.vue'
import CButton from 'components/template/buttons/CButton.vue'
import { cartRepo } from 'src/models/carts/cartRepo'
import moment from 'moment'

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
  (evt: 'accept'): void
}>()

const getFormatedDate = () => {
  const date = moment(cartRepo.item?.deliveryTime, 'DD.MM.YYYY HH:mm')
  const now = moment()
  if (date.format('DD.MM.YYYY') === now.format('DD.MM.YYYY')) return 'Заказ будет готов сегодня в ' + date.format('HH:mm')
  if (date.format('DD.MM.YYYY') === now.add(1, 'days').format('DD.MM.YYYY')) return 'Заказ будет готов завтра в ' + date.format('HH:mm')
  return 'Заказ будет готов ' + date.format('DD.MM.YYYY в HH:mm')
}

</script>
