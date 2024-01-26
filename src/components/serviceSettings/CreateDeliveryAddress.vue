<template>
  <div
    :style="$q.screen.lt.md ? '' : 'height: 600px'"
    :class="$q.screen.lt.md ? 'column reverse' : 'row '"
    class="full-width no-wrap"
  >
    <div
      v-if="newAddress"
      style="overflow-y: auto"
      :style="$q.screen.lt.md ? '' : 'width: 47%'"
      ref="dataContainer"
      class="column no-wrap justify-between text-on-background-color pa-lg-15 pa-md-10 py-xs-12 px-xs-8"
    >
      <div class="column full-width gap-md-8 gap-xs-6">
        <div class="row items-center no-wrap gap-5 mb-md-7 mb-xs-4">
          <CIcon
            v-if="backCallback"
            @click="backCallback()"
            size="24px"
            color="on-background-color"
            hover-color="primary"
            class="cursor-pointer"
            name="fa-regular fa-angle-left"
          />
          <div class="header2 bold">
            {{ address ? address.name || 'Изменение адреса' : 'Новый адрес' }}
          </div>
        </div>
        <CInput
          height="48px"
          external-label="Название адреса"
          placeholder="Название"
          v-model="newAddress.name"
        />
        <div class="column full-width gap-md-6 gap-xs-4">
          <AddressSearch
            @update="selectAddress($event)"
            :address="newAddress.address"
            label="Укажите адрес"
            placeholder="Город, улица, дом"
          />
          <CButton
            @click="geolocate()"
            text-button
            style="width: fit-content"
            icon="fa-regular fa-location-dot"
            icon-size="24px"
            :loading="geoloading"
            text-color="primary"
          >
            <div class="body bold">Определить адрес атоматически</div>
          </CButton>
          <!-- <div
            @click="geolocate()"
            class="row cursor-pointer no-wrap items-center gap-4"
          >
            <CIcon
              name="fa-regular fa-location-dot"
              color="primary"
              size="24px"
            />
            <div class="body text-primary bold">
              Определить адрес атоматически
            </div>
          </div> -->
        </div>
        <div v-if="!isPrivateHouse" class="row gap-5 no-wrap">
          <CInput
            height="48px"
            class="col"
            :readonly="isPrivateHouse"
            external-label="Подъезд"
            placeholder="Номер"
            v-model="newAddress.entrance"
          />
          <CInput
            height="48px"
            class="col"
            :readonly="isPrivateHouse"
            external-label="Этаж"
            placeholder="Номер"
            v-model="newAddress.floor"
          />
          <CInput
            height="48px"
            class="col"
            :readonly="isPrivateHouse"
            external-label="Код двери"
            placeholder="Номер"
            v-model="newAddress.intercom"
          />
        </div>
        <CInput
          placeholder="Комментарий"
          input-style="border-radius: 15px !important"
          v-model="newAddress.description"
          auto-grow
          height="fit-content"
        />
      </div>
      <div class="mt-md-15 mt-xs-8 column full-width gap-12">
        <CCheckBox
          @click="privateHouseClickHandler()"
          :model-value="isPrivateHouse"
          size="50px"
          class="body"
          label="У меня частный дом"
        />
        <CButton
          @click="createAddress()"
          :disabled="!isSaveAvailable"
          height="48px"
          class="body"
          width="100%"
          label="Сохранить"
        />
      </div>
    </div>
    <div
      :style="
        $q.screen.lt.md
          ? `height: ${mobileViewMapHeight}px !important`
          : 'height: 600px; width: 53%'
      "
    >
      <div
        id="map"
        style="z-index: 9; width: 100%"
        :style="`border-radius: ${getBorderRadius}; ${
          $q.screen.lt.md
            ? `height: ${mobileViewMapHeight}px !important`
            : 'height: 600px;'
        }`"
        class="map"
      ></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import CButton from '../template/buttons/CButton.vue'
import AddressSearch from '../template/inputs/AddressSearch.vue'
import CInput from '../template/inputs/CInput.vue'
import { ref, onMounted, computed } from 'vue'
import { deliveryAddressRepo } from 'src/models/customer/deliveryAddress/deliveryAddressRepo'
import { Notify, useQuasar } from 'quasar'
import { Address } from 'src/models/types'
import CIcon from '../template/helpers/CIcon.vue'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import L from 'leaflet'
import { CorexLeafletMap } from 'src/models/corexLeafletMap/corexLeafletMap'
import { Layer } from 'leaflet'
import CCheckBox from '../helpers/CCheckBox.vue'
import { useGeolocation } from '@vueuse/core'
import { utilsRepo } from 'src/models/utils/utilsRepo'

const { coords, resume, pause } = useGeolocation()

const props = defineProps<{
  address?: DeliveryAddress
  backCallback?: () => void
}>()

const emit = defineEmits(['updated'])

const drawnItems = new L.FeatureGroup()

const newAddress = ref<DeliveryAddress | null>(null)

const isPrivateHouse = ref(false)

const geoloading = ref(false)

const dataContainer = ref<HTMLDivElement>()

const q = useQuasar()

let map: CorexLeafletMap

const mobileViewMapHeight = computed(() => {
  return dataContainer.value
    ? q.screen.height - dataContainer.value?.clientHeight
    : undefined
})

const isSaveAvailable = computed(() => {
  return !!newAddress.value?.name?.length && !!newAddress.value.address.length
})

const getBorderRadius = computed(() => {
  return q.screen.lt.md
    ? 'unset'
    : `0px ${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px 0`
})

const geolocate = async () => {
  try {
    geoloading.value = true
    if (!newAddress.value) throw new Error('Объект адреса не может быть пустым')
    resume()
    const res = await utilsRepo.geolocate(
      coords.value.latitude,
      coords.value.longitude
    )
    const addressWithCorrectCoords: Address = {
      ...res,
      coords: [res.coords[1], res.coords[0]],
    }
    selectAddress(addressWithCorrectCoords)
  } catch {
    Notify.create({
      message: 'Ошибка при получении вашего положения',
      color: 'danger',
    })
  } finally {
    geoloading.value = false
    pause()
  }
}

const privateHouseClickHandler = () => {
  if (!newAddress.value) return
  newAddress.value.entrance = null
  newAddress.value.floor = null
  newAddress.value.intercom = null
  isPrivateHouse.value = !isPrivateHouse.value
}

const drawPoint = () => {
  drawnItems.clearLayers()
  const values: {
    id: number | string | undefined
    coords: {
      latitude: number | null
      longitude: number | null
    }
  }[] = []
  if (newAddress.value?.coords.length)
    values.push({
      id: newAddress.value.id,
      coords: {
        latitude: newAddress.value.coords[0],
        longitude: newAddress.value.coords[1],
      },
    })

  const collection = map.pointCollection(values)
  const layer = map.pointLayer(
    collection,
    null,
    `#${uiSettingsRepo.item?.primaryColor.color}`,
    'store'
  )

  map.lmap.addLayer(layer)
  if (values.length) map.lmap.fitBounds(layer.getBounds(), { maxZoom: 12 })
}

