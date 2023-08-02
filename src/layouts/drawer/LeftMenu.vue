<template>
  <div
    :style="`height: ${kek}px ; width: 260px;min-width: 260px;`"
    class="text-white header"
  >
    <div
      v-if="$menu.item"
      style="
        position: fixed;
        overflow: auto;
        width: inherit;
        height: inherit;
        font-weight: 300;
        font-size: 18px;
        line-height: 30px;
      "
      :style="`background: #${$uiSettings.item?.backgroundColor}`"
      class="row gap-10 pb-xs-50 pb-md-0 items-center pa-10"
    >
      <q-img
        class="mb-20"
        style="border-radius: 30%"
        :src="
          $uiSettings.item?.logo
            ? $uiSettings.item?.logo.thumbnail
            : $store.images.empty
        "
      ></q-img>

      <div
        class="full-width cursor-pointer"
        v-for="(el, index) in $menu.item?.groups"
        :key="index"
        style="text-align: center"
        :style="
          $route.params.categoryId === el.uuid
            ? `text-decoration: underline; color: #${$uiSettings.item?.primaryColor} !important`
            : `color: #${$uiSettings.item?.onBackgroundColor}`
        "
        @click="
          $router.push({
            name: 'categoryPage',
            params: { categoryId: el.uuid },
          })
        "
        :class="{ 'mb-10': index === $menu.item.groups.length - 1 }"
      >
        {{ el.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';

const q = useQuasar();

const kek = computed(() => {
  let footerHeight = ref(q.screen.lt.md ? 66 : 73.6);
  return q.screen.height - 54 - footerHeight.value;
});
</script>

<style scoped></style>
