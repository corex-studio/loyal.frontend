<template>
  <div>
    <div
      class="row no-wrap column pt-lg-20 pt-md-10 pt-xs-8 text-on-background-color"
    >
      <HomeScanQr v-if="$salesPoint.item?.settings.allow_arrange_from_qr" />
      <HomeSpecialOffers />
      <HomeMenus class="c-container" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import HomeSpecialOffers from './HomeSpecialOffers.vue'
import { defineAsyncComponent, onMounted } from 'vue'
import HomeMenus from './HomeMenus.vue'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'

const HomeScanQr = defineAsyncComponent(() => import('./HomeScanQr.vue'))

onMounted(() => {
  menuGroupRepo.elementsInViewport = []
})
</script>
