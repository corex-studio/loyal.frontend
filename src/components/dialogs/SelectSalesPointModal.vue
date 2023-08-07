<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="456px"
    class="text-on-background-color"
  >
    <template v-slot:header> Выберите точку продажи </template>
    <div class="body bold">{{ company?.name }}</div>
    <div class="column body full-width">
      <div v-for="(el, index) in company?.salesPoints" :key="index">
        <q-separator v-if="index" />
        <div
          @click="selectedSalesPoint = el"
          class="row full-width items-center justify-between py-8 cursor-pointer"
        >
          <div class="col-9">
            {{ el.address }}
          </div>
          <RoundedSelector :model-value="selectedSalesPoint?.id === el.id" />
        </div>
      </div>
      <div class="row full-width justify-center">
        <CButton
          @click="$emit('select', selectedSalesPoint)"
          :disabled="!selectedSalesPoint"
          class="mt-5"
          label="Выбрать"
          width="200px"
        />
      </div>
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import { Company } from 'src/models/company/company'
import CDialog from '../template/dialogs/CDialog.vue'
import CButton from '../template/buttons/CButton.vue'
import RoundedSelector from '../template/buttons/RoundedSelector.vue'
import { ref, onMounted } from 'vue'
import { SalesPoint } from 'src/models/salesPoint/salesPoint'

const selectedSalesPoint = ref<SalesPoint | null>(null)

defineProps<{
  modelValue: boolean
  company: Company | null
}>()

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
  (evt: 'select', value: SalesPoint): void
}>()

onMounted(() => {
  return 0
})
</script>
