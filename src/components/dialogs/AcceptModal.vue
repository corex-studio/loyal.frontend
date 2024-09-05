<template>
  <CDialog
    :model-value="modelValue"
    width="422px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="header3 text-center mb-10 px-10 text-on-background-color">
      {{ text || 'Вы подтверждаете действие?' }}
    </div>
    <div class="row gap-sm-10 gap-xs-5 flex-center">
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
        @click="acceptHandler"
      />
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import CButton from '../template/buttons/CButton.vue'
import CDialog from '../template/dialogs/CDialog.vue'

defineProps<{
  modelValue: boolean
  text?: string
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
  (evt: 'accept'): void
}>()

const acceptHandler = () => {
  emit('accept')
  emit('update:modelValue', false)
}
</script>
