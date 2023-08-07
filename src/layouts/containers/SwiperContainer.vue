<template>
  <div>
    <swiper
      :space-between="spaceBetween || 20"
      :loop="loop"
      :slides-per-view="slidesPerView || 3"
      :pagination="{
        clickable: true,
      }"
      :mousewheel="{
        releaseOnEdges: true,
        sensitivity: 0.5,
        forceToAxis: true,
      }"
      :modules="modules"
      navigation
      :class="noNavigation ? 'no-navigation' : 'navigation'"
    >
      <swiper-slide
        v-for="(item, index) in items"
        :key="index"
        :class="useBullets ? 'mb-10' : ''"
      >
        <slot name="item" v-bind:item="item"></slot>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation, Mousewheel } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { computed } from 'vue'

const props = defineProps<{
  items: Array<any>
  loop?: boolean
  spaceBetween?: number
  slidesPerView?: number
  useBullets?: boolean
  noNavigation?: boolean
}>()

const modules = computed(() => {
  const res = []
  if (!props.noNavigation) res.push(Navigation)
  res.push(Mousewheel)
  if (props.useBullets) {
    res.push(Pagination)
  }

  return res
})
</script>

<style scoped lang="scss">
.swiper-click :deep(.swiper-pagination) {
  margin-left: -23% !important;
  z-index: 0;
}

.swiper :deep(.swiper-pagination) {
  position: unset;
}

.swiper :deep(.swiper-pagination-bullet) {
  width: 9px;
  height: 9px;
  opacity: 1;
  background: #898989;
}

.swiper :deep(.swiper-pagination-bullet-active) {
  background: var(--primary);
  width: 9px;
  border-radius: 5px;
}

.navigation :deep(.swiper-button-prev) {
  color: black;
  height: 10px;
  width: 10px;
  margin-top: -40px;
  border: 20px rgba(255, 255, 255, 0.85) solid;
  border-radius: 50%;
}

.swiper :deep(.swiper-button-prev:after) {
  font-size: 20px;
}

.swiper :deep(.swiper-button-next:after) {
  font-size: 20px;
}

.navigation :deep(.swiper-button-next) {
  color: black;
  height: 10px;
  width: 10px;
  margin-top: -40px;
  border: 20px rgba(255, 255, 255, 0.85) solid;
  border-radius: 50%;
}

.no-navigation :deep(.swiper-button-next) {
  display: none;
}

.no-navigation :deep(.swiper-button-prev) {
  display: none;
}
</style>
