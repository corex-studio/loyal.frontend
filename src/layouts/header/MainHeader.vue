<template>
  <q-header class="text-black transition bg-background-color">
    <div class="c-container full-height column">
      <div class="row no-wrap justify-between items-center pt-10">
        <div
          class="no-wrap row cursor-pointer items-center gap-14 items-center"
          @click="$router.push({ name: 'home' })"
        >
          <template v-if="$companyGroup.item?.externalId !== 'corex_demo'">
            <img
              v-if="$company.item?.image?.thumbnail"
              height="48"
              class="border-radius"
              style="object-fit: contain"
              :src="$company.item?.image?.thumbnail"
            />
          </template>
          <img
            v-else
            height="48"
            class="border-radius"
            style="object-fit: contain"
            src="~assets/tochkaLogo.png"
          />
          <CButton
            v-if="
              $companyGroup.item &&
              $companyGroup.item.companies.length > 1 &&
              !$store.tableMode
            "
            @click="selectCompanyModal = true"
            height="48px"
            color="secondary-button-color"
            text-color="on-secondary-button-color"
          >
            <div class="row no-wrap gap-4 items-end">
              <!-- <q-img
                height="34px"
                width="34px"
                class="border-radius"
                :src="$company.item?.image?.thumbnail"
              >
                <template v-slot:error>
                  <span>
                    <q-img
                      class="border-radius"
                      style="height: 34px; width: 34px"
                      :src="$store.images.empty"
                    ></q-img>
                  </span> </template
              ></q-img> -->
              <div class="text-on-background-color subtitle-text">
                Изменить заведение
              </div>
              <CIcon size="20px" name="fa-solid fa-angle-down" />
            </div>
          </CButton>
        </div>
        <div class="row gap-12 no-wrap">
          <div class="body">
            <ServiceSettingsBlock v-if="authentication.user" />
            <ServiceSettingsSkeleton v-if="authentication.loading" />
          </div>
          <CButton
            v-if="!authentication.loading && !$store.tableMode"
            @click="profileButtonClickHandler()"
            height="48px"
            width="160px"
            icon="fa-solid fa-user"
            class="subtitle-text"
            color="secondary-button-color"
            text-color="on-secondary-button-color"
            :label="authentication.user ? 'Профиль' : 'Войти'"
          />
        </div>
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
import CIcon from 'src/components/template/helpers/CIcon.vue'

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
