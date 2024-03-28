<template>
  <div class="mt-sm-15 mt-xs-10">
    <div class="header3 bold mb-10">История начислений</div>
    <div v-if="$balanceOperations.items.length" class="column full-width gap-6">
      <div
        v-for="(el, index) in $balanceOperations.items"
        :key="index"
        class="row full-width no-wrap items-center justify-between gap-10 py-5 px-8 border-radius2 bg-backing-color text-on-backing-color"
      >
        <div class="column gap-1 body">
          <div>{{ el.message }}</div>
          <div class="text-secondary">{{ el.createdAt }}</div>
        </div>
        <div
          class="subtitle-text row gap-2 items-center no-wrap"
          :class="el.sum < 0 ? 'text-danger' : 'text-success'"
        >
          {{ el.sum }}
          <CIcon
            size="21px"
            class="mb-1"
            :color="el.sum < 0 ? 'danger' : 'success'"
            name="fa-regular fa-circle-star"
          />
        </div>
      </div>
    </div>
    <div v-else class="body text-secondary">Начислений не найдено</div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
</script>
