<template>
  <div>
    <div class="header mb-12 c-container">Спец предложения</div>
    <TabPicker
      class="c-container"
      @update-tab="currentTab = $event"
      :tabs="tabs"
      :model-value="currentTab"
    />

    <SwiperContainer
      use-bullets
      class="swiper"
      :slides-per-view="4"
      :items="currentTab === 'Новости' ? $news.items : $promotion.items"
    >
      <template v-slot:item="{ item }">
        <div
          style="height: 295px; overflow: hidden"
          @click="goToItem(item)"
          class="cursor-pointer offer-block mt-10 body box-shadow border-radius column no-wrap bg-backing-color"
        >
          <q-img
            :src="item.image?.thumbnail || $store.images.empty"
            :style="`border-radius:${getBorderRadius}`"
            height="180px"
            style="min-height: 180px"
            fit="cover"
          />
          <div class="px-5 py-7 column justify-between items-start full-height">
            <div class="ellipsis text-on-backing-color">
              {{ 'name' in item ? item.name : item.title }}
            </div>
            <div
              v-if="
                'shortDescription' in item
                  ? item.shortDescription?.length
                  : item.description?.length
              "
              class="ellipsis-2-lines mt-5 text-on-backing-color"
              style="opacity: 0.6"
            >
              {{
                'shortDescription' in item
                  ? item.shortDescription
                  : item.description
              }}
            </div>
            <CButton
              @click="void 0"
              class="mt-4"
              style="margin-left: -2px"
              text-button
              text-color="button-color"
            >
              Читать полностью</CButton
            >
          </div>
        </div>
      </template></SwiperContainer
    >
    <div
      v-if="currentTab === 'Новости' && !$news.items.length"
      class="header3 pl-6 my-20 c-container"
    >
      У вас нет новостей
    </div>
    <div
      v-if="currentTab === 'Акции' && !$promotion.items.length"
      class="header3 pl-6 my-20 c-container"
    >
      У вас нет акций
    </div>

    <div class="row no-wrap full-width gap-10 c-container"></div>
  </div>
</template>

<script setup lang="ts">
import TabPicker from 'src/components/template/buttons/TabPicker.vue'
import SwiperContainer from 'src/layouts/containers/SwiperContainer.vue'
import { computed, ref } from 'vue'
import { Promotions } from 'src/models/promotion/promotions'
import { News } from 'src/models/news/news'
import { useRouter } from 'vue-router'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import CButton from 'src/components/template/buttons/CButton.vue'
import { newsRepo } from 'src/models/news/newsRepo'
import { promotionsRepo } from 'src/models/promotion/promotionsRepo'

const tabs = computed(() => {
  const result = []
  if (newsRepo.items.length) result.push('Новости')
  if (promotionsRepo.items.length) result.push('Акции')
  return result
})

const router = useRouter()

const currentTab = ref('Новости')

const getBorderRadius = computed(() => {
  return `${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px 0 0`
})

const goToItem = (item: News | Promotions) => {
  if ('shortDescription' in item) {
    void router.push({ name: 'newsPage', params: { newsId: item.id } })
  } else
    void router.push({
      name: 'promotionPage',
      params: { promotionId: item.id },
    })
}
</script>

<style lang="scss" scoped>
.swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
  @media (max-width: 1919px) {
    max-width: 1420px;
  }
  @media (min-width: 1919px) {
    max-width: 1480px;
  }
}
body.screen--xl {
  .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
    @media (max-width: 1560px) {
      padding-left: 60px;
      padding-right: 60px;
    }

    @media (min-width: 1560px) {
      padding-left: 30px;
      padding-right: 30px;
    }
  }
}

body.screen--lg {
  .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
    width: 100%;
    margin: 0 auto;
    padding-left: 40px;
    padding-right: 40px;
  }
}

body.screen--md {
  .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
    width: 100%;
    margin: 0 auto;
    padding-left: 15px;
    padding-right: 15px;
  }
}

body.screen--sm {
  .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
    width: 100%;
    margin: 0 auto;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
