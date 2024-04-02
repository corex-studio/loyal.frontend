<template>
  <CIcon
    v-if="$q.screen.lt.md"
    @click="
              $router.push({
                name: $store.tableMode ? 'qrHome' : 'home',
                params: {
                  padId:
                    $store.tableMode && $route.params.padId
                      ? $route.params.padId
                      : undefined,
                },
              })
            "
    name="fa-regular fa-angle-left"
    size="24px"
    color="on-background-color"
    hover-color="primary"
    class="cursor-pointer"
  />
</template>
<script setup lang="ts">
import CIcon from 'components/template/helpers/CIcon.vue'
</script>