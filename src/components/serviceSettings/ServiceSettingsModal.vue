<template>
  <CDialog
    :height="modalHeight"
    :hide-close="$q.screen.lt.md"
    :maximize="$q.screen.lt.lg"
    :model-value="modelValue"
    :position="$q.screen.lt.md ? 'bottom' : undefined"
    :width="modalWidth"
    no-padding
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-if="!newAddressMode">
      <div
        v-if="$q.screen.gt.sm"
        class="row full-width no-wrap bg-background-color text-on-background-color border-radius"
      >
        <div
          :class="
            currentTab?.type === CartType.PICKUP ||
            (currentTab?.type === CartType.BOOKING &&
              bookingMode === 'bookingList')
              ? ''
              : 'col-12'
          "
          :style="
            currentTab?.type === CartType.PICKUP ||
            (currentTab?.type === CartType.BOOKING &&
              bookingMode === 'bookingList')
              ? `width: ${$q.screen.md ? '100%' : '47%'} `
              : ''
          "
          class="column py-lg-15 py-xs-10 px-xs-10 px-lg-15"
        >
          <ServiceModalHeader :tab="currentTab">
            <template v-slot:action>
              <CIcon
                v-if="
                  bookingMode === 'tablePicker' ||
                  bookingMode === 'tableDetail' ||
                  bookingMode === 'successBooked'
                "
                class="cursor-pointer"
                hover-color="primary"
                name="fa-regular fa-angle-left"
                size="24px"
                @click="navigationButtonClickHandler()"
              />
            </template>
          </ServiceModalHeader>
          <CButton
            v-if="
              $companyGroup.item && $companyGroup.item?.companies.length > 1
            "
            class="mt-4 body"
            label="Выбрать другое заведение"
            style="width: fit-content"
            text-button
            text-color="secondary-text"
            @click="changeCompany"
          />
          <ServiceSettingsTabPicker
            :model-value="currentTab || undefined"
            :tabs="availableCartTypes"
            class="mt-12 mb-13"
            @update-tab="currentTab = $event"
          />
          <div>
            <DeliveryAddressesTab
              v-if="currentTab?.type === CartType.DELIVERY"
              :current-address="selectedDeliveryAddress"
              @edit="editAddressHandler($event)"
              @select="selectDeliveryAddressHandler($event)"
            >
              <template v-slot:bottom>
                <div class="row full-width gap-6">
                  <CButton
                    :disabled="!selectedDeliveryAddress || !selectedDeliveryAddress.isAddressAvailable"
                    :loading="$cart.setParamsLoading || $store.catalogLoading"
                    class="col body"
                    height="48px"
                    label="Выбрать"
                    @click="confirmSelectedAddress()"
                  />
                  <CButton
                    class="col body"
                    color="secondary-button-color"
                    height="48px"
                    label="Добавить адрес"
                    text-color="on-secondary-button-color"
                    @click="addAddressHandler()"
                  />
                </div>
              </template>
            </DeliveryAddressesTab>
            <PickupAddressesTab
              v-if="currentTab?.type === CartType.PICKUP"
              :current-point="selectedPickupAddress"
              @select="selectedPickupAddress = $event"
            >
              <template v-slot:bottom>
                <CButton
                  :loading="$cart.setParamsLoading || $store.catalogLoading"
                  class="body"
                  height="48px"
                  label="Заберу здесь"
                  width="100%"
                  @click="confirmSelectedAddress()"
                />
              </template>
            </PickupAddressesTab>
            <template v-if="currentTab?.type === CartType.BOOKING">
              <BookingAddressesTab
                v-if="bookingMode === 'bookingList'"
                :current-point="selectedSalesPoint"
                @select="selectedSalesPoint = $event"
              >
                <template v-slot:bottom>
                  <CButton
                    :disabled="!selectedSalesPoint"
                    class="body"
                    height="48px"
                    label="Выбрать"
                    width="100%"
                    @click="bookingMode = 'bookingInfo'"
                  />
                </template>
              </BookingAddressesTab>
              <BookingInfo
                v-if="bookingMode != 'bookingList'"
                :current-mode="bookingMode"
                :sales-point="selectedSalesPoint"
                @close="$emit('update:modelValue', false)"
                @change-booking-mode="bookingMode = $event"
              />
            </template>
            <DeliveryAggregatorTab
              v-if="currentTab?.type === AggregatorType.DELIVERY_CLUB"
              :tab="currentTab"
            />
            <YandexAggregatorTab
              v-if="currentTab?.type === AggregatorType.YANDEX"
              :tab="currentTab"
            />
          </div>
        </div>
        <SalesPointsOnMap
          v-if="
            $q.screen.gt.md &&
            (currentTab?.type === CartType.PICKUP ||
              (currentTab?.type === CartType.BOOKING &&
                bookingMode === 'bookingList'))
          "
          :addresses="currentSalesPoints || []"
          :selected-point="selectedPickupAddress"
          @select="
            currentTab?.type === CartType.DELIVERY
              ? (selectedSalesPoint = $event)
              : (selectedPickupAddress = $event)
          "
        />
      </div>
      <div v-else class="full-height column text-on-background-color">
        <SalesPointsOnMap
          v-if="
            mobileViewTypeConfirmed &&
            (currentTab?.type === CartType.PICKUP ||
              (currentTab?.type === CartType.BOOKING &&
                bookingMode === 'bookingList'))
          "
          :addresses="currentSalesPoints || []"
          :selected-point="selectedPickupAddress"
          @select="
            currentTab?.type === CartType.DELIVERY
              ? (selectedSalesPoint = $event)
              : (selectedPickupAddress = $event)
          "
        />
        <DeliveryTypeSelector
          v-if="!mobileViewTypeConfirmed"
          :current-tab="currentTab"
          :types="availableCartTypes"
          @confirm="mobileViewTypeConfirmed = true"
          @select="currentTab = $event"
        />
        <template v-else>
          <DeliveryAddressesTab
            v-if="currentTab?.type === CartType.DELIVERY"
            :current-address="selectedDeliveryAddress"
            @back="mobileViewTypeConfirmed = false"
            @edit="editAddressHandler($event)"
            @select="selectedDeliveryAddress = $event"
            @add-address="addAddressHandler()"
          >
            <template v-slot:bottom>
              <div class="row full-width gap-6">
                <CButton
                  :disabled="!selectedDeliveryAddress"
                  :height="$q.screen.lt.md ? '40px' : '48px'"
                  :loading="$cart.setParamsLoading || $store.catalogLoading"
                  class="col body"
                  label="Выбрать"
                  @click="confirmSelectedAddress()"
                />
              </div>
            </template>
          </DeliveryAddressesTab>
          <PickupAddressesTab
            v-if="currentTab?.type === CartType.PICKUP"
            :current-point="selectedPickupAddress"
            @back="mobileViewTypeConfirmed = false"
            @select="selectedPickupAddress = $event"
          >
            <template v-slot:bottom>
              <CButton
                :height="$q.screen.lt.md ? '40px' : '48px'"
                :loading="$cart.setParamsLoading || $store.catalogLoading"
                class="subtitle-text"
                label="Заберу здесь"
                width="100%"
                @click="confirmSelectedAddress()"
              />
            </template>
          </PickupAddressesTab>
          <template v-if="currentTab?.type === CartType.BOOKING">
            <BookingAddressesTab
              v-if="bookingMode === 'bookingList'"
              :current-point="selectedSalesPoint"
              @back="mobileViewTypeConfirmed = false"
              @select="selectedSalesPoint = $event"
            >
              <template v-slot:bottom>
                <CButton
                  :disabled="!selectedSalesPoint"
                  :height="$q.screen.lt.md ? '40px' : '48px'"
                  class="subtitle-text col-6"
                  label="Выбрать"
                  width="100%"
                  @click="bookingMode = 'bookingInfo'"
                />
              </template>
            </BookingAddressesTab>
            <BookingInfo
              v-if="bookingMode != 'bookingList'"
              :current-mode="bookingMode"
              :sales-point="selectedSalesPoint"
              @back="navigationButtonClickHandler()"
              @close="$emit('update:modelValue', false)"
              @change-booking-mode="bookingMode = $event"
            />
          </template>
          <DeliveryAggregatorTab
            v-if="currentTab?.type === AggregatorType.DELIVERY_CLUB"
            :tab="currentTab"
            @back="mobileViewTypeConfirmed = false"
          />
          <YandexAggregatorTab
            v-if="currentTab?.type === AggregatorType.YANDEX"
            :tab="currentTab"
            @back="mobileViewTypeConfirmed = false"
          />
        </template>
      </div>
    </template>
    <template v-else>
      <CreateDeliveryAddress
        :address="deliveryAddressToEdit || undefined"
        :back-callback="() => (newAddressMode = false)"
        @created="deliveryAddressCreateHandler($event)"
        @updated="deliveryAddressCreateHandler()"
      />
    </template>
  </CDialog>
