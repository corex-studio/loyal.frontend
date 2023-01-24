<template>
  <div class="row pa-15 full-width justify-between">
    <div class="cursor-pointer header2">
      Current platform is:
      <span style="font-weight: 400">
        {{
          $q.platform.is.mobile
            ? $q.platform.is.android
              ? 'android'
              : $q.platform.is.ios
              ? 'ios'
              : 'other mobile platform'
            : 'desktop'
        }}
      </span>
      <div class="mt-5">
        Link to store:

        <span @click="toLink()" class="text-blue" style="font-weight: 400">
          {{ currentLink }}
        </span>
      </div>
    </div>
    <!-- <CButton
      text-button
      height="25px"
      :text-color="'black'"
      :hover-text-color="'accent3'"
      @click="$router.replace({ name: 'home' })"
      >Back to home</CButton
    > -->
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, onMounted } from 'vue';

const q = useQuasar();

onMounted(() => {
  window.location.replace(currentLink.value);
});

const currentLink = computed(() => {
  return q.platform.is.android
    ? 'https://play.google.com/store/apps/details?id=studio.corex.hoodoo'
    : q.platform.is.ios || q.platform.is.iphone || q.platform.is.ipad
    ? 'https://apps.apple.com/us/app/hoodoo/id1667328735'
    : 'https://apps.apple.com/us/app/hoodoo/id1667328735';
});

const toLink = () => {
  window.open(currentLink.value, '_blank');
};
</script>

<style scoped></style>
