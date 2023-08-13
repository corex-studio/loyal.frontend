<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="456px"
  >
    <div class="column full-width gap-13 items-center">
      <div class="header3">Внимание</div>
      <div class="bold body" style="text-align: center">
        В выбранной вами точке продажи отсутствует данная позиция.
      </div>
      <CButton
        @click="$emit('update:modelValue', false)"
        label="Понятно"
        width="200px"
      />
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import CDialog from 'src/components/template/dialogs/CDialog.vue'

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()
</script>
