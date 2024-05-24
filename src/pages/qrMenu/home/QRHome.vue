<template>
  <template v-if="!errorText">
    <div class="no-wrap column text-on-background-color">
      <HomeMenus class="c-container" />
    </div>
  </template>
  <div
    v-else
    style="width: 100%; height: 60vh; text-align: center"
    class="row justify-center items-center header light px-5"
    v-html="errorText"
  ></div>
</template>
<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
import HomeMenus from 'src/pages/home/HomeMenus.vue'
import { padRepo } from 'src/models/pads/padRepo'
import { menuRepo } from 'src/models/menu/menuRepo'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'

onMounted(() => {
  menuGroupRepo.elementsInViewport = []
})

const errorText = computed(() => {
  if (!padRepo.item) return 'Не удалось найти QR-Меню'
  if (!padRepo.item.isEnabled) return 'Формирование заказов недоступно'
  if (!padRepo.item.salesPoint) return 'Не удалось найти заведение'
  if (!menuRepo.item)
    return `${salesPointRepo.item ? salesPointRepo.item?.name + ' ' + salesPointRepo.item.currentAddress + '.' : ''} <br/> Не удалось получить меню`
  else return false
})
</script>
