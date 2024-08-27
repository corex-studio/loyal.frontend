<template>
  <CAdaptiveModal
    :initial-mobile-height="'520px'"
    :model-value="modelValue"
    width="466px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="px-xs-8 px-md-15 pb-xs-12 pb-md-15 pt-xs-15 pt-md-15">
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
            <div class="mt-16" v-if="tabs.length > 1">
              <div
                :style="$q.screen.lt.md ? 'text-align: center' : ''"
                class="body"
              >
                Выберите способ авторизации
              </div>
              <AuthModalTabs
                :tabs="tabs"
                v-model="data.authType"
                class="mt-4"
              ></AuthModalTabs>
            </div>
            <div class="row no-wrap items-center mt-16 gap-6">
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
        <div class="mt-4" v-else-if="data.authType === AuthType.SMS">
          <div class="column body gap-1 full-width">
            <div
              :style="$q.screen.lt.md ? 'text-align: center' : ''"
              style="opacity: 0.7"
              class="body"
            >
              Код отправлен сообщением на
            </div>
            <div
              :class="{ 'justify-center': $q.screen.lt.md }"
              class="row gap-4"
            >
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
            @click="delay ? void 0 : requestAuth()"
            class="row justify-center mt-md-4 mt-xs-30 body"
            style="text-decoration: underline"
            :class="{ 'cursor-pointer': !delay }"
          >
            {{
              !!delay ? `Отправить еще раз (${delay} сек)` : 'Отправить еще раз'
            }}
          </div>
        </div>
        <div class="mt-4" v-else-if="data.authType === AuthType.FLASHCALL">
          <div class="column body gap-1 full-width">
            <div
              :style="$q.screen.lt.md ? 'text-align: center' : ''"
              style="opacity: 0.7"
              class="body"
            >
              Вам поступит звонок на номер:
              <div
                :class="{ 'justify-center': $q.screen.lt.md }"
                class="row gap-4"
              >
                <div>+7{{ data.phone }}</div>
                <CButton
                  @click="currentStep = 1"
                  text-button
                  label="Изменить"
                  text-color="primary"
                  class="body"
                />
              </div>
              Введите последние 4 цифры номера, с которого идёт звонок.
            </div>
            <div class="text-h5 text-center">
              <span style="opacity: 0.5">+7 000 000 </span>
              <span
                class="bg-backing-color text-on-backing-color px-4 rounded-borders"
                >XX-XX</span
              >
            </div>
          </div>
          <div class="row full-width justify-center mt-12">
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
            @click="delay ? void 0 : sendSmsCode()"
            class="row justify-center mt-md-4 mt-xs-30 body"
            style="text-decoration: underline"
            :class="{ 'cursor-pointer': !delay }"
          >
            {{
              !!delay
                ? `Отправить смс с кодом (${delay} сек)`
                : 'Отправить смс с кодом'
            }}
          </div>
        </div>
        <div class="mt-4" v-else-if="data.authType === AuthType.TELEGRAM">
          <div class="column body gap-1 full-width">
            <div
              :class="{ 'justify-center': $q.screen.lt.md }"
              class="row gap-4"
            >
              <div>+7{{ data.phone }}</div>
              <CButton
                @click="currentStep = 1"
                text-button
                label="Изменить"
                text-color="primary"
                class="body"
              />
            </div>
            <div
              :style="$q.screen.lt.md ? 'text-align: center' : ''"
              style="opacity: 0.7"
              class="body"
            >
              Переход в телеграм. Пожалуйста не закрывайте страницу.
            </div>
          </div>
          <div class="row mt-10 justify-center full-width">
            <QSpinner size="32" />
          </div>

          <a
            v-if="sessionLink"
            :href="sessionLink"
            target="_blank"
            class="row justify-center mt-10 body cursor-pointer"
            style="text-decoration: underline"
          >
            Нажмите, если не сработал переход в телеграм
          </a>
        </div>
      </div>
      <CButton
        v-if="
          currentStep === 1 ||
          (data.authType &&
            [AuthType.SMS, AuthType.FLASHCALL].includes(data.authType))
        "
        @click="stepHandler()"
        height="50px"
        width="100%"
        :disabled="
          !data.agreement ||
          !data.phone ||
          data.phone.length < 10 ||
          !data.authType
        "
        label="Войти"
        class="subtitle-text mt-10"
        color="primary"
        text-color="on-primary"
        :loading="loading"
      />
    </div>
  </CAdaptiveModal>
