<template>
  <div id="offers">
    <!-- <div class="header mb-12 c-container">Спец предложения</div> -->
    <!-- <TabPicker
      class="c-container"
      @update-tab="$store.offersTab = $event"
      :tabs="tabs"
      :width="$q.screen.xs ? '100%' : undefined"
      :model-value="$store.offersTab"
    /> -->
    <div class="row c-container gap-6 items-center text-on-background-color">
      <div
        v-for="(el, index) in tabs"
        :key="index"
        class="row gap-6 items-center huge2 bold"
      >
        <div
          v-if="index"
          style="width: 9px; height: 9px; border-radius: 50%"
          class="bg-on-background-color"
        ></div>
        <div
          @click="$store.offersTab = el"
          :style="$store.offersTab !== el ? 'opacity: 0.5' : ''"
          class="cursor-pointer bold"
        >
          {{ el }}
        </div>
      </div>
    </div>

    <SwiperContainer
      v-if="$companyGroup.item?.externalId !== 'corex_demo'"
      class="swiper"
      :initial-slide="1"
      :slides-per-view="slidesPerView"
      :items="$store.offersTab === 'Новости' ? $news.items : $promotion.items"
    >
      <template v-slot:item="{ item }">
        <div
          style="overflow: hidden; height: 360px"
          @click="goToItem(item)"
          class="cursor-pointer body border-radius column no-wrap bg-backing-color mb-20 mt-15"
        >
          <q-img
            :src="item.image?.thumbnail || $store.images.empty"
            :style="`border-radius:${getBorderRadius}`"
            height="100%"
            fit="cover"
          >
            <template v-slot:error>
              <span>
                <q-img
                  fit="cover"
                  height="100%"
                  :src="$store.images.empty"
                ></q-img>
              </span>
            </template>
          </q-img>
        </div> </template
    ></SwiperContainer>
    <SwiperContainer
      v-else
      class="swiper"
      :initial-slide="1"
      :slides-per-view="slidesPerView"
      :items="banners"
    >
      <template v-slot:item="{ item }">
        <div
          style="overflow: hidden; height: 360px"
          class="cursor-pointer body border-radius no-wrap bg-backing-color mb-20 mt-15 column justify-center"
        >
          <q-img
            :src="getImage(item.image)"
            height="360px"
            class="border-radius"
            fit="cover"
            style="position: absolute"
          >
            <template v-slot:error>
              <span>
                <q-img
                  fit="cover"
                  height="100%"
                  :src="$store.images.empty"
                ></q-img>
              </span>
            </template>
          </q-img>
          <div
            style="z-index: 10; padding-left: 10%; width: 45%"
            class="text-white huge"
          >
            {{ item.text }}
          </div>
        </div></template
      >
    </SwiperContainer>
    <div
      v-if="$store.offersTab === 'Новости' && !$news.items.length"
      class="header3 pl-6 my-20 c-container"
    >
      У вас нет новостей
    </div>
    <div
      v-if="$store.offersTab === 'Акции' && !$promotion.items.length"
      class="header3 pl-6 my-20 c-container"
    >
      У вас нет акций
    </div>

    <!-- <div class="row no-wrap full-width gap-10 c-container"></div> -->
  </div>
</template>

<script setup lang="ts">
import SwiperContainer from 'src/layouts/containers/SwiperContainer.vue'
import { computed } from 'vue'
import { Promotions } from 'src/models/promotion/promotions'
import { News } from 'src/models/news/news'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { useQuasar } from 'quasar'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { store } from 'src/models/store'
import { newsRepo } from 'src/models/news/newsRepo'
import { promotionsRepo } from 'src/models/promotion/promotionsRepo'

const q = useQuasar()

const banners = [
  {
    image: 'baner1.jpg',
    text: 'Натуральные лимонады Starbar Craft',
  },
  {
    image: 'baner2.jpg',
    text: 'Знаменитый тайский суп Том Ям — от 369 ₽',
  },
  {
    image: 'baner1.jpg',
    text: 'Натуральные лимонады Starbar Craft',
  },
  {
    image: 'baner2.jpg',
    text: 'Знаменитый тайский суп Том Ям — от 369 ₽',
  },
  {
    image: 'baner1.jpg',
    text: 'Натуральные лимонады Starbar Craft',
  },
  {
    image: 'baner2.jpg',
    text: 'Знаменитый тайский суп Том Ям — от 369 ₽',
  },
]

const tabs = computed(() => {
  const result = []
  result.push('Акции')
  result.push('Новости')
  return result
})

const slidesPerView = computed(() => {
  return store.offersTab === 'Акции'
    ? 1
    : q.screen.xs
    ? 1
    : companyGroupRepo.item?.externalId === 'corex_demo'
    ? 1
    : q.screen.sm
    ? 2
    : 3
})

const getBorderRadius = computed(() => {
  return `${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px 0 0`
})

const getImage = (link: string) => {
  try {
    return require('assets/' + link) as string
  } catch {
    return store.images.empty
  }
}

const goToItem = (item: News | Promotions) => {
  if ('shortDescription' in item) {
    void newsRepo.retrieve(item.id)
    store.newsModal = true
    // void router.push({ name: 'newsPage', params: { newsId: item.id } })
  } else {
    promotionsRepo.retrieve(item.id)
    store.newsModal = true
  }
  // void router.push({
  //   name: 'promotionPage',
  //   params: { promotionId: item.id },
  // })
}
</script>

<style lang="scss" scoped>
// .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
//   @media (max-width: 1919px) {
//     max-width: 1420px;
//   }
//   @media (min-width: 1919px) {
//     max-width: 1480px;
//   }
// }
body.screen--xl {
  .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
    @media (max-width: 1560px) {
      padding-left: 160px;
      padding-right: 160px;
    }

    @media (min-width: 1560px) {
      padding-left: calc((100vw - (1420px)) / 2);
      padding-right: calc((100vw - (1420px)) / 2);
    }
  }
}

body.screen--lg {
  .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
    width: 100%;
    margin: 0 auto;
    padding-left: calc((100vw - (1344px)) / 2);
    padding-right: calc((100vw - (1344px)) / 2);
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

body.screen--xs {
  .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
    width: 100%;
    margin: 0 auto;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
