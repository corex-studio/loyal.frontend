<template>
  <div
    style="height: 100%; overflow: overlay; overflow-x: hidden"
    class="border-radius column no-wrap cursor-pointer relative-position bg-product-tile-color"
    @click="openFreeItem()"
    :class="{ 'bordered-item': $uiSettings.item?.showMenuItemBorder }"
  >
    <q-img
      height="100%"
      :src="item.menuItem.image?.thumbnail || $store.images.empty"
      fit="cover"
      class="border-radius"
      :class="{ dimmed: item.menuItem.isDead }"
      :ratio="1"
    >
      <template v-slot:error>
        <span>
          <q-img
            :ratio="1"
            fit="cover"
            height="100%"
            :src="$store.images.empty"
          ></q-img>
        </span>
      </template>
    </q-img>
    <div class="column full-width px-5 py-4 secondary-text">
      {{ item.menuItem.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MenuItem } from 'src/models/menu/menuItem/menuItem'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { store } from 'src/models/store'

const props = defineProps<{
  item: {
    uuid: string
    active: boolean
    cart: string
    cartItem: string
    menuItem: MenuItem
    applied: boolean
  }
}>()

const openFreeItem = async () => {
  store.menuItemModal = true
  store.freeItem = props.item.uuid
  await menuItemRepo.retrieve(props.item.menuItem.id || '', {
    sales_point: salesPointRepo.item?.id,
  })
}
</script>

<style lang="scss" scoped>
.bordered-item {
  outline: 1px var(--divider-color) solid;
}
</style>
