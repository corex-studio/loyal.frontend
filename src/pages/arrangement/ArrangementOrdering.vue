<template>
  <div v-if="$cart.item" class="row pt-20 text-on-background-color">
    <div class="col column gap-15">
      <div class="column gap-12 full-width">
        <div class="header2 bold">
          Заказ на
          {{ isDelivery ? 'доставку' : 'самовывоз' }}
        </div>
        <div class="row body full-width gap-5 items-center">
          <div class="col-4">
            Адрес {{ isDelivery ? 'доставки' : 'самовывоза' }}
          </div>
          <div
            :style="
              $uiSettings.item?.inputType === 'outlined'
                ? 'border: 1px #ededed solid'
                : ''
            "
            style="min-height: 48px"
            :class="
              $uiSettings.item?.inputType === 'outlined'
                ? 'border-radius'
                : 'filled-input'
            "
            class="bg-input-color text-on-input-color row justify-between items-center px-6 py-5 row no-wrap col gap-10"
          >
            <div>{{ $cart.item?.currentAddress }}</div>
            <CButton
              v-if="isDelivery"
              @click="deliveryAddressesModal = true"
              text-button
              label="Изменить"
              class="body pr-5"
              text-color="primary"
            />
          </div>
        </div>
        <div class="row body full-width gap-5 items-center">
          <div class="col-4">Время доставки</div>
          <div class="row gap-8 col text-on-input-color">
            <div
              :style="
                $uiSettings.item?.inputType === 'outlined'
                  ? 'border: 1px #ededed solid'
                  : ''
              "
              :class="[{ 'selected-element': !$cart.item.deliveryTime }]"
              style="min-height: 48px"
              @click="selectClosestTime()"
              class="border-radius cursor-pointer bg-input-color row justify-between items-center px-6 py-5 row no-wrap col gap-10"
            >
              <div>Ближайшая</div>
              <CIcon
                class="cursor-pointer"
                name="fa-regular fa-clock"
                color="secondary-button-color"
                size="20px"
              />
            </div>
            <div
              v-if="
                availableHours?.today.length || availableHours?.tomorrow.length
              "
              :style="
                $uiSettings.item?.inputType === 'outlined'
                  ? 'border: 1px #ededed solid'
                  : ''
              "
              style="min-height: 48px"
              :class="{ 'selected-element': $cart.item.deliveryTime }"
              class="border-radius cursor-pointer bg-input-color row justify-between items-center px-6 py-5 row no-wrap col gap-10"
            >
              <div>{{ $cart.item.deliveryTime || 'Ко времени' }}</div>
              <CIcon
                class="cursor-pointer"
                name="fa-regular fa-calendar-clock"
                color="secondary-button-color"
                size="20px"
              />

              <q-menu
                v-model="menu"
                fit
                class="pa-6"
                style="overflow-y: hidden"
              >
                <TabPicker
                  :model-value="currentDay"
                  @update-tab="currentDay = $event"
                  :tabs="['Сегодня', 'Завтра']"
                />
                <div
                  ref="menuRef"
                  class="column no-wrap full-width"
                  style="overflow-y: scroll; max-height: 450px; height: 100%"
                >
                  <div
                    v-for="(el, index) in totalDayTimes()"
                    :class="[
                      el,
                      {
                        'bold ': el === $cart.item.deliveryTime?.slice(11, 16),
                      },
                    ]"
                    :key="index"
                    @click="setDeliveryTime(el)"
                    :style="
                      !availableTimes?.includes(el)
                        ? 'opacity: 0.5; cursor: not-allowed !important'
                        : ''
                    "
                    class="full-width body cursor-pointer pa-6 time-row"
                  >
                    {{ el }}
                  </div>
                </div>
              </q-menu>
            </div>
          </div>
        </div>
        <div class="row body full-width gap-5">
          <div class="col-4 mt-8">Комментарий</div>
          <CInput
            auto-grow
            height="fit-content"
            class="col"
            input-class="body"
            placeholder="Напишите ваши пожелания"
            v-model="$cart.item.comment"
          />
        </div>
        <div class="row body full-width items-center gap-5">
          <div class="col-4">Способ оплаты</div>
          <div
            :style="
              $uiSettings.item?.inputType === 'outlined'
                ? 'border: 1px #ededed solid'
                : ''
            "
            style="min-height: 48px"
            :class="
              $uiSettings.item?.inputType === 'outlined'
                ? 'border-radius'
                : 'filled-input'
            "
            class="body bg-input-color text-on-input-color row justify-between items-center px-6 py-5 row no-wrap col gap-10"
          >
            <div class="gap-4 row items-center no-wrap">
              <q-icon size="20px" :name="selectedPaymentType?.icon" />
              {{ selectedPaymentType?.label }}
            </div>
            <CButton
              @click="selectedPaymentTypeModal = true"
              text-button
              label="Изменить"
              class="body pr-5"
              text-color="primary"
            />
          </div>
        </div>

        <div
          v-if="
            $salesPoint.item?.settings.promo_codes !== PromoCodeMode.DISABLED
          "
          class="row full-width justify-center"
        >
          <CButton
            @click="promocodeModal = true"
            text-button
            label="У меня есть промокод"
            class="body"
            style="opacity: 0.9"
            text-color="on-background-color"
          />
        </div>
      </div>
      <div class="row full-width gap-10 mt-10">
        <CButton
          @click="
            $router.push({
              name: 'home',
            })
          "
          label="Назад"
          height="48px"
          class="col body"
          color="secondary-button-color"
          text-color="on-secondary-button-color"
        />
        <CButton
          @click="makeAnOrder()"
          :loading="loading"
          :disabled="!isArrangeAvailable"
          label="Оплатить"
          height="48px"
          class="col body"
        />
      </div>
    </div>
    <div class="pl-30 col-5">
      <div
        :style="
          $companyGroup.item?.externalId === 'corex_demo'
            ? 'border: 1px #f5f5f5 solid'
            : ''
        "
        class="column full-width border-radius box-shadow gap-6 pa-8"
      >
        <div style="opacity: 0.8" class="subtitle-text mb-2">Состав заказа</div>
        <template v-for="(item, index) in $cart.item?.cartItems" :key="index">
          <div class="row body full-width no-wrap py-3">
            <div class="row no-wrap gap-6 col-10 items-center">
              <q-img
                :src="item.size.image?.thumbnail || $store.images.empty"
                height="65px"
                width="65px"
                style="min-height: 65px; min-width: 65px"
                fit="contain"
              >
                <template v-slot:error>
                  <span>
                    <q-img
                      class="user-image"
                      fit="cover"
                      style="min-height: 65px; min-width: 65px"
                      width="65px"
                      height="65px"
                      :src="$store.images.empty"
                    ></q-img>
                  </span>
                </template>
              </q-img>
              <div class="column gap-1">
                <div class="ellipsis-2-lines">
                  {{ item.size.name }}
                </div>

                <div style="opacity: 0.6">{{ item.quantity }} шт</div>
              </div>
            </div>
            <div
              class="col-2 column items-end no-wrap"
              style="white-space: no-wrap"
            >
              <div
                v-if="item.totalSum !== item.discountedTotalSum"
                style="opacity: 0.5"
                class="text-strike"
              >
                {{ beautifyNumber(item.totalSum, true) }} ₽
              </div>
              <div>{{ beautifyNumber(item.discountedTotalSum, true) }} ₽</div>
            </div>
          </div>
        </template>
        <q-separator color="divider-color" />
        <div class="row full-width justify-between">
          <div class="body bold">Сумма заказа</div>

          <div class="body bold">
            {{ beautifyNumber($cart.item?.totalSum, true) }} ₽
          </div>
        </div>
        <div
          v-if="$cart.item?.appliedBonuses"
          class="row full-width justify-between text-primary"
        >
          <div class="body bold">Списано бонусов</div>
          <div class="body bold">
            -{{ beautifyNumber($cart.item?.appliedBonuses, true) }} ₽
          </div>
        </div>
        <div class="row full-width justify-between">
          <div class="body bold">К оплате</div>
          <div class="body bold">
            {{ beautifyNumber($cart.item?.discountedTotalSum, true) }} ₽
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="pt-20 header2 bold">Корзина пуста</div>
  <SelectPaymentTypeModal
    :types="paymentTypes"
    v-model="selectedPaymentTypeModal"
    :current-type="selectedPaymentType"
    @select="selectedPaymentType = $event"
  />
  <PromocodeModal v-model="promocodeModal" />
  <DeliveryAddressesModal
    @address-selected="changeDeliveryAddress($event)"
    v-model="deliveryAddressesModal"
  />
