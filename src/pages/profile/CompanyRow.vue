<template>
  <div
    class="row items-center no-wrap border-radius cursor-pointer pa-4 gap-6"
    :style="
      $q.screen.lt.md
        ? ''
        : selected
        ? `outline: 2px ${getBorderColor} solid`
        : ''
    "
  >
    <q-img
      :height="$q.screen.lt.md ? '44px' : '54px'"
      :width="$q.screen.lt.md ? '44px' : '54px'"
      :style="`min-height: ${$q.screen.lt.md ? '44px' : '54px'} ; min-width: ${
        $q.screen.lt.md ? '44px' : '54px'
      }`"
      class="border-radius"
      fit="cover"
      :src="item.image?.thumbnail || $store.images.empty"
    >
      <template v-slot:error>
        <span>
          <q-img
            class="border-radius"
            fit="cover"
            :width="$q.screen.lt.md ? '44px' : '54px'"
            :height="$q.screen.lt.md ? '44px' : '54px'"
            :src="$store.images.empty"
          ></q-img>
        </span> </template
    ></q-img>
    <div class="header3 bold row justify-between col-grow">
      {{ item.name }}

      <RoundedSelector
        v-if="$q.screen.lt.md"
        :model-value="selected"
        check
        height="24px"
        width="24px"
        icon-size="14px"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import RoundedSelector from 'src/components/template/buttons/RoundedSelector.vue'
import { Company } from 'src/models/company/company'
import { lightColor } from 'src/models/store'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { computed } from 'vue'

const props = defineProps<{
  item: Company
  selected: boolean
}>()

const getBorderColor = computed(() => {
  return props.selected
    ? '#' + uiSettingsRepo.item?.primaryColor.color
    : lightColor(uiSettingsRepo.item?.backgroundColor.on_color || '000', '20')
})
</script>

<style lang="scss" scoped>
.company-row {
  border: 1px var(--primary) solid;
}
</style>
