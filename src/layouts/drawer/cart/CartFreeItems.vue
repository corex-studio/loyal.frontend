<template>
  <div v-if="$cart.item" class="column full-width gap-8 mt-15">
    <div class="header3 bold">Выберите подарок</div>
    <div class="row full-width">
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import GridContainer from 'src/components/containers/GridContainer.vue'
import CartFreeItemCard from './CartFreeItemCard.vue'
</script>
