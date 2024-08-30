<template>
  <div>
    <div
      v-if="$slots.top"
      class="row full-width no-wrap gap-5 justify-between mb-lg-15 mb-xs-10"
    >
      <slot name="top"></slot>
      <div class="row gap-4 no-wrap">
        <CIconButton
          class="outlined-button"
          icon="fa-regular fa-chevron-left"
          icon-color="on-background-color"
          icon-size="20px"
          outline
          size="46px"
          @click="prevPage"
        />
        <CIconButton
          class="outlined-button"
          icon="fa-regular fa-chevron-right"
          icon-color="on-background-color"
          icon-size="20px"
          outline
          size="46px"
          @click="nextPage"
        />
      </div>
    </div>
    <swiper
      :centered-slides="centeredSlides"
      :class="noNavigation ? 'no-navigation' : 'navigation'"
      :initial-slide="initialSlide"
      :loop="loop"
      :modules="modules"
      :mousewheel="{
        releaseOnEdges: true,
        sensitivity: 0.5,
        forceToAxis: true,
      }"
      :pagination="{
        clickable: true,
      }"
      :slides-per-view="slidesPerView || 3"
      :space-between="spaceBetween === undefined ? 20 : spaceBetween"
      navigation
      @swiper="onSwiper"
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

<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Swiper as SwiperClass } from 'swiper'
import { Navigation, Pagination, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { computed } from 'vue'
import CIconButton from 'src/components/template/buttons/CIconButton.vue'

const props = defineProps<{
  items: Array<any>
  loop?: boolean
  spaceBetween?: number
  slidesPerView?: number
  useBullets?: boolean
  noNavigation?: boolean
  initialSlide?: number
  centeredSlides?: boolean
}>()

let swiperInstance: SwiperClass | null = null

const modules = computed(() => {
  const res = []
  if (!props.noNavigation) res.push(Navigation)
  res.push(Mousewheel)
  if (props.useBullets) {
    res.push(Pagination)
  }

  return res
})

const nextPage = () => {
  swiperInstance?.slideNext()
}

const prevPage = () => {
  swiperInstance?.slidePrev()
}

const onSwiper = (swiper: SwiperClass) => {
  swiperInstance = swiper
}
</script>

<style lang="scss" scoped>
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
  border: 20px rgba(255, 255, 255, 0.7) solid;
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
  border: 20px rgba(255, 255, 255, 0.7) solid;
  border-radius: 50%;
}

.no-navigation :deep(.swiper-button-next) {
  display: none;
}

.no-navigation :deep(.swiper-button-prev) {
  display: none;
}

.outlined-button :deep(.q-btn--outline:before) {
  border: 2px var(--secondary) solid !important;
  border-radius: 50%;
}

.outlined-button {
  border-radius: 50% !important;
  overflow: hidden !important;
}
</style>
