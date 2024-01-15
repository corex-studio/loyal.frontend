<template>
  <div style="height: 600px" class="row no-wrap full-width">
    <div
      v-if="newAddress"
      style="overflow-y: auto"
      class="column no-wrap justify-between col text-on-background-color pa-15"
    >
      <div class="column full-width gap-8">
        <div class="row items-center gap-5 mb-12">
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
          input-class="body"
          v-model="newAddress.name"
        />
        <AddressSearch
          @update="selectAddress($event)"
          :address="newAddress.address"
          input-class="body"
          label="Укажите адрес"
          placeholder="Город, улица, дом"
        />
        <div v-if="!isPrivateHouse" class="row gap-5 no-wrap">
          <CInput
            height="48px"
            class="col"
            input-class="body"
            external-label="Подъезд"
            placeholder="Номер"
            v-model="newAddress.entrance"
          />
          <CInput
            height="48px"
            class="col"
            input-class="body"
            external-label="Этаж"
            placeholder="Номер"
            v-model="newAddress.floor"
          />
          <CInput
            height="48px"
            class="col"
            input-class="body"
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
          input-class="body"
          height="fit-content"
        />
      </div>
      <div class="mt-15 column full-width gap-12">
        <CCheckBox
          @click="privateHouseClickHandler()"
          :model-value="isPrivateHouse"
          size="50px"
          class="body"
          label="У меня частный дом"
        />
        <!-- <q-checkbox
          @click="privateHouseClickHandler()"
          :model-value="isPrivateHouse"
          dense
          size="50px"
          class="body"
          label="У меня частный дом"
        /> -->
        <CButton
          @click="createAddress()"
          :disabled="!isSaveAvailable"
          height="48px"
          class="body"
          width="280px"
          label="Сохранить"
        />
      </div>
    </div>

    <div style="width: 600px; height: 600px">
      <div
        id="map"
        style="width: 100%; height: 600px; z-index: 9"
        :style="`border-radius: ${getBorderRadius}`"
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
import { Notify } from 'quasar'
import { Address } from 'src/models/types'
import CIcon from '../template/helpers/CIcon.vue'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import L from 'leaflet'
import { CorexLeafletMap } from 'src/models/corexLeafletMap/corexLeafletMap'
import { Layer } from 'leaflet'
import CCheckBox from '../helpers/CCheckBox.vue'

const props = defineProps<{
  address?: DeliveryAddress
  backCallback?: () => void
}>()

const emit = defineEmits(['updated'])

const drawnItems = new L.FeatureGroup()

const newAddress = ref<DeliveryAddress | null>(null)

const isPrivateHouse = ref(false)

let map: CorexLeafletMap

const isSaveAvailable = computed(() => {
  return (
    !!newAddress.value?.name?.length && !!newAddress.value.address.length
    // &&
    // !!newAddress.value.floor?.length &&
    // !!newAddress.value.entrance?.length
  )
})

const getBorderRadius = computed(() => {
  return `0px ${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px 0`
})

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

  drawPoint()
  map.lmap.addControl(initDraw())
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
