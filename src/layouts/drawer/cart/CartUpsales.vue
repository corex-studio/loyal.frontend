<template>

  <div class="mt-15">
    <div class="header3 bold">Рекомендуем к заказу</div>
    <div
      :style="`width:${$q.screen.lt.lg ? $q.screen.width - ($q.screen.lt.lg ? ($q.screen.md ? 64 : 38) : 64) : 516}px`"
      class="mt-8"
    >
      <SwiperContainer
        :key="`${$store.offersTab}${$q.screen.gt.md}`"
        :initial-slide="0"
        :items="upsales"
        :slides-per-view="$q.screen.lt.md ? 2.3 : $q.screen.md ? 3.5 : 3.4"
        no-navigation
      >
        <template v-slot:item="{ item }: { item: MenuItem }">
          <div
            class="border-radius cursor-pointer column"
            @click="openItemModal(item)"
          >
            <q-img
              :src="item.image?.thumbnail || $store.images.empty"
              class="border-radius"
            />
            <div
              class="column px-5 py-4 body text-on-backgroun-color secondary-text"
            >
              <div class="ellipsis-2-lines" style="min-height: 40px">
                {{ item.name }}
              </div>
              <div class="row gap-3" v-if="item.sizes[0].specialPrice !== null">
                <div class="row gap-2 bold text-primary">
                  <div class="bold">
                    {{ beautifyNumber(item.sizes[0].specialPrice || 0) }}
                  </div>
                  <div class="bold" itemprop="priceCurrency">₽</div>
                </div>
                <div class="row gap-2 ml-2 items-center caption-text text-strike text-secondary">
                  <div class="bold">{{ beautifyNumber(item.sizes[0].price || 0) }}</div>
                  <div class="bold" itemprop="priceCurrency">₽</div>
                </div>

              </div>
              <div class="row gap-3" v-else>
                <div class="bold text-primary row items-center" v-if="item.sizes[0].specialPrice !== null">
                  {{ beautifyNumber(item.sizes[0].specialPrice || 0) }}
                </div>
                <div class="bold row">
                  {{ beautifyNumber(item.sizes[0].price || 0) }}
                </div>
                <div class="bold" itemprop="priceCurrency">₽</div>
              </div>
            </div>
          </div>
        </template>
      </SwiperContainer
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

const openItemModal = async (menuItem: MenuItem) => {
  store.openMenuItemModal(menuItem)
  await menuItemRepo.retrieve(menuItem.id || '', {
    sales_point: salesPointRepo.item?.id,
  })
}
</script>
