<template>
  <div
    style="height: 100%; overflow: overlay; overflow-x: hidden"
    :style="
      $companyGroup.item?.externalId === 'corex_demo'
        ? `border: 1px ${lightColor(
            $uiSettings.item?.backgroundColor.on_color || '000',
            '10'
          )} solid`
        : ''
    "
    class="border-radius box-shadow column no-wrap cursor-pointer relative-position bg-background-color"
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
      :class="{ dimmed: item.isDead }"
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
      :style="`height: ${$q.screen.lt.md ? '165' : '188'}px`"
      class="px-8 py-8 column no-wrap justify-between col-grow text-on-background-color"
    >
      <div class="column no-wrap mb-md-0 mb-xs-8">
        <div class="row full-width no-wrap gap-6">
          <div class="header3 bold ellipsis-2-lines">
            {{ item.name }}
          </div>
        </div>

        <div
          style="opacity: 0.6"
          :class="$q.screen.lt.md ? 'ellipsis' : 'ellipsis-2-lines'"
          class="mt-3 body"
        >
          {{ item.description }}
        </div>
      </div>
      <div class="row no-wrap full-width justify-between items-center">
        <div
          v-if="$q.screen.gt.sm"
          class="subtitle-text bold text-on-backgroun-color"
        >
          {{ item.sizes[0].price }}
          ₽
        </div>
        <div :class="{ 'full-width': $q.screen.lt.md }">
          <CButton
            @click.capture.stop="toCartClickHandler()"
            color="background-color"
            :style="`background-color: ${lightColor(
              buttonColor || '000',
              '27'
            )} !important; ${item.isDead ? 'cursor: not-allowed' : ''}`"
            :text-color="item.isDead ? 'on-background-color' : 'primary'"
            height="40px"
            class="body"
            :loading="loading"
            :width="$q.screen.lt.md ? '100%' : undefined"
          >
            <div :class="{ bold: $q.screen.lt.md }">
              {{
                $q.screen.lt.md ? `От ${item.sizes[0].price} ₽` : 'В корзину'
              }}
            </div>
          </CButton>
          <CTooltip v-if="item.isDead">Товар недоступен</CTooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { MenuItem } from 'src/models/menu/menuItem/menuItem'
import { lightColor, store } from 'src/models/store'
import CButton from '../template/buttons/CButton.vue'
import { cartRepo } from 'src/models/carts/cartRepo'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { companyRepo } from 'src/models/company/companyRepo'
import { authentication } from 'src/models/authentication/authentication'
import { cartItemRepo } from 'src/models/carts/cartItem/cartItemRepo'
import { Notify } from 'quasar'
import { CartItemModifier } from 'src/models/carts/cartItem/cartItem'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { ref, computed } from 'vue'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import CTooltip from '../helpers/CTooltip.vue'

const props = defineProps<{
  item: MenuItem
}>()

const loading = ref(false)

const buttonColor = computed(() => {
  return props.item.isDead
    ? uiSettingsRepo.item?.backgroundColor.on_color
    : uiSettingsRepo.item?.primaryColor.color
})

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
          : salesPointRepo.item?.company?.id || '')
    )
    if (foundCompany) companyRepo.item = foundCompany
    else
      await companyRepo.retrieve(
        typeof salesPointRepo.item.company === 'string'
          ? salesPointRepo.item.company
          : salesPointRepo.item.company?.id || ''
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
  store.menuItemModal = true
  await menuItemRepo.retrieve(props.item.id, {
    sales_point: salesPointRepo.item?.id,
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
        : salesPointRepo.item.company?.id || ''
    )

    store.serviceSettingsModal = true
  } else if (cartRepo.item && props.item.sizes[0]) {
    try {
      cartRepo.loading = true
      loading.value = true
      await cartItemRepo.createCartItem({
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
              .filter((e) => e.quantity)
          ) || [],
      })
    } catch (e) {
      cartRepo.loading = false
      Notify.create({
        message: 'Ошибка при добавлении в корзину',
        color: 'danger',
      })
    } finally {
      loading.value = false
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
</style>
