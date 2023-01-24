<template>
  <CDialog
    width="600px"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue')"
  >
    <div
      :style="`box-shadow: ${$uiSettings.item?.boxShadow.offset_x}px ${$uiSettings.item?.boxShadow.offset_y}px ${$uiSettings.item?.boxShadow.blur}px ${$uiSettings.item?.boxShadow.spread}px #${$uiSettings.item?.boxShadow.color} !important; border-radius: ${$uiSettings.item?.borderRadius}px`"
      class="row pa-5 gap-10 items-center"
    >
      <q-img
        :src="item.image ? item.image : $store.images.empty"
        width="180px"
      ></q-img>
      <div class="row full-width" style="font-size: 20px">{{ item.name }}</div>
      <div style="font-size: 16px" class="text-secondary full-width mb-2 mt-5">
        Описание:
        <div class="text-black mt-3">{{ item.description }}</div>
      </div>
    </div>
    <!-- <div v-if="getMinimalSize()" style="font-size: 24px" class="bold mt-5">
      {{ beautifyNumber(getMinimalSize()!.price, true) }} ₽
    </div> -->

    <div style="font-size: 16px" class="mt-5">Размеры:</div>
    <div class="row mt-5">
      <div
        class="pr-8 col-md-4 col-sm-4 col-xs-6"
        v-for="(el, index) in item.sizes"
        :key="index"
      >
        <div
          :style="`box-shadow: ${$uiSettings.item?.boxShadow.offset_x}px ${$uiSettings.item?.boxShadow.offset_y}px ${$uiSettings.item?.boxShadow.blur}px ${$uiSettings.item?.boxShadow.spread}px #${$uiSettings.item?.boxShadow.color} !important; border-radius: ${$uiSettings.item?.borderRadius}px; `"
          class="column pa-5"
        >
          <q-img
            class="mb-3"
            width="119px"
            height="119px"
            :src="
              el.image
                ? el.image.thumbnail
                  ? el.image.thumbnail
                  : $store.images.empty
                : $store.images.empty
            "
          ></q-img>
          <div class="mb-3">
            {{ el.name }}
          </div>
          <div class="text-secondary">
            {{ beautifyNumber(el.price, true) }} ₽
          </div>
        </div>
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import { MenuItem } from 'src/models/menu/menu';
// import { ref, watch, watchEffect } from 'vue';
import CDialog from './CDialog.vue';
import { beautifyNumber } from 'src/models/store';

// const currentSize = ref<Size>();

defineProps<{
  modelValue: boolean;
  item: MenuItem;
}>();

// watchEffect(() => {
//   if (props.item) currentSize.value = getMinimalSize();
// });

// const getMinimalSize = () => {
//   return _.minBy(props.item.sizes, 'price');
// };
</script>

<style scoped></style>