</template>
<script lang="ts" setup>
import moment from 'moment'
import CButton from 'src/components/template/buttons/CButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import { AvailableHours, CartType } from 'src/models/carts/cart'
import { cartRepo } from 'src/models/carts/cartRepo'
import { PaymentType, PaymentObjectType } from 'src/models/order/order'
import {
  beautifyNumber,
  getTimesBetween,
  store,
  totalDayTimes,
} from 'src/models/store'
import { ref, computed, onMounted, watch } from 'vue'
import SelectPaymentTypeModal from './SelectPaymentTypeModal.vue'
import PromocodeModal from './PromocodeModal.vue'
import { PromoCodeMode } from 'src/models/salesPoint/salesPoint'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { Notify } from 'quasar'
import { padRepo } from 'src/models/pads/padRepo'
import { useRouter } from 'vue-router'
import { orderRepo } from 'src/models/order/orderRepo'
import DeliveryAddressesModal from 'src/components/template/dialogs/DeliveryAddressesModal.vue'
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import { deliveryAreaRepo } from 'src/models/deliveryAreas/deliveryAreaRepo'
import { deliveryAddressRepo } from 'src/models/customer/deliveryAddress/deliveryAddressRepo'
import TabPicker from 'src/components/template/buttons/TabPicker.vue'

