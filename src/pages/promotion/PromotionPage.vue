<template>
  <div v-if="$promotion.item" style="min-height: 450px" class="pt-20">
    <div class="c-container">
      <div class="row full-width justify-between text-on-background-color">
        <div class="column col-6">
          <div class="header mb-15">{{ $promotion.item?.name }}</div>
          <div class="bold mb-10">Описание</div>
          <div class="body mb-15">
            {{ $promotion.item?.description || '-' }}
          </div>
        </div>
        <div class="col-5">
          <q-img
            v-if="$promotion.item.images.length < 2"
            style="max-height: 300px"
            class="rounded-15"
            fit="contain"
            :src="$promotion.item?.image?.thumbnail || $store.images.empty"
          />
          <SwiperContainer
            v-else
            no-navigation
            class="col"
            use-bullets
            :slides-per-view="1.1"
            :items="$promotion.item.images"
          >
            <template v-slot:item="{ item }">
              <!-- :style="`border-radius:${getBorderRadius}`" -->
              <q-img
                class="border-radius"
                :src="item.thumbnail || $store.images.empty"
                fit="contain"
                style="max-height: 300px; min-height: 300px"
              >
                <template v-slot:error>
                  <span>
                    <q-img
                      class="border-radius"
                      style="
                        max-height: 300px !important;
                        min-height: 300px !important;
                      "
                      :src="$store.images.empty"
                    ></q-img>
                  </span>
                </template>
              </q-img> </template
          ></SwiperContainer>
        </div>
      </div>
    </div>
    <div class="mt-25">
      <div class="header text-on-background-color c-container">Акции</div>
      <SwiperContainer
        use-bullets
        :slides-per-view="4"
        class="swiper"
        :items="$promotion.items"
      >
        <template v-slot:item="{ item }">
          <div
            style="overflow: overlay; height: 240px"
            @click="goToItem(item)"
            class="cursor-pointer mt-10 bg-backing-color text-on-backing-color border-radius box-shadow column no-wrap"
          >
            <q-img
              :src="item.image?.thumbnail || $store.images.empty"
              style="border-radius: 10px 10px 0 0"
              height="175px"
              fit="cover"
            />
            <div class="px-5 py-7">
              <div class="ellipsis-2-lines">
                {{ 'name' in item ? item.name : item.title }}
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
import { Promotions } from 'src/models/promotion/promotions'
import { promotionsRepo } from 'src/models/promotion/promotionsRepo'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()

const router = useRouter()

onMounted(async () => {
  await promotionsRepo.retrieve(String(route.params.promotionId))
  if (!promotionsRepo.items.length) await promotionsRepo.list()
})

const goToItem = (item: Promotions) => {
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
