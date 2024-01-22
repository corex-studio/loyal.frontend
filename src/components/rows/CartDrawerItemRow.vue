<template>
  <template v-if="cartItem">
    <div class="row full-width items-center no-wrap justify-between gap-5">
      <div class="row gap-6 no-wrap">
        <q-img
          class="border-radius"
          :src="cartItem.size.image?.thumbnail || $store.images.empty"
          :width="$q.screen.lt.md ? '64px' : '90px'"
          :height="$q.screen.lt.md ? '64px' : '90px'"
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
          <!-- <teleport
            :to="xsSelectorSpot"
            :disabled="!xsSelectorSpot || !$q.screen.xs"
          > -->
          <div class="row gap-4 no-wrap body mb-5">
            <div class="bold">
              {{ beautifyNumber(item.discountedTotalSum, true) }} ₽
            </div>
            <div
              v-if="item.totalSum > item.discountedTotalSum"
              class="text-strike text-secondary"
            >
              {{ beautifyNumber(item.totalSum, true) }} ₽
            </div>
          </div>
          <!-- </teleport> -->
        </div>
      </div>
      <!-- <teleport :to="xsPriceSpot" :disabled="!xsPriceSpot || !$q.screen.xs"> -->

      <ChangeAmount
        style="height: fit-content"
        small
        :model-value="cartItem.quantity"
        @update:model-value="updateQuantity($event)"
      />
      <!-- </teleport> -->
    </div>
    <!-- <div
      v-if="$q.screen.xs"
      class="row full-width justify-between gap-3 items-end mt-3"
    >
      <div ref="xsSelectorSpot"></div>

      <div ref="xsPriceSpot"></div>
    </div> -->
  </template>
</template>
<script lang="ts" setup>
import { CartItem } from 'src/models/carts/cartItem/cartItem'
import ChangeAmount from '../inputs/ChangeAmount.vue'
import { ref, onMounted, watch } from 'vue'
import { cartItemRepo } from 'src/models/carts/cartItem/cartItemRepo'
import { Notify } from 'quasar'
import { cartRepo } from 'src/models/carts/cartRepo'
import { beautifyNumber } from 'src/models/store'

const cartItem = ref<CartItem | null>(null)
// const xsPriceSpot = ref<HTMLDivElement>()
// const xsSelectorSpot = ref<HTMLDivElement>()

const props = defineProps<{
  item: CartItem
}>()

const emit = defineEmits(['delete'])

// const isItemDead = computed(() => {
//   return props.item.availableQuantity
//     ? props.item.availableQuantity <= 0
//     : false
// })

onMounted(() => {
  cartItem.value = props.item
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
    await cartItemRepo.update(cartItem.value)
    // await cartRepo.current();
  } catch {
    Notify.create({
      message: 'Ошибка изменения товара',
      color: 'danger',
    })
  }
}
</script>

<style lang="scss" scoped>
.dimmed {
  filter: grayscale(90%);
}
</style>
