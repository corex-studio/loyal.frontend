<template>
  <div class="col-xl-3 row full-width col-lg-4 col-md-3">
    <div class="text-secondary mb-4">
      ©
      {{ 'Все права защищены' }}
    </div>
  </div>
  <q-list class="rounded-borders" style="width: 100%">
    <q-separator color="divider-color" />
  </q-list>
  <div class="mt-11 row full-width justify-between no-wrap">
    <CButton
      icon="fas fa-clock"
      hover-text-color="white"
      class="body bold mb-8"
      text-button
      ><div class="col">
        <div :style="`color: #${$uiSettings.item?.onBackgroundColor}`">
          {{ 'С 10:00 до 18:00' }}
        </div>
        <div :style="`color: #${$uiSettings.item?.onBackgroundColor}`">
          {{ 'г.Калининград' }}
        </div>
      </div></CButton
    >
    <div class="row fu mb-8">
      <CIconButton
        href="https://t.me/corex_market"
        target="_blank"
        size="20px"
        icon-size="20px"
        color="transparent"
        icon-color="white"
        icon="fab fa-telegram-plane"
      ></CIconButton>
      <CIconButton
        href="https://www.youtube.com/channel/UCG-sQDL1ZWINYVcFkHs-oGg"
        target="_blank"
        class="ml-5"
        size="20px"
        icon-size="20px"
        color="transparent"
        icon-color="white"
        icon="fab fa-youtube"
      ></CIconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import CButton from 'src/components/template/buttons/CButton.vue';
import CIconButton from 'src/components/template/buttons/CIconButton.vue';
</script>

<style lang="scss" scoped></style>
