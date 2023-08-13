<template>
  <div>
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
  </div>
</template>
<script lang="ts" setup>
import { Company } from 'src/models/company/company'
import { SalesPoint } from 'src/models/salesPoint/salesPoint'
import { ref } from 'vue'
import CButton from '../template/buttons/CButton.vue'
import RoundedSelector from '../template/buttons/RoundedSelector.vue'

defineProps<{
  company: Company | null
}>()

defineEmits<{
  (evt: 'select', value: SalesPoint): void
}>()

const selectedSalesPoint = ref<SalesPoint | null>(null)
</script>
