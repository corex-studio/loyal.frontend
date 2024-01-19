<template>
  <!-- <object
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :data="getImage()"
    :width="width || 22"
    :height="height || 22"
    class="icon"
    type="image/svg+xml"
  ></object> -->
  <div
    :style="`background: url(${getImage()}); width: ${
      width || '22px'
    }; min-width: ${width || '22px'};  height: ${height || '22px'}`"
  ></div>
</template>
<script lang="ts" setup>
import { store } from 'src/models/store'
// import { ref } from 'vue'

const props = defineProps<{
  name: string
  width?: string
  height?: string
}>()

// const hover = ref(false)

const getImage = () => {
  try {
    return require('assets/icons/' + props.name)
  } catch {
    return store.images.empty
  }
}
</script>

<style lang="scss" scoped></style>
