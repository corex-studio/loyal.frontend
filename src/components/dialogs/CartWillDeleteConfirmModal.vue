<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="456px"
  >
    <div class="column gap-13 full-width" style="text-align: center">
      <div class="row header3 full-width justify-center">Внимание!</div>
      <div class="body">
        При изменении заведения текущая корзина будет заменена. Вы точно хотите
        изменить заведение?
      </div>
      <div class="row full-width gap-5">
        <CButton
          @click="$emit('update:modelValue', false)"
          label="Отмена"
          color="secondary-button-color"
          class="col"
          text-color="on-secondary-button-color"
        />
        <CButton @click="$emit('accept')" class="col" label="Да, хочу" />
      </div>
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import CButton from '../template/buttons/CButton.vue'
import CDialog from '../template/dialogs/CDialog.vue'

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
  (evt: 'accept'): void
}>()
</script>
