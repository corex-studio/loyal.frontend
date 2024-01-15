<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="735px"
  >
    <div class="huge3 bold mb-12">Выберите заведение</div>
    <!-- {{ selectedCompany }} -->
    <div v-if="$companyGroup.item" class="row full-width">
      <GridContainer
        :items="$companyGroup.item?.companies"
        :lg="2"
        :xl="2"
        :md="2"
        :sm="2"
        :xs="2"
        gap="20px"
      >
        <template v-slot:item="{ item }">
          <CompanyRow
            @click="selectCompany(item)"
            :item="item"
            :selected="selectedCompany?.id === item.id"
          />
        </template>
      </GridContainer>
    </div>
    <CButton
      @click="$emit('select', selectedCompany)"
      label="Выбрать заведение"
      :disabled="!selectedCompany"
      height="48px"
      width="100%"
      style="max-width: 288px"
      class="body mt-15"
    />
  </CDialog>
</template>
<script lang="ts" setup>
import { Company } from 'src/models/company/company'
import CDialog from '../template/dialogs/CDialog.vue'
import CompanyRow from 'src/pages/profile/CompanyRow.vue'
import GridContainer from '../containers/GridContainer.vue'
import CButton from '../template/buttons/CButton.vue'
import { ref, watch } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'

const props = defineProps<{
  modelValue: boolean
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