const initDraw = () => {
  return new map.L.Control.Draw({
    edit: {
      featureGroup: drawnItems,
      edit: false,
      remove: false,
    },
    draw: {
      marker: false,
      circlemarker: false,
      polyline: false,
      circle: false,
      rectangle: false,
      polygon: false,
    },
  })
}

onMounted(() => {
  newAddress.value = new DeliveryAddress({
    uuid: props.address?.id || undefined,
    name: props.address?.name || '',
    address: props.address?.address || '',
    coords: props.address?.coords || [],
    city: props.address?.city || '',
    street: props.address?.street || '',
    house: props.address?.house || '',
    flat: props.address?.flat || null,
    floor: props.address?.floor || null,
    entrance: props.address?.entrance || null,
    intercom: props.address?.intercom || null,
    description: props.address?.description || '',
  })
  map = new CorexLeafletMap()
  if (!map) return
  map.lmap.addLayer(drawnItems)
  setTimeout(() => {
    drawPoint()
    map.lmap.addControl(initDraw())
    map.lmap.invalidateSize()
  }, 0)
})

const createAddress = async () => {
  try {
    if (props.address) {
      const res = await deliveryAddressRepo.update(newAddress.value)
      const foundAddressIndex = deliveryAddressRepo.items.findIndex(
        (v) => v.id === newAddress.value?.id
      )
      if (foundAddressIndex > -1) {
        deliveryAddressRepo.items[foundAddressIndex] = res
      }
      Notify.create({
        message: 'Адрес успешно изменен',
      })
    } else {
      await deliveryAddressRepo.create(newAddress.value)
      Notify.create({
        message: 'Адрес успешно создан',
      })
    }
    emit('updated')
  } catch {
    if (props.address) {
      Notify.create({
        message: 'Ошибка при обновлении адреса',
        color: 'danger',
      })
    } else {
      Notify.create({
        message: 'Ошибка при создании адреса',
        color: 'danger',
      })
    }
  }
}

const selectAddress = (v: Address) => {
  if (!newAddress.value) return

  newAddress.value.address = v.address
  newAddress.value.city = v.city
  newAddress.value.coords = v.coords

  newAddress.value.flat = v.flat
  newAddress.value.street = v.street
  newAddress.value.house = v.house

  map.lmap.eachLayer((layer: Layer) => {
    if (layer instanceof map.L.Marker) layer.remove()
  })
  drawPoint()
  map.lmap.addControl(initDraw())
}
</script>
