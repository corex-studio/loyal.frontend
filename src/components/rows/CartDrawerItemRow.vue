<template>
  <div v-if="cartItem">
    <div class="row full-width no-wrap gap-5">
      <q-img
        @click="openItemModal(item.size.menu_item)"
        class="border-radius2 cursor-pointer"
        :src="cartItem.size.image?.thumbnail || $store.images.empty"
        :width="$q.screen.lt.md ? '64px' : '90px'"
        :height="$q.screen.lt.md ? '64px' : '90px'"
        :style="`min-width: ${$q.screen.lt.md ? '64px' : '90px'}`"
        :class="{ dimmed: cartItem.isDead }"
        fit="cover"
      >
        <template v-slot:error>
          <span>
            <q-img
              class="user-image"
              fit="cover"
              :width="$q.screen.lt.md ? '64px' : '90px'"
              :height="$q.screen.lt.md ? '64px' : '90px'"
              :src="$store.images.empty"
            ></q-img>
          </span>
        </template>
      </q-img>
      <div class="column col gap-sm-4 gap-xs-2">
        <div
          @click="openItemModal(item.size.menu_item)"
          class="row gap-6 no-wrap justify-between cursor-pointer"
        >
          <div class="column col gap-sm-4 gap-xs-2 subtitle-text">
            <div>{{ cartItem.size.name }}</div>
            <div
              v-if="cartItem.cartItemModifiers.length"
              class="secondary-text text-on-background-color"
            >
              {{
                cartItem.cartItemModifiers
                  .map(
                    (v) =>
                      `${v.modifier?.name}${
                        v.quantity > 1 ? ' x ' + v.quantity : ''
                      }`,
                  )
                  .join(', ')
              }}
            </div>
            <div v-if="!cartItem.freeItem" class="row gap-4 no-wrap body">
              <div class="bold">
                {{ beautifyNumber(item.discountedTotalSum, true) }} ₽
              </div>
              <div
                v-if="item.totalSum > item.discountedTotalSum"
                class="text-strike"
                style="opacity: 0.5"
              >
                {{ beautifyNumber(item.totalSum, true) }} ₽
              </div>
            </div>
            <div v-else class="secondary-text">Подарок</div>
          </div>
          <ChangeAmount
            v-if="!cartItem.freeItem"
            style="height: fit-content"
            small
            text-color="on-secondary-button-color"
            :model-value="cartItem.quantity"
            @update:model-value="updateQuantity($event)"
          />
          <div
            v-else
            class="bg-backing-color gift-icon row justify-center items-center"
          >
            <CIcon
              size="16px"
              name="fa-regular fa-gift"
              color="on-backing-color"
            />
          </div>
        </div>
        <div
          v-if="$cart.getRelatedItems(item)?.length"
          class="column gap-sm-4 gap-xs-2 full-width"
        >
          <div
            v-for="(el, index) in $cart.getRelatedItems(item)"
            :key="index"
            @click="openItemModal(el.size.menu_item)"
            class="row full-width body items-center no-wrap gap-6 cursor-pointer"
          >
            <div class="row col-grow no-wrap items-center jusify-between">
              <div class="items-center no-wrap row gap-5">
                <q-img
                  :src="el.size.image?.thumbnail"
                  style="max-width: 40px; min-width: 40px; height: 40px"
                  class="border-radius2"
                  fit="cover"
                >
                  <template v-slot:error>
                    <span>
                      <q-img
                        fit="cover"
                        style="max-width: 40px; min-width: 40px; height: 40px"
                        :src="$store.images.empty"
                      ></q-img>
                    </span> </template
                ></q-img>
                <div>
                  {{ el.size.name }}
                </div>
              </div>
            </div>
            <div>
              {{ el.quantity }} x
              {{ beautifyNumber(el.discountedTotalSum, true) }}₽
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CartItem } from 'src/models/carts/cartItem/cartItem'
import ChangeAmount from '../inputs/ChangeAmount.vue'
import { onMounted, ref, watch } from 'vue'
import { cartItemRepo } from 'src/models/carts/cartItem/cartItemRepo'
import { cartRepo } from 'src/models/carts/cartRepo'
import { beautifyNumber, store } from 'src/models/store'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import CIcon from '../template/helpers/CIcon.vue'
import { CalculationStatus } from 'src/models/carts/cart'
import { notifier } from 'src/services/notifier'

const cartItem = ref<CartItem | null>(null)

const props = defineProps<{
  item: CartItem
}>()

const emit = defineEmits(['delete'])

const openItemModal = async (menuItemId: string | null) => {
  store.openMenuItemModal()
  await menuItemRepo.retrieve(menuItemId || '', {
    sales_point: salesPointRepo.item?.id,
  })
}

onMounted(() => {
  cartItem.value = props.item
})

watch(
  () => props.item,
  (v) => {
    cartItem.value = v
  },
)

const updateQuantity = async (v: number) => {
  if (!v) {
    emit('delete')
    return
  }
  if (!cartItem.value) return
  cartItem.value.quantity = v
  try {
    cartRepo.loading = true
    cartRepo.item = await cartItemRepo.updateItem(cartItem.value)
  } catch {
    notifier.error('Ошибка изменения товара')
  } finally {
    if (cartRepo.item?.calculationStatus !== CalculationStatus.IN_PROGRESS) {
      cartRepo.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dimmed {
  filter: grayscale(90%);
}

.gift-icon {
  height: 34px;
  width: 34px;
  border-radius: 100px;
}
</style>
