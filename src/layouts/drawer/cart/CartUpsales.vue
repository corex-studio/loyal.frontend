<template>
  <div class="mt-15">
    <div class="header3 bold">Также заказывают</div>
    <div
      class="mt-8"
      :style="`width:${$q.screen.lt.lg ? $q.screen.width - ($q.screen.lt.lg ? ($q.screen.md ? 64 : 38) : 64) : 516}px`"
    >
      <SwiperContainer
        :key="`${$store.offersTab}${$q.screen.gt.md}`"
        :initial-slide="0"
        :slides-per-view="$q.screen.lt.md ? 2.3 : $q.screen.md ? 3.5 : 3.4"
        no-navigation
        :items="upsales"
      >
        <template v-slot:item="{ item }: { item: MenuItem }">
          <div
            @click="openItemModal(item.id)"
            class="border-radius cursor-pointer column"
          >
            <q-img
              class="border-radius"
              :src="item.image?.thumbnail || $store.images.empty"
            />
            <div
              class="column px-5 py-4 body text-on-backgroun-color secondary-text"
            >
              <div style="min-height: 40px" class="ellipsis-2-lines">
                {{ item.name }}
              </div>
              <div class="row gap-2">
                <div class="bold">
                  {{ beautifyNumber(item.sizes[0].price || 0) }}
                </div>
                <div itemprop="priceCurrency" class="bold">₽</div>
              </div>
            </div>
          </div>
        </template></SwiperContainer
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import SwiperContainer from 'src/layouts/containers/SwiperContainer.vue'
import { MenuItem } from 'src/models/menu/menuItem/menuItem'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { beautifyNumber, store } from 'src/models/store'

defineProps<{
  upsales: MenuItem[]
}>()

const openItemModal = async (menuItemId: string | null) => {
  store.openMenuItemModal()
  await menuItemRepo.retrieve(menuItemId || '', {
    sales_point: salesPointRepo.item?.id,
  })
}
</script>
