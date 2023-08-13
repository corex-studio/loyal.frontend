<template>
  <div class="row justify-between full-width">
    <div class="col-5 text-on-background-color">
      <div v-if="_item" class="column full-width gap-12">
        <CInput v-model="_item.firstName" height="40px" external-label="Имя" />
        <CInput
          v-model="_item.lastName"
          height="40px"
          external-label="Фамилия"
        />
        <CInput
          :model-value="parsedPhone"
          height="40px"
          readonly
          mask="+7 (###) ###-##-##"
          external-label="Телефон"
        />
        <CInput
          v-model="_item.birthday"
          height="40px"
          readonly
          external-label="Дата рождения"
        />
        <TabPicker
          width="100%"
          small
          class="full-width"
          :model-value="sexNames[_item.sex]"
          @update-tab="updateSex($event)"
          :tabs="sexValues"
        />
        <CInput
          v-model="_item.email"
          :rules="[rules.email]"
          height="40px"
          external-label="Email"
        />
        <div class="row full-width justify-center mt-6">
          <CButton
            @click="updateProfileData()"
            :disabled="!isSaveAvailable"
            height="40px"
            width="280px"
            >Сохранить</CButton
          >
        </div>
      </div>
    </div>
    <CButton
      @click="acceptModal = true"
      class="pr-3"
      text-button
      icon="fa-light fa-trash"
      height="40px"
      color="secondary-button-color"
      text-color="on-background-color"
      >Удалить аккаунт</CButton
    >
  </div>
  <AcceptModal
    :model-value="acceptModal"
    @update:model-value="acceptModal = false"
    @accept="deleteAccount()"
  />
</template>
<script lang="ts" setup>
import { cloneDeep, isEqual } from 'lodash'
import { Notify } from 'quasar'
import AcceptModal from 'src/components/dialogs/AcceptModal.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import TabPicker from 'src/components/template/buttons/TabPicker.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import rules from 'src/corexModels/rules'
import { authentication } from 'src/models/authentication/authentication'
import { Customer, sexNames, sexValues } from 'src/models/customer/customer'
import { customerRepo } from 'src/models/customer/customerRepo'
import { ref, computed, onMounted } from 'vue'

const item = computed(() => {
  return authentication.user
})

const _item = ref<Customer | null>(null)

const acceptModal = ref(false)

const parsedPhone = computed(() => {
  const phone = String(_item.value?.phone)
  if (phone.startsWith('7')) {
    return phone.slice(1)
  } else return phone
})

const isSaveAvailable = computed(() => {
  return (
    _item.value?.firstName.length &&
    !isEqual(item.value, _item.value) &&
    (_item.value.email
      ? typeof rules.email(_item.value.email) !== 'string'
      : true)
  )
})

const updateSex = (v: string) => {
  if (!_item.value) return
  const foundSex = sexValues.find((el) => el.label === v)
  if (foundSex) {
    _item.value.sex = foundSex.value
  }
}

const updateProfileData = async () => {
  try {
    const res = await customerRepo.update(_item.value)
    authentication.user = cloneDeep(res)
    Notify.create({
      message: 'Данные профиля обновлены',
    })
  } catch {
    Notify.create({
      message: 'Ошибка при обновлении профиля',
      color: 'danger',
    })
  }
}

onMounted(() => {
  _item.value = cloneDeep(item.value)
})

const deleteAccount = async () => {
  try {
    if (!item.value) return
    await customerRepo.delete(item.value)
    Notify.create({
      message: 'Аккаунт успешно удален',
    })
  } catch {
    Notify.create({
      message: 'Ошибка при удалении аккаунта',
      color: 'danger',
    })
  }
}
</script>
