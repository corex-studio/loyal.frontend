<template>
  <q-header class="text-black transition bg-background-color">
    <div class="c-container full-height column">
      <div class="row no-wrap justify-between items-center pt-10">
        <div
          class="no-wrap row cursor-pointer items-center gap-14 items-center"
          @click="$router.push({ name: 'home' })"
        >
          <img
            v-if="$uiSettings.item?.logo?.thumbnail"
            height="44"
            class="border-radius"
            style="object-fit: contain"
            :src="$uiSettings.item?.logo?.thumbnail"
          />

          <CButton
            v-if="
              $companyGroup.item &&
              $companyGroup.item.companies.length > 1 &&
              !$store.tableMode
            "
            @click="selectCompanyModal = true"
            height="44px"
            label="Изменить заведение"
            color="secondary-button-color"
            text-color="on-secondary-button-color"
          />
        </div>
        <div class="row items-center gap-15 body">
          <ServiceSettingsBlock v-if="authentication.user" />
          <ServiceSettingsSkeleton v-if="authentication.loading" />
        </div>
        <CButton
          v-if="!authentication.loading && !$store.tableMode"
          @click="profileButtonClickHandler()"
          class="box-shadow"
          height="33px"
          color="background-color"
          text-color="primary"
          style="border-radius: 100px"
          icon="fa-light fa-user"
          :label="authentication.user ? 'Профиль' : 'Войти'"
        />
      </div>
    </div>
  </q-header>
  <SelectCompanyModal
    :model-value="selectCompanyModal"
    @update:model-value="selectCompanyModal = false"
    @select="selectCompany($event)"
  />
  <ServiceSettingsModal
    :model-value="serviceModal"
    @update:model-value="serviceModal = false"
  />
</template>

<script setup lang="ts">
import CButton from 'src/components/template/buttons/CButton.vue'
import { authentication } from 'src/models/authentication/authentication'
import ServiceSettingsBlock from 'src/components/serviceSettings/ServiceSettingsBlock.vue'
import { store } from 'src/models/store'
import { useRouter } from 'vue-router'
import ServiceSettingsSkeleton from 'src/components/serviceSettings/ServiceSettingsSkeleton.vue'
import SelectCompanyModal from 'src/components/dialogs/SelectCompanyModal.vue'
import { ref } from 'vue'
import { Company } from 'src/models/company/company'
import { companyRepo } from 'src/models/company/companyRepo'
import ServiceSettingsModal from 'src/components/serviceSettings/ServiceSettingsModal.vue'

const router = useRouter()

const selectCompanyModal = ref(false)

const serviceModal = ref(false)

const profileButtonClickHandler = () => {
  if (authentication.user) {
    void router.push({ name: 'profilePage' })
  } else {
    store.authModal = true
  }
}

const selectCompany = async (v: Company) => {
  selectCompanyModal.value = false
  companyRepo.cartCompany = v
  serviceModal.value = true
}
</script>

<style scoped lang="scss">
.q-header {
  position: relative;
}
</style>
