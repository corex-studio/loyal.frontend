<template>
  <div
    v-if="ready"
    style="height: 100vh"
    class="column full-width items-center justify-center bg-background-color text-on-backround-color"
  >
    <PrepareUiSettings />

    <div style="max-width: 400px; width: 100%" class="column justify-center">
      <q-img
        class="mb-12"
        :src="$uiSettings.item?.logo?.thumbnail"
        height="50px"
        fit="contain"
      />
      <div class="row mb-12 gap-5 items-center full-width justify-center">
        <div class="header2">Удаление аккаунта</div>
        <CIcon size="20px" name="fa-light fa-info-circle">
          <q-tooltip>
            <div>
              Введите Ваш номер телефона и подтвердите код из СМС для удаления
              аккаунта
            </div>
          </q-tooltip>
        </CIcon>
      </div>
      <div class="row full-width justify-center">
        <CInput
          v-if="step === 1"
          mask="+7 (###) ###-##-##"
          v-model="data.phone"
          external-label="Телефон"
          width="220px"
          class="mb-12"
          input-class="header3 text-on-input-color"
          height="46px"
          unmasked-value
        />
        <CInput
          v-else
          v-model="data.code"
          input-class="header3 input text-on-input-color"
          height="46px"
          external-label="Код из СМС"
          width="220px"
          style="overflow-x: hidden"
          :class="data.code?.length ? 'center-content' : ''"
          class="pb-12 px-10 sms-field"
          standout
          mask="####"
        />
      </div>
      <div style="text-align: center" class="subtitle-text mb-12">
        Ваши персональные данные будут удалены, история заказов и система
        лояльности будут анонимизированы
      </div>
      <div class="row full-width justify-center">
        <CButton @click="nextStepHandler()" height="46px" width="220px"
          >Далее</CButton
        >
      </div>

      <!-- <img
        v-if="$uiSettings.item?.logo?.thumbnail"
        height="42"
        style="object-fit: contain"
        :src="$uiSettings.item?.logo?.thumbnail"
      /> -->
    </div>
  </div>
  <div
    v-else
    style="height: 100vh"
    class="absolute-full flex items-center justify-center"
  >
    <q-spinner-puff color="primary" size="13%" />
  </div>
</template>
<script lang="ts" setup>
import PrepareUiSettings from 'src/components/template/PrepareUiSettings.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import { store } from 'src/models/store'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const ready = ref(false)

const step = ref(1)

const data = ref<{
  phone: string | null
  code: string | null
}>({
  code: null,
  phone: null,
})

const nextStepHandler = () => {
  if (step.value === 1) {
    step.value = 2
  } else {
  }
}

onMounted(async () => {
  store.getCompanyGroup(String(route.params.companyGroup))
  await uiSettingsRepo.fetchSettings()
  ready.value = true
})
</script>

<style lang="scss" scoped>
.input :deep(.q-field--standout.q-field-highlighted .q-field__control) {
  box-shadow: unset !important;
}

.sms-field :deep(.q-field__native) {
  letter-spacing: 20px;
  text-align: center;
}
</style>
