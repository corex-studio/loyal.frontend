<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="735px"
    :position="$q.screen.lt.md ? 'bottom' : undefined"
    :maximize="$q.screen.lt.md"
  >
    <div class="huge3 bold mb-md-12 mb-xs-10">Выберите заведение</div>
    <div v-if="$companyGroup.item" class="row full-width">
      <GridContainer
        :items="$companyGroup.item?.companies"
        :lg="2"
        :xl="2"
        :md="2"
        :sm="1"
        :xs="1"
        :gap="$q.screen.lt.md ? '12px' : '20px'"
      >
        <template v-slot:item="{ item }">
          <q-separator
            v-if="
              $q.screen.lt.md && item.id !== $companyGroup.item.companies[0].id
            "
            class="mb-6"
          />
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
      :label="$q.screen.lt.md ? 'Выбрать' : 'Выбрать заведение'"
      :disabled="!selectedCompany"
      :height="$q.screen.lt.md ? '40px' : '48px'"
      width="100%"
      :style="$q.screen.gt.md ? 'max-width: 288px' : ''"
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
