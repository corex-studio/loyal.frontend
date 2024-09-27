<template>
  <div
    ref="footer"
    :class="{ 'pb-30': $q.screen.lt.md && $store.tableMode }"
    class="bg-bottom-menu-color"
  >
    <q-separator v-if="!$q.screen.xs" color="divider-color" />
    <div class="pb-md-15 pb-xs-5" style="bottom: 0; z-index: 2100">
      <div v-if="$q.screen.gt.sm" class="c-container">
        <div class="footer-wrap row items-center pt-15">
          <FooterDesktop />
        </div>
      </div>
      <div v-else class="footer-wrap py-15 px-8 row">
        <FooterMobile />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { store } from 'src/models/store'
import FooterDesktop from './FooterDesktop.vue'
import FooterMobile from './FooterMobile.vue'
import { onMounted, ref } from 'vue'

const footer = ref<HTMLDivElement>()

onMounted(() => {
  setTimeout(() => {
    store.footerHeight = footer.value?.clientHeight || 0
    document.addEventListener('resize', () => {
      store.footerHeight = footer.value?.clientHeight || 0
    })
  }, 50)
})
</script>

<style lang="scss" scoped>
.q-footer {
  min-height: 196px;
}

.footer-wrap {
  justify-content: space-between;
}
</style>