const currentDay = ref('Сегодня')

const availableHours = ref<AvailableHours | null>(null)

// const deliveryTyme = ref<string | null>(null)

const selectedPaymentType = ref<PaymentObjectType | null>(null)

const selectedPaymentTypeModal = ref(false)

const promocodeModal = ref(false)

const loading = ref(false)

const router = useRouter()

const deliveryAddressesModal = ref(false)

const menu = ref(false)

const menuRef = ref<HTMLDivElement | null>(null)

const isArrangeAvailable = computed(() => {
  return !!selectedPaymentType.value
})

const isDelivery = computed(() => {
  return cartRepo.item?.type === CartType.DELIVERY
})

const availableTimes = computed(() => {
  return currentDay.value === 'Сегодня'
    ? availableHours.value?.today.flatMap((v) => {
        return getTimesBetween(v.start.slice(11, 16), v.end.slice(11, 16))
      })
    : availableHours.value?.tomorrow.flatMap((v) => {
        return getTimesBetween(v.start.slice(11, 16), v.end.slice(11, 16))
      })
})

// const options = computed(() => {
//   return currentDay.value === 'Сегодня'
//     ? availableHours.value?.today.map((v) => {
//         return {
//           start: moment(v.start, 'YYYY-MM-DD HH:mm').format('HH:mm'),
//           end: moment(v.end, 'YYYY-MM-DD HH:mm').format('HH:mm'),
//         }
//       })
//     : availableHours.value?.tomorrow.map((v) => {
//         return {
//           start: moment(v.start, 'YYYY-MM-DD HH:mm').format('HH:mm'),
//           end: moment(v.end, 'YYYY-MM-DD HH:mm').format('HH:mm'),
//         }
//       })
// })

const paymentTypes = computed(() => {
  const result: PaymentObjectType[] = []
  if (store.tableMode) {
    result.push({
      label: 'Внести в счет',
      type: PaymentType.PAY_LATER,
      class: 'bg-cash-button-color text-on-cash-button-color',
      icon: 'fa-light fa-money-bill',
    })
    if (cartRepo.item?.salesPoint.paymentSettings.online_payment_enabled) {
      result.push({
        label: 'Онлайн',
        type: PaymentType.ONLINE,
        class: 'bg-cash-button-color text-on-cash-button-color',
        icon: 'fa-light fa-ruble-sign',
      })
    }
  } else {
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
        icon: 'fa-light fa-ruble-sign',
      })
  }
  return result
})

watch(
  () => menu.value,
  (v) => {
    if (v) {
      setTimeout(() => {
        if (!availableTimes.value || !menuRef.value) return
        const foundTimeElement = menuRef.value.getElementsByClassName(
          availableTimes.value[0]
        )
        if (foundTimeElement) {
          foundTimeElement[0].scrollIntoView()
        }
      }, 0)
    }
  }
)

