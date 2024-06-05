<template>
  <CDialog v-model="modelValue" width="400px">
    <div class="header3 bold">Введите номер телефона</div>

    <div class="body mt-4">Мы пришлем смс о готовности заказа</div>

    <CInput
      v-model="phoneValue"
      default
      unmasked-value
      mask="+7 (###) ###-##-##"
      class="border-radius2 mt-md-10 mt-xs-8"
    />
    <CButton
      label="Подтвердить"
      width="100%"
      class="mt-15"
      :disabled="(phoneValue?.length || 0) < 10"
      @click="updatePhone()"
    />
    <div class="row justify-center">
      <CButton
        label="Спасибо, не нужно"
        text-button
        text-color="on-background-color"
        class="mt-8"
      />
    </div>
  </CDialog>
</template>
<script setup lang="ts">
import CDialog from 'components/template/dialogs/CDialog.vue'
import CInput from 'components/template/inputs/CInput.vue'
import { ref, watch } from 'vue'
import { clone } from 'lodash'
import CButton from 'components/template/buttons/CButton.vue'

const modelValue = defineModel<boolean>()

const props = defineProps<{
  phone?: string
}>()

const emit = defineEmits<{
  (evt: 'updatePhone', val: { value: string | null; valid: boolean }): void
}>()

const phoneValue = ref<string | null>(clone(props.phone) || '7')

const updatePhone = () => {
  emit('updatePhone', {
    value: phoneValue.value,
    valid: phoneValue.value?.length === 10,
  })
}

watch(
  () => modelValue.value,
  (v) => {
    if (v) phoneValue.value = clone(props.phone) || '7'
  },
)
</script>
