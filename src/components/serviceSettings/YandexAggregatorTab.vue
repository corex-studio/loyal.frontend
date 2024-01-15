<template>
  <div>
    <div class="row full-width gap-8 items-center no-wrap">
      <q-img
        src="~assets/yandexLogo.png"
        width="62px"
        height="62px"
        style="min-width: 62px"
      ></q-img>
      <div class="text-on-background-color body">
        Оформление яндекс доставки возможно при переходе на другую платформу.
        Стоимость блюд может измениться
      </div>
    </div>
    <CButton
      @click="openLink()"
      label="Оформить в Яндекс еда"
      class="subtitle-text mt-18"
      height="48px"
      width="288px"
    />
  </div>
</template>
<script lang="ts" setup>
import CButton from '../template/buttons/CButton.vue'
import { TabRaw } from './ServiceSettingsModal.vue'

const props = defineProps<{
  tab: TabRaw | null
}>()

const openLink = () => {
  window.open(props.tab?.link || undefined, '_blank')
}
</script>
