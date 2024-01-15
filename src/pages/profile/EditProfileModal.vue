<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="490px"
  >
    <div class="huge3 bold mb-15">Мои данные</div>
    <div v-if="item" class="column full-width gap-10">
      <CInput
        external-label="Ваше имя"
        external-label-class="body mb-2"
        input-class="body"
        height="48px"
        v-model="item.firstName"
      />
      <CInput
        external-label-class="body mb-2"
        external-label="Ваша фамилия"
        input-class="body"
        height="48px"
        v-model="item.lastName"
      />
      <CInput
        external-label-class="body mb-2"
        external-label="Номер телефона"
        input-class="body"
        v-model="item.phone"
        height="48px"
        mask="+# (###) ###-##-##"
        :rules="[(v: string | null) => v && v!.length < 11 ? 'Введите корректный телефон' : true]"
        unmasked-value
      />
      <CInput
        external-label-class="body mb-2"
        external-label="Email"
        input-class="body"
        :rules="[rules.email]"
        height="48px"
        v-model="item.email"
      />
      <q-separator color="devider-color" class="my-2" />
      <div class="row full-width gap-6">
        <TabPicker
          @update-tab="changeSex($event)"
          :model-value="sex || undefined"
          height="48px"
          class="col-5"
          :tabs="sexTabs"
          external-label="Пол"
        />
        <CInput
          external-label="Дата рождения"
          height="48px"
          class="col-grow"
          input-class="body"
          :model-value="item.birthday"
        >
          <q-menu
            ><q-date
              v-model="item.birthday"
              :options="getDateOptions"
              mask="DD.MM.YYYY"
          /></q-menu>
        </CInput>
      </div>
    </div>
    <CButton
      @click="save()"
      label="Сохранить"
      icon="fa-regular fa-user"
      height="48px"
      color="secondary-button-color"
      :loading="loading"
      :disabled="!isSaveAvailable"
      text-color="text-on-secondary-button-color"
      width="100%"
      class="mt-20 body"
    />
  </CDialog>
</template>
<script lang="ts" setup>
import { cloneDeep, isEqual } from 'lodash'
import moment from 'moment'
import { Notify } from 'quasar'
import CButton from 'src/components/template/buttons/CButton.vue'
import TabPicker from 'src/components/template/buttons/TabPicker.vue'
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import rules from 'src/corexModels/rules'
import { authentication } from 'src/models/authentication/authentication'
import { Customer, SexType } from 'src/models/customer/customer'
import { customerRepo } from 'src/models/customer/customerRepo'
import { watch, ref, computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const sexTabs = ['М', 'Ж']

const sex = ref<string | null>(null)

const item = ref<Customer | null>(null)

const loading = ref(false)

const isSaveAvailable = computed(() => {
  return (
    item.value?.firstName.length &&
    !isEqual(item.value, authentication.user) &&
    (item.value.email
      ? typeof rules.email(item.value.email) !== 'string'
      : true) &&
    String(item.value.phone).length === 11
  )
})

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      item.value = cloneDeep(authentication.user)
      sex.value = item.value?.sex === SexType.MALE ? 'М' : 'Ж'
    }
  }
)

const changeSex = (v: string) => {
  if (!item.value) return
  sex.value = v
  if (v === 'М') {
    item.value.sex = SexType.MALE
  } else if (v === 'Ж') {
    item.value.sex = SexType.FEMALE
  }
}

const getDateOptions = (date: string) => {
  return date < moment().format('YYYY/MM/DD')
}

const save = async () => {
  try {
    if (!item.value) throw new Error('Пользователь не может быть пустым')
    loading.value = true

    const res = await customerRepo.update(item.value)
    authentication.user = cloneDeep(res)
    Notify.create({
      message: 'Данные профиля обновлены',
    })
    emit('update:modelValue', false)
  } catch {
    Notify.create({
      message: 'Ошибка при обновлении данных',
      color: 'danger',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped></style>
