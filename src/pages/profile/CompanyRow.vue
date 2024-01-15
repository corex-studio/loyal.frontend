<template>
  <div
    class="row items-center border-radius cursor-pointer pa-4 gap-6"
    :style="selected ? `outline: 2px ${getBorderColor} solid` : ''"
  >
    <q-img
      height="54px"
      width="54px"
      class="border-radius"
      fit="cover"
      :src="item.image?.thumbnail || $store.images.empty"
    >
      <template v-slot:error>
        <span>
          <q-img
            class="border-radius"
            fit="cover"
            width="54px"
            height="54px"
            :src="$store.images.empty"
          ></q-img>
        </span> </template
    ></q-img>
    <div class="column col-grow">
      <div class="header3 bold">{{ item.name }}</div>
      <!-- <div class="body">{{ item }}</div> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
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
