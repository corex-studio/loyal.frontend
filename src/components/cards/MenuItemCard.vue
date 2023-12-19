<template>
  <div
    style="height: 100%; overflow: overlay; overflow-x: hidden"
    :style="
      $companyGroup.item?.externalId === 'corex_demo'
        ? 'border: 1px #f5f5f5 solid'
        : ''
    "
    class="border-radius box-shadow column no-wrap cursor-pointer relative-position"
    @click="openMenuItem()"
  >
    <q-chip
      v-if="false"
      class="info-chip subtitle-text"
      color="red"
      text-color="white"
      >Новинка</q-chip
    >
    <q-img
      height="100%"
      :src="item.image?.thumbnail || $store.images.empty"
      fit="cover"
      class="border-radius"
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
    <div
      style="height: 208px"
      class="px-8 py-8 column no-wrap justify-between col-grow text-on-product-tile-color"
    >
      <div class="column no-wrap mb-14">
        <div class="row full-width no-wrap gap-6">
          <div class="header3 bold ellipsis-2-lines">
            {{ item.name }}
          </div>
          <!-- <div style="opacity: 0.7" class="body">
          {{ item.sizes[0].characteristics.weight }}г
        </div> -->
        </div>
        <!-- style="height: 42px" -->

        <div style="opacity: 0.6" class="mt-5 subtitle-text ellipsis-2-lines">
          {{ item.description }}
        </div>
      </div>
      <div class="row no-wrap full-width justify-between items-center">
        <div class="header3 bold text-on-product-tile-color">
          {{ item.sizes[0].price }}
          ₽
        </div>
        <!-- {{ getButtonBg }} -->
        <CButton
          @click.capture.stop="toCartClickHandler()"
          color="background-color"
          :style="`background-color: ${getButtonBg} !important`"
          text-color="primary"
          height="42px"
          class="subtitle-text"
          :loading="loading"
          label="В корзину"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { MenuItem } from 'src/models/menu/menuItem/menuItem'
import { store } from 'src/models/store'
import CButton from '../template/buttons/CButton.vue'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import { cartRepo } from 'src/models/carts/cartRepo'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { companyRepo } from 'src/models/company/companyRepo'
import { authentication } from 'src/models/authentication/authentication'
import { ref, computed } from 'vue'
import { cartItemRepo } from 'src/models/carts/cartItem/cartItemRepo'
import { Notify } from 'quasar'
import { CartItemModifier } from 'src/models/carts/cartItem/cartItem'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'

const props = defineProps<{
  item: MenuItem
}>()

const loading = ref(false)

const getButtonBg = computed(() => {
  if (uiSettingsRepo.item?.primaryColor.color.length === 6) {
    return `#${uiSettingsRepo.item?.primaryColor.color}27`
  } else {
    return `#${uiSettingsRepo.item?.primaryColor.color.slice(0, 6)}27`
  }
})

const toCartClickHandler = async () => {
  if (!cartRepo.item && salesPointRepo.item) {
    await companyRepo.retrieve(
      typeof salesPointRepo.item.company === 'string'
        ? salesPointRepo.item.company
        : salesPointRepo.item.company?.id || ''
    )
    store.serviceSettingsModal = true
    return
  }
  if (props.item.allowInstantAddition) {
    await addToCart()
  } else {
    openMenuItem()
  }
}

const openMenuItem = async () => {
  store.menuItemModal = true
  await menuItemRepo.retrieve(props.item.id)
}

const addToCart = async () => {
  if (!authentication.user && !store.tableMode) {
    store.authModal = true
    return
  }
  if (!cartRepo.item && salesPointRepo.item) {
    await companyRepo.retrieve(
      typeof salesPointRepo.item.company === 'string'
        ? salesPointRepo.item.company
        : salesPointRepo.item.company?.id || ''
    )
    store.serviceSettingsModal = true
  } else if (cartRepo.item && props.item.sizes[0]) {
    try {
      loading.value = true
      await cartItemRepo.createCartItem({
        cart: cartRepo.item?.id,
        quantity: 1,
        size: props.item.sizes[0].id,
        cart_item_modifiers:
          props.item.sizes[0].modifierGroups?.flatMap((v) =>
            v.items
              .map((el) => {
                return {
                  modifier: el.id,
                  quantity: el.quantity,
                  price: el.price || 0,
                  sum: String(Number(el.price) * el.quantity),
                } as CartItemModifier
              })
              .filter((e) => e.quantity)
          ) || [],
      })
      loading.value = false
    } catch (e) {
      loading.value = false

      Notify.create({
        message: 'Ошибка при добавлении в корзину',
        color: 'danger',
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.info-chip {
  width: fit-content;
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 9;
}
</style>
