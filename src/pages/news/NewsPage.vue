<template>
  <div class="pt-20 text-on-background-color">
    <div class="row full-width justify-between">
      <div class="column col-6" style="overflow-x: hidden">
        <div class="header mb-15">{{ $news.item?.title }}</div>

        <div class="bold mb-10">Полное описание</div>

        <div
          v-if="$news.item?.fullDescription"
          v-html="$news.item?.fullDescription"
        ></div>
        <div v-else>-</div>
      </div>
      <div class="col-5">
        <q-img
          style="max-height: 300px"
          class="rounded-15"
          fit="contain"
          :src="$news.item?.image?.thumbnail || $store.images.empty"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { newsRepo } from 'src/models/news/newsRepo';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

onMounted(() => {
  void newsRepo.retrieve(String(route.params.newsId));
});
</script>

<style lang="scss" scoped></style>
