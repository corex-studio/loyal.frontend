<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div class="row no-wrap column pt-20 text-on-background-color">
      <HomeBonuses v-if="authentication.user" class="mb-20 c-container" />
      <HomeSpecialOffers />
      <HomeMenus class="c-container" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { newsRepo } from 'src/models/news/newsRepo';
import HomeBonuses from './HomeBonuses.vue';
import HomeSpecialOffers from './HomeSpecialOffers.vue';
import { onMounted } from 'vue';
import { promotionsRepo } from 'src/models/promotion/promotionsRepo';
import HomeMenus from './HomeMenus.vue';
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo';
import { authentication } from 'src/models/authentication/authentication';

onMounted(() => {
  menuGroupRepo.elementInViewport = null;
  if (!newsRepo.items.length) void newsRepo.list();
  if (!promotionsRepo.items.length) void promotionsRepo.list();
});
</script>
