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
            ref="timeBlockMobileSpot"
            class="full-width mb-2"
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
              class="bg-input-color border-radius2 items-center text-on-input-color row justify-between px-6 py-5 row no-wrap col gap-10"
              style="min-height: 48px"
            >
              <div>{{ $cart.item?.currentAddress }}</div>
            </div>
          </div>
          <teleport
            v-if="
              $cart.item.type !== CartType.TABLE &&
              !$salesPoint.item?.settings
                .allow_order_arrangement_without_delivery_time &&
              !$store.qrMenuData
            "
            :disabled="$q.screen.gt.sm || !timeBlockMobileSpot"
            :to="timeBlockMobileSpot"
          >
            <div
              :class="$q.screen.lt.md ? 'column' : 'row items-center'"
              class="body full-width gap-5"
            >
              <div v-if="$q.screen.gt.sm" class="col-4">Время доставки</div>
              <div
                :class="$q.screen.lt.md ? 'full-width' : 'col'"
                class="row gap-md-8 gap-xs-6 text-on-input-color"
              >
                <div
                  :class="[
                    !$cart.item.deliveryTime
                      ? 'selected-element'
                      : { 'bordered-block': $q.screen.lt.md },
                    $q.screen.lt.md
                      ? 'column gap-8'
                      : 'row justify-between   gap-10',
                  ]"
                  :style="
                    $uiSettings.item?.inputType === 'outlined'
                      ? 'border: 1px #ededed solid'
                      : ''
                  "
                  class="border-radius2 cursor-pointer bg-input-color px-6 py-5 row no-wrap col"
                  style="min-height: 48px; height: inherit"
                  @click="selectClosestTime()"
                >
                  <template v-if="$q.screen.gt.sm">
                    <div class="column gap-2">
                      <div>Ближайшая</div>
                      <div>
                        {{ $cart.item.closestTimeText }}
                      </div>
                    </div>
                    <CIcon
                      class="cursor-pointer"
                      color="secondary"
                      name="fa-regular fa-clock"
                      size="20px"
                    />
                  </template>
                  <template v-else>
                    <RoundedSelector
                      :model-value="!$cart.item.deliveryTime"
                      check
                      height="24px"
                      width="24px"
                    />
                    <div class="column full-width gap-2">
                      <div class="bold body">Как можно скорее</div>
                      <div class="body">
                        {{ $cart.item.closestTimeText }}
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
                  :class="[
                    $cart.item.deliveryTime
                      ? 'selected-element'
                      : { 'bordered-block': $q.screen.lt.md },
                    $q.screen.lt.md
                      ? 'column gap-8'
                      : 'row justify-between  gap-10',
                  ]"
                  :style="
                    $uiSettings.item?.inputType === 'outlined'
                      ? 'border: 1px #ededed solid'
                      : ''
                  "
                  class="border-radius2 cursor-pointer bg-input-color px-6 py-5 no-wrap col"
                  style="min-height: 48px; height: inherit"
                >
                  <template v-if="$q.screen.gt.sm">
                    <div class="column gap-2">
                      <div>{{ 'Ко времени' }}</div>
                      <div>
                        {{ $cart.item.deliveryTime || 'Выберите время' }}
                      </div>
                    </div>
                    <CIcon
                      class="cursor-pointer"
                      color="secondary"
                      name="fa-regular fa-calendar-clock"
                      size="20px"
                    />
                  </template>
                  <template v-else>
                    <RoundedSelector
                      :model-value="!!$cart.item.deliveryTime"
                      check
                      height="24px"
                      width="24px"
                    />
                    <div class="column full-width gap-2">
                      <div class="bold body">Ко времени</div>
                      <div class="body">
                        {{ $cart.item.deliveryTime || 'Выберите время' }}
                      </div>
                    </div>
                  </template>
                  <q-menu
                    v-if="availableArrangementDays.length"
                    v-model="menu"
                    :fit="
                      $q.screen.gt.sm && availableArrangementDays.length < 3
                    "
                    :style="`width: ${availableArrangementDays.length < 3 ? ($q.screen.lt.md ? '250px' : '') : '100%'}`"
                    class="pa-6"
                    max-width="350px"
                    style="overflow-y: hidden"
                  >
                    <TabPicker
                      :model-value="currentDayType"
                      :tabs="availableArrangementDays"
                      gap="2"
                      width="100%"
                      @update-tab="selectCurrentDayType($event)"
                    />
                    <div
                      ref="menuRef"
                      class="column no-wrap full-width"
                      style="overflow-y: scroll; max-height: 40dvh"
                    >
                      <template
                        v-if="currentDayType !== 'Выбрать' || currentDayDate"
                      >
                        <div
                          v-for="(el, index) in totalDayTimes()"
                          :key="index"
                          :class="[
                            el,
                            {
                              'bold selected-time border-radius2':
                                el === $cart.item.deliveryTime?.slice(11, 16),
                            },
                          ]"
                          :style="
                            !availableTimes?.includes(el)
                              ? 'opacity: 0.5; cursor: not-allowed !important'
                              : ''
                          "
                          class="full-width body cursor-pointer pa-6 time-row"
                          @click="setDeliveryTime(el)"
                        >
                          {{ el }}
                        </div>
                      </template>
                      <q-date
                        v-else
                        v-model="currentDayDate"
                        :options="getDateOptions"
                        flat
                        mask="YYYY-MM-DD"
                        minimal
                        style="width: 100%"
                        @update:model-value="loadDateAvailableHours()"
                      ></q-date>
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
              :loading="$cart.setParamsLoading"
              :model-value="comment"
              :readonly="$cart.setParamsLoading"
              auto-grow
              class="col"
              height="fit-content"
              placeholder="Напишите ваши пожелания"
              @update:model-value="comment = $event || null"
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
              class="body border-radius2 bg-input-color text-on-input-color row justify-between items-center px-6 py-5 row no-wrap col gap-10"
              style="min-height: 48px"
              @click="selectedPaymentTypeModal = true"
            >
              <div class="gap-4 row items-center no-wrap">
                <q-icon :name="$cart.selectedPaymentType?.icon" size="20px" />
                {{ $cart.selectedPaymentType?.label }}
              </div>
              <CButton
                v-if="$q.screen.gt.sm"
                class="body pr-5"
                label="Изменить"
                text-button
                text-color="primary"
              />
              <CIcon
                v-else
                class="cursor-pointer"
                color="on-input-color"
                hover-color="primary"
                name="fa-regular fa-angle-right"
                size="24px"
                @click="selectedPaymentTypeModal = true"
              />
            </div>
          </div>
          <div
            v-if="
              $cart.item.type !== CartType.TABLE &&
              $cart.item.type !== CartType.DELIVERY &&
              $cart.item.salesPoint.settings.allow_pickup_orders_inside &&
              !$store.qrMenuData
            "
            class="row full-width gap-md-5 gap-xs-4"
          >
            <div v-if="$q.screen.gt.sm" class="col-md-4"></div>
            <div class="col-grow">
              <TabPicker
                :model-value="currentEatInsideTab"
                :tabs="eatInsideTabs"
                width="100%"
                @update-tab="changeEatInside($event)"
              />
            </div>
          </div>
        </div>
        <div v-if="$q.screen.gt.md" class="row full-width gap-10 mt-25">
          <CButton
            class="col body"
            color="secondary-button-color"
            height="48px"
            label="Назад"
            text-color="on-secondary-button-color"
            @click="
              $router.push({
                name: 'home',
              })
            "
          />

          <CButton
            :disabled="!isArrangeAvailable"
            :height="$q.screen.md ? '44px' : $q.screen.lt.md ? '40px' : '48px'"
            :loading="loading || $cart.setParamsLoading"
            class="col body"
            label="Оформить"
            @click="arrangeClickHandler()"
          />
        </div>
      </div>
      <div
        v-if="
          $store.qrMenuData?.settings.authorization_type ===
          QrMenuAuthType.PHONE_NUMBER
        "
        :class="$q.screen.lt.md ? 'column' : 'row items-center'"
        class="body full-width gap-md-5 gap-xs-4 mt-12"
      >
        <div :class="{ bold: $q.screen.lt.md }" class="col-md-4">
          Номер телефона
        </div>
        <CInput
          v-model="qrMenuUserPhone"
          :rules="[
            (v) => [0, 10].includes(v.length) || 'Некорректный номер телефона',
          ]"
          class="border-radius2"
          default
          mask="+7 (###) ###-##-##"
          unmasked-value
        />
        <div class="helper-text mt-8">
          Укажите, чтобы получить уведомление о готовности заказа
        </div>
      </div>
      <div
        class="pl-lg-30 col-lg-5 col-xs-12 mt-md-20 mt-xs-10 mt-lg-0 pb-md-20 pb-lg-0"
      >
        <div
          :class="{ 'box-shadow': $q.screen.gt.md }"
          :style="
            $companyGroup.item?.externalId === 'corex_demo'
              ? 'border: 1px #f5f5f5 solid'
              : ''
          "
          class="column full-width border-radius gap-6 px-lg-8 py-lg-10 pa-md-10 pa-xs-6"
        >
          <template v-if="$q.screen.gt.sm">
            <div class="subtitle-text mb-2" style="opacity: 0.8">
              Состав заказа
            </div>
            <template v-for="(item, index) in $cart.item?.cartItems" :key="index">
              <div class="row body full-width no-wrap py-3">
                <div class="row no-wrap gap-6 col-10 items-center">
                  <q-img
                    :class="{ dimmed: item.isDead }"
                    :height="
                    $q.screen.gt.md ? '65px' : $q.screen.md ? '60px' : '55px'
                  "
                    :src="item.size.image?.thumbnail || $store.images.empty"
                    :style="`min-width: ${
                    $q.screen.gt.md ? '65px' : $q.screen.md ? '60px' : '55px'
                  }`"
                    :width="
                    $q.screen.gt.md ? '65px' : $q.screen.md ? '60px' : '55px'
                  "
                    class="border-radius cursor-pointer"
                    fit="cover"
                    @click="openMenuItemModal(item)"
                    @contextmenu.prevent
                  >
                    <template v-slot:error>
                    <span>
                      <q-img
                        :height="
                          $q.screen.gt.md
                            ? '65px'
                            : $q.screen.md
                              ? '60px'
                              : '55px'
                        "
                        :src="$store.images.empty"
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
                        class="user-image"
                        fit="cover"
                      ></q-img>
                    </span>
                    </template>
                  </q-img>
                  <div class="column gap-1">
                    <div class="ellipsis-2-lines">
                      {{ item.size.name }}
                    </div>
                    <div
                      v-if="item.cartItemModifiers.length"
                      class="secondary-text text-on-background-color"
                    >
                      {{
                        item.cartItemModifiers
                          .map(
                            (v) =>
                              `${v.modifier?.name}${
                                v.quantity > 1 ? ' x ' + v.quantity : ''
                              }`
                          )
                          .join(', ')
                      }}
                    </div>
                    <div style="opacity: 0.6">{{ item.quantity }} шт</div>
                  </div>
                </div>
                <div class="col-2 column items-end no-wrap">
                  <div
                    v-if="item.totalSum !== item.discountedTotalSum"
                    class="text-strike"
                    style="opacity: 0.5"
                  >
                    {{ beautifyNumber(item.totalSum, true) }} ₽
                  </div>
                  <div>{{ beautifyNumber(item.discountedTotalSum, true) }} ₽</div>
                </div>
              </div>
            </template>
            <q-separator color="divider-color" />
          </template>
          <OrderTotalInfo :item="$cart.item" />
        </div>
      </div>
    </div>
    <div
      v-if="$q.screen.lt.lg"
      class="full-width bg-background-color mt-xs-20"
      style="position: sticky; bottom: 0; left: 0"
    >
      <q-separator class="full-width" color="divider-color" />
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
        </div>
        <CButton
          :disabled="!isArrangeAvailable"
          :height="$q.screen.md ? '44px' : $q.screen.lt.md ? '40px' : '48px'"
          :label="$q.screen.lt.md ? 'Оформить заказ' : 'Оплатить'"
          :loading="loading"
          class="col-grow body"
          @click="arrangeClickHandler()"
        />
      </div>
    </div>
  </div>
  <div v-else class="row items-center pt-20 gap-7">
    <ArrangementOrderingBackButton />
    <div class="header3 bold">Корзина пуста</div>
  </div>
  <SelectPaymentTypeModal
    v-model="selectedPaymentTypeModal"
    :current-type="$cart.selectedPaymentType"
    :types="paymentTypes"
    @select="paymentTypeSelectHandler($event)"
  />
  <DeliveryAddressesModal
    v-model="deliveryAddressesModal"
    @address-selected="changeDeliveryAddress($event)"
  />
  <OrderTimeWarning
    v-model="timeWarningModal"
    @accept="(timeWarningModal = false), makeAnOrder()"
  />
</template>
<script lang="ts" setup>
import moment from 'moment'
import CButton from 'src/components/template/buttons/CButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import { AvailableHours, CartType } from 'src/models/carts/cart'
import { cartRepo } from 'src/models/carts/cartRepo'
import { Order, PaymentObjectType, PaymentType } from 'src/models/order/order'
import {
  beautifyNumber,
  getTimesBetween,
  store,
  totalDayTimes
} from 'src/models/store'
import { computed, onMounted, ref, watch } from 'vue'
import SelectPaymentTypeModal from './SelectPaymentTypeModal.vue'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { SessionStorage } from 'quasar'
import { useRouter } from 'vue-router'
import DeliveryAddressesModal from 'src/components/template/dialogs/DeliveryAddressesModal.vue'
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import { deliveryAreaRepo } from 'src/models/deliveryAreas/deliveryAreaRepo'
import { deliveryAddressRepo } from 'src/models/customer/deliveryAddress/deliveryAddressRepo'
import TabPicker from 'src/components/template/buttons/TabPicker.vue'
import RoundedSelector from 'src/components/template/buttons/RoundedSelector.vue'
import { padRepo } from 'src/models/pads/padRepo'
import { orderRepo } from 'src/models/order/orderRepo'
import ArrangementOrderingBackButton from 'pages/arrangement/ArrangementOrderingBackButton.vue'
import { ecommercePurchase } from 'src/models/ecommerceEvents/ecommerceEvents'
import { CartItem } from 'src/models/carts/cartItem/cartItem'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import { menuRulesForAddingRepo } from 'src/models/menu/menuItem/menuRulesForAdding/menuRulesForAddingRepo'
import { QrMenuAuthType } from 'src/models/qrMenuSettings/qrMenuSettingsRepo'
import { notifier } from 'src/services/notifier'
import { cloneDeep } from 'lodash'
import OrderTimeWarning from 'pages/arrangement/OrderTimeWarning.vue'
import OrderTotalInfo from 'pages/arrangement/OrderTotalInfo.vue'

const currentDayType = ref('Сегодня')
const currentDayDate = ref<string | null>(null)
const timeWarningModal = ref(false)

const eatInsideTabs = [
  {
    label: 'В зале',
    icon: 'fa-regular fa-utensils',
    iconSize: '20px'
  },
  {
    label: 'С собой',
    icon: 'fa-regular fa-person-walking-luggage',
    iconSize: '20px'
  }
]
const availableHours = ref<AvailableHours | null>(null)
const initialAvailableHours = ref<AvailableHours | null>(null)
const timeBlockMobileSpot = ref<HTMLDivElement>()
const selectedPaymentTypeModal = ref(false)
const loading = ref(false)
const router = useRouter()
const deliveryAddressesModal = ref(false)
const menu = ref(false)
const menuRef = ref<HTMLDivElement | null>(null)
const qrMenuUserPhone = ref<string | null>(
  SessionStorage.getItem('qrMenuUserPhone') || '7'
)

const comment = ref<string | null>(null)

const availableArrangementDays = computed(() => {
  const datePickerConf = salesPointRepo.item?.settings.delivery_date_picker
  if (datePickerConf) {
    let totalDayTypes = [
      {
        label: 'Сегодня'
      },
      {
        label: 'Завтра'
      },
      {
        label: currentDayDate.value
          ? moment(currentDayDate.value).format('DD.MM')
          : 'Выбрать',
        iconRight: 'fa-regular fa-calendar',
        force: currentDayType.value === 'Выбрать' || !!currentDayDate.value
      }
    ]
    if (datePickerConf.end_offset) {
      totalDayTypes = totalDayTypes.slice(0, datePickerConf.end_offset)
      if (datePickerConf.end_offset < datePickerConf.start_offset) {
        return totalDayTypes
      }
    }
    if (datePickerConf.start_offset) {
      totalDayTypes = totalDayTypes.slice(datePickerConf.start_offset)
    }
    if (!datePickerConf.end_offset && !datePickerConf.start_offset) {
      totalDayTypes = []
    }
    return totalDayTypes
  } else {
    return ['Сегодня', 'Завтра']
  }
})

const currentEatInsideTab = computed(() => {
  return cartRepo.item?.eatInside
    ? eatInsideTabs[0].label
    : eatInsideTabs[1].label
})

const isArrangeAvailable = computed(() => {
  return (
    !!cartRepo.selectedPaymentType &&
    cartRepo.item?.cartItems.every(
      (v) =>
        !v.isDead &&
        (v.availableQuantity ? v.quantity <= v.availableQuantity : true)
    )
  )
})

const isDelivery = computed(() => {
  return cartRepo.item?.type === CartType.DELIVERY
})

const orderTypeText = computed(() => {
  if (store.qrMenuData) return 'Оформление заказа'
  return `Заказ на ${isDelivery.value ? 'доставку' : 'самовывоз'}`
})

const availableTimes = computed(() => {
  return currentDayType.value === 'Сегодня' ||
  currentDayType.value === 'Выбрать'
    ? availableHours.value?.today.flatMap((v) => {
      return getTimesBetween(v.start.slice(11, 16), v.end.slice(11, 16))
    })
    : availableHours.value?.tomorrow.flatMap((v) => {
      return getTimesBetween(v.start.slice(11, 16), v.end.slice(11, 16))
    })
})

const paymentTypes = computed(() => {
  return salesPointRepo.paymentTypes
})

const currentPaymentService = computed(() => {
  return cartRepo.selectedPaymentType?.type === PaymentType.CASH ||
  cartRepo.selectedPaymentType?.type === PaymentType.PAY_LATER
    ? undefined
    : cartRepo.selectedPaymentType?.type === PaymentType.CARD
      ? 'card'
      : 'web_form'
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

watch(selectedPaymentTypeModal, async (v) => {
  if (v) {
    await salesPointRepo.getAvailablePayments(cartRepo.item?.salesPoint.id)
    const foundOnlinePaymentType = paymentTypes.value.find(
      (v) => v.type === PaymentType.ONLINE
    )
    if (
      cartRepo.selectedPaymentType?.type === PaymentType.ONLINE &&
      !foundOnlinePaymentType
    ) {
      if (paymentTypes.value.length)
        cartRepo.selectedPaymentType = paymentTypes.value[0]
      else cartRepo.selectedPaymentType = null
    }
  }
})

const paymentTypeSelectHandler = async (type: PaymentObjectType) => {
  if (!cartRepo.item) return
  cartRepo.selectedPaymentType = type
  const result = await cartRepo.computeFinallySum({
    payment_type: cartRepo.selectedPaymentType.type,
    payment_service: currentPaymentService.value
  })
  cartRepo.item.discountedTotalSum = result.finally_sum
  cartRepo.item.fee = result.fee
}

const loadDateAvailableHours = async () => {
  if (!currentDayDate.value) return
  const date = moment(currentDayDate.value).format('YYYY-MM-DD')
  availableHours.value = await salesPointRepo.getAvailableWorkingHours(
    date,
    cartRepo.item?.salesPoint.id
  )
}

const getDateOptions = (date: string) => {
  return (
    date >= moment().add(2, 'day').format('YYYY/MM/DD') &&
    date <=
    moment()
      .add(
        salesPointRepo.item?.settings.delivery_date_picker?.end_offset,
        'day'
      )
      .format('YYYY/MM/DD')
  )
}

const selectCurrentDayType = (v: string) => {
  currentDayDate.value = null
  if (!['Сегодня', 'Завтра', 'Выбрать'].includes(v)) {
    currentDayType.value = 'Выбрать'
  } else {
    currentDayType.value = v
    availableHours.value = initialAvailableHours.value
  }
}

const openMenuItemModal = async (item: CartItem) => {
  if (!item.size.menu_item) return
  store.openMenuItemModal()
  await menuItemRepo.retrieve(item.size.menu_item, {
    sales_point: salesPointRepo.item?.id
  })
  await menuRulesForAddingRepo.list({
    menu_item: menuItemRepo.item?.id
  })
}

const changeEatInside = async (val: string) => {
  try {
    if (!cartRepo.item) {
      throw new Error('Object is null')
    }
    cartRepo.item.eatInside = val === 'В зале'
    await cartRepo.setParams({
      eat_inside: cartRepo.item.eatInside
    })
  } catch {
    notifier.error('Ошибка при задании параметров корзины')
  }
}

const selectClosestTime = async () => {
  if (!cartRepo.item) return
  cartRepo.item.deliveryTime = null
  await cartRepo.setParams({
    delivery_time: cartRepo.item?.deliveryTime
      ? moment(cartRepo.item?.deliveryTime, 'DD.MM.YYYY HH:mm')
        .utc()
        .format('YYYY-MM-DD HH:mm:ss')
      : null
  })
}

const setDeliveryTime = async (v: string | null) => {
  if (!cartRepo.item) return
  if (v && !availableTimes.value?.includes(v)) return
  const today = moment().format('DD.MM.YYYY')
  const tomorrow = moment().add(1, 'day').format('DD.MM.YYYY')
  if (currentDayType.value === 'Сегодня') {
    cartRepo.item.deliveryTime = [today, v].join(' ')
  } else if (currentDayType.value === 'Завтра') {
    cartRepo.item.deliveryTime = [tomorrow, v].join(' ')
  } else {
    cartRepo.item.deliveryTime = [
      moment(currentDayDate.value).format('DD.MM.YYYY'),
      v
    ].join(' ')
  }
  menu.value = false
  await cartRepo.setParams({
    delivery_time: cartRepo.item?.deliveryTime
      ? moment(cartRepo.item?.deliveryTime, 'DD.MM.YYYY HH:mm')
        .utc()
        .format('YYYY-MM-DD HH:mm:ss')
      : null
  })
}

const arrangeClickHandler = async () => {
  if (!cartRepo.item) return
  const diffHours = moment(cartRepo.item.deliveryTime || cartRepo.item.closestDate, 'DD.MM.YYYY HH:mm').diff(moment(), 'hours')
  const mustBeConfirmedIfMoreThenHours = salesPointRepo.item?.settings.delivery_date_picker?.must_be_confirmed_if_more_then_hours || 3
  if (diffHours > mustBeConfirmedIfMoreThenHours) {
    timeWarningModal.value = true
  } else {
    await makeAnOrder()
  }
}

const makeAnOrder = async () => {
  try {
    let phoneToSend: string | null = null
    if (qrMenuUserPhone.value?.length === 10) {
      SessionStorage.set('qrMenuUserPhone', qrMenuUserPhone.value)
      phoneToSend = qrMenuUserPhone.value.startsWith('7')
        ? qrMenuUserPhone.value
        : `7${qrMenuUserPhone.value}`
    } else {
      SessionStorage.remove('qrMenuUserPhone')
    }
    loading.value = true
    const status = await salesPointRepo.status(cartRepo.item?.salesPoint.id)
    if (!status) {
      notifier.error('В данный момент невозможно оформить заказ')
      return
    }
    const order = await cartRepo.arrange({
      sales_point: cartRepo.item?.salesPoint.id,
      payment_data: {
        type: cartRepo.selectedPaymentType?.type,
        payment_service: currentPaymentService.value
      },
      comment: comment.value,
      extra_data: {
        system_source: store.qrMenuData ? 'qr_menu' : 'website'
      },
      pad: store.tableMode
        ? padRepo.item?.id
        : store.qrData
          ? store.qrData.data?.pad?.id
          : undefined,
      phone: phoneToSend || undefined
    })
    void onOrderPaid(order)
  } catch (e) {
    console.log(e)
    cartRepo.arrangeLoading = false
    notifier.error('Ошибка при оформлении заказа')
  } finally {
    if (cartRepo.item) {
      void ecommercePurchase(cartRepo.item)
    }
    loading.value = false
  }
}

const onOrderPaid = async (order: Order) => {
  setTimeout(async () => {
    if (store.qrData && store.qrData.data?.pad) {
      await cartRepo.current(
        store.qrData.data?.salesPoint?.id,
        store.qrData.data?.pad?.id
      )
      void router.replace({
        name: 'successOrderPage',
        params: {
          orderId: order.id
        },
        query: order.paymentUrl ? { paymentUrl: order.paymentUrl } : undefined
      })
    } else if (store.tableMode) {
      void router.replace({
        name: 'myQrMenuOrders',
        query: order.paymentUrl ? { paymentUrl: order.paymentUrl } : undefined
      })
      await cartRepo.current(
        padRepo.item?.salesPoint?.id,
        padRepo.item?.id || undefined
      )
    } else {
      cartRepo.item = null
      void router.replace({
        name: 'successOrderPage',
        params: {
          orderId: order.id
        },
        query: order.paymentUrl ? { paymentUrl: order.paymentUrl } : undefined
      })
    }
  }, 350)
  notifier.success('Заказ успешно оформлен')
  orderRepo.item = order
}

const changeDeliveryAddress = async (address: DeliveryAddress) => {
  if (address.id === cartRepo.item?.deliveryAddress?.id) {
    deliveryAddressesModal.value = false
    return
  }
  const res = await deliveryAreaRepo.byCoords([
    address.coords?.latitude || 0,
    address.coords?.longitude || 0
  ])
  if (!res.length) {
    notifier.error('По данному адресу не осуществляется доставка')
    deliveryAddressesModal.value = false
    return
  }
  try {
    await cartRepo.setParams({
      sales_point: res[0].salesPoint,
      type: CartType.DELIVERY,
      delivery_address: address.id
    })
  } catch {
    notifier.error('Ошибка')
  } finally {
    deliveryAddressesModal.value = false
  }
}

onMounted(async () => {
  void cartRepo.getAvailableHours(cartRepo.item?.salesPoint.id).then((res) => {
    availableHours.value = res
    initialAvailableHours.value = cloneDeep(res)
  })
  void deliveryAddressRepo.list()
  await salesPointRepo.getAvailablePayments(cartRepo.item?.salesPoint.id)
  const foundOnlinePaymentType = paymentTypes.value.find(
    (v) => v.type === PaymentType.ONLINE
  )
  if (foundOnlinePaymentType) {
    cartRepo.selectedPaymentType = foundOnlinePaymentType
  } else {
    cartRepo.selectedPaymentType = paymentTypes.value[0]
  }
  const result = await cartRepo.computeFinallySum({
    payment_type: cartRepo.selectedPaymentType.type,
    payment_service: currentPaymentService.value
  })
  if (!cartRepo.item) return
  cartRepo.item.discountedTotalSum = result.finally_sum
  cartRepo.item.fee = result.fee
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
