<template>
  <div style="width: 650px; height: 600px">
    <div
      id="map"
      style="width: 100%; height: 600px; z-index: 9"
      :style="`border-radius: ${getBorderRadius}`"
      class="map"
    ></div>
  </div>
</template>
<script lang="ts" setup>
import { CorexLeafletMap } from 'src/models/corexLeafletMap/corexLeafletMap'
import L from 'leaflet'
import { onMounted, computed, watch } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { SalesPoint } from 'src/models/salesPoint/salesPoint'
import { Layer } from 'leaflet'

const props = defineProps<{
  selectedPoint: SalesPoint | null
  addresses: SalesPoint[]
}>()

let map: CorexLeafletMap
const drawnItems = new L.FeatureGroup()

watch(
  () => props.addresses,
  () => {
    map.lmap.eachLayer((layer: Layer) => {
      if (layer instanceof map.L.Marker) layer.remove()
    })
    drawPoints()
    map.lmap.addControl(initDraw())
  }
)

watch(
  () => props.selectedPoint,
  (v) => {
    if (v && v.coords.latitude && v.coords.longitude) {
      map.lmap.flyTo(
        {
          lat: v.coords.latitude,
          lng: v.coords.longitude,
        },
        14
      )
    }
  }
)

const getBorderRadius = computed(() => {
  return `0px ${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px 0`
})

const drawPoints = () => {
  if (!companyRepo.item || !props.addresses) return
  drawnItems.clearLayers()
  const values: {
    id: number | string | undefined
    coords: {
      latitude: number | null
      longitude: number | null
    }
  }[] = []
  for (const el of props.addresses) {
    if (el.coords && el.active)
      values.push({
        id: el.id,
        coords: el.coords,
      })
  }

  const collection = map.pointCollection(values)
  const layer = map.pointLayer(
    collection,
    null,
    `#${uiSettingsRepo.item?.primaryColor.color}`,
    'store'
  )

  map.lmap.addLayer(layer)
  if (props.addresses.length)
    map.lmap.fitBounds(layer.getBounds(), { maxZoom: 11 })
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
  map = new CorexLeafletMap()
  if (!map) return
  map.lmap.addLayer(drawnItems)

  drawPoints()
  map.lmap.addControl(initDraw())
})
</script>