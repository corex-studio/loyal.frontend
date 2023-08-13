<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="456px"
    class="text-on-background-color"
  >
    <template v-slot:header> Выберите точку продажи </template>
    <SalesPointSelector :company="company" @select="$emit('select', $event)" />
  </CDialog>
</template>
<script lang="ts" setup>
import { Company } from 'src/models/company/company'
import CDialog from '../template/dialogs/CDialog.vue'
import { SalesPoint } from 'src/models/salesPoint/salesPoint'
import SalesPointSelector from './SalesPointSelector.vue'

defineProps<{
  modelValue: boolean
  company: Company | null
}>()

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
  (evt: 'select', value: SalesPoint): void
}>()
</script>
