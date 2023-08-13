<template>
  <div
    v-if="$news.item"
    style="min-height: 450px"
    class="pt-20 text-on-background-color"
  >
    <div class="row full-width justify-between">
      <div class="column col-6" style="overflow-x: hidden">
        <div class="header mb-15">{{ $news.item.title }}</div>

        <div
          v-if="$news.item.fullDescription"
          v-html="$news.item.fullDescription"
        ></div>
        <div v-else>-</div>
      </div>
      <div class="col-5">
        <q-img
          v-if="$news.item.images.length < 2"
          style="max-height: 300px"
          class="rounded-15"
          fit="contain"
          :src="$news.item.image?.thumbnail || $store.images.empty"
        >
          <template v-slot:error>
            <span>
              <q-img
                class="user-image"
                fit="cover"
                height="300px"
                :src="$store.images.empty"
              ></q-img>
            </span> </template
        ></q-img>
        <SwiperContainer
          v-else
          no-navigation
          class="col"
          use-bullets
          :slides-per-view="1.1"
          :items="$news.item.images"
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
</template>
<script lang="ts" setup>
import SwiperContainer from 'src/layouts/containers/SwiperContainer.vue'
import { newsRepo } from 'src/models/news/newsRepo'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  void newsRepo.retrieve(String(route.params.newsId))
})
</script>

<style lang="scss" scoped></style>
