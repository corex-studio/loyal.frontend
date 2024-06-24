<template>
  <div
    :class="$q.screen.lt.md ? 'column reverse full-height' : 'row '"
    :style="$q.screen.lt.md ? '' : 'height: 600px'"
    class="full-width no-wrap"
  >
    <div
      v-if="newAddress && $q.screen.gt.sm && $q.platform.has.touch"
      :style="$q.screen.lt.md ? 'max-height: 55vh' : 'width: 47%'"
      class="column no-wrap justify-between text-on-background-color pa-lg-15 pa-md-10 py-xs-12 px-xs-8"
      style="overflow-y: auto"
    >
      <div class="column full-width gap-md-8 gap-xs-6">
        <div class="row items-center no-wrap gap-5 mb-md-7 mb-xs-4">
          <CIcon
            v-if="backCallback"
            class="cursor-pointer"
            color="on-background-color"
            hover-color="primary"
            name="fa-regular fa-angle-left"
            size="24px"
            @click="backCallback ? backCallback() : void 0"
          />
          <div class="header3 bold">
            {{ address ? address.name || 'Изменение адреса' : 'Новый адрес' }}
          </div>
        </div>
        <div class="column full-width gap-10">
          <AddressSearch
            :address="newAddress.address"
            label="Укажите адрес"
            placeholder="Город, улица, дом"
            @update="selectAddress($event, 15)"
          />
          <CButton
            :icon-loading="geoloading"
            icon="fa-regular fa-location-dot"
            icon-size="24px"
            style="width: fit-content"
            text-button
            text-color="primary"
            @click="requestGeolocation()"
          >
            <div class="body bold">Определить адрес автоматически</div>
          </CButton>
        </div>
        <div class="row gap-5 no-wrap">
          <CInput
            v-model="newAddress.flat"
            class="col"
            external-label="Квартира"
            height="48px"
            placeholder="Номер"
          />
          <CInput
            v-model="newAddress.entrance"
            class="col"
            external-label="Подъезд"
            height="48px"
            placeholder="Номер"
          />
        </div>
        <div class="row gap-5 no-wrap">
          <CInput
            v-model="newAddress.floor"
            class="col"
            external-label="Этаж"
            height="48px"
            placeholder="Номер"
            type="number"
          />
          <CInput
            v-model="newAddress.intercom"
            class="col"
            external-label="Домофон"
            height="48px"
            placeholder="Номер"
          />
        </div>
        <CInput
          v-model="newAddress.description"
          auto-grow
          height="fit-content"
          input-style="border-radius: 15px !important"
          placeholder="Комментарий"
        />
      </div>
      <div class="mt-md-15 mt-xs-8 column full-width gap-12">
        <CButton
          :disabled="!isSaveAvailable"
          :loading="
            $deliveryAddress.loadings.update || $deliveryAddress.loadings.create
          "
          class="body"
          height="48px"
          label="Сохранить"
          width="100%"
          @click="createAddress()"
        />
      </div>
    </div>
    <div
      :style="$q.screen.lt.md ? `` : 'height: 600px; width: 53%'"
      class="col"
    >
      <div
        id="map"
        :style="`border-radius: ${getBorderRadius};`"
        class="map"
        style="z-index: 9; width: 100%; height: 100%"
      ></div>
    </div>
  </div>
  <CSwipeModal
    ref="cSwipeModalRef"
    style="max-width: 450px; width: 100%"
    class="px-5"
    v-if="$q.screen.lt.md && $q.platform.has.touch"
    v-model="swipeModal"
    allow-open-full-height
    breakpoint="200"
    always-visible-on-breakpoint
    prevent-content-scrolling-if-closed
    :as-modal="false"
  >
    <!--    :full-height="$q.platform.is.safari ? '89vh' : '93vh'"-->
    <div class="column full-width gap-md-8 gap-xs-6">
      <div class="row items-center no-wrap gap-5 mb-md-7 mb-xs-4">
        <CIcon
          v-if="backCallback"
          class="cursor-pointer"
          color="on-background-color"
          hover-color="primary"
          name="fa-regular fa-angle-left"
          size="24px"
          @click="backCallback ? backCallback() : void 0"
        />
        <div class="header3 bold">
          {{ address ? address.name || 'Изменение адреса' : 'Новый адрес' }}
        </div>
      </div>
      <div class="column full-width gap-10">
        <AddressSearch
          :address="newAddress.address"
          ref="addressSearchRef"
          label="Укажите адрес"
          placeholder="Город, улица, дом"
          @update="selectAddress($event, 15)"
          @click="onInputClick"
        />
        <CButton
          :icon-loading="geoloading"
          icon="fa-regular fa-location-dot"
          icon-size="24px"
          style="width: fit-content"
          text-button
          text-color="primary"
          @click="requestGeolocation()"
        >
          <div class="body bold">Определить адрес автоматически</div>
        </CButton>
      </div>
      <div class="row gap-5 no-wrap">
        <CInput
          v-model="newAddress.flat"
          class="col"
          external-label="Квартира"
          height="48px"
          placeholder="Номер"
        />
        <CInput
          v-model="newAddress.entrance"
          class="col"
          external-label="Подъезд"
          height="48px"
          placeholder="Номер"
        />
      </div>
      <div class="row gap-5 no-wrap">
        <CInput
          v-model="newAddress.floor"
          class="col"
          external-label="Этаж"
          height="48px"
          placeholder="Номер"
          type="number"
        />
        <CInput
          v-model="newAddress.intercom"
          class="col"
          external-label="Домофон"
          height="48px"
          placeholder="Номер"
        />
      </div>
      <CInput
        v-model="newAddress.description"
        auto-grow
        height="fit-content"
        input-style="border-radius: 15px !important"
        placeholder="Комментарий"
      />
    </div>
    <div class="mt-md-15 mt-xs-8 column full-width gap-12">
      <CButton
        :disabled="!isSaveAvailable"
        :loading="
          $deliveryAddress.loadings.update || $deliveryAddress.loadings.create
        "
        class="body"
        height="48px"
        label="Сохранить"
        width="100%"
        @click="createAddress()"
      />
    </div>
  </CSwipeModal>
