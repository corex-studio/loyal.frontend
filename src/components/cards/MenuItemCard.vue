<template>
  <div
    style="height: 100%; overflow: overlay; overflow-x: hidden"
    class="bg-product-tile-color box-shadow border-radius column no-wrap cursor-pointer"
    @click="openMenuItemPage(item)"
  >
    <q-img
      height="100%"
      :src="item.image?.thumbnail || $store.images.empty"
      fit="cover"
    >
      <template v-slot:error>
        <span>
          <q-img fit="cover" height="100%" :src="$store.images.empty"></q-img>
        </span>
      </template>
    </q-img>
    <div
      class="px-6 py-8 column justify-between col-grow text-on-product-tile-color"
    >
      <div style="height: 42px" class="body ellipsis-2-lines">
        {{ item.name }}
      </div>

      <div class="header3 text-on-product-tile-color mt-2">
        {{ item.sizes[0].price }}
        ₽
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { MenuItem } from 'src/models/menu/menuItem/menuItem'
import { store } from 'src/models/store'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps<{
  item: MenuItem
}>()

const openMenuItemPage = (v: MenuItem) => {
  void router.push({
    name: store.tableMode ? 'qrMenuItemPage' : 'menuItemPage',
    params: {
      menuItemId: v.id,
    },
  })
}
</script>
