<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :width="modalWidth"
    no-padding
    :maximize="$q.screen.lt.lg"
  >
    <!-- :height="
      currentTab === CartType.YANDEX || currentTab === CartType.DELIVERY_CLUB
        ? undefined
        : '600px'
    " -->
    <template v-if="!newAddressMode">
      <div
        class="row full-width no-wrap bg-background-color text-on-background-color border-radius"
      >
        <div
          :class="
            currentTab?.type === CartType.PICKUP ||
            (currentTab?.type === CartType.BOOKING &&
              bookingMode === 'bookingList')
              ? 'col-6'
              : 'col-12'
          "
          class="column py-15 px-15"
        >
          <ServiceModalHeader :tab="currentTab">
            <template v-slot:action>
              <CIcon
                v-if="
                  bookingMode === 'tablePicker' ||
                  bookingMode === 'tableDetail' ||
                  bookingMode === 'successBooked'
                "
                @click="navigationButtonClickHandler()"
                name="fa-regular fa-angle-left"
                hover-color="primary"
                class="cursor-pointer"
                size="24px"
              />
            </template>
          </ServiceModalHeader>
          <ServiceSettingsTabPicker
            class="mt-12 mb-13"
            @update-tab="currentTab = $event"
            :tabs="availableCartTypes"
            :model-value="currentTab || undefined"
          />
          <div>
            <DeliveryAddressesTab
              v-if="currentTab?.type === CartType.DELIVERY"
              :current-address="selectedDeliveryAddress"
              @select="selectedDeliveryAddress = $event"
              @edit="editAddressHandler($event)"
            >
              <template v-slot:bottom>
                <div class="row full-width gap-6">
                  <CButton
                    @click="confirmSelectedAddress()"
                    height="48px"
                    label="Выбрать"
                    :disabled="!selectedDeliveryAddress"
                    :loading="$cart.setParamsLoading || $store.catalogLoading"
                    class="col subtitle-text"
                  />
                  <CButton
                    @click="newAddressMode = true"
                    label="Добавить адрес"
                    height="48px"
                    color="secondary-button-color"
                    class="col subtitle-text"
                    text-color="on-secondary-button-color"
                  />
                </div>
              </template>
            </DeliveryAddressesTab>
            <PickupAddressesTab
              v-if="currentTab?.type === CartType.PICKUP"
              @select="selectedPickupAddress = $event"
              :current-point="selectedPickupAddress"
            >
              <template v-slot:bottom>
                <CButton
                  @click="confirmSelectedAddress()"
                  height="48px"
                  width="300px"
                  :loading="$cart.setParamsLoading || $store.catalogLoading"
                  class="subtitle-text col-6"
                  label="Заберу здесь"
                />
              </template>
            </PickupAddressesTab>
            <template v-if="currentTab?.type === CartType.BOOKING">
              <BookingAddressesTab
                v-if="bookingMode === 'bookingList'"
                @select="selectedSalesPoint = $event"
                :current-point="selectedSalesPoint"
              >
                <template v-slot:bottom>
                  <CButton
                    @click="bookingMode = 'bookingInfo'"
                    height="48px"
                    :disabled="!selectedSalesPoint"
                    width="300px"
                    class="subtitle-text col-6"
                    label="Выбрать"
                  />
                </template>
              </BookingAddressesTab>
              <BookingInfo
                v-if="bookingMode != 'bookingList'"
                :sales-point="selectedSalesPoint"
                :current-mode="bookingMode"
                @change-booking-mode="bookingMode = $event"
                @close="$emit('update:modelValue', false)"
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
            currentTab?.type === CartType.PICKUP ||
            (currentTab?.type === CartType.BOOKING &&
              bookingMode === 'bookingList')
          "
          :selected-point="selectedPickupAddress"
          :addresses="currentSalesPoints || []"
        />
      </div>
    </template>
    <CreateDeliveryAddress
      v-else
      :back-callback="() => (newAddressMode = false)"
      @updated="deliveryAddressCreateHandler()"
      :address="deliveryAddressToEdit || undefined"
    />
  </CDialog>