</template>
<script lang="ts" setup>
import { QSpinner } from 'quasar'
import { handleMessage } from 'src/models/webSocket/webSocketRepo'
import CButton from 'src/components/template/buttons/CButton.vue'
import { authentication } from 'src/models/authentication/authentication'
import { cartRepo } from 'src/models/carts/cartRepo'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { store } from 'src/models/store'
import { CartType } from 'src/models/carts/cart'
import { authHelper } from 'src/services/authKeyManager'
import VOtpInput from 'vue3-otp-input'
import CInput from 'components/template/inputs/CInput.vue'
import CCheckBox from 'components/helpers/CCheckBox.vue'
import { Fn, useEventListener, useWebSocket } from '@vueuse/core'
import { authSettingsRepo } from 'src/models/authSettings/authSettingsRepo'
import { AuthType } from 'src/models/authSettings/authSettings'
import AuthModalTabs from './AuthModalTabs.vue'
import { openWebsocket } from 'src/services/openWebsocket'
import { notifier } from 'src/services/notifier'
import CAdaptiveModal from 'src/components/dialogs/CAdaptiveModal.vue'

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
  authType: AuthType | null
}>({
  phone: '7',
  code: undefined,
  agreement: false,
  authType: null,
})

const currentStep = ref(1)
const sessionLink = ref<string | null>(null)
const webSocket = ref<ReturnType<typeof useWebSocket> | null>(null)

const authSettings = authSettingsRepo.authSettingsData

const tabs = computed(() => {
  const buttons = [
    {
      label: authSettings?.flashcall_auth ? 'Позвонить' : 'Отправить код',
      authType: authSettings?.flashcall_auth
        ? AuthType.FLASHCALL
        : AuthType.SMS,
      icon: authSettings?.flashcall_auth
        ? 'fa-solid fa-phone'
        : 'fa fa-envelope',
    },
  ]

  if (authSettings?.telegram_auth)
    buttons.push({
      label: 'Телеграм',
      authType: AuthType.TELEGRAM,
      icon: 'fa fa-telegram',
    })

  return buttons
})

if (tabs.value.length === 1)
  data.value.authType = authSettings?.flashcall_auth
    ? AuthType.FLASHCALL
    : AuthType.SMS

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

const auth = async (authType = 1) => {
  try {
    loading.value = true
    await authentication.login({
      phone: `7${data.value.phone}`,
      code: data.value.code,
      auth_type: authType,
    })
    await checkAuth()
  } catch {
    codeError.value = true
  } finally {
    loading.value = false
  }
}

const checkAuth = async () => {
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

const stepHandler = async () => {
  loading.value = true
  switch (currentStep.value) {
    case 1:
      await requestAuth()
      break
    case 2:
      break
  }
  currentStep.value++
  loading.value = false
}

const sendSmsCode = async () => {
  data.value.authType = AuthType.SMS
  requestAuth()
}

const requestAuth = async () => {
  const authType = data.value.authType

  const res = await authentication.requestAuth({
    phone: `7${data.value.phone}`,
    key: await authHelper.getAuthKey(),
    auth_type: authType,
  })
  if (!res || !res.success) {
    notifier.error('Ошибка при обработке запроса')
    return
  }

  if (authType === AuthType.TELEGRAM) {
    const session = res.session!
    if (webSocket.value) {
      webSocket.value.close()
    }

    webSocket.value = openWebsocket(
      `wss://loyalhub.ru/ws/services/${session.key}/`,
    ) as unknown as typeof webSocket.value
    if (!webSocket.value?.ws) return
    webSocket.value.ws.onmessage = async (event: MessageEvent) => {
      const message = handleMessage(event)
      if (!message.data.access) return
      webSocket.value?.close()

      try {
        loading.value = true
        await checkAuth()
      } catch {
        codeError.value = true
      } finally {
        loading.value = false
      }
    }

    sessionLink.value = res.authorize_url!
    window.open(sessionLink.value, '_blank')
  } else if (
    authType &&
    [AuthType.SMS, AuthType.FLASHCALL].includes(authType)
  ) {
    notifier.success(
      authType === AuthType.SMS
        ? 'Сообщение с кодом успешно отправлено'
        : 'Звонок с кодом успешно отправлен',
    )

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
    notifier.error('Ошибка при отправке sms')
  }

  return res
}

onBeforeUnmount(() => {
  cleanupListeners.map((v) => v())
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
