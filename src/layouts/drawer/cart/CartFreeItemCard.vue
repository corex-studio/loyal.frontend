<template>
  <div
    :class="{ 'bordered-item': $uiSettings.item?.showMenuItemBorder }"
    class="border-radius column no-wrap cursor-pointer relative-position bg-product-tile-color"
    style="height: 100%; overflow: overlay; overflow-x: hidden"
    @click="openFreeItem()"
  >
    <q-img
      :class="{ dimmed: item.menuItem.isDead }"
      :ratio="1"
      :src="item.menuItem.image?.thumbnail || $store.images.empty"
      class="border-radius"
      fit="cover"
      height="100%"
    >
      <template v-slot:error>
        <span>
          <q-img
            :ratio="1"
            :src="$store.images.empty"
            fit="cover"
            height="100%"
          ></q-img>
        </span>
      </template>
    </q-img>
    <div class="column gap-2 full-width px-5 py-4 secondary-text">
      <div>
        {{ item.menuItem.name }}
      </div>
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
  store.openMenuItemModal(props.item.menuItem)
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