</template>
<script lang="ts" setup>
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import CButton from '../template/buttons/CButton.vue'
import AddressSearch from '../template/inputs/AddressSearch.vue'
import CInput from '../template/inputs/CInput.vue'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { deliveryAddressRepo } from 'src/models/customer/deliveryAddress/deliveryAddressRepo'
import { QInput, scroll, useQuasar } from 'quasar'
import { Address } from 'src/models/types'
import CIcon from '../template/helpers/CIcon.vue'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import L, { Layer } from 'leaflet'
import { CorexLeafletMap } from 'src/models/corexLeafletMap/corexLeafletMap'
import { useGeolocation } from '@vueuse/core'
import { utilsRepo } from 'src/models/utils/utilsRepo'
import CSwipeModal from 'components/dialogs/CSwipeModal.vue'
import { CSwipeModalRef } from 'components/dialogs/types/types'
import setVerticalScrollPosition = scroll.setVerticalScrollPosition
import { notifier } from 'src/services/notifier'

const props = defineProps<{
  address?: DeliveryAddress
  backCallback?: () => void
}>()

// const { coords, resume, pause } = useGeolocation()
const swipeModal = ref(false)
const geolocation = useGeolocation()
const preventGeolocationErrorNotify = ref(false)
const cSwipeModalRef = ref<CSwipeModalRef | null>(null)
const addressSearchRef = ref<{ cInputRef: QInput } | null>(null)
const currentCoords = ref<{
  lat: number
  lng: number
}>()

const emit = defineEmits<{
  (evt: 'updated'): void
  (evt: 'created', val: DeliveryAddress): void
}>()

const drawnItems = new L.FeatureGroup()
const newAddress = ref<DeliveryAddress>(
  new DeliveryAddress({
    uuid: props.address?.id || undefined,
    name: props.address?.name || null,
    address: props.address?.address || '',
    coords: props.address?.coords || null,
    city: props.address?.city || '',
    street: props.address?.street || '',
    house: props.address?.house || '',
    flat: props.address?.flat || null,
    floor: props.address?.floor || null,
    entrance: props.address?.entrance || null,
    intercom: props.address?.intercom || null,
    description: props.address?.description || '',
  }),
)
const geoloading = ref(false)
const q = useQuasar()
let map: CorexLeafletMap

// const onInputClick = (e: Event) => {
//   e.preventDefault()
//   // console.log(e)
//   if (!cSwipeModalRef.value) return
//   if (!cSwipeModalRef.value.isFullHeight) {
//     // cSwipeModalRef.value?.toggleFullHeight()
//     setTimeout(() => {
//       cSwipeModalRef.value?.contentScrollTo({ top: 0 })
//     }, 100)
//   }
// }
const isSaveAvailable = computed(() => {
  return !!newAddress.value?.address.length
})

const getBorderRadius = computed(() => {
  return q.screen.lt.md
    ? 'unset'
    : `0px ${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px 0`
})

const requestGeolocation = (auto = false) => {
  if (geolocation.isSupported) {
    preventGeolocationErrorNotify.value = auto
    geolocation.resume()
    geoloading.value = true
  } else if (!auto) {
    notifier.error(
      'Автоматическое определение геопозиции не поддерживается на вашем устройстве',
    )
  }
}

watch(
  () => geolocation.coords.value,
  () => {
    geolocation.pause()
    geolocate()
  },
  { deep: true },
)

watch(
  () => geolocation.error.value,
  () => {
    processGeolocationError()
  },
)

const processGeolocationError = () => {
  const error = geolocation.error.value
  const code = error?.code
  if (error) {
    let notifyText: string | null = null
    if (code === error?.PERMISSION_DENIED) {
      notifyText =
        'Предоставьте доступ к геопозиции для определения местоположения'
    } else if (code === error?.POSITION_UNAVAILABLE) {
      notifyText = 'Не удалось определить местоположение'
    }
    if (notifyText && !preventGeolocationErrorNotify.value) {
      notifier.error(notifyText)
    }
  }
  geoloading.value = false
  geolocation.error.value = null
  preventGeolocationErrorNotify.value = false
}

