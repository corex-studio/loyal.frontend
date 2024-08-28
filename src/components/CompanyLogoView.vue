<template>
  <img
    v-if="$company.item?.logo?.thumbnail || $company.item?.image?.thumbnail"
    :height="$q.screen.gt.md ? '52' : '48'"
    :src="
      $store.tableMode
        ? $company.item?.logo?.thumbnail || $company.item?.image?.thumbnail
        : $q.screen.lt.lg
          ? $company.item?.image?.thumbnail
          : $company.item?.logo?.thumbnail || $company.item?.image?.thumbnail
    "
    alt="Логотип"
    class="cursor-pointer"
    style="object-fit: contain; max-width: 230px"
    @click="
      $router.push({
        name: $store.tableMode ? 'qrHome' : 'home',
        params: {
          padId: $store.tableMode
            ? $route.params.padId || undefined
            : undefined,
        },
      })
    "
  />
</template>
<script lang="ts" setup></script>
