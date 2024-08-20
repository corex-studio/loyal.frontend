<template>
  <div v-if="value?.chip?.label">
    <div
      class="px-2 py-1"
      style="border-radius: 6px"
      :style="`background: ${value.chip.color}; color: ${getTextColorOnColor(value.chip.color)}`"
    >{{ value.chip.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { OrderType } from 'src/models/menu/menuItem/menuRulesForAdding/menuRulesForAdding'
import { computed } from 'vue'
import { themeRepo } from 'src/models/theme/themeRepo'
import { getTextColorOnColor } from 'src/services/colorFunctions'

const props = defineProps<{
  delivery_type?: OrderType | string
}>()

const value = computed(() => {
  return themeRepo.currentCompanyTheme?.getDeliveryTypeSchema(props.delivery_type)
})

</script>

<style scoped lang="scss">

</style>
