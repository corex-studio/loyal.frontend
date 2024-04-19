<template>
  <div v-if="$cart.item">
    <div class="row pt-lg-20 pt-xs-12 text-on-background-color">
      <div class="col-lg col-xs-12 column">
        <div
          class="row full-width items-center no-wrap gap-4 mb-md-12 mb-xs-10"
        >
          <ArrangementOrderingBackButton />
          <div class="header bold">
            {{ orderTypeText }}
          </div>
        </div>
        <div class="column gap-md-12 gap-xs-8 full-width">
          <div
            v-if="$q.screen.lt.md"
            class="full-width mb-2"
            ref="timeBlockMobileSpot"
          ></div>
          <div
            v-if="!$store.tableMode"
            :class="$q.screen.lt.md ? 'column' : 'row items-center'"
            class="body full-width gap-md-5 gap-xs-4"
          >
            <div v-if="$q.screen.gt.sm" class="col-4">
              Адрес {{ isDelivery ? 'доставки' : 'самовывоза' }}
            </div>
            <div v-else class="row items-center full-width gap-3 no-wrap">
              <CIcon color="on-background-color" name="fa-regular fa-home" />
              <div class="body bold mt-2">Адрес</div>
            </div>
            <div
              :style="
                $uiSettings.item?.inputType === 'outlined'
                  ? 'border: 1px #ededed solid'
                  : ''
              "
              style="min-height: 48px"
              class="bg-input-color border-radius2 text-on-input-color row justify-between px-6 py-5 row no-wrap col gap-10"
            >
              <div>{{ $cart.item?.currentAddress }}</div>
              <template v-if="isDelivery">
                <CButton
                  v-if="$q.screen.gt.sm"
                  @click="deliveryAddressesModal = true"
                  text-button
                  label="Изменить"
                  class="body pr-5"
                  text-color="primary"
                />
                <CIcon
                  v-else
                  @click="deliveryAddressesModal = true"
                  name="fa-regular fa-angle-right"
                  size="24px"
                  color="on-input-color"
                  hover-color="primary"
                  class="cursor-pointer"
                />
              </template>
            </div>
          </div>
          <teleport
            :disabled="$q.screen.gt.sm || !timeBlockMobileSpot"
            :to="timeBlockMobileSpot"
          >
            <div
              v-if="$cart.item.type !== CartType.TABLE"
              :class="$q.screen.lt.md ? 'column' : 'row items-center'"
              class="body full-width gap-5"
            >
              <div v-if="$q.screen.gt.sm" class="col-4">Время доставки</div>
              <div
                :class="$q.screen.lt.md ? 'full-width' : 'col'"
                class="row gap-md-8 gap-xs-6 text-on-input-color"
              >
                <div
                  :style="
                    $uiSettings.item?.inputType === 'outlined'
                      ? 'border: 1px #ededed solid'
                      : ''
                  "
                  :class="[
                    !$cart.item.deliveryTime
                      ? 'selected-element'
                      : { 'bordered-block': $q.screen.lt.md },
                    $q.screen.lt.md
                      ? 'column gap-8'
                      : 'row justify-between  items-center gap-10',
                  ]"
                  style="min-height: 48px; height: inherit"
                  @click="selectClosestTime()"
                  class="border-radius2 cursor-pointer bg-input-color px-6 py-5 row no-wrap col"
                >
                  <template v-if="$q.screen.gt.sm">
                    <div>Ближайшая</div>
                    <CIcon
                      class="cursor-pointer"
                      name="fa-regular fa-clock"
                      color="secondary"
                      size="20px"
                    />
                  </template>
                  <template v-else>
                    <RoundedSelector
                      height="24px"
                      width="24px"
                      :model-value="!$cart.item.deliveryTime"
                      check
                    />
                    <div class="column full-width gap-2">
                      <div class="bold body">Как можно скорее</div>
                      <div class="body">
                        <span class="bold body">~</span>через 10 минут
                      </div>
                    </div>
                  </template>
                </div>

                <div
                  v-if="
                    !$salesPoint.item?.settings
                      .allow_order_arrangement_without_delivery_time &&
                    (availableHours?.today.length ||
                      availableHours?.tomorrow.length)
                  "
                  :style="
                    $uiSettings.item?.inputType === 'outlined'
                      ? 'border: 1px #ededed solid'
                      : ''
                  "
                  style="min-height: 48px; height: inherit"
                  :class="[
                    $cart.item.deliveryTime
                      ? 'selected-element'
                      : { 'bordered-block': $q.screen.lt.md },
                    $q.screen.lt.md
                      ? 'column gap-8'
                      : 'row justify-between items-center  gap-10',
                  ]"
                  class="border-radius2 cursor-pointer bg-input-color px-6 py-5 no-wrap col"
                >
                  <template v-if="$q.screen.gt.sm">
                    <div>{{ $cart.item.deliveryTime || 'Ко времени' }}</div>
                    <CIcon
                      class="cursor-pointer"
                      name="fa-regular fa-calendar-clock"
                      color="secondary"
                      size="20px"
                    />
                  </template>
                  <template v-else>
                    <RoundedSelector
                      height="24px"
                      width="24px"
                      :model-value="!!$cart.item.deliveryTime"
                      check
                    />
                    <div class="column full-width gap-2">
                      <div class="bold body">Ко времени</div>
                      <div class="body">Выберите время</div>
                    </div>
                  </template>
                  <q-menu
                    v-model="menu"
                    :fit="$q.screen.gt.sm"
                    class="pa-6"
                    :style="`width: ${$q.screen.lt.md ? '250px' : ''}`"
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
                      style="
                        overflow-y: scroll;
                        max-height: 450px;
                        height: 100%;
                      "
                    >
                      <div
                        v-for="(el, index) in totalDayTimes()"
                        :class="[
                          el,
                          {
                            'bold selected-time border-radius2':
                              el === $cart.item.deliveryTime?.slice(11, 16),
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
          </teleport>
          <q-separator
            v-if="$q.screen.lt.md && !$store.tableMode"
            color="divider-color"
          />
          <div
            :class="$q.screen.lt.md ? 'column' : 'row'"
            class="body full-width gap-md-5 gap-xs-4"
          >
            <div :class="{ bold: $q.screen.lt.md }" class="col-md-4 mt-md-8">
              {{ $q.screen.lt.md ? 'Комментарий к заказу' : 'Комментарий' }}
            </div>
            <CInput
              auto-grow
              height="fit-content"
              class="col"
              placeholder="Напишите ваши пожелания"
              v-model="$cart.item.comment"
            />
          </div>
          <q-separator v-if="$q.screen.lt.md" color="divider-color" />

          <div
            :class="$q.screen.lt.md ? 'column' : 'row items-center'"
            class="body full-width gap-md-5 gap-xs-4"
          >
            <div :class="{ bold: $q.screen.lt.md }" class="col-md-4">
              Способ оплаты
            </div>
            <div
              :style="
                $uiSettings.item?.inputType === 'outlined'
                  ? 'border: 1px #ededed solid'
                  : ''
              "
              style="min-height: 48px"
              class="body border-radius2 bg-input-color text-on-input-color row justify-between items-center px-6 py-5 row no-wrap col gap-10"
              @click="selectedPaymentTypeModal = true"
            >
              <div class="gap-4 row items-center no-wrap">
                <q-icon size="20px" :name="selectedPaymentType?.icon" />
                {{ selectedPaymentType?.label }}
              </div>
              <CButton
                v-if="$q.screen.gt.sm"
                text-button
                label="Изменить"
                class="body pr-5"
                text-color="primary"
              />
              <CIcon
                v-else
                @click="selectedPaymentTypeModal = true"
                name="fa-regular fa-angle-right"
                size="24px"
                color="on-input-color"
                hover-color="primary"
                class="cursor-pointer"
              />
            </div>
          </div>

          <div
            v-if="$cart.item.salesPoint.settings.allow_pickup_orders_inside"
            class="row full-width gap-md-5 gap-xs-4"
          >
            <div v-if="$q.screen.gt.sm" class="col-md-4"></div>
            <div class="col-grow">
              <TabPicker
                @update-tab="changeEatInside($event)"
                :tabs="eatInsideTabs"
                :model-value="currentEatInsideTab"
                width="100%"
              />
            </div>
          </div>
        </div>
        <div v-if="$q.screen.gt.md" class="row full-width gap-10 mt-25">
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
            label="Оформить"
            :height="$q.screen.md ? '44px' : $q.screen.lt.md ? '40px' : '48px'"
            class="col body"
          />
        </div>
      </div>
      <div
        v-if="$q.screen.gt.sm"
        class="pl-lg-30 col-lg-5 col-xs-12 mt-xs-20 mt-lg-0 pb-xs-20 pb-lg-0"
      >
        <div
          :style="
            $companyGroup.item?.externalId === 'corex_demo'
              ? 'border: 1px #f5f5f5 solid'
              : ''
          "
          :class="{ 'box-shadow': $q.screen.gt.md }"
          class="column full-width border-radius gap-6 px-lg-8 py-lg-10 pa-xs-10"
        >
          <div style="opacity: 0.8" class="subtitle-text mb-2">
            Состав заказа
          </div>
          <template v-for="(item, index) in $cart.item?.cartItems" :key="index">
            <div class="row body full-width no-wrap py-3">
              <div class="row no-wrap gap-6 col-10 items-center">
                <q-img
                  :src="item.size.image?.thumbnail || $store.images.empty"
                  :height="
                    $q.screen.gt.md ? '65px' : $q.screen.md ? '60px' : '55px'
                  "
                  :width="
                    $q.screen.gt.md ? '65px' : $q.screen.md ? '60px' : '55px'
                  "
                  :style="`min-width: ${
                    $q.screen.gt.md ? '65px' : $q.screen.md ? '60px' : '55px'
                  }`"
                  fit="cover"
                  class="border-radius"
                  :class="{ dimmed: item.isDead }"
                >
                  <template v-slot:error>
                    <span>
                      <q-img
                        class="user-image"
                        fit="cover"
                        :style="`min-width: ${
                          $q.screen.gt.md
                            ? '65px'
                            : $q.screen.md
                              ? '60px'
                              : '55px'
                        }`"
                        :width="
                          $q.screen.gt.md
                            ? '65px'
                            : $q.screen.md
                              ? '60px'
                              : '55px'
                        "
                        :height="
                          $q.screen.gt.md
                            ? '65px'
                            : $q.screen.md
                              ? '60px'
                              : '55px'
                        "
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
          <div
            v-if="$cart.item.type === CartType.DELIVERY"
            class="row full-width justify-between"
          >
            <div class="body bold">Стоимость доставки</div>
            <div class="body bold">
              {{ beautifyNumber($cart.item?.deliveryPrice, true) }} ₽
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
    <div
      v-if="$q.screen.lt.lg"
      class="full-width bg-background-color mt-xs-20"
      style="position: sticky; bottom: 0; left: 0"
    >
      <q-separator color="divider-color" class="full-width" />
      <div
        class="row full-width gap-md-10 gap-xs-8 no-wrap py-md-15 py-xs-8 items-center text-on-background-color"
      >
        <div v-if="$q.screen.gt.sm" class="header3 bold px-md-20 px-xs-10">
          Сумма {{ beautifyNumber($cart.item?.discountedTotalSum, true) }} ₽
        </div>
        <div v-else class="column pl-5">
          <div class="header3 bold">
            {{ beautifyNumber($cart.item?.discountedTotalSum, true) }} ₽
          </div>
          <div>
            {{ mobileViewSelectedTime }}
          </div>
        </div>
        <CButton
          :label="$q.screen.lt.md ? 'Оформить заказ' : 'Оплатить'"
          :height="$q.screen.md ? '44px' : $q.screen.lt.md ? '40px' : '48px'"
          class="col-grow body"
          @click="paymentUrl ? (paymentModal = true) : makeAnOrder()"
          :loading="loading"
          :disabled="!isArrangeAvailable"
        />
      </div>
    </div>
  </div>
  <div class="row items-center pt-20 gap-7" v-else>
    <ArrangementOrderingBackButton />
    <div class="header3 bold">Корзина пуста</div>
  </div>

  <div v-if="$route.query.paymentUrl && !$cart.item" class="mt-15">
    <CButton
      label="Открыть окно для оплаты заказа"
      @click="paymentModal = true"
    />
  </div>
  <SelectPaymentTypeModal
    :types="paymentTypes"
    v-model="selectedPaymentTypeModal"
    :current-type="selectedPaymentType"
    @select="selectedPaymentType = $event"
  />
  <DeliveryAddressesModal
    @address-selected="changeDeliveryAddress($event)"
    v-model="deliveryAddressesModal"
  />
  <CDialog
    :disable-overflow="$q.platform.is.safari"
    v-model="paymentModal"
    :position="$q.screen.lt.md ? 'bottom' : undefined"
    width="900px"
    :height="`${$q.screen.gt.sm ? `${$q.screen.height * 0.75 > 1150 ? 1150 : $q.screen.height * 0.75}px ` : ''}`"
    no-backdrop-dismiss
    :card-styles="`flex-direction: column; ${$q.screen.lt.md ? `height: ${$q.screen.height * 0.9}px;` : ''}`"
    content-wrapper-styles="flex-grow:1; display: flex"
  >
    <div class="flex" style="flex-grow: 1">
      <iframe
        style="border: 0"
        class="full-width full-height"
        v-if="paymentModal && paymentUrl"
        :src="paymentUrl"
      ></iframe>
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import moment from 'moment'
import CButton from 'src/components/template/buttons/CButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import { AvailableHours, CartType } from 'src/models/carts/cart'
import { cartRepo } from 'src/models/carts/cartRepo'
import {
  Order,
  PaymentObjectType,
  PaymentStatusType,
  PaymentType,
} from 'src/models/order/order'
import {
  beautifyNumber,
  getTimesBetween,
  store,
  totalDayTimes,
} from 'src/models/store'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SelectPaymentTypeModal from './SelectPaymentTypeModal.vue'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { Notify } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import DeliveryAddressesModal from 'src/components/template/dialogs/DeliveryAddressesModal.vue'
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import { deliveryAreaRepo } from 'src/models/deliveryAreas/deliveryAreaRepo'
import { deliveryAddressRepo } from 'src/models/customer/deliveryAddress/deliveryAddressRepo'
import TabPicker from 'src/components/template/buttons/TabPicker.vue'
import RoundedSelector from 'src/components/template/buttons/RoundedSelector.vue'
import { padRepo } from 'src/models/pads/padRepo'
import { orderRepo } from 'src/models/order/orderRepo'
import CDialog from 'components/template/dialogs/CDialog.vue'
import { useEventBus } from '@vueuse/core'
import { orderUpdatedKey } from 'src/services/eventBusKeys'
import ArrangementOrderingBackButton from 'pages/arrangement/ArrangementOrderingBackButton.vue'
import { ecommercePurchase } from 'src/models/ecommerceEvents/ecommerceEvents'

const currentDay = ref('Сегодня')

const eatInsideTabs = [
  {
    label: 'В зале',
    icon: 'fa-regular fa-utensils',
    iconSize: '20px',
  },
  {
    label: 'С собой',
    icon: 'fa-regular fa-person-walking-luggage',
    iconSize: '20px',
  },
]

const availableHours = ref<AvailableHours | null>(null)

const timeBlockMobileSpot = ref<HTMLDivElement>()

const selectedPaymentType = ref<PaymentObjectType | null>(null)

const selectedPaymentTypeModal = ref(false)

const loading = ref(false)

const router = useRouter()
const route = useRoute()

const deliveryAddressesModal = ref(false)

const menu = ref(false)

const menuRef = ref<HTMLDivElement | null>(null)

const paymentUrl = ref<string | null>(null)
const paymentModal = ref(false)

const currentEatInsideTab = computed(() => {
  return cartRepo.item?.eatInside
    ? eatInsideTabs[0].label
    : eatInsideTabs[1].label
})

const clearBeforeRouterResolve = router.afterEach(() => {
  checkOnPaymentUrlInPath()
})

const changeEatInside = async (val: string) => {
  try {
    if (!cartRepo.item) throw new Error('Object is null')
    cartRepo.item.eatInside = val === 'В зале'
    await cartRepo.setParams({
      eat_inside: cartRepo.item.eatInside,
    })
  } catch {
    Notify.create({
      message: 'Ошибка при задании параметров корзины',
      color: 'danger',
    })
  }
}

const checkOnPaymentUrlInPath = () => {
  if (route.query.paymentUrl) {
    paymentUrl.value = String(route.query.paymentUrl)
    void nextTick(() => {
      paymentModal.value = true
    })
  }
}

onBeforeUnmount(() => {
  if (clearBeforeRouterResolve) clearBeforeRouterResolve()
})

const mobileViewSelectedTime = computed(() => {
  if (!cartRepo.item) return
  return cartRepo.item.deliveryTime
    ? cartRepo.item.deliveryTime.slice(0, 5) +
        ' ' +
        cartRepo.item.deliveryTime.slice(11, 16)
    : '~ 10 мин'
})

const isArrangeAvailable = computed(() => {
  return (
    !!selectedPaymentType.value &&
    cartRepo.item?.cartItems.every(
      (v) =>
        !v.isDead &&
        (v.availableQuantity ? v.quantity <= v.availableQuantity : true),
    )
  )
})

const isDelivery = computed(() => {
  return cartRepo.item?.type === CartType.DELIVERY
})

const orderTypeText = computed(() => {
  if (cartRepo.item?.type === CartType.TABLE) return 'Заказ в стол'
  return `Заказ на ${isDelivery.value ? 'доставку' : 'самовывоз'}`
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

const paymentTypes = computed(() => {
  const result: PaymentObjectType[] = []

  if (salesPointRepo.paymentSettings?.cash_enabled)
    result.push({
      label: 'Наличными при получении',
      type: PaymentType.CASH,
      class: 'bg-cash-button-color text-on-cash-button-color',
      icon: 'fa-light fa-money-bill',
    })
  if (salesPointRepo.paymentSettings?.card_enabled)
    result.push({
      label: 'Картой при получении',
      type: PaymentType.CARD,
      class: 'bg-card-button-color text-on-card-button-color',
      icon: 'fa-light fa-credit-card',
    })
  if (salesPointRepo.paymentSettings?.online_payment_enabled)
    result.push({
      label: 'Онлайн',
      type: PaymentType.ONLINE,
      class: 'bg-online-button-color text-on-online-button-color',
      icon: 'fa-light fa-ruble-sign',
    })
  return result
})

watch(
  () => menu.value,
  (v) => {
    if (v) {
      setTimeout(() => {
        if (!availableTimes.value || !menuRef.value) return
        const foundTimeElement = menuRef.value.getElementsByClassName(
          availableTimes.value[0],
        )
        if (foundTimeElement) {
          foundTimeElement[0].scrollIntoView()
        }
      }, 0)
    }
  },
)

const selectClosestTime = async () => {
  if (!cartRepo.item) return
  cartRepo.item.deliveryTime = null
  await cartRepo.setParams({
    delivery_time: cartRepo.item?.deliveryTime
      ? moment(cartRepo.item?.deliveryTime, 'DD.MM.YYYY HH:mm')
          .utc()
          .format('YYYY-MM-DD HH:mm:ss')
      : null,
  })
}

const setDeliveryTime = async (v: string | null) => {
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
  await cartRepo.setParams({
    delivery_time: cartRepo.item?.deliveryTime
      ? moment(cartRepo.item?.deliveryTime, 'DD.MM.YYYY HH:mm')
          .utc()
          .format('YYYY-MM-DD HH:mm:ss')
      : null,
  })
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
      pad: store.qrData?.data?.pad?.id || store.qrMenuData?.pad.id || undefined,
      sales_point: store.qrMenuData?.pad.salesPoint?.id,
      type: cartRepo.item?.type,
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
      extra_data: {
        system_source: 'website',
      },
      pad: store.tableMode
        ? padRepo.item?.id
        : store.qrData
          ? store.qrData.data?.pad?.id
          : undefined,
    })
    if (order.paymentUrl) {
      await router.replace({
        name: String(route.name),
        query: { paymentUrl: order.paymentUrl },
      })
      paymentUrl.value = order.paymentUrl
      paymentModal.value = true
    } else {
      void onOrderPaid(order)
    }
  } catch (e) {
    console.log(e)
    cartRepo.arrangeLoading = false
    Notify.create({
      message: 'Ошибка при оформлении заказа',
      color: 'danger',
    })
  } finally {
    if (cartRepo.item) {
      void ecommercePurchase(cartRepo.item)
    }
    loading.value = false
  }
}

const onOrderPaid = async (order: Order) => {
  paymentModal.value = false
  setTimeout(async () => {
    if (store.qrData && store.qrData.data?.pad) {
      await cartRepo.current(
        store.qrData.data?.salesPoint?.id,
        store.qrData.data?.pad?.id,
      )
      void router.push({
        name: 'successOrderPage',
        params: {
          orderId: order.id,
        },
      })
    } else if (store.tableMode) {
      void router.push({
        name: 'myQrMenuOrders',
      })
      await cartRepo.current(
        padRepo.item?.salesPoint?.id,
        padRepo.item?.id || undefined,
      )
    } else {
      cartRepo.item = null
      void router.push({
        name: 'successOrderPage',
        params: {
          orderId: order.id,
        },
      })
    }
  }, 350)

  Notify.create({
    message: 'Заказ успешно оформлен',
  })
  orderRepo.item = order
}

const changeDeliveryAddress = async (address: DeliveryAddress) => {
  if (address.id === cartRepo.item?.deliveryAddress?.id) {
    deliveryAddressesModal.value = false
    return
  }
  const res = await deliveryAreaRepo.byCoords([
    address.coords?.latitude || 0,
    address.coords?.longitude || 0,
  ])
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
      type: CartType.DELIVERY,
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

watch(selectedPaymentTypeModal, async (v) => {
  if (v) {
    await salesPointRepo.getAvailablePayments(cartRepo.item?.salesPoint.id)
    const foundOnlinePaymentType = paymentTypes.value.find(
      (v) => v.type === PaymentType.ONLINE,
    )
    if (
      selectedPaymentType.value?.type === PaymentType.ONLINE &&
      !foundOnlinePaymentType
    ) {
      if (paymentTypes.value.length)
        selectedPaymentType.value = paymentTypes.value[0]
      else selectedPaymentType.value = null
    }
  }
})

onMounted(async () => {
  checkOnPaymentUrlInPath()
  useEventBus(orderUpdatedKey).on(({ order }) => {
    if (order.paymentStatus == PaymentStatusType.FULL_PAID) {
      paymentModal.value = false
      onOrderPaid(order)
    }
  })
  void cartRepo.getAvailableHours(cartRepo.item?.salesPoint.id).then((res) => {
    availableHours.value = res
  })
  void deliveryAddressRepo.list()

  await salesPointRepo.getAvailablePayments(cartRepo.item?.salesPoint.id)
  const foundOnlinePaymentType = paymentTypes.value.find(
    (v) => v.type === PaymentType.ONLINE,
  )
  if (foundOnlinePaymentType) {
    selectedPaymentType.value = foundOnlinePaymentType
  } else {
    selectedPaymentType.value = paymentTypes.value[0]
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

.dimmed {
  filter: grayscale(90%);
}

.selected-time {
  border: 2px var(--primary) solid;
}

.bordered-block {
  outline: 1px var(--secondary) solid;
}
</style>
