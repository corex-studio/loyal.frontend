<template>
  <div v-if="cartItem">
    <div class="row full-width no-wrap gap-5">
      <q-img
        :class="{ dimmed: cartItem.isDead }"
        :height="$q.screen.lt.md ? '64px' : '90px'"
        :src="cartItem.size.image?.thumbnail || $store.images.empty"
        :style="`min-width: ${$q.screen.lt.md ? '64px' : '90px'}`"
        :width="$q.screen.lt.md ? '64px' : '90px'"
        class="border-radius2 cursor-pointer"
        fit="cover"
        @click="openItemModal(item.size.menu_item)"
      >
        <template v-slot:error>
          <span>
            <q-img
              :height="$q.screen.lt.md ? '64px' : '90px'"
              :src="$store.images.empty"
              :width="$q.screen.lt.md ? '64px' : '90px'"
              class="user-image"
              fit="cover"
            ></q-img>
          </span>
        </template>
      </q-img>
      <div class="column col gap-sm-4 gap-xs-2">
        <div
          class="row gap-6 no-wrap justify-between cursor-pointer"
          @click="openItemModal(item.size.menu_item)"
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
                      }`
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
            :model-value="cartItem.quantity"
            small
            style="height: fit-content"
            text-color="on-secondary-button-color"
            @update:model-value="updateQuantity($event)"
          />
          <div
            v-else
            class="bg-backing-color gift-icon row justify-center items-center"
          >
            <CIcon
              color="on-backing-color"
              name="fa-regular fa-gift"
              size="16px"
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
            class="row full-width body items-center no-wrap gap-6 cursor-pointer"
            @click="openItemModal(el.size.menu_item)"
          >
            <div class="row col-grow no-wrap items-center jusify-between">
              <div class="items-center no-wrap row gap-5">
                <q-img
                  :src="el.size.image?.thumbnail"
                  class="border-radius2"
                  fit="cover"
                  style="max-width: 40px; min-width: 40px; height: 40px"
                >
                  <template v-slot:error>
                    <span>
                      <q-img
                        :src="$store.images.empty"
                        fit="cover"
                        style="max-width: 40px; min-width: 40px; height: 40px"
                      ></q-img>
                    </span></template
                  >
                </q-img>
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
        <div v-if="cartItem.quantityError" class="text-danger secondary-text">{{ cartItem.quantityError }}</div>
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
    sales_point: salesPointRepo.item?.id
  })
}

onMounted(() => {
  cartItem.value = props.item
  // cartItem.value.error = 'тестовая ошибка'
})

watch(
  () => props.item,
  (v) => {
    cartItem.value = v
  }
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
