<template>
  <div
    class="row gap-5 items-center no-wrap pa-3 company-row border-radius cursor-pointer"
  >
    <q-img
      class="border-radius"
      fit="contain"
      style="width: 75px; height: 75px"
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
    <div class="body bold">
      {{ item.name }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Company } from 'src/models/company/company'

defineProps<{
  item: Company
}>()
</script>

<style lang="scss" scoped>
.company-row {
  border: 1px var(--primary) solid;
}
</style>