const geolocate = async () => {
  geoloading.value = true
  if (geolocation.coords.value.latitude !== Infinity) {
    currentCoords.value = {
      lat: geolocation.coords.value.latitude,
      lng: geolocation.coords.value.longitude,
    }
    await loadAddressDataByCoords()
  } else {
    currentCoords.value = undefined
  }
  geoloading.value = false
}

const loadAddressDataByCoords = async () => {
  if (!currentCoords.value) return
  const res = await utilsRepo.geolocate(
    currentCoords.value.lat,
    currentCoords.value.lng,
  )
  selectAddress(res, 13)
}


const drawPoint = (zoom?: number) => {
  const values: {
    id: number | string | undefined
    coords: {
      latitude: number | null
      longitude: number | null
    }
  }[] = []
  if (newAddress.value?.coords?.latitude || newAddress.value?.coords?.longitude)
    values.push({
      id: newAddress.value.id,
      coords: newAddress.value.coords,
    })
  const collection = map.pointCollection(values)
  const layer = map.pointLayer(
    collection,
    null,
    `#${uiSettingsRepo.item?.primaryColor.color}`,
    'home',
  )
  map.lmap.addLayer(layer)
  if (values.length)
    map.lmap.fitBounds(layer.getBounds(), {
      maxZoom: zoom || map.lmap.getZoom(),
    })
}

// onBeforeUnmount(() => {
//   pause()
// })

const { getScrollTarget } = scroll

onMounted(() => {
  requestGeolocation(true)
  setTimeout(() => {
    map = new CorexLeafletMap()
    if (!map) return
    map.lmap.addLayer(drawnItems)
    // if (!props.address) void geolocate()
    drawPoint(13)
    map.lmap.invalidateSize()
    map.lmap.on(
      'click',
      async (v: { latlng: { lat: number; lng: number } }) => {
        if (!newAddress.value) return
        newAddress.value.coords = {
          latitude: v.latlng.lat,
          longitude: v.latlng.lng,
        }
        const res = await utilsRepo.geolocate(v.latlng.lat, v.latlng.lng)
        const addressWithCorrectCoords: Address = {
          ...res,
        }
        selectAddress(addressWithCorrectCoords)
      },
    )
  }, 200)
  const addressSearchEl = addressSearchRef.value?.cInputRef.$el as
    | HTMLDivElement
    | undefined
  const inp = addressSearchEl?.querySelector('input') as
    | HTMLInputElement
    | undefined
  setInterval(() => {}, 2000)
  inp?.addEventListener('focus', async () => {
    if (!cSwipeModalRef.value?.isFullHeight)
      cSwipeModalRef.value?.toggleFullHeight()
    if (q.platform.is.safari && !cSwipeModalRef.value?.isFullHeight) {
      void nextTick(() => {
        setTimeout(() => {
          if (cSwipeModalRef.value?.contentRef) {
            const t = getScrollTarget(cSwipeModalRef.value.contentRef)
            setVerticalScrollPosition(t, 0)
            console.log(cSwipeModalRef.value?.contentRef.scrollHeight)
          }
        }, 220)
      })
    }

  })
})

const createAddress = async () => {
  try {
    if (props.address) {
      // if (isPrivateHouse.value && newAddress.value) {
      //   newAddress.value.entrance = null
      //   newAddress.value.floor = null
      //   newAddress.value.intercom = null
      // }
      const res = await deliveryAddressRepo.update(newAddress.value)
      const foundAddressIndex = deliveryAddressRepo.items.findIndex(
        (v) => v.id === newAddress.value?.id,
      )
      if (foundAddressIndex > -1) {
        deliveryAddressRepo.items[foundAddressIndex] = res
      }
      notifier.success('Адрес успешно изменен')
      emit('updated')
    } else {
      const res = await deliveryAddressRepo.create(newAddress.value)
      notifier.success('Адрес успешно создан')
      emit('created', res)
    }
  } catch {
    if (props.address) {
      notifier.error('Ошибка при обновлении адреса')
    } else {
      notifier.error('Ошибка при создании адреса')
    }
  }
}

const selectAddress = (v: Address, zoom?: number) => {
  if (!newAddress.value) return
  newAddress.value.address = v.address
  newAddress.value.city = v.city
  newAddress.value.coords = {
    latitude: v.coords[1],
    longitude: v.coords[0],
  }
  newAddress.value.flat = v.flat
  newAddress.value.street = v.street
  newAddress.value.house = v.house
  redrawPoint(zoom)
}

const redrawPoint = (zoom?: number) => {
  map.lmap.eachLayer((layer: Layer) => {
    if (layer instanceof map.L.Marker) layer.remove()
  })
  drawPoint(zoom)
}
</script>
<style lang="scss">
input:focus {
  background: red;
}

input:active {
  background: blue;
}
</style>
