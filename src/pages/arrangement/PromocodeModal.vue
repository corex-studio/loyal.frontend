<template>
  <CAdaptiveModal
    :initial-mobile-height="'230px'"
    :model-value="modelValue"
    width="433px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="pa-md-15 pt-xs-12 px-xs-8 text-on-background-color">
      <!-- <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="433px"
    class="text-on-background-color"
    :position="$q.screen.lt.md ? 'bottom' : undefined"
  > -->
      <div class="header3 bold mb-8">Промокод</div>
      <template v-if="$cart.item">
        <CInput
          height="48px"
          placeholder="Введите промокод"
          :model-value="$cart.item.promoCode"
          @update:model-value="
            ($cart.item!.promoCode = $event || null),
              ($cart.promocodeError = false)
          "
          :rules="[
            () =>
              $cart.promocodeError
                ? 'Промокод не действителен. Попробуйте другой'
                : true,
          ]"
        />
        <CButton
          @click="apply()"
          label="Применить"
          height="48px"
          width="100%"
          :loading="$cart.loading"
          class="mt-14 subtitle-text"
          :class="$cart.promocodeError ? 'mt-20' : 'mt-14'"
        />
      </template>
    </div>
    <!-- </CDialog> -->
  </CAdaptiveModal>
</template>
<script lang="ts" setup>
import CAdaptiveModal from 'src/components/dialogs/CAdaptiveModal.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import { cartRepo } from 'src/models/carts/cartRepo'
import { watch } from 'vue'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

watch(
  () => cartRepo.loading,
  (v) => {
    if (!v && !cartRepo.promocodeError) {
      emit('update:modelValue', false)
    }
  },
)

const apply = async () => {
  if (!cartRepo.item) return
  try {
    cartRepo.loading = true
    await cartRepo.setParams({
      promo_code: cartRepo.item.promoCode,
    })
  } catch {}
}
</script>
