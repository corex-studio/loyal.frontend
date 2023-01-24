<template>
  <div
    :style="`color: #${$uiSettings.item?.onBackgroundColor}`"
    class="column full-width px-xs-5 px-md-20 pb-xs-40 pb-sm-15 pt-15"
  >
    <!-- <div class="header mb-10">Салаты</div> -->
    <div class="full-width">
      <div class="mb-20" v-for="(el, index) in $menu.item?.groups" :key="index">
        <div class="header full-width mb-10">{{ el.name }}</div>
        <div class="row full-width">
          <!-- :style="`background: #${$uiSettings.item?.primaryColor}; border-radius: ${$uiSettings.item?.borderRadius}px; box-shadow: ${$uiSettings.item?.boxShadow.offset_x}px ${$uiSettings.item?.boxShadow.offset_y}px ${$uiSettings.item?.boxShadow.blur}px ${$uiSettings.item?.boxShadow.spread}px #${$uiSettings.item?.boxShadow.color} !important`" -->

          <div
            v-for="(el_, index_) in el.items"
            :key="index_"
            class="col-xs-12 pr-10 pb-10 col-md-4 col-lg-3"
          >
            <ProductCard
              @click="openProductModal(el_)"
              class="cursor-pointer"
              :item="el_"
            ></ProductCard>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ProductModal
    v-if="productToModal"
    :model-value="productModal"
    @update:modelValue="productModal = false"
    :item="productToModal"
  ></ProductModal>
</template>

<script setup lang="ts">
import ProductCard from 'src/components/template/card/productCard/ProductCard.vue';
import { MenuItem } from 'src/models/menu/menu';
import ProductModal from 'src/components/template/dialogs/ProductModal.vue';
import { ref } from 'vue';

const productToModal = ref<MenuItem>();
const productModal = ref(false);

const openProductModal = (item: MenuItem) => {
  productToModal.value = item;
  productModal.value = true;
};
</script>

<style scoped lang="scss"></style>
