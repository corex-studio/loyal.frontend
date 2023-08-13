<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div class="row no-wrap column pt-20 text-on-background-color">
      <HomeBonuses
        v-if="authentication.user && showBonuses"
        class="mb-20 c-container"
      />
      <HomeSpecialOffers />
      <HomeMenus class="c-container" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import HomeBonuses from './HomeBonuses.vue'
import HomeSpecialOffers from './HomeSpecialOffers.vue'
import { onMounted, computed } from 'vue'
import HomeMenus from './HomeMenus.vue'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
import { authentication } from 'src/models/authentication/authentication'

const showBonuses = computed(() => {
  return authentication.user?.wallets.filter((v) => v.type === 'bonus').length
})

onMounted(() => {
  menuGroupRepo.elementInViewport = null
})
</script>
