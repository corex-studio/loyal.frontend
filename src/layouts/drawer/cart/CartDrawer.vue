<template>
  <div>
    <q-drawer
      v-model="$store.cartDrawer"
      :width="$q.screen.lt.lg ? $q.screen.width : 581"
      behavior="mobile"
      class="column full-height no-wrap justify-between bg-background-color text-on-background-color"
      no-swipe-open
      overlay
      side="right"
      style="z-index: 999999; height: 100%"
    >
      <CIcon
        v-if="$q.screen.gt.md"
        class="cursor-pointer"
        color="white"
        hover-color="primary"
        name="fa-light fa-xmark"
        size="37px"
        style="position: absolute; top: 40px; left: -50px"
        @click="$store.cartDrawer = false"
      />
      <div class="column pb-20">
        <div
          class="row no-wrap items-center text-on-background-color px-md-15 px-xs-8 justify-between pt-md-15 pb-md-11 py-md-0 py-xs-10"
        >
          <div class="row items-center no-wrap gap-md-5 gap-xs-4 header3 bold">
            <CIcon
              v-if="$q.screen.lt.lg"
              class="cursor-pointer mb-1"
              color="on-background-color"
              hover-color="primary"
              name="fa-regular fa-angle-left"
              size="22px"
              @click="$store.cartDrawer = false"
            />
            <div class="bold">
              {{ $q.screen.gt.sm ? 'Ваша корзина' : 'Корзина' }}
            </div>
            <template v-if="$q.screen.gt.sm">
              <div
                class="bg-primary"
                style="width: 5px; height: 5px; border-radius: 50%"
              ></div>
              <div class="bold">{{ $cart.item?.sum || 0 }}₽</div>
            </template>
          </div>
          <template v-if="$q.screen.gt.sm">
            <CButton
              v-if="$cart.item?.cartItems.length"
              class="subtitle-text"
              label="Очистить"
              text-button
              text-color="primary"
              @click="acceptModal = true"
            />
          </template>
          <CIcon
            v-else
            class="cursor-pointer"
            color="on-background-color"
            hover-color="primary"
            name="fa-regular fa-trash-alt"
            size="22px"
            @click="acceptModal = true"
          />
        </div>
        <q-separator
          v-if="$q.screen.gt.sm"
          class="mb-15"
          color="divider-color"
        />
        <div class="column full-width px-md-15 px-xs-8">
          <CartDeliveryInfo v-if="$cart.item" class="mb-md-15 mb-xs-10" />
          <template v-if="$cart.item?.cartItems.length">
            <div class="column">
              <template
                v-for="(item, index) in $cart.item?.cartItems.filter(
                  (v) => !v.attachedTo,
                )"
                :key="index"
              >
                <q-separator
                  v-if="index"
                  class="my-md-10 my-xs-8"
                  color="divider-color"
                />
                <CartDrawerItemRow
                  :item="item"
                  @delete="deleteCartItem(item)"
                />
              </template>
            </div>
            <CartDrawerGuestsCount
              v-if="$cart.item.salesPoint.settings.allow_set_guest_count"
            />

            <CartFreeItems
              v-if="$cart.item.freeItems.filter((el) => !el.applied).length"
            />
            <CartUpsales
              v-if="filteredUpsales.length"
              :upsales="filteredUpsales"
            />
          </template>
          <div v-else class="subtitle-text">Корзина пуста</div>
        </div>
      </div>
      <div
        v-if="$cart.item?.cartItems.length || $cart.arrangeLoading"
        class="row full-width justify-center bg-background-color px-15 py-13"
        style="position: sticky; bottom: 0; z-index: 10"
      >
        <CartBonuses
          v-if="
            $cart.item?.walletPayments.length && $uiSettings.item?.useBonuses
          "
          class="mb-md-12 mb-xs-8"
        />
        <div
          v-if="
            $salesPoint.item?.settings.promo_codes !== PromoCodeMode.DISABLED
          "
          class="row full-width justify-center mb-md-12 mb-xs-8"
        >
          <CButton
            :style="`background-color: ${lightColor(
              $uiSettings.item?.primaryColor.color || '000',
              '27',
            )} !important`"
            class="body"
            height="40px"
            label="У меня есть промокод"
            text-color="primary"
            @click="promocodeModal = true"
          />
        </div>
        <CartTotalInfo :delivery-settings="currentDeliverySettings" />
        <div
          :class="[
            $q.screen.gt.sm ? 'justify-between' : 'justify-center',
            addToCartDisabledInfo
              ? 'bg-secondary-button-color text-on-secondary-button-color'
              : 'bg-button-color text-on-button-color cursor-pointer',
          ]"
          :style="`height: ${$q.screen.lt.md ? '40' : '52'}px; width: 100%; ${
            addToCartDisabledInfo ? 'cursor: not-allowed' : ''
          }`"
          class="border-radius2 row items-center px-10 subtitle-text mt-10"
          @click="arrange"
        >
          <div
            v-if="
              cartRepo.loading ||
              $cart.arrangeLoading ||
              loading ||
              $cart.setParamsLoading
            "
            class="row justify-center full-width"
          >
            <q-spinner size="28px" />
          </div>
          <template v-else>
            <CTooltip v-if="addToCartDisabledInfo"
            >{{ addToCartDisabledInfo }}
            </CTooltip>
            <div>Оформить заказ</div>
            <q-badge
              v-if="$q.screen.gt.sm"
              :class="{
                'text-on-secondary-button-color': addToCartDisabledInfo,
              }"
              class="subtitle-text py-3 px-5"
              style="
                border-radius: 8px;
                backdrop-filter: blur(5px);
                background-color: rgba(0, 0, 0, 0.1);
              "
            >{{
                $cart.item?.discountedTotalSum
                  ? beautifyNumber($cart.item?.discountedTotalSum, true)
                  : '0'
              }}
              ₽
            </q-badge>
          </template>
        </div>
      </div>
    </q-drawer>
  </div>
  <AcceptModal
    :model-value="acceptModal"
    text="Вы точно хотите очистить корзину"
    @accept="clearCart()"
    @update:model-value="acceptModal = false"
  >
  </AcceptModal>
  <PromocodeModal v-model="promocodeModal" />
</template>
<script lang="ts" setup>
import CartDrawerItemRow from 'src/components/rows/CartDrawerItemRow.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { beautifyNumber, lightColor, store } from 'src/models/store'
import { computed, ref, watch } from 'vue'
import { cartRepo } from 'src/models/carts/cartRepo'
import { CartItem } from 'src/models/carts/cartItem/cartItem'
import { cartItemRepo } from 'src/models/carts/cartItem/cartItemRepo'
import AcceptModal from 'src/components/dialogs/AcceptModal.vue'
import CartDeliveryInfo from './CartDeliveryInfo.vue'
import CartTotalInfo from './CartTotalInfo.vue'
import { useRoute, useRouter } from 'vue-router'
import CartBonuses from './CartBonuses.vue'
import { PromoCodeMode } from 'src/models/salesPoint/salesPoint'
import PromocodeModal from 'src/pages/arrangement/PromocodeModal.vue'
import CTooltip from 'src/components/helpers/CTooltip.vue'
import { DeliveryAreaSettings } from 'src/models/deliveryAreas/deliveryAreaSettings/deliveryAreaSettings'
import CartFreeItems from './CartFreeItems.vue'
import CartDrawerGuestsCount from './CartDrawerGuestsCount.vue'
import { ecommerceRemove } from 'src/models/ecommerceEvents/ecommerceEvents'
import CartUpsales from './CartUpsales.vue'
import { notifier } from 'src/services/notifier'

const selectPaymentType = ref(false)
const acceptModal = ref(false)
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const promocodeModal = ref(false)
const currentDeliverySettings = ref<DeliveryAreaSettings[] | undefined>()

watch(
  () => store.cartDrawer,
  (v) => {
    if (v) {
      selectPaymentType.value = false
    }
  }
)

const filteredUpsales = computed(() => {
  return cartRepo.upsales.filter(
    (el) =>
      !cartRepo.item?.cartItems.map((v) => v.menuItem).includes(el.id) &&
      !el.isDead &&
      el.isItemInMenu
  )
})

const addToCartDisabledInfo = computed(() => {
  if (
    cartRepo.item?.cartItems.some(
      (v) =>
        (v.availableQuantity !== null &&
          (v.availableQuantity <= 0 || v.availableQuantity < v.quantity))
    )
  )
    return 'Имеются недоступные позиции'
  if (cartRepo.item?.isDelivery && currentDeliverySettings.value?.length) {
    if (
      !currentDeliverySettings.value?.find(
        (v) =>
          cartRepo.item &&
          v.minimalOrderSum < cartRepo.item.discountedSumWithoutBonuses
      )
    ) {
      return 'Не набрана минимальная сумма'
    }
  }
  return false
})

const clearCart = async () => {
  if (!cartRepo.item) throw new Error('Object is null')
  try {
    void ecommerceRemove(cartRepo.item)
    cartRepo.item = await cartRepo.clear()
    notifier.success('Корзина очищена')
  } catch {
    notifier.error('Ошибка при очистке корзины')
  }
}

const deleteCartItem = async (item: CartItem) => {
  try {
    await cartItemRepo.delete(item)
    notifier.success('Блюдо удалено из корзины')
    await cartRepo.current(
      store.qrData?.data?.salesPoint?.id,
      store.qrData?.data?.pad?.id
    )
    const foundIndex = cartRepo.item?.cartItems.findIndex(
      (v) => v.id === item.id
    )
    if (foundIndex !== undefined && foundIndex > -1)
      cartRepo.item?.cartItems.splice(foundIndex, 1)
  } catch {
    notifier.error('Ошибка при удалении')
  } finally {
    void ecommerceRemove(item)
  }
}

const arrange = () => {
  if (
    cartRepo.loading ||
    cartRepo.arrangeLoading ||
    loading.value ||
    cartRepo.setParamsLoading
  ) {
    return
  }

  if (['orderingPage'].includes(String(route.name))) {
    store.cartDrawer = false
    return
  }
  if (addToCartDisabledInfo.value) return
  void router.push({
    name: store.tableMode ? 'qrMenuArrangementPage' : 'arrangementPage'
  })
}

watch(
  () => store.cartDrawer,
  async (v) => {
    currentDeliverySettings.value = cartRepo.item?.deliveryAddress
      ? []
      : undefined

    if (v && cartRepo.item?.isDelivery) {
      currentDeliverySettings.value = await cartRepo.getDeliverySettings(
        cartRepo.item
      )
    }
    if (v) {
      await cartRepo.getUpsales()
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped></style>
