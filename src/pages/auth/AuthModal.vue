<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="466px"
    :position="$q.screen.lt.md ? 'bottom' : undefined"
    :maximize="$q.screen.lt.md"
    :hide-close="$q.screen.lt.md"
  >
    <div class="text-on-background-color">
      <div
        :style="$q.screen.lt.md ? 'text-align: center' : ''"
        class="header3 bold"
      >
        Вход на сайт
      </div>
      <div v-if="currentStep === 1" class="column mt-4">
        <div class="column full-width">
          <div
            :style="$q.screen.lt.md ? 'text-align: center' : ''"
            class="body"
          >
            Введите номер телефона, чтобы войти на сайт
          </div>
        </div>
        <div class="mt-md-10 mt-xs-8">
          <CInput
            input-class="subtitle-text text-on-input-color input "
            :height="$q.screen.lt.md ? '44px' : '50px'"
            outlined
            mask="+7 (###) ###-##-##"
            unmasked-value
            v-model="data.phone"
          />
          <div class="row no-wrap items-center mt-10 gap-6">
            <CCheckBox v-model="data.agreement" color="primary" size="48px" />
            <div
              @click="data.agreement = !data.agreement"
              class="secondary-text cursor-pointer"
              style="opacity: 0.7"
            >
              Продолжая, вы соглашаетесь c
              <span
                @click.capture.stop="openTermsOfService()"
                style="text-decoration: underline"
                >пользовательским соглашением</span
              >,
              <span
                @click.capture.stop="openPolicy()"
                style="text-decoration: underline"
                >политикой конфиденциальности</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4" v-else>
        <div class="column body gap-1 full-width">
          <div
            :style="$q.screen.lt.md ? 'text-align: center' : ''"
            style="opacity: 0.7"
            class="body"
          >
            Код отправлен сообщением на
          </div>
          <div :class="{ 'justify-center': $q.screen.lt.md }" class="row gap-4">
            <div>+7{{ data.phone }}</div>
            <CButton
              @click="currentStep = 1"
              text-button
              label="Изменить"
              text-color="primary"
              class="body"
            />
          </div>
        </div>
        <div class="row full-width justify-center mt-12">
          <!--          <CodeComponent-->
          <!--            :code="data.sms"-->
          <!--            @update=";(data.sms = $event), (codeError = false)"-->
          <!--            @log-in="auth()"-->
          <!--            :error="codeError"-->
          <!--          />-->
          <VOtpInput
            input-classes="otp-input"
            ref="otpInputRef"
            separator=""
            inputType="number"
            :num-inputs="4"
            v-model:value="data.code"
            @on-change="data.code = $event"
            @on-complete="auth()"
          />
          <div
            v-if="codeError"
            class="col-12 text-center text-danger body mt-2"
          >
            Неверный код
          </div>
        </div>
        <div
          @click="delay ? void 0 : sendSms()"
          class="row justify-center mt-md-4 mt-xs-30 body"
          style="text-decoration: underline"
          :class="{ 'cursor-pointer': !delay }"
        >
          {{
            !!delay ? `Отправить еще раз (${delay} сек)` : 'Отправить еще раз'
          }}
        </div>
      </div>
      <CButton
        @click="nextStepHandler()"
        height="50px"
        width="100%"
        :disabled="!data.agreement || !data.phone || data.phone.length < 10"
        :label="currentStep === 1 ? 'Выслать код' : 'Войти'"
        class="subtitle-text"
        :class="
          $q.screen.lt.md ? (currentStep === 2 ? 'mt-6' : 'mt-30') : 'mt-15'
        "
        color="primary"
        text-color="on-primary"
        :loading="loading"
      />
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import { Notify } from 'quasar'
import CButton from 'src/components/template/buttons/CButton.vue'
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import { authentication } from 'src/models/authentication/authentication'
import { cartRepo } from 'src/models/carts/cartRepo'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { store } from 'src/models/store'
import { CartType } from 'src/models/carts/cart'
import { authHelper } from 'src/services/authKeyManager'
import VOtpInput from 'vue3-otp-input'
import CInput from 'components/template/inputs/CInput.vue'
import CCheckBox from 'components/helpers/CCheckBox.vue'
import { Fn, useEventListener } from '@vueuse/core'

const props = defineProps<{
  modelValue: boolean
}>()

const otpInputRef = ref<{ $el: HTMLDivElement } | null>(null)
const delay = ref(30)
let interval: NodeJS.Timeout | null = null
const codeError = ref(false)
const loading = ref(false)
const cleanupListeners: Fn[] = []
const data = ref<{
  phone: string
  code: string | undefined
  agreement: boolean
}>({
  phone: '7',
  code: undefined,
  agreement: false,
})
const currentStep = ref(1)

const openPolicy = () => {
  window.open(
    `https://${window.location.host}/${String(companyGroupRepo.item?.externalId)}/policy`,
    '_blank',
  )
}

const openTermsOfService = () => {
  window.open(
    `https://${window.location.host}/${String(
      companyGroupRepo.item?.externalId,
    )}/terms_of_service`,
    '_blank',
  )
}

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

watch(
  () => currentStep.value,
  (v) => {
    if (v === 1 && interval) {
      clearInterval(interval)
    }
  },
)

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      codeError.value = false
    }
  },
)

