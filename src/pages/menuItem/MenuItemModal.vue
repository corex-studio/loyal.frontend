<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="900px"
    height="600px"
    height-percent="100%"
    no-overflow
  >
    <div class="row full-height">
      <q-img
        :ratio="1"
        class="col"
        fit="contain"
        height="100%"
        :src="$menuItem.item?.image?.thumbnail || $store.images.empty"
      >
        <template v-slot:error>
          <span>
            <q-img
              :ratio="1"
              fit="cover"
              height="100%"
              :src="$store.images.empty"
            ></q-img>
          </span> </template
      ></q-img>
      <div
        style="overflow-x: auto"
        class="column no-wrap col justify-between full-height pl-15"
      >
        <div class="column full-width">
          <div class="header bold mb-6">{{ $menuItem.item?.name }}</div>
          <div class="body mb-6">{{ $menuItem.item?.description }}</div>
          <MenuItemCharacteristics :size="currentSize" />
          <div
            v-if="$menuItem.item && $menuItem.item.sizes.length > 1"
            class="relative-position mt-8"
          >
            <ItemSizeSelector
              :sizes="$menuItem.item?.sizes"
              :model-value="currentSize || undefined"
              @update-tab="currentSize = $event"
            />
          </div>
          <div class="mt-10">
            <div
              v-for="(el, index) in currentSize?.modifierGroups"
              :key="index"
            >
              <q-separator v-if="index" color="divider-color" class="my-8" />
              <ModifiersSelector :group="el" />
            </div>
          </div>
        </div>

        <div
          class="row items-center gap-sm-15 gap-xs-5 pr-5"
          :class="[
            { 'mt-15': currentSize?.modifierGroups?.length },
            {
              'no-wrap full-width box-shadow pa-5 bg-backing-color':
                $q.screen.xs,
            },
          ]"
          :style="$q.screen.xs ? 'position: fixed; bottom: 0px; left: 0' : ''"
        >
          <ChangeAmount
            :small="$q.screen.xs"
            background-color="white"
            v-model="quantity"
          />
          <div
            v-if="$store.tableMode && !$pad.item?.settings.orders_enabled"
            class="full-width text-danger"
          >
            Оформление заказов временно недоступно
          </div>
          <CButton
            @click="addToCart()"
            class="col-grow subtitle-text"
            :height="$q.screen.xs ? '42px' : '42px'"
            :loading="loading"
            :disabled="isAddToCardDisabled"
            :icon="$q.screen.xs ? '' : 'fa-light fa-shopping-cart'"
            :label="$q.screen.xs ? 'В корзину' : 'Добавить в корзину'"
          />
        </div>
      </div>
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import MenuItemCharacteristics from './MenuItemCharacteristics.vue'
import { ItemSize } from 'src/models/menu/menu'
import { ref, watch, computed } from 'vue'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import ItemSizeSelector from './ItemSizeSelector.vue'
import ModifiersSelector from './ModifiersSelector.vue'
import ChangeAmount from 'src/components/inputs/ChangeAmount.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import { store } from 'src/models/store'
import { padRepo } from 'src/models/pads/padRepo'
import { sum } from 'lodash'
import { authentication } from 'src/models/authentication/authentication'
import { cartRepo } from 'src/models/carts/cartRepo'
import { companyRepo } from 'src/models/company/companyRepo'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { cartItemRepo } from 'src/models/carts/cartItem/cartItemRepo'
import { CartItemModifier } from 'src/models/carts/cartItem/cartItem'
import { Notify, useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const currentSize = ref<ItemSize | null>(null)

const quantity = ref(1)

const loading = ref(false)

const q = useQuasar()

const route = useRoute()

const router = useRouter()

watch(
  () => menuItemRepo.item,
  () => {
    if (props.modelValue) {
      currentSize.value = menuItemRepo.item?.sizes[0]
        ? menuItemRepo.item?.sizes[0]
        : null
    }
  }
)

const isAddToCardDisabled = computed(() => {
  return (
    (store.tableMode && !padRepo.item?.settings.orders_enabled) ||
    currentSize.value?.modifierGroups?.some(
      (v) =>
        v.restrictions?.min_quantity &&
        sum(v.items.map((el) => el.quantity)) < v.restrictions.min_quantity
    ) ||
    !quantity.value
  )
})

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
    emit('update:modelValue', false)
  } else if (cartRepo.item && currentSize.value) {
    try {
      loading.value = true
      await cartItemRepo.createCartItem({
        cart: cartRepo.item?.id,
        quantity: quantity.value,
        size: currentSize.value?.id,
        cart_item_modifiers:
          currentSize.value.modifierGroups?.flatMap((v) =>
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
      quantity.value = 1
      loading.value = false
    } catch (e) {
      loading.value = false

      Notify.create({
        message: 'Ошибка при добавлении в корзину',
        color: 'danger',
      })
    }
  }
  if (q.screen.xs) {
    void router.push({
      name: route.name === 'menuItemPage' ? 'home' : 'qrHome',
    })
  }
}
</script>
