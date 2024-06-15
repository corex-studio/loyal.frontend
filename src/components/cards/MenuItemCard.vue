<template>
  <div
    style="height: 100%; overflow: overlay; overflow-x: hidden"
    v-intersection="onIntersection"
    class="border-radius column no-wrap cursor-pointer relative-position bg-product-tile-color"
    @click="openMenuItem()"
    :class="{ 'bordered-item': $uiSettings.item?.showMenuItemBorder }"
    itemscope
    itemtype="https://schema.org/Product"
  >
    <div
      v-if="$cart.isItemInCart(item.id)?.quantity"
      style="
        width: 36px;
        height: 36px;
        border-radius: 100px;
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 9;
      "
      class="bg-primary row justify-center items-center"
    >
      <CIcon name="fa-solid fa-cart-shopping" color="on-primary" size="16px" />
    </div>
    <q-chip
      v-if="false"
      class="info-chip subtitle-text"
      color="red"
      text-color="white"
      >Новинка</q-chip
    >

    <q-img
      :src="item.image?.thumbnail || $store.images.empty"
      fit="cover"
      class="border-radius"
      :ratio="1"
      :alt="item.name || 'Продукт'"
      itemprop="image"
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
      class="px-8 py-8 column gap-md-7 gap-lg-8 no-wrap justify-between col-grow text-on-product-tile-color"
    >
      <div class="column no-wrap mb-md-0 mb-xs-8">
        <div class="row full-width no-wrap gap-6">
          <div itemprop="name" class="header3 bold">
            {{ item.name }}
          </div>
        </div>
        <div
          v-if="item.description"
          style="opacity: 0.6"
          :class="$q.screen.lt.md ? 'ellipsis' : 'ellipsis-2-lines'"
          class="mt-3 body"
          itemprop="description"
        >
          {{ item.description }}
        </div>
      </div>
      <div class="row no-wrap full-width justify-between items-center">
        <div
          v-if="$q.screen.gt.sm"
          class="subtitle-text bold text-on-backgroun-color row gap-2 no-wrap"
          itemprop="offers"
          itemscope
          itemtype="https://schema.org/Offer"
        >
          <div itemprop="price">
            {{ item.sizes[0].price }}
          </div>
          <div itemprop="priceCurrency">₽</div>
        </div>
        <div :class="{ 'full-width': $q.screen.lt.md }">
          <CButton
            v-if="$companyGroup.item?.externalId !== 'Krendel'"
            @click.capture.stop="toCartClickHandler()"
            :color="item.isDead ? 'secondary' : 'primary'"
            :style="` ${item.isDead ? 'cursor: not-allowed' : ''}`"
            :text-color="item.isDead ? 'on-secondary' : 'on-primary'"
            height="40px"
            class="body"
            :loading="loading"
            :width="$q.screen.lt.md ? '100%' : undefined"
          >
            <div :class="{ bold: $q.screen.lt.md }">
              {{ $q.screen.lt.md ? `${item.sizes[0].price} ₽` : 'В корзину' }}
            </div>
          </CButton>
          <CButton
            v-else
            @click.capture.stop="toCartClickHandler()"
            :color="item.isDead ? 'secondary' : 'accent'"
            :style="` ${item.isDead ? 'cursor: not-allowed' : ''}`"
            :text-color="item.isDead ? 'on-secondary' : 'on-accent'"
            height="40px"
            class="body"
            :loading="loading"
            :width="$q.screen.lt.md ? '100%' : undefined"
          >
            <div :class="{ bold: $q.screen.lt.md }">
              {{ $q.screen.lt.md ? `${item.sizes[0].price} ₽` : 'В корзину' }}
            </div>
          </CButton>
          <CTooltip v-if="item.isDead"
            >{{ $uiSettings.item?.outOfStockText || 'Товар недоступен' }}
          </CTooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { MenuItem } from 'src/models/menu/menuItem/menuItem'
import { store } from 'src/models/store'
import CButton from '../template/buttons/CButton.vue'
import { cartRepo } from 'src/models/carts/cartRepo'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { companyRepo } from 'src/models/company/companyRepo'
import { authentication } from 'src/models/authentication/authentication'
import { cartItemRepo } from 'src/models/carts/cartItem/cartItemRepo'
import { CartItemModifier } from 'src/models/carts/cartItem/cartItem'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { ref } from 'vue'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import CTooltip from '../helpers/CTooltip.vue'
import CIcon from '../template/helpers/CIcon.vue'
import { menuRulesForAddingRepo } from 'src/models/menu/menuItem/menuRulesForAdding/menuRulesForAddingRepo'
import {
  ecommerceAdd,
  ecommerceClick,
} from 'src/models/ecommerceEvents/ecommerceEvents'
import { useYandexMetrika } from 'yandex-metrika-vue3'
import { useRoute } from 'vue-router'
import { CalculationStatus } from 'src/models/carts/cart'
import { notifier } from 'src/services/notifier'

const props = defineProps<{
  item: MenuItem
}>()

const metrika = useYandexMetrika()
const loading = ref(false)
const route = useRoute()

const onIntersection = (entry: IntersectionObserverEntry) => {
  if (entry.isIntersecting) {
    menuItemRepo.visibleItems.push(props.item)
  } else {
    const foundIndex = menuItemRepo.visibleItems.findIndex(
      (el) => el.id === props.item.id,
    )
    if (foundIndex > -1) {
      menuItemRepo.visibleItems.splice(foundIndex, 1)
    }
  }
}

const toCartClickHandler = async () => {
  if (props.item.isDead) return
  if (!authentication.user) {
    store.authModal = true
    return
  }
  if (!cartRepo.item && salesPointRepo.item) {
    const foundCompany = companyGroupRepo.item?.companies.find(
      (v) =>
        v.id ===
        (typeof salesPointRepo.item?.company === 'string'
          ? salesPointRepo.item.company
          : salesPointRepo.item?.company?.id || ''),
    )
    if (foundCompany) companyRepo.item = foundCompany
    else
      await companyRepo.retrieve(
        typeof salesPointRepo.item.company === 'string'
          ? salesPointRepo.item.company
          : salesPointRepo.item.company?.id || '',
      )
    store.storedMenuItem = props.item.id || null
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
  void ecommerceClick(props.item)
  metrika.hit(route.fullPath)
  store.openMenuItemModal()
  store.menuItemImage = props.item.image
  await menuItemRepo.retrieve(props.item.id, {
    sales_point: salesPointRepo.item?.id,
  })
  await menuRulesForAddingRepo.list({
    menu_item: menuItemRepo.item?.id,
  })
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
        : salesPointRepo.item.company?.id || '',
    )
    store.serviceSettingsModal = true
  } else if (cartRepo.item && props.item.sizes[0]) {
    try {
      cartRepo.loading = true
      loading.value = true
      cartRepo.item = await cartItemRepo.createCartItem({
        cart: cartRepo.item?.id,
        quantity: 1,
        size: props.item.sizes[0].id || '',
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
              .filter((e) => e.quantity),
          ) || [],
      })
    } catch (e) {
      notifier.error('Ошибка при добавлении в корзину')
    } finally {
      if (cartRepo.item?.calculationStatus !== CalculationStatus.IN_PROGRESS) {
        cartRepo.loading = false
      }
      loading.value = false

      void ecommerceAdd(props.item)
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

.dimmed {
  filter: grayscale(90%);
}

.bordered-item {
  outline: 1px var(--divider-color) solid;
}
</style>