const nextStepHandler = async () => {
  loading.value = true
  if (currentStep.value === 1) {
    const res = await sendSms()
    if (res) {
      currentStep.value = 2
    }
    loading.value = false
  } else {
    await auth()
    loading.value = false
  }
}

const auth = async () => {
  try {
    loading.value = true
    await authentication.login({
      phone: `7${data.value.phone}`,
      code: data.value.code,
    })
    await authentication.me()
    if (authentication.user) {
      if (store.qrData) {
        await cartRepo.setParams({
          sales_point: store.qrData.data?.salesPoint?.id,
          type: CartType.TABLE,
          pad: store.qrData.data?.pad?.id,
        })
      }
      void cartRepo.current(undefined, store.qrData?.data?.pad?.id)
      if (store.qrData && store.qrData.data?.salesPoint?.id) {
        void store.loadCatalog(store.qrData.data?.salesPoint?.id)
      }
    }
    currentStep.value = 1
    emit('update:modelValue', false)
    if (
      authentication.user?.registeredAt === null &&
      !authentication.user.isAnonymous
    ) {
      store.registrationModal = true
    }
  } catch {
    codeError.value = true
  } finally {
    loading.value = false
  }
}

const sendSms = async () => {
  const res = await authentication.sendSms({
    phone: `7${data.value.phone}`,
    key: await authHelper.getAuthKey(),
  })
  if (res) {
    Notify.create({
      message: 'Сообщение с кодом успешно отправлено',
    })
    delay.value = 30
    if (interval) {
      clearInterval(interval)
    }
    interval = setInterval(() => {
      if (!delay.value) return
      delay.value--
    }, 1000)
    if (currentStep.value === 2) {
      codeError.value = false
      data.value.code = undefined
    }
  } else {
    Notify.create({
      message: 'Ошибка при отправке sms',
      color: 'danger',
    })
  }
  return res
}

watch(currentStep, (v) => {
  if (v !== 1) {
    void nextTick(() => {
      const inputs: HTMLInputElement[] = []
      if (otpInputRef.value) {
        const inputWraps = otpInputRef.value.$el.querySelectorAll('div')
        inputWraps.forEach((v) => {
          const input = v?.firstChild as HTMLInputElement
          if (input) inputs.push(input)
          v.onclick = () => {
            input?.focus()
            input?.click()
          }

          if (input) {
            input.onblur = () => v.classList.remove('focus')
            input.onfocus = () => v.classList.add('focus')
            cleanupListeners.push(
              useEventListener(input, 'input', (e: InputEvent) => {
                e.preventDefault()
                const val = e.data as string | undefined
                if (
                  (val?.length || 0) > 1 &&
                  (data.value.code?.length || 0) < 4
                ) {
                  data.value.code = val
                  const len = data.value.code?.length || 0
                  if (len === 4) {
                    inputs[3]?.focus()
                    auth()
                  } else inputs[len]?.focus()
                }
              }),
            )
          }
        })
        const firstInput = inputWraps.item(0)?.firstChild as
          | HTMLInputElement
          | undefined
        setTimeout(() => {
          firstInput?.focus()
          firstInput?.click()
        }, 0)
      }
    })
  }
})

watch(codeError, (v) => {
  const inputs = otpInputRef.value?.$el.querySelectorAll('div')
  inputs?.forEach((el) => {
    const i = el.firstChild as HTMLInputElement | undefined
    if (v) {
      if (!el.classList.contains('otp-error')) el.classList.add('otp-error')
      if (i && !i?.classList.contains('text-danger'))
        i?.classList.add('text-danger')
    } else {
      i?.classList.remove('text-danger')
      el.classList.remove('otp-error')
    }
  })
})

onBeforeUnmount(() => {
  cleanupListeners.map(v => v())
})
</script>

<style lang="scss">
.otp-input-container > div {
  position: relative;
  margin: 0 10px;
  font-size: 20px;
  text-align: center;
  padding: 6px 0px;
  min-width: 44px;
  max-width: 56px;
  width: 100%;
  border-radius: var(--border-radius2) !important;
  background: var(--input-color) !important;

  &.focus,
  &.otp-error {
    &:before {
      border-color: transparent;
    }

    &:after {
      border-color: var(--primary);
      border-radius: inherit;
      transform: scale3d(1, 1, 1);
    }
  }

  &.otp-error input {
    color: $danger !important;
  }

  &:before {
    transition: border-color 0.36s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: inherit;
    border: 1px solid #ededed;
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
  }

  &:hover:before {
    border-color: #000;
  }

  &:after {
    height: inherit;
    border-radius: inherit;
    border: 2px solid transparent;
    transition: border-color 0.36s cubic-bezier(0.4, 0, 0.2, 1);
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
  }
}

.otp-input {
  outline: unset !important;
  border: unset;
  height: 44px;
  color: var(--on-input-color);
  background: var(--input-color) !important;
  text-align: center;
  width: 100%;
}
</style>

<style lang="scss" scoped>
.input :deep(.q-field--standout.q-field-highlighted .q-field__control) {
  box-shadow: unset !important;
}

.sms-field :deep(.q-field__native) {
  letter-spacing: 20px;
  text-align: center;
}

.center-content :deep(.q-field__native) {
  padding-left: 15px;
}
</style>
