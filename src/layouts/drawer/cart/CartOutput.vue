<template>
  <div v-if="$cart.item" class="px-10 column pb-10">
    <div
      v-if="authentication.user && authentication.user.wallets[0]"
      class="bg-bonus-color border-radius text-on-bonus-color px-6 py-5 mb-15"
    >
      <div class="row no-wrap items-center justify-between">
        <div class="row gap-5 no-wrap items-center">
          <div class="py-5 px-6 bg-white-opacity border-radius box-shadow">
            <CIcon color="on-bonus-color" name="fa-light fa-piggy-bank" />
          </div>
          <div class="column gap-1">
            <div class="caption-text">Баллы</div>
            <div class="header3">
              {{ authentication.user.wallets[0].balance }}
            </div>
          </div>
        </div>
        <CButton
          @click="usePointsMode = true"
          text-button
          text-color="on-bonus-color"
        >
          <div class="secondary-text" style="text-decoration: underline">
            Применить
          </div>
        </CButton>
      </div>
      <div
        v-if="usePointsMode"
        class="column gap-10 bg-background-color border-radius px-6 py-8 mt-7"
      >
        <div class="row no-wrap justify-between body bold">
          <div>Доступно</div>
          <div>
            <span class="text-positive">{{ $cart.item.appliedBonuses }}</span>
            {{ '/' + authentication.user.wallets[0].balance }}
          </div>
        </div>
        <q-slider
          color="accent5"
          thumb-color="primary"
          :min="0"
          :max="authentication.user.wallets[0].balance"
          v-model="$cart.item.appliedBonuses"
        />
      </div>
    </div>
    <div class="column">
      <div class="header2 mb-10">Итого</div>
      <div class="box-shadow border-radius py-6 px-5 column gap-5">
        <div
          v-for="(el, index) in resultRows"
          :key="index"
          class="row items-center no-wrap justify-between"
        >
          <div class="row gap-5 no-wrap items-center">
            <div class="bg-white-opacity box-shadow border-radius px-6 py-5">
              <CIcon
                :color="index === 3 ? 'primary' : 'on-background-color'"
                :name="el.icon"
              />
            </div>
            <div
              :class="index === 3 ? 'text-primary' : 'text-on-background-color'"
              class="secondary-text"
            >
              {{ el.label }}
            </div>
          </div>
          <div
            :class="index === 3 ? 'text-primary' : 'text-on-background-color'"
            class="secondary-text"
          >
            {{ el.value || '0' }} ₽
          </div>
        </div>
      </div>
      <div class="row items-end gap-5 mt-10">
        <CInput
          v-model="$cart.item.promoCode"
          default
          class="body col-grow"
          height="50px"
          external-label="Промокод"
        />
        <CButton height="50px" class="body" label="Применить" />
      </div>
      <CInput
        :model-value="$cart.item.deliveryTime"
        class="mt-10"
        default
        height="50px"
        external-label="Время доставки"
      >
        <q-menu
          ><q-time
            :options="dateOptions"
            :model-value="deliveryTyme"
            @update:model-value="setDeliveryTime($event)"
          >
            <TabPicker
              @update-tab="currentDay = $event"
              :tabs="['Сегодня', 'Завтра']"
              :model-value="currentDay"
            /> </q-time
        ></q-menu>
      </CInput>
      <div v-if="showPaymentTypes" class="row full-width gap-8 mt-15">
        <div
          v-for="(type, index) in paymentTypes"
          :key="index"
          @click="$emit('paymentSelected', type.type)"
          style="max-width: 50%"
          class="col border-radius px-5 pt-10 pb-5 cursor-pointer relative-position"
          :class="type.class"
        >
          <div
            class="column justify-between full-height"
            :style="`visibility: ${
              $cart.arrangeLoading ? 'hidden' : 'visible'
            }`"
          >
            <div class="subtitle-text">
              {{ type.label }}
            </div>
            <div class="row mt-3 full-width justify-end">
              <div
                style="height: 30px; width: 30px"
                class="bg-white-opacity row justify-center items-center border-radius"
              >
                <CIcon color="" :name="type.icon" />
              </div>
            </div>
          </div>
          <q-spinner-puff
            v-if="$cart.arrangeLoading"
            class="absolute-center"
            color="primary"
            size="50%"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import TabPicker from 'src/components/template/buttons/TabPicker.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import { authentication } from 'src/models/authentication/authentication'
import { cartRepo } from 'src/models/carts/cartRepo'
import { computed, ref, onMounted } from 'vue'
import { AvailableHours } from 'src/models/carts/cart'
import moment from 'moment'
import { PaymentType } from 'src/models/order/order'

defineProps<{
  showPaymentTypes: boolean
}>()

defineEmits<{
  (evt: 'paymentSelected', val: PaymentType): void
}>()

const usePointsMode = ref(false)

const currentDay = ref('Сегодня')

const deliveryTyme = ref<string | null>(null)

const availableHours = ref<AvailableHours | null>(null)

const paymentTypes = computed(() => {
  const result = []
  if (cartRepo.item?.salesPoint.paymentSettings.cash_enabled)
    result.push({
      label: 'Наличными при получении',
      type: PaymentType.CASH,
      class: 'bg-cash-button-color text-on-cash-button-color',
      icon: 'fa-light fa-money-bill',
    })
  if (cartRepo.item?.salesPoint.paymentSettings.card_enabled)
    result.push({
      label: 'Картой при получении',
      type: PaymentType.CARD,
      class: 'bg-card-button-color text-on-card-button-color',
      icon: 'fa-light fa-credit-card',
    })
  if (cartRepo.item?.salesPoint.paymentSettings.online_payment_enabled)
    result.push({
      label: 'Онлайн',
      type: PaymentType.ONLINE,
      class: 'bg-online-button-color text-on-online-button-color',
      icon: 'fa-light fa-dollar',
    })
  return result
})

const dateOptions = (hr: number, min: number | null) => {
  if (!availableHours.value) return
  for (const v of currentDay.value === 'Сегодня'
    ? availableHours.value?.today
    : availableHours.value.tomorrow) {
    const startTime = moment
      .utc(v.start, 'YYYY-MM-DD HH:mm:ss')
      .local()
      .format('HH:mm')
    const endTime = moment
      .utc(v.end, 'YYYY-MM-DD HH:mm:ss')
      .local()
      .format('HH:mm')

    const startHour = Number(startTime.split(':')[0])
    const endHour = Number(endTime.split(':')[0])

    const startMin = Number(startTime.split(':')[1])
    const endMin = Number(endTime.split(':')[1])

    if (hr < startHour) return false
    if (hr > endHour) return false
    if (min !== null && hr === startHour && min < startMin) return false
    if (min !== null && hr === endHour && min > endMin) return false
    return true
  }
}

const resultRows = computed(() => {
  return [
    {
      label: 'Сумма заказа',
      icon: 'fa-light fa-user',
      value: cartRepo.item?.discountedSum,
    },
    {
      label: 'Списать баллов',
      icon: 'fa-light fa-piggy-bank',
      value: '—' + cartRepo.item?.appliedBonuses,
    },
    {
      label: 'Доставка',
      icon: 'fa-light fa-truck',
      value: cartRepo.item?.deliveryPrice,
    },
    {
      label: 'К оплате',
      icon: 'fa-light fa-credit-card-blank',
      value: cartRepo.item?.discountedTotalSum,
    },
  ]
})

const setDeliveryTime = (v: string | null) => {
  if (!cartRepo.item) return
  const today = moment().format('DD.MM.YYYY')
  const tomorrow = moment().add(1, 'day').format('DD.MM.YYYY')
  if (currentDay.value === 'Сегодня') {
    cartRepo.item.deliveryTime = [today, v].join(' ')
  } else {
    cartRepo.item.deliveryTime = [tomorrow, v].join(' ')
  }
}

onMounted(() => {
  void cartRepo.getAvailableHours().then((res) => {
    availableHours.value = res
  })
  if (cartRepo.item?.deliveryTime) {
    deliveryTyme.value = moment(
      cartRepo.item.deliveryTime,
      'DD.MM.YYYY HH:mm:ss'
    ).format('HH:mm')
  }
})
</script>

<style lang="scss" scoped></style>
