<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :width="
      newAddressMode
        ? '1094px'
        : currentTab === CartType.PICKUP
        ? '1300px'
        : '649px'
    "
    height="540px"
    no-padding
  >
    <template v-if="!newAddressMode">
      <div
        class="row full-width no-wrap bg-background-color text-on-background-color border-radius"
      >
        <div class="col-grow column py-15 px-15">
          <ServiceModalHeader :tab="currentTab" />
          <ServiceSettingsTabPicker
            class="mt-12"
            @update-tab="currentTab = $event"
            :tabs="availableCartTypes"
            :model-value="currentTab || undefined"
          />
          <div class="mt-13">
            <DeliveryAddressesTab
              v-if="currentTab === CartType.DELIVERY"
              :current-address="selectedDeliveryAddress"
              @select="selectedDeliveryAddress = $event"
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
              v-if="currentTab === CartType.PICKUP"
              @select="selectedPickupAddress = $event"
              :current-point="selectedPickupAddress"
            >
              <template v-slot:bottom>
                <div class="row full-width no-wrap">
                  <CButton
                    @click="confirmSelectedAddress()"
                    height="48px"
                    width="300px"
                    class="subtitle-text col-6"
                    label="Заберу здесь"
                  />
                </div>
              </template>
            </PickupAddressesTab>
          </div>
        </div>
        <PickupAddressesOnMap
          v-if="currentTab === CartType.PICKUP"
          :selected-point="selectedPickupAddress"
        />
      </div>
    </template>
    <CreateDeliveryAddress
      v-else
      :back-callback="() => (newAddressMode = false)"
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
import PickupAddressesOnMap from './PickupAddressesOnMap.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const currentTab = ref<CartType | null>(null)

const newAddressMode = ref(false)

const selectedDeliveryAddress = ref<DeliveryAddress | null>(null)

const selectedPickupAddress = ref<SalesPoint | null>(null)

const selectedSalesPoint = ref<SalesPoint | null>(null)

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      void deliveryAddressRepo.list().then(() => {
        selectCurrentAddress()
        if (availableCartTypes.value.length) {
          currentTab.value = availableCartTypes.value[0].type
        }
      })
    }
  }
)

const availableCartTypes = computed(() => {
  const result = []

  if (
    companyRepo.cartCompany?.salesPoints?.some(
      (v) => v.settings.delivery_enabled
    )
  ) {
    result.push({
      label: 'Доставка',
      type: CartType.DELIVERY,
      icon: 'fa-light fa-home',
      color: 'delivery-button-color',
      class: 'text-on-delivery-button-color',
    })
  }
  if (
    companyRepo.cartCompany?.salesPoints?.some((v) => v.settings.pickup_enabled)
  ) {
    result.push({
      label: 'Самовывоз',
      type: CartType.PICKUP,
      icon: 'fa-light fa-store',
      color: 'pickup-button-color',
      class: 'text-on-pickup-button-color',
    })
  }
  if (
    companyRepo.cartCompany?.salesPoints?.some(
      (v) => v.settings.booking_enabled
    ) &&
    authentication.user
  ) {
    result.push({
      label: 'Бронирование',
      type: CartType.BOOKING,
      icon: 'fa-light fa-calendar-day',
      color: 'booking-button-color',
      class: 'text-on-booking-button-color',
    })
  }
  return result
})

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
  if (selectedDeliveryAddress.value && currentTab.value === CartType.DELIVERY) {
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
    currentTab.value === CartType.PICKUP &&
    selectedPickupAddress.value
  ) {
    if (authentication.user)
      await cartRepo.setParams({
        sales_point: selectedPickupAddress.value.id,
        type: 'pickup',
      })
    await store.loadCatalog(selectedPickupAddress.value)

    emit('update:modelValue', false)
  } else if (currentTab.value === CartType.BOOKING) {
    //TODO: lol kek sosi
    // mode.value = 'bookingInfo'
  }
  menuGroupRepo.elementsInViewport = []
}
</script>
