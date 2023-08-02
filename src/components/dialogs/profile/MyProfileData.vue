<template>
  <div v-if="_item" class="column gap-7 full-width">
    <CInput v-model="_item.firstName" height="38px" external-label="Имя" />
    <CInput v-model="_item.lastName" height="38px" external-label="Фамилия" />
    <CInput
      v-model="_item.phone"
      height="38px"
      readonly
      mask="+7 (###) ###-##-##"
      external-label="Телефон"
    />
    <CInput
      v-model="_item.birthday"
      height="38px"
      readonly
      external-label="Дата рождения"
    />
    <TabPicker
      small
      class="full-width mb-1"
      :model-value="sexNames[_item.sex]"
      @update-tab="updateSex($event)"
      :tabs="sexValues"
    />
    <CInput
      v-model="_item.email"
      :rules="[rules.email]"
      height="38px"
      external-label="Email"
    />
    <div class="column gap-5 mt-6">
      <CButton
        height="38px"
        color="secondary-button-color"
        text-color="on-secondary-button-color"
        disabled
        >Удалить аккаунт</CButton
      >
      <CButton
        @click="updateProfileData()"
        :disabled="!isSaveAvailable"
        height="38px"
        >Сохранить</CButton
      >
    </div>
  </div>
  <div
    v-if="customerRepo.loadings.update"
    class="absolute-full items-center justify-center flex"
  >
    <q-spinner-puff color="primary" size="20%" />
  </div>
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue';
import TabPicker from 'src/components/template/buttons/TabPicker.vue';
import CInput from 'src/components/template/inputs/CInput.vue';
import { authentication } from 'src/models/authentication/authentication';
import { computed, onMounted, ref } from 'vue';
import { sexValues, sexNames, Customer } from 'src/models/customer/customer';
import { cloneDeep, isEqual } from 'lodash';
import { Notify } from 'quasar';
import { customerRepo } from 'src/models/customer/customerRepo';
import rules from 'src/corexModels/rules';

const item = computed(() => {
  return authentication.user;
});

const _item = ref<Customer | null>(null);

const isSaveAvailable = computed(() => {
  return _item.value?.firstName.length &&
    !isEqual(item.value, _item.value) &&
    _item.value.email
    ? typeof rules.email(_item.value.email) !== 'string'
    : true;
});

const updateSex = (v: string) => {
  if (!_item.value) return;
  const foundSex = sexValues.find((el) => el.label === v);
  if (foundSex) {
    _item.value.sex = foundSex.value;
  }
};

const updateProfileData = async () => {
  try {
    const res = await customerRepo.update(_item.value);
    authentication.user = cloneDeep(res);
    Notify.create({
      message: 'Данные профиля обновлены',
    });
  } catch {
    Notify.create({
      message: 'Ошибка при обновлении профиля',
      color: 'danger',
    });
  }
};

onMounted(() => {
  _item.value = cloneDeep(item.value);
});
</script>
