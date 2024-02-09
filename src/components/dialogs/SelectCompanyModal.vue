<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :width="'400px'"
    :position="$q.screen.lt.md ? 'bottom' : undefined"
    :maximize="$q.screen.lt.md"
    :no-close="$q.screen.lt.md || noClose"
  >
    <div class="column full-width">
      <div class="header bold mb-md-15 mb-xs-10">Выберите заведение</div>
      <div class="column no-wrap full-width gap-md-10 gap-xs-6">
        <template
          v-for="(item, index) in $companyGroup.item?.companies"
          :key="index"
        >
          <q-separator v-if="index && $q.screen.lt.md" color="divider-color" />
          <CompanyRow
            @click="selectCompany(item)"
            :item="item"
            :selected="selectedCompany?.id === item.id"
          />
        </template>
      </div>

      <CButton
        @click="$emit('select', selectedCompany)"
        :label="$q.screen.lt.md ? 'Выбрать' : 'Выбрать заведение'"
        :disabled="!selectedCompany"
        :height="$q.screen.lt.md ? '40px' : '48px'"
        width="100%"
        class="body mt-15"
      />
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import { Company } from 'src/models/company/company'
import CDialog from '../template/dialogs/CDialog.vue'
import CompanyRow from 'src/pages/profile/CompanyRow.vue'
import CButton from '../template/buttons/CButton.vue'
import { ref, watch } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'

const props = defineProps<{
  modelValue: boolean
  noClose?: boolean
}>()

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
  (evt: 'select', v: Company | null): void
}>()

const selectedCompany = ref<Company | null>(null)

watch(
  () => props.modelValue,
  (v) => {
    if (v && companyRepo.item) {
      selectedCompany.value = companyRepo.item
    }
  }
)

const selectCompany = (v: Company) => {
  selectedCompany.value = v
}
</script>
