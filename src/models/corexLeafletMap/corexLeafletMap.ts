import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'src/models/corexLeafletMap/leaflet.css'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import { FeatureCollection, Feature, Position } from 'geojson'

type TileRaw = {
  name: string
  url: string
  options: Record<string, any>
}

export class CorexLeafletMap {
  L = L
  lmap: L.Map
  lat = 54.9525782
  lng = 28.493184
  zoom = 4
  tiles: Array<TileRaw> = [
    {
      name: 'Яндекс карты',
      url: 'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&v=21.06.08-0-b210520094930&x={x}&y={y}&z={z}&scale=2&lang=ru_RU',
      options: {
        id: 2,
        attribution: '<a href="https://yandex.ru" target="_blank">Яндекс</a>',
        reuseTiles: true,
        updateWhenIdle: false,
      },
    },
    {
      name: 'OSM Карты',
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        id: 3,
        attribution:
          '<a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        reuseTiles: true,
        updateWhenIdle: false,
      },
    },
    {
      name: 'Google карты - спутник',
      url: 'http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      options: {
        id: 1,
        subdomains: ['01', '02', '03', '04'],
        attribution: '<a href="https://google.com" target="_blank">Google</a>',
        reuseTiles: true,
        updateWhenIdle: false,
      },
    },
  ]

  constructor(mapId = 'map') {
    const tiles: Record<string, any> = {}
    this.tiles.forEach((value) => {
      tiles[value.name] = L.tileLayer(value.url, value.options)
    })
    this.lmap = L.map(mapId, {
      center: [this.lat, this.lng],
      zoom: this.zoom,
      layers: [tiles[this.tiles[0].name]],
    })

    this.lmap.options.crs = L.CRS.EPSG3395

    L.control.layers(tiles).addTo(this.lmap)
  }

  polygonCollection(
    values: Array<{
      id: number | string | undefined
      coords: Position[][]
    }> = []
  ) {
    const geoJson = this.getFutureCollection()
    values.forEach((value) => {
      geoJson.features.push({
        type: 'Feature',
        id: value.id,
        properties: {
          popupContent: '',
          style: {},
        },
        geometry: {
          type: 'Polygon',
          coordinates: value.coords,
        },
      })
    })
    return geoJson
  }

  pointCollection<T extends { [name: string]: any } | null>(
    values: Array<{
      id: number | string | undefined
      coords: {
        latitude: number | null
        longitude: number | null
      }
      instance?: T
    }>
  ) {
    const geoJson = this.getFutureCollection()
    values.forEach((value) => {
      if (value.coords)
        geoJson.features.push({
          type: 'Feature',
          id: value.id,
          properties: {
            instance: value.instance,
          },
          geometry: {
            type: 'Point',
            coordinates: [
              value.coords.longitude || 0,
              value.coords.latitude || 0,
            ],
          },
        })
    })
    return geoJson
  }

  polylineCollection(
    values: Array<{
      id: number | string | undefined
      coords: {
        latitude: number | null
        longitude: number | null
      }
    }> = []
  ) {
    const styles = {
      weight: 2,
      color: 'red',
      opacity: 1,
    }
    const coords: number[][] = []
    for (const value of values) {
      coords.push([value.coords.longitude || 0, value.coords.latitude || 0])
    }
    const geoJson = this.getFutureCollection()
    geoJson.features.push({
      type: 'Feature',
      id: '123',
      geometry: {
        type: 'LineString',
        coordinates: coords,
      },
      properties: {
        style: styles,
      },
    })
    return geoJson
  }

  pointLayer(
    geojson: FeatureCollection,
    onClick: ((feature: Feature, layer: L.Layer) => void) | null = null,
    color: ((feature: Feature | null) => string) | string | null = null,
    icon: ((feature: Feature | null) => string) | string | null = null,
    image: ((feature: Feature | null) => string) | string | null = null
  ) {
    return L.geoJSON(geojson, {
      onEachFeature: (feature: Feature, layer: L.Layer) => {
        if (onClick) layer.on('click', () => onClick(feature, layer))
      },
      pointToLayer: (feature, latlng) => {
        return this.createPoint(latlng, color, icon, image, feature)
      },
    })
  }
  polygonLayer(
    geojson: FeatureCollection,
    onClick: ((feature: Feature, layer: L.Layer) => void) | null = null
  ) {
    return L.geoJSON(geojson, {
      onEachFeature: (feature: Feature, layer: L.Layer) => {
        if (onClick) layer.on('click', () => onClick(feature, layer))
      },
      style: (feature?: Feature): L.PathOptions => {
        return (feature?.properties?.style || {}) as L.PathOptions
      },
    })
  }

  createPoint(
    coords: L.LatLngExpression,
    color: ((feature: Feature | null) => string) | string | null = null,
    icon: ((feature: Feature | null) => string) | string | null = null,
    image: ((feature: Feature | null) => string) | string | null = null,
    feature: Feature | null = null
  ) {
    const draw_icon = this.createIcon(color, icon, image, feature)
    return new L.Marker(coords, { icon: draw_icon })
  }

  createIcon(
    color: ((feature: Feature | null) => string) | string | null,
    icon: ((feature: Feature | null) => string) | string | null,
    image: ((feature: Feature | null) => string) | string | null = null,
    feature: Feature | null = null
  ) {
    if (image)
      return new L.Icon({
        iconUrl: typeof image === 'function' ? image(feature) : image,
        iconSize: [30, 30],
      })
    if (!color || !icon) return new L.DivIcon({ html: 'error' })
    const _color = typeof color === 'function' ? color(feature) : color
    const _icon = typeof icon === 'function' ? icon(feature) : icon

    return new L.DivIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${_color}"
            class="marker-pin"></div><i class="material-icons" style="color: ${_color}">${_icon}</i>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    })
  }

  setMapCenter(lat: number, lng: number, zoom: null | number = null) {
    if (!zoom) zoom = this.lmap.getMaxZoom()
    this.lmap.flyTo([lat, lng], zoom, {
      duration: 0.5,
    })
  }
  // setMapBounds(layer: L.Layer) {
  //   // try {
  //   //   this.lmap.flyToBounds(layer.getBounds(), {
  //   //     duration: 0.5,
  //   //   })
  //   // } catch (e) {}
  // }

  getFutureCollection(): FeatureCollection {
    return { type: 'FeatureCollection', features: [] }
  }
}
