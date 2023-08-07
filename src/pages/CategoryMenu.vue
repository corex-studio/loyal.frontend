<template>
  <!-- <pre class="text-white">{{ currentCategoryItem }}</pre> -->

  <div
    style="height: inherit"
    :style="`background: #${$uiSettings.item?.backgroundColor}`"
    class="pa-md-20 pa-xs-10 pb-xs-45 row text-white full-width"
  >
    <div
      :style="`color: #${$uiSettings.item?.primaryColor}`"
      style="font-size: 35px"
      class="full-width mb-5"
    >
      {{ currentCategoryItem?.name }}
    </div>
    <div
      v-for="(el, index) in currentCategoryItem?.items"
      :key="index"
      @click="openProductModal(el)"
      class="col-xs-12 pr-sm-10 pb-10 col-sm-6 col-md-4 col-lg-3 cursor-pointer"
    >
      <ProductCard :item="el"></ProductCard>
      <!-- <div class="row items-baseline my-3 full-width">
        <div style="font-size: 20px">
          {{ el.name }}
        </div>
        <template v-if="el.sizes.length < 2">
          <q-space
            class="mx-5"
            style="border-bottom: dotted; border-bottom-color: #e9e9e9"
          />
          <div style="font-size: 20px">
            {{ beautifyNumber(el.sizes[0].price, true) }} ₽
          </div>
        </template>
        <div v-else class="column mt-5 gap-3 pl-10 full-width">
          <div
            v-for="(size, index_) in el.sizes"
            :key="index_"
            class="row items-baseline no-wrap"
            style="font-size: 18px"
          >
            <div>
              {{ size.name }}
            </div>
            <q-space
              class="mx-5"
              style="border-bottom: dotted; border-bottom-color: #e9e9e9"
            />
            <div>{{ beautifyNumber(size.price, true) }} ₽</div>
          </div>
        </div>
      </div> -->
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
import { menuRepo } from 'src/models/menu/menuRepo';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import ProductCard from 'src/components/template/card/productCard/ProductCard.vue';
import ProductModal from 'src/components/template/dialogs/ProductModal.vue';
import { MenuItem } from 'src/models/menu/menu';

const route = useRoute();
const productModal = ref(false);
const productToModal = ref<MenuItem>();

const currentCategoryItem = computed(() => {
  const categoryId = route.params.categoryId;
  if (!categoryId) return;
  else {
    const found = menuRepo.item?.groups?.find((el) => el.uuid === categoryId);
    return found;
  }
});

const openProductModal = (item: MenuItem) => {
  productToModal.value = item;
  productModal.value = true;
};
</script>

<style scoped></style>
