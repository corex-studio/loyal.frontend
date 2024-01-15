<template>
  <div>
    <q-drawer
      side="right"
      style="z-index: 999999; height: 100%"
      overlay
      v-model="$store.cartDrawer"
      no-swipe-open
      behavior="mobile"
      :width="$q.screen.xs ? $q.screen.width : 581"
      class="column full-height no-wrap justify-between bg-background-color text-on-background-color"
    >
      <CIcon
        @click="$store.cartDrawer = false"
        size="37px"
        style="position: absolute; top: 40px; left: -50px"
        name="fa-light fa-xmark"
        hover-color="primary"
        class="cursor-pointer"
        color="white"
      />
      <div class="column pb-50">
        <div
          class="row no-wrap items-center text-on-background-color px-15 justify-between py-15"
        >
          <div class="row items-center no-wrap gap-5 header2 bold">
            <div class="bold">Ваша корзина</div>
            <div
              style="width: 5px; height: 5px; border-radius: 50%"
              class="bg-primary"
            ></div>
            <div class="bold">{{ $cart.item?.sum }}₽</div>
          </div>
          <CButton
            v-if="$cart.item?.cartItems.length"
            @click="acceptModal = true"
            label="Очистить"
            class="subtitle-text"
            text-button
            text-color="primary"
          />
        </div>
        <q-separator class="mb-15" color="divider-color" />
        <div class="column full-width px-15">
          <CartDeliveryInfo class="mb-15" />
          <template v-if="$cart.item?.cartItems.length">
            <div class="column">
              <template
                v-for="(item, index) in $cart.item?.cartItems"
                :key="index"
              >
                <q-separator v-if="index" class="my-10" color="divider-color" />
                <CartDrawerItemRow
                  @delete="deleteCartItem(item)"
                  :item="item"
                />
              </template>
              <q-separator color="divider-color" class="my-12" />
              <CartBonuses
                v-if="$cart.item.walletPayments.length"
                class="mb-12"
              />
              <CartTotalInfo />
              <!-- <CartOutput showPaymentTypes /> -->
            </div>
          </template>
          <div v-else class="subtitle-text">Корзина пуста</div>
        </div>
      </div>

      <div
        v-if="$cart.item?.cartItems.length || $cart.arrangeLoading"
        class="row full-width justify-center bg-background-color py-8 px-15 py-13"
        style="position: sticky; bottom: 0"
      >
        <div
          @click="arrange"
          class="border-radius bg-button-color row items-center justify-between cursor-pointer px-10 subtitle-text text-on-button-color"
          style="height: 59px; width: 100%"
        >
          <div
            class="row justify-center full-width"
            v-if="cartRepo.loading || $cart.arrangeLoading || loading"
          >
            <q-spinner size="28px" />
          </div>
          <template v-else>
            <div>Оформить заказ</div>
            <q-badge
              style="
                border-radius: 8px;
                backdrop-filter: blur(5px);
                background-color: rgba(0, 0, 0, 0.1);
              "
              class="subtitle-text py-4 px-5"
              >{{
                $cart.item?.discountedTotalSum
                  ? beautifyNumber($cart.item?.discountedTotalSum, true) + ' ₽'
                  : '-'
              }}
            </q-badge>
          </template>
        </div>
      </div>
    </q-drawer>
  </div>
  <AcceptModal
    :model-value="acceptModal"
    @update:model-value="acceptModal = false"
    @accept="clearCart()"
    text="Вы точно хотите очистить корзину"
  >
  </AcceptModal>
