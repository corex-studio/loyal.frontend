<template>
  <div
    :style="`background: #${$uiSettings.item?.backgroundColor}`"
    class="text-white pb-md-10"
  >
    <div class="c-container" v-if="$q.screen.gt.sm">
      <div class="footer-wrap row items-center pt-10 px-20 row">
        <FooterDesktop />
      </div>
    </div>
    <div class="footer-wrap pt-10 px-10 row" v-else>
      <FooterMobile />
    </div>
  </div>
</template>

<script setup lang="ts">
import FooterDesktop from './FooterDesktop.vue';
import FooterMobile from './FooterMobile.vue';
</script>

<style scoped>
.q-footer {
  min-height: 196px;
}

.footer-wrap {
  justify-content: space-between;
}
</style>