</template>
<script lang="ts" setup>
import { CartType } from 'src/models/carts/cart'
import CDialog from '../template/dialogs/CDialog.vue'
import { computed, ref, watch } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { authentication } from 'src/models/authentication/authentication'
import ServiceSettingsTabPicker from './ServiceSettingsTabPicker.vue'
import DeliveryAddressesTab from './DeliveryAddressesTab.vue'
import { deliveryAddressRepo } from 'src/models/customer/deliveryAddress/deliveryAddressRepo'
import { cartRepo } from 'src/models/carts/cartRepo'
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import { SalesPoint } from 'src/models/salesPoint/salesPoint'
import { deliveryAreaRepo } from 'src/models/deliveryAreas/deliveryAreaRepo'
import { useQuasar } from 'quasar'
import { store } from 'src/models/store'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
import ServiceModalHeader from './ServiceModalHeader.vue'
import CreateDeliveryAddress from './CreateDeliveryAddress.vue'
import CButton from '../template/buttons/CButton.vue'
import PickupAddressesTab from './PickupAddressesTab.vue'
import BookingAddressesTab from './BookingAddressesTab.vue'
import SalesPointsOnMap from './SalesPointsOnMap.vue'
import BookingInfo from './BookingInfo.vue'
import CIcon from '../template/helpers/CIcon.vue'
import { AggregatorType } from 'src/models/company/company'
import DeliveryAggregatorTab from './DeliveryAggregatorTab.vue'
import YandexAggregatorTab from './YandexAggregatorTab.vue'
import { menuRepo } from 'src/models/menu/menuRepo'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import DeliveryTypeSelector from './DeliveryTypeSelector.vue'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { notifier } from 'src/services/notifier'

