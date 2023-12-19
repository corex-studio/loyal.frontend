<template>
  <div class="column full-width gap-6">
    <div
      v-for="(nutrition, index) in size?.nutritions"
      :key="index"
      class="row gap-6 body"
    >
      <div class="column gap-2">
        <div style="opacity: 0.8">Калорийность</div>
        <div>{{ nutrition.calories ? nutrition.calories + ' ккал' : '-' }}</div>
      </div>
      <div class="column gap-2">
        <div style="opacity: 0.8">Белки</div>
        <div>{{ nutrition.proteins ? nutrition.proteins + ' г' : '-' }}</div>
      </div>
      <div class="column gap-2">
        <div style="opacity: 0.8">Жиры</div>
        <div>{{ nutrition.fats ? nutrition.fats + ' г' : '-' }}</div>
      </div>
      <div class="column gap-2">
        <div style="opacity: 0.8">Углеводы</div>
        <div>
          {{ nutrition.carbohydrates ? nutrition.carbohydrates + ' г' : '-' }}
        </div>
      </div>
      <!-- <div
        v-for="(el, index) in size?.nutritions"
        :key="index"
        class="column gap-2"
      >
        {{ el }}
      </div> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ItemSize } from 'src/models/menu/menu'

defineProps<{
  size: ItemSize | null
}>()
</script>
