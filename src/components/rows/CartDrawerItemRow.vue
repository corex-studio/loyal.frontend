<template>
  <div v-if="cartItem" class="row full-width items-center no-wrap gap-5">
    <CIcon
      @click="$emit('delete')"
      class="cursor-pointer"
      hover-color="primary"
      color="on-background-color"
      name="fa-light fa-xmark "
    />
    <q-img
      class="rounded-5"
      :src="cartItem.size.image?.thumbnail || $store.images.empty"
      width="80px"
      height="80px"
      fit="cover"
    >
      <template v-slot:error>
        <span>
          <q-img
            class="user-image"
            fit="cover"
            width="80px"
            height="80px"
            :src="$store.images.empty"
          ></q-img>
        </span>
      </template>
    </q-img>
    <div class="row no-wrap col items-end justify-between">
      <div class="column col gap-4 secondary-text">
        <div>{{ cartItem.size.name }}</div>
        <div class="caption-text text-on-background-color">
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
        <ChangeAmount
          small
          :model-value="cartItem.quantity"
          @update:model-value="updateQuantity($event)"
        />
      </div>
      <div class="row gap-4 no-wrap body mb-5">
        <div class="bold">{{ item.discountedTotalSum }} ₽</div>
        <div
          v-if="item.totalSum > item.discountedTotalSum"
          class="text-strike text-secondary"
        >
          {{ item.totalSum }} ₽
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CartItem } from 'src/models/carts/cartItem/cartItem'
import CIcon from '../template/helpers/CIcon.vue'
import ChangeAmount from '../inputs/ChangeAmount.vue'
import { ref, onMounted, watch } from 'vue'
import { cartItemRepo } from 'src/models/carts/cartItem/cartItemRepo'
import { Notify } from 'quasar'
import { cartRepo } from 'src/models/carts/cartRepo'

const cartItem = ref<CartItem | null>(null)

const props = defineProps<{
  item: CartItem
}>()

defineEmits(['delete'])

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
  if (!v) return
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