</template>
<script lang="ts" setup>
import { CartType } from 'src/models/carts/cart'
import CDialog from '../template/dialogs/CDialog.vue'
import { ref, computed, watch } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { authentication } from 'src/models/authentication/authentication'
import ServiceSettingsTabPicker from './ServiceSettingsTabPicker.vue'
import DeliveryAddressesTab from './DeliveryAddressesTab.vue'
import { deliveryAddressRepo } from 'src/models/customer/deliveryAddress/deliveryAddressRepo'
import { cartRepo } from 'src/models/carts/cartRepo'
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import { SalesPoint } from 'src/models/salesPoint/salesPoint'
import { deliveryAreaRepo } from 'src/models/deliveryAreas/deliveryAreaRepo'
import { Notify } from 'quasar'
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

const newAddressMode = ref(false)

const selectedDeliveryAddress = ref<DeliveryAddress | null>(null)

const selectedPickupAddress = ref<SalesPoint | null>(null)

const selectedSalesPoint = ref<SalesPoint | null>(null)

const bookingMode = ref<BookingModes>('bookingList')

const deliveryAddressToEdit = ref<DeliveryAddress | null>(null)

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      void deliveryAddressRepo.list().then(() => {
        selectCurrentAddress()
        if (availableCartTypes.value.length) {
          currentTab.value = availableCartTypes.value[0]
        }
      })
    }
  }
)

const modalWidth = computed(() => {
  return newAddressMode.value
    ? '1094px'
    : currentTab.value?.type === CartType.PICKUP ||
      (currentTab.value?.type === CartType.BOOKING &&
        bookingMode.value === 'bookingList')
    ? '1300px'
    : '649px'
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
      type: CartType.DELIVERY,
    })
  }
  if (
    companyRepo.cartCompany?.salesPoints?.some((v) => v.settings.pickup_enabled)
  ) {
    result.push({
      label: 'Самовывоз',
      type: CartType.PICKUP,
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
      type: CartType.BOOKING,
    })
  }
  if (companyRepo.item)
    companyRepo.item?.deliveryAggregators.forEach((el) => {
      result.push({
        label: el.type === AggregatorType.YANDEX ? 'Яндекс еда' : 'Деливери',
        type: el.type,
        link: el.link,
      })
    })
  return result
})

const editAddressHandler = (v: DeliveryAddress) => {
  newAddressMode.value = true
  deliveryAddressToEdit.value = v
}

const deliveryAddressCreateHandler = () => {
  newAddressMode.value = false
  void deliveryAddressRepo.list()
}

const navigationButtonClickHandler = () => {
  if (bookingMode.value === 'tablePicker') bookingMode.value = 'bookingInfo'
  if (bookingMode.value === 'tableDetail') bookingMode.value = 'tablePicker'
  if (bookingMode.value === 'successBooked') bookingMode.value = 'bookingList'
}

const selectCurrentAddress = () => {
  if (cartRepo.item) {
    if (cartRepo.item.type === CartType.DELIVERY) {
      selectedDeliveryAddress.value = cartRepo.item.deliveryAddress
      selectedPickupAddress.value = null
    }
    if (cartRepo.item.type === CartType.PICKUP) {
      selectedPickupAddress.value = cartRepo.item.salesPoint || null
      selectedDeliveryAddress.value = null
    }
    if (cartRepo.item.type === CartType.BOOKING) {
      selectedSalesPoint.value = cartRepo.item.salesPoint || null
    }
  }
}

const confirmSelectedAddress = async () => {
  if (
    selectedDeliveryAddress.value &&
    currentTab.value?.type === CartType.DELIVERY
  ) {
    const res = await deliveryAreaRepo.byCoords(
      selectedDeliveryAddress.value?.coords
    )
    if (!res.length) {
      Notify.create({
        message: 'По данному адресу не осуществляется доставка',
        color: 'danger',
      })
      return
    }
    if (authentication.user)
      await cartRepo.setParams({
        sales_point: res[0].salesPoint,
        type: 'delivery',
        delivery_address: selectedDeliveryAddress.value?.id,
      })

    await store.loadCatalog(res[0].salesPoint)

    emit('update:modelValue', false)
  } else if (
    currentTab.value?.type === CartType.PICKUP &&
    selectedPickupAddress.value
  ) {
    if (authentication.user)
      await cartRepo.setParams({
        sales_point: selectedPickupAddress.value.id,
        type: 'pickup',
      })
    await store.loadCatalog(selectedPickupAddress.value)

    emit('update:modelValue', false)
  } else if (currentTab.value?.type === CartType.BOOKING) {
  }
  menuGroupRepo.elementsInViewport = []
}
</script>