export type TabRaw = {
  label: string | null
  type: string
  link?: string | null
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

export type BookingModes =
  | 'bookingList'
  | 'bookingInfo'
  | 'tablePicker'
  | 'tableDetail'
  | 'successBooked'

const currentTab = ref<TabRaw | null>(null)
const mobileViewTypeConfirmed = ref(false)
const newAddressMode = ref(false)
const selectedDeliveryAddress = ref<DeliveryAddress | null>(null)
const selectedPickupAddress = ref<SalesPoint | null>(null)
const selectedSalesPoint = ref<SalesPoint | null>(null)
const bookingMode = ref<BookingModes>('bookingList')
const deliveryAddressToEdit = ref<DeliveryAddress | null>(null)
const q = useQuasar()

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      void deliveryAddressRepo.list({
        company: companyRepo.item?.id,
        city: companyGroupRepo.item?.cityData.current?.uuid
      }).then(() => {
        selectCurrentTab()
        selectExistingAddress()
        // deliveryAddressRepo.items.forEach((el, index) => {
        //   if (index % 2 === 0)
        //     el.salesPoint = null
        //   else el.salesPoint = '123'
        // })
        // companyRepo.currentCitySalesPoints()?.forEach(el => el.id = '123')
      })
    }
  }
)

const modalWidth = computed(() => {
  return q.screen.lt.md
    ? '450px'
    : newAddressMode.value
      ? '1094px'
      : currentTab.value?.type === CartType.PICKUP ||
      (currentTab.value?.type === CartType.BOOKING &&
        bookingMode.value === 'bookingList')
        ? '1300px'
        : '649px'
})

const modalHeight = computed(() => {
  return q.screen.lt.md &&
  ((currentTab.value?.type === CartType.PICKUP &&
      mobileViewTypeConfirmed.value) ||
    (currentTab.value?.type === CartType.BOOKING &&
      mobileViewTypeConfirmed.value &&
      bookingMode.value === 'bookingList') ||
    newAddressMode.value)
    ? '100vh'
    : 'unset'
})

const currentSalesPoints = computed(() => {
  return currentTab.value?.type === CartType.PICKUP
    ? availablePickupAddresses.value
    : availableBookingAddresses.value
})

const availablePickupAddresses = computed(() => {
  return companyRepo.cartCompany?.salesPoints?.filter(
    (v) => v.settings.pickup_enabled
  )
})

const availableBookingAddresses = computed(() => {
  return companyRepo.cartCompany?.salesPoints?.filter(
    (v) => v.settings.booking_enabled
  )
})

const availableCartTypes = computed(() => {
  const result: TabRaw[] = []
  if (
    companyRepo.cartCompany?.salesPoints?.some(
      (v) => v.settings.delivery_enabled
    )
  ) {
    result.push({
      label: 'Доставка',
      type: CartType.DELIVERY
    })
  }
  if (
    companyRepo.cartCompany?.salesPoints?.some((v) => v.settings.pickup_enabled)
  ) {
    result.push({
      label:
        companyGroupRepo.item?.externalId === 'Onegin'
          ? 'Заказ с собой'
          : 'Самовывоз',
      type: CartType.PICKUP
    })
  }
  if (
    companyRepo.cartCompany?.salesPoints?.some(
      (v) => v.settings.booking_enabled
    ) &&
    authentication.user
  ) {
    result.push({
      label: 'Бронь',
      type: CartType.BOOKING
    })
  }
  if (companyRepo.item)
    companyRepo.item?.deliveryAggregators.forEach((el) => {
      result.push({
        label: el.type === AggregatorType.YANDEX ? 'Яндекс еда' : 'Деливери',
        type: el.type,
        link: el.link
      })
    })
  return result
})

