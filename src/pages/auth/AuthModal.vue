<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="320px"
    height="359px"
  >
    <!-- <CButton label="выйти" @click="authentication.logout()" /> -->
    <div class="column text-on-background-color">
      <!-- <div class="row justify-end" :class="{ 'mb-12': currentStep === 1 }">
        <CIcon
          @click="$emit('update:modelValue', false)"
          name="fa-light fa-xmark"
          color="black"
          class="cursor-pointer"
          hover-color="primary"
          size="23px"
        />
      </div> -->
      <CIconButton
        v-if="currentStep === 2"
        @click="currentStep = 1"
        icon="fa-light fa-angle-left"
        color="white"
        icon-color="black"
        hover-icon-color="primary"
        size="30px"
      />

      <div
        :class="{ 'mt-15': currentStep === 1 }"
        class="header3 row full-width justify-center mb-10"
      >
        {{ currentStep === 1 ? 'Войти в приложение' : 'Введите код из смс' }}
      </div>
      <div
        v-if="currentStep === 2"
        class="row full-width justify-center body mb-10"
      >
        <div class="col-9" style="text-align: center">
          Смс отправлено на номер <br />
          {{ `+7${data.phone}` }}
        </div>
      </div>
      <CInput
        v-if="currentStep === 1"
        input-class="header3 text-on-input-color input"
        height="50px"
        class="mb-11"
        outlined
        mask="+7 (###) ###-##-##"
        unmasked-value
        v-model="data.phone"
      />
      <CInput
        v-else
        v-model="data.sms"
        input-class="header3 input text-on-input-color"
        height="50px"
        class="mb-11"
        standout
        mask="####"
      />
      <div
        v-if="currentStep === 2"
        @click="delay ? void 0 : sendSms()"
        class="row justify-center mb-10"
        style="text-decoration: underline"
        :class="{ 'cursor-pointer': !delay }"
      >
        {{ !!delay ? `Отправить еще раз (${delay} сек)` : 'Отправить еще раз' }}
      </div>

      <q-checkbox
        v-if="currentStep === 1"
        v-model="data.agreement"
        class="mb-10"
        color="primary"
      >
        <div class="secondary-text">
          {{ 'Я согласен на обработку моих '
          }}<span style="text-decoration: underline">персональных данных</span>
        </div></q-checkbox
      >
      <CButton
        @click="nextStepHandler()"
        height="50px"
        :disabled="!data.agreement || !data.phone || data.phone.length < 10"
        :label="currentStep === 1 ? 'Далее' : 'Войти'"
        class="body"
        color="primary"
        text-color="on-primary"
      />
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import { Notify } from 'quasar';
import CButton from 'src/components/template/buttons/CButton.vue';
import CIconButton from 'src/components/template/buttons/CIconButton.vue';
import CDialog from 'src/components/template/dialogs/CDialog.vue';
import CInput from 'src/components/template/inputs/CInput.vue';
import { authentication } from 'src/models/authentication/authentication';

import { ref, watch } from 'vue';

const delay = ref(30);
let interval: NodeJS.Timeout | null = null;

const data = ref({
  phone: '',
  sms: '',
  agreement: false,
});

const currentStep = ref(1);

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void;
}>();

const nextStepHandler = async () => {
  if (currentStep.value === 1) {
    const res = await sendSms();
    if (res) {
      currentStep.value = 2;
    }
  } else {
    try {
      await auth();
      // window.location.reload();
    } catch {
      Notify.create({
        message: 'Ошибка при авторизации',
        color: 'danger',
      });
    }
  }
};

const auth = async () => {
  try {
    await authentication.login({
      phone: `7${data.value.phone}`,
      code: data.value.sms,
    });
    Notify.create({
      message: 'Вы успешно авторизованы',
    });
    emit('update:modelValue', false);
  } catch (e) {
    Notify.create({
      message: 'Ошибка при авторизации',
      color: 'danger',
    });
  }
};

const sendSms = async () => {
  const res = await authentication.sendSms({
    phone: `7${data.value.phone}`,
  });
  if (res) {
    Notify.create({
      message: 'Сообщение с кодом успешно отправлено',
    });
    delay.value = 30;
    interval = setInterval(() => {
      if (!delay.value) return;
      delay.value--;
    }, 1000);
  } else {
    Notify.create({
      message: 'Ошибка при отправке sms',
      color: 'danger',
    });
  }
  return res;
};

// watch(
//   () => props.modelValue,
//   (v) => {
//     if (v) {
//       currentStep.value = 1;
//     }
//   }
// );

watch(
  () => currentStep.value,
  (v) => {
    if (v === 1 && interval) {
      clearInterval(interval);
    }
  }
);
</script>

<style lang="scss" scoped>
.kek {
  color: var(--kekKEK);
}
.input :deep(.q-field--standout.q-field-highlighted .q-field__control) {
  box-shadow: unset !important;
}
</style>