</template>
<script lang="ts" setup>
import CartDrawerItemRow from 'src/components/rows/CartDrawerItemRow.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { beautifyNumber, store } from 'src/models/store'
import { ref, watch } from 'vue'
import { cartRepo } from 'src/models/carts/cartRepo'
import { Notify } from 'quasar'
import { CartItem } from 'src/models/carts/cartItem/cartItem'
import { cartItemRepo } from 'src/models/carts/cartItem/cartItemRepo'
import AcceptModal from 'src/components/dialogs/AcceptModal.vue'
import CartDeliveryInfo from './CartDeliveryInfo.vue'
import CartTotalInfo from './CartTotalInfo.vue'
import { useRouter } from 'vue-router'
import CartBonuses from './CartBonuses.vue'

const selectPaymentType = ref(false)

const acceptModal = ref(false)

const router = useRouter()

const loading = ref(false)

watch(
  () => store.cartDrawer,
  (v) => {
    if (v) {
      selectPaymentType.value = false
    }
  }
)

const clearCart = async () => {
  try {
    await cartRepo.clear()
    Notify.create({
      message: 'Корзина очищена',
    })
  } catch {
    Notify.create({
      message: 'Ошибка при очистке корзины',
      color: 'danger',
    })
  }
}

const deleteCartItem = async (item: CartItem) => {
  try {
    await cartItemRepo.delete(item)
    Notify.create({
      message: 'Блюдо удалено из корзины',
    })
    await cartRepo.current()
    const foundIndex = cartRepo.item?.cartItems.findIndex(
      (v) => v.id === item.id
    )
    if (foundIndex !== undefined && foundIndex > -1)
      cartRepo.item?.cartItems.splice(foundIndex, 1)
  } catch {
    Notify.create({
      message: 'Ошибка при удалении',
      color: 'danger',
    })
  }
}

const applyBonuses = () => {
  if (cartRepo.item?.walletPayments.some((v) => v.applied_sum)) {
    void cartRepo.setParams({
      sales_point: cartRepo.item?.salesPoint.id,
      type: cartRepo.item?.type,
      applied_wallet_payments: [
        {
          wallet_payment: cartRepo.item.walletPayments[0].uuid,
          applied_sum: cartRepo.item.walletPayments[0].applied_sum,
        },
      ],
    })
  }
}

const arrange = () => {
  applyBonuses()
  void router.push({
    name: 'arrangementPage',
  })
}

// const makeAnOrder = async () => {
//   try {
//     loading.value = true
//     const status = await salesPointRepo.status(cartRepo.item?.salesPoint.id)
//     if (!status) {
//       Notify.create({
//         message: 'В данный момент невозможно оформить заказ',
//         color: 'danger',
//       })
//       return
//     }
//     const order = await cartRepo.arrange({
//       sales_point: cartRepo.item?.salesPoint.id,
//       payment_data: {
//         type: currentPaymentType.value,
//         payment_service:
//           currentPaymentType.value === PaymentType.CASH ||
//           currentPaymentType.value === PaymentType.PAY_LATER
//             ? undefined
//             : currentPaymentType.value === PaymentType.CARD
//             ? 'card'
//             : 'web_form',
//       },
//       pad: store.tableMode ? padRepo.item?.id : undefined,
//     })
//     cartMode.value = 'cart'
//     if (store.tableMode) {
//       await cartRepo.current(
//         padRepo.item?.salesPoint?.id,
//         padRepo.item || undefined
//       )
//       void router.push({
//         name: 'currentOrderPage',
//       })
//     } else {
//       cartRepo.item = null
//     }
//     if (order.paymentUrl) {
//       window.open(order.paymentUrl, '_blank')
//     }
//     Notify.create({
//       message: 'Заказ успешно оформлен',
//     })
//     orderRepo.item = order
//   } catch {
//     cartRepo.arrangeLoading = false
//     Notify.create({
//       message: 'Ошибка при оформлении заказа',
//       color: 'danger',
//     })
//   } finally {
//     loading.value = false
//   }
// }

// const toPreviousStep = () => {
//   if (cartMode.value === 'output') {
//     cartMode.value = 'cart'
//   } else {
//     store.cartDrawer = false
//   }
// }
</script>

<style lang="scss" scoped></style>