const changeCompany = () => {
  emit('update:modelValue', false)
  store.selectCompanyModal = true
}

const selectDeliveryAddressHandler = (v: DeliveryAddress) => {
  if (v.isAddressAvailable) {
    selectedDeliveryAddress.value = v
  } else {
    notifier.error('Адрес недоступен')
  }
}

const addAddressHandler = () => {
  deliveryAddressToEdit.value = null
  newAddressMode.value = true
}

const editAddressHandler = (v: DeliveryAddress) => {
  newAddressMode.value = true
  deliveryAddressToEdit.value = v
}

const deliveryAddressCreateHandler = async (newAddress?: DeliveryAddress) => {
  newAddressMode.value = false
  void deliveryAddressRepo.list()
  if (newAddress) {
    selectedDeliveryAddress.value = newAddress
  }
}

const navigationButtonClickHandler = () => {
  if (bookingMode.value === 'tablePicker') bookingMode.value = 'bookingInfo'
  else if (bookingMode.value === 'tableDetail')
    bookingMode.value = 'tablePicker'
  else if (
    bookingMode.value === 'successBooked' ||
    bookingMode.value === 'bookingInfo'
  )
    bookingMode.value = 'bookingList'
}

const selectExistingAddress = () => {
  if (cartRepo.item) return
  availablePickupAddresses.value
  if (deliveryAddressRepo.items.length === 1) {
    selectedDeliveryAddress.value = deliveryAddressRepo.items[0]
  }
  if (availablePickupAddresses.value?.length === 1) {
    selectedPickupAddress.value = availablePickupAddresses.value[0]
  }
}

const selectCurrentTab = () => {
  if (
    cartRepo.item &&
    companyRepo.cartCompany?.id === cartRepo.item.salesPoint.company
  ) {
    if (cartRepo.item.type === CartType.DELIVERY) {
      selectedDeliveryAddress.value = cartRepo.item.deliveryAddress
      selectedPickupAddress.value = null
      selectedSalesPoint.value = null
    }
    if (cartRepo.item.type === CartType.PICKUP) {
      selectedPickupAddress.value = cartRepo.item.salesPoint || null
      selectedDeliveryAddress.value = null
      selectedSalesPoint.value = null
      currentTab.value =
        availableCartTypes.value.find((el) => el.type === CartType.PICKUP) ||
        null
    }
    if (cartRepo.item.type === CartType.BOOKING) {
      selectedSalesPoint.value = cartRepo.item.salesPoint || null
    }
    const foundType = availableCartTypes.value.find(
      (el) => el.type === cartRepo.item?.type
    )
    if (foundType) {
      currentTab.value = foundType
      mobileViewTypeConfirmed.value = true
    }
  } else if (availableCartTypes.value.length) {
    currentTab.value = availableCartTypes.value[0]
  }
}

const openPreviousMenuItem = () => {
  if (!store.storedMenuItem) return
  if (
    menuRepo.item?.allMenuItems?.map((v) => v.id).includes(store.storedMenuItem)
  ) {
    void menuItemRepo.retrieve(store.storedMenuItem)
    store.openMenuItemModal(store.storedMenuItem)
    store.storedMenuItem = null
  }
}

const confirmSelectedAddress = async (noClose = false) => {
  if (
    selectedDeliveryAddress.value &&
    currentTab.value?.type === CartType.DELIVERY
  ) {
    const res = await deliveryAreaRepo.byCoords([
      selectedDeliveryAddress.value?.coords?.latitude || 0,
      selectedDeliveryAddress.value?.coords?.longitude || 0
    ])
    const availableAreas = res.filter((el) =>
      companyRepo.cartCompany?.salesPoints
        ?.map((v) => v.id)
        .includes(el.salesPoint)
    )
    if (!res.length || !availableAreas.length) {
      notifier.error('По данному адресу не осуществляется доставка')
      return
    }
    if (authentication.user) {
      await cartRepo.setParams({
        sales_point: availableAreas[0].salesPoint,
        type: CartType.DELIVERY,
        delivery_address: selectedDeliveryAddress.value?.id,
        cart: cartRepo.item?.id
      })
    }
    store.qrData = null
    await store.loadCatalog(availableAreas[0].salesPoint)
    void openPreviousMenuItem()
    if (!noClose) emit('update:modelValue', false)
  } else if (
    currentTab.value?.type === CartType.PICKUP &&
    selectedPickupAddress.value
  ) {
    if (authentication.user) {
      await cartRepo.setParams({
        sales_point: selectedPickupAddress.value.id,
        type: CartType.PICKUP,
        cart: cartRepo.item?.id
      })
    }
    store.qrData = null
    await store.loadCatalog(selectedPickupAddress.value)
    void openPreviousMenuItem()
    emit('update:modelValue', false)
  }
  menuGroupRepo.elementsInViewport = []
}
</script>
