<template>
  <div
    class="row justify-center border-radius cursor-pointer"
    style="overflow: hidden; max-height: 138px"
    :style="`border: 1px ${getBorderColor} solid`"
  >
    <q-img
      height="138px"
      fit="contain"
      :src="item.image?.thumbnail || $store.images.empty"
    >
      <template v-slot:error>
        <span>
          <q-img
            class="user-image"
            fit="contain"
            :src="$store.images.empty"
          ></q-img>
        </span> </template
    ></q-img>
    <!-- <div class="body bold">
      {{ item.name }}
    </div> -->
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