const selectClosestTime = () => {
  if (!cartRepo.item) return
  cartRepo.item.deliveryTime = null
  // if (availableHours.value?.today.length) {
  //   cartRepo.item.deliveryTime = moment(
  //     availableHours.value.today[0].start
  //   ).format('DD.MM.YYYY HH:mm')
  // } else {
  //   cartRepo.item.deliveryTime =
  //     moment(availableHours.value?.tomorrow[0].start).format(
  //       'DD.MM.YYYY HH:mm'
  //     ) || null
  // }
}

const setDeliveryTime = (v: string | null) => {
  if (!cartRepo.item) return
  if (v && !availableTimes.value?.includes(v)) return
  const today = moment().format('DD.MM.YYYY')
  const tomorrow = moment().add(1, 'day').format('DD.MM.YYYY')

  if (currentDay.value === 'Сегодня') {
    cartRepo.item.deliveryTime = [today, v].join(' ')
  } else {
    cartRepo.item.deliveryTime = [tomorrow, v].join(' ')
  }
  menu.value = false
}

const makeAnOrder = async () => {
  try {
    loading.value = true
    const status = await salesPointRepo.status(cartRepo.item?.salesPoint.id)
    if (!status) {
      Notify.create({
        message: 'В данный момент невозможно оформить заказ',
        color: 'danger',
      })
      return
    }

    await cartRepo.setParams({
      delivery_time: cartRepo.item?.deliveryTime
        ? moment(cartRepo.item?.deliveryTime, 'DD.MM.YYYY HH:mm')
            .utc()
            .format('YYYY-MM-DD HH:mm:ss')
        : null,
      comment: cartRepo.item?.comment || undefined,
    })
    const order = await cartRepo.arrange({
      sales_point: cartRepo.item?.salesPoint.id,
      payment_data: {
        type: selectedPaymentType.value?.type,
        payment_service:
          selectedPaymentType.value?.type === PaymentType.CASH ||
          selectedPaymentType.value?.type === PaymentType.PAY_LATER
            ? undefined
            : selectedPaymentType.value?.type === PaymentType.CARD
            ? 'card'
            : 'web_form',
      },
      pad: store.tableMode ? padRepo.item?.id : undefined,
    })
    if (store.tableMode) {
      await cartRepo.current(
        padRepo.item?.salesPoint?.id,
        padRepo.item || undefined
      )
      void router.push({
        name: 'currentOrderPage',
      })
    } else {
      cartRepo.item = null
      void router.push({
        name: 'successOrderPage',
        params: {
          orderId: order.id,
        },
      })
    }
    if (order.paymentUrl) {
      window.open(order.paymentUrl, '_blank')
    }
    Notify.create({
      message: 'Заказ успешно оформлен',
    })
    orderRepo.item = order
  } catch {
    cartRepo.arrangeLoading = false
    Notify.create({
      message: 'Ошибка при оформлении заказа',
      color: 'danger',
    })
  } finally {
    loading.value = false
  }
}

const changeDeliveryAddress = async (address: DeliveryAddress) => {
  if (address.id === cartRepo.item?.deliveryAddress?.id) {
    deliveryAddressesModal.value = false
    return
  }
  const res = await deliveryAreaRepo.byCoords(address.coords)
  if (!res.length) {
    Notify.create({
      message: 'По данному адресу не осуществляется доставка',
      color: 'danger',
    })
    deliveryAddressesModal.value = false
    return
  }
  try {
    await cartRepo.setParams({
      sales_point: res[0].salesPoint,
      type: 'delivery',
      delivery_address: address.id,
    })
  } catch {
    Notify.create({
      message: 'Ошибка',
      color: 'danger',
    })
  } finally {
    deliveryAddressesModal.value = false
  }
}

onMounted(() => {
  void cartRepo.getAvailableHours().then((res) => {
    availableHours.value = res
  })
  void deliveryAddressRepo.list()
  const foundOnlinePaymentType = paymentTypes.value.find(
    (v) => v.type === PaymentType.ONLINE
  )
  if (foundOnlinePaymentType) {
    selectedPaymentType.value = foundOnlinePaymentType
  }
})
</script>

<style lang="scss" scoped>
.input :deep(.q-field--standout.q-field--readonly .q-field__control:before) {
  border: unset;
}

.selected-element {
  outline: 2px var(--primary) solid !important;
}

.filled-input {
  border-radius: 4px 4px 0 0;
}
</style>
