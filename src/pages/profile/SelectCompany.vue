<template>
  <div style="max-width: 456px">
    <div class="row full-width header2 mb-10">Все заведения</div>
    <div class="column gap-10">
      <CompanyRow
        @click="selectCompany(el)"
        v-for="(el, index) in $companyGroup.item?.companies"
        :key="index"
        :item="el"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { companyRepo } from 'src/models/company/companyRepo'
import CompanyRow from './CompanyRow.vue'
import { Company } from 'src/models/company/company'

const selectCompany = (el: Company) => {
  companyRepo.companyForProfile = el
}


</script>
