<template>
  <div id="offers">
    <div class="row c-container gap-6 items-center text-on-background-color">
      <div
        v-for="(el, index) in tabs"
        :key="index"
        class="row gap-6 items-center huge3 bold"
      >
        <div
          v-if="index"
          style="width: 9px; height: 9px; border-radius: 50%"
          class="bg-secondary-text"
        ></div>
        <div
          @click="$store.offersTab = el"
          :class="
            $store.offersTab !== el ? 'text-secondary-text' : 'text-primary'
          "
          class="cursor-pointer bold"
        >
          {{ el }}
        </div>
      </div>
    </div>

    <SwiperContainer
      :key="`${$store.offersTab}${$q.screen.gt.md}`"
      :class="{
        swiper: !isNewsDesktopView,
        'px-20': slidesPerView === 1 && $q.screen.gt.md,
      }"
      :initial-slide="0"
      :slides-per-view="slidesPerView"
      no-navigation
      :centered-slides="isNewsDesktopView"
      :loop="isNewsDesktopView && $news.news.length > 2"
      :items="$store.offersTab === 'Новости' ? $news.news : $news.promotions"
    >
      <template v-slot:item="{ item }">
        <div
          :style="`overflow: hidden; max-height: ${isNewsDesktopView ? '400px;' : ''} max-width: ${$q.screen.lt.md ? '100%;' : ''}`"
          @click="goToItem(item)"
          class="cursor-pointer body border-radius column no-wrap bg-backing-color mt-15"
        >
          <q-img
            :src="getImage(item)"
            :style="`border-radius:${getBorderRadius}; object-position: left 50%;`"
            position="left"
            fit="cover"
            :alt="item.title"
            :ratio="isNewsDesktopView ? undefined : 16 / 9"
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
    <div
      v-if="$store.offersTab === 'Новости' && !$news.news.length"
      class="header3 pl-6 my-20 c-container"
    >
      У вас нет новостей
    </div>
    <div
      v-if="$store.offersTab === 'Акции' && !$news.promotions.length"
      class="header3 pl-6 my-lg-20 mt-xs-10 c-container"
    >
      У вас нет акций
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { News } from 'src/models/news/news'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { useQuasar } from 'quasar'
import { store } from 'src/models/store'
import { newsRepo } from 'src/models/news/newsRepo'
import { useFictiveUrlStore } from 'stores/fictiveUrlStore'

const SwiperContainer = defineAsyncComponent(() => import('src/layouts/containers/SwiperContainer.vue'))

const q = useQuasar()

onMounted(() => {
    if (fictiveUrlStore.currentNewsItem) {
      void newsRepo.retrieve(fictiveUrlStore.currentNewsItem).then(() => {
        fictiveUrlStore.setFictiveNewsUrl()
        store.newsModal = true
      })
    }
})

const tabs = computed(() => {
  const result = []
  result.push('Новости')
  result.push('Акции')
  return result
})

const getImage = (item: News) => {
  if (isNewsDesktopView.value)
    return item.desktopImage?.image || store.images.empty
  return item.image?.image || store.images.empty
}

const isNewsDesktopView = computed(() => {
  if (q.screen.lt.lg) return false
  if (store.offersTab !== 'Новости') return false
  return !newsRepo.news.filter((v) => !v.desktopImage).length
})

const slidesPerView = computed(() => {
  if (!isNewsDesktopView.value) return smallBannersSlidesPerView.value
  if (q.screen.gt.md) {
    const paddings: Record<string, number> = {
      xl: 120,
      lg: 80,
    }
    const width = q.screen.width
    const currentPadding = width <= 1560 ? paddings[q.screen.name] || 0 : 0
    const currentContainer = 1290 - currentPadding
    const res = Number((width / currentContainer).toFixed(2))
    return res < 1 ? 1 : res
  }
  return smallBannersSlidesPerView.value
})

const smallBannersSlidesPerView = computed(() => {
  return q.screen.lt.md ? 1.2 : q.screen.lt.lg ? 2 : 2.5
})

const getBorderRadius = computed(() => {
  return `${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px 0 0`
})

const fictiveUrlStore = useFictiveUrlStore()

const goToItem = (item: News) => {
  void newsRepo.retrieve(item.id).then(v => {
    fictiveUrlStore.currentNewsItem = v.alias || v.id
    fictiveUrlStore.setFictiveNewsUrl()
  })
  store.newsModal = true
}
</script>

<style lang="scss" scoped>
body.screen--xl {
  .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
    @media (max-width: 1560px) {
      padding-left: calc((100vw - (1170px)) / 2);
      padding-right: calc((100vw - (1170px)) / 2);
    }
    @media (min-width: 1560px) {
      padding-left: calc((100vw - (1290px)) / 2);
      padding-right: calc((100vw - (1290px)) / 2);
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

body.screen--xs {
  .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
    width: 100%;
    margin: 0 auto;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
