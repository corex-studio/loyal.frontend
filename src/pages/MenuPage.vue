<template>
  <div
    :style="`background: #${$uiSettings.item?.backgroundColor}`"
    class="column full-height full-width"
  >
    <div
      style="font-weight: 300; font-size: 20px"
      class="column full-width gap-10 items-center pa-10 pb-40"
    >
      <q-img
        style="border-radius: 30%; max-width: 300px"
        :height="'200px'"
        :src="'https://placeimg.com/500/300/nature'"
      ></q-img>
      <q-separator
        class="full-width mt-8 divider-color"
        :color="`#${$uiSettings.item?.onBackgroundColor}`"
      />
      <div
        style="font-weight: 500; font-size: 35px; color: #ffae34"
        :style="`color: #${$uiSettings.item?.primaryColor}`"
      >
        Категории меню
      </div>
      <div
        class="full-width cursor-pointer"
        v-for="(el, index) in $menu.item?.groups"
        :key="index"
        style="text-align: center"
        @click="
          $router.push({
            name: 'categoryPage',
            params: { categoryId: el.uuid },
          })
        "
        :style="`color: #${$uiSettings.item?.onBackgroundColor}`"
      >
        {{ el.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
