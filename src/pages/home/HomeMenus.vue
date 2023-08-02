<template>
  <div v-if="$menuGroup.currentGroups.length">
    <div class="header mt-25 mb-17">Меню</div>
    <div
      v-for="(el, index) in $menuGroup.currentGroups"
      :key="index"
      :class="{ 'pt-7': index }"
      class="full-width"
      :id="el.id"
    >
      <div class="header2 mb-10">
        {{ el.name }}
      </div>
      <div v-if="el.items.length" class="row full-width">
        <div v-for="(el2, index2) in el.items" :key="index2" class="col-2">
          <MenuItemCard
            :class="!index2 || index2 % 6 === 0 ? ' mb-10' : 'ml-10'"
            :item="el2"
          />
        </div>
      </div>
      <div v-else>Пусто</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import MenuItemCard from 'src/components/cards/MenuItemCard.vue';
</script>
