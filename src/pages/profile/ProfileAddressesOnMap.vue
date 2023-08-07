<template>
  <div>
    <div
      id="map"
      style="width: 100%; height: 400px; z-index: 9"
      class="mt-15 border-radius col-12 map"
    ></div>
  </div>
</template>
<script lang="ts" setup>
import { CorexLeafletMap } from 'src/models/corexLeafletMap/corexLeafletMap'
import L from 'leaflet'
import { onMounted } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'

let map: CorexLeafletMap
const drawnItems = new L.FeatureGroup()

onMounted(() => {
  map = new CorexLeafletMap()
  if (!map) return
  map.lmap.addLayer(drawnItems)
  const initDraw = () => {
    return new map.L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        marker: false,
        circlemarker: false,
        polyline: false,
        circle: false,
        rectangle: false,
      },
    })
  }
  drawPoints()
  map.lmap.addControl(initDraw())
})

const drawPoints = () => {
  if (!companyRepo.item || !companyRepo.item.salesPoints) return
  drawnItems.clearLayers()
  const values: {
    id: number | string | undefined
    coords: {
      latitude: number | null
      longitude: number | null
    }
  }[] = []
  for (const el of companyRepo.item.salesPoints) {
    if (el.coords && el.active) values.push({ id: el.id, coords: el.coords })
  }

  const collection = map.pointCollection(values)
  const layer = map.pointLayer(
    collection,
    null,
    `#${uiSettingsRepo.item?.primaryColor.color}`,
    'store'
  )

  map.lmap.addLayer(layer)
  if (companyRepo.item.salesPoints.length)
    map.lmap.fitBounds(layer.getBounds(), { maxZoom: 11 })
}
</script>

<style lang="scss" scoped>
.map :deep(.leaflet-draw.leaflet-control) {
  display: none;
}

.map :deep(.leaflet-top.leaflet-right) {
  display: none;
}
</style>
