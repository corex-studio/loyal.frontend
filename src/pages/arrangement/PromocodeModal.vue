<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="433px"
  >
    <template v-slot:header> Промокод </template>

    <template v-if="$cart.item">
      <CInput
        height="46px"
        placeholder="Введите промокод"
        v-model="$cart.item.promoCode"
      />
      <CButton
        @click="apply()"
        label="Применить"
        height="46px"
        width="100%"
        :loading="$cart.loading"
        class="mt-12"
      />
    </template>
  </CDialog>
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import { cartRepo } from 'src/models/carts/cartRepo'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const apply = async () => {
  if (!cartRepo.item) return
  try {
    cartRepo.loading = true
    await cartRepo.setParams({
      promo_code: cartRepo.item.promoCode || undefined,
    })
    emit('update:modelValue', false)
  } catch {}
}
</script>
