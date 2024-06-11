<template>
  <div v-if="$cart.item" class="column full-width gap-8 mt-15">
    <div class="header3 bold">Выберите подарок</div>
    <div
      :style="`width:${$q.screen.lt.lg ? $q.screen.width - ($q.screen.lt.lg ? ($q.screen.md ? 64 : 38) : 64) : 516}px`"
    >
      <SwiperContainer
        :key="`${$store.offersTab}${$q.screen.gt.md}`"
        :initial-slide="0"
        :slides-per-view="$q.screen.lt.md ? 2.3 : $q.screen.md ? 3.5 : 3.4"
        no-navigation
        :items="$cart.item.freeItems.filter((el) => !el.applied)"
      >
        <template v-slot:item="{ item }">
          <CartFreeItemCard :item="item" /> </template
      ></SwiperContainer>
    </div>
    <!-- <div class="row full-width">
      <GridContainer
        :items="$cart.item.freeItems.filter((el) => !el.applied)"
        :lg="3"
        :xl="3"
        :md="4"
        :sm="3"
        :xs="2"
        :gap="$q.screen.gt.md ? '20px' : $q.screen.md ? '16px' : '8px'"
      >
        <template v-slot:item="{ item }">
          <CartFreeItemCard :item="item" />
        </template>
      </GridContainer>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import CartFreeItemCard from './CartFreeItemCard.vue'
import SwiperContainer from 'src/layouts/containers/SwiperContainer.vue'
</script>
