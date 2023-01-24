<template>
  <div>
    <q-card
      :style="`border-radius: ${$uiSettings.item?.borderRadius}px; box-shadow: ${$uiSettings.item?.boxShadow.offset_x}px ${$uiSettings.item?.boxShadow.offset_y}px ${$uiSettings.item?.boxShadow.blur}px ${$uiSettings.item?.boxShadow.spread}px #${$uiSettings.item?.boxShadow.color} !important`"
      class="relative-position"
    >
      <q-img
        fit="cover"
        :src="item.image ? item.image : $store.images.empty"
      ></q-img>

      <div class="px-5 pt-5 pb-5">
        <!-- <div
          v-if="item.startDate"
          class="text-secondary text-lowercase caption-text mb-10"
        >
          {{
            moment(item.startDate).local().format('DD.MM.YY') +
            ' ' +
            $getText('YEAR_ABBREVIATION', 'г')
          }}
        </div> -->
        <div class="text-black">
          {{ item.name }}
        </div>
        <div class="row full-width text-black mt-1">
          {{ beautifyNumber(getMinimalSum, true) }} ₽
        </div>
        <!-- <div
          style="height: 63px"
          class="ellipsis-3-lines mb-10"
          v-html="formatedDescription"
        ></div> -->
        <!-- <CButton
          text-color="secondary"
          text-button
          :label="$getText('MORE', 'Подробнее')"
        ></CButton> -->
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { MenuItem } from 'src/models/menu/menu';
import { beautifyNumber } from 'src/models/store';
import { computed } from 'vue';

const props = defineProps<{
  item: MenuItem;
}>();

const getMinimalSum = computed(() => {
  return Math.min(...props.item.sizes.map((el) => el.price));
});
</script>

<style lang="scss" scoped></style>
