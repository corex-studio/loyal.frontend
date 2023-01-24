<template>
  <div class="col-4 col-xl-3">
    <div class="text-secondary">
      ©
      {{ 'Все права защищены' }}
    </div>
  </div>

  <div class="col-3"></div>
  <div class="col-2 col-xl-3 row no-wrap justify-end">
    <CButton
      icon="fas fa-clock"
      hover-text-color="white"
      class="body bold mr-10"
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
    <!-- <CIconButton
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
    ></CIconButton> -->
  </div>
</template>

<script setup lang="ts">
import CButton from 'src/components/template/buttons/CButton.vue';
</script>
