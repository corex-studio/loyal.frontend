<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :width="$q.screen.gt.md ? '1150px' : '500px'"
    :height="$q.screen.gt.md ? '600px' : undefined"
    height-percent="100%"
    :no-overflow="$q.screen.gt.md"
    dialog-class="no-scrollbar"
    no-padding
  >
    <div
      :class="$q.screen.lt.lg ? 'column' : 'row full-height '"
      class="no-wrap full-width"
    >
      <q-img
        :ratio="1"
        class="col"
        :style="`border-radius: ${getBorderRadius}; max-width: ${
          $q.screen.gt.md ? '600px' : '500px'
        }; min-width: ${$q.screen.gt.md ? '600px' : '500px'}`"
        fit="cover"
        :height="$q.screen.lt.lg ? '450px' : '100%'"
        style="width: 100%"
        :src="$menuItem.item?.image?.image || $store.images.empty"
      >
        <template v-slot:error>
          <span>
            <q-img
              :ratio="1"
              fit="cover"
              height="100%"
              width="600px"
              :src="$store.images.empty"
            ></q-img>
          </span> </template
      ></q-img>
      <div
        style="overflow-x: auto; width: -webkit-fill-available"
        class="column no-wrap justify-between full-height px-15 pt-15 relative-position"
      >
        <div class="column full-width">
          <div class="huge3 bold mb-6">{{ $menuItem.item?.name }}</div>
          <div v-if="$menuItem.item?.description?.length" class="body mb-6">
            {{ $menuItem.item?.description }}
          </div>
          <MenuItemCharacteristics v-if="currentSize" :size="currentSize" />

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
          class="row items-center gap-sm-15 gap-xs-5 bg-background-color py-12 bottom-block"
          :class="[
            { 'mt-15': currentSize?.modifierGroups?.length },
            {
              'no-wrap  box-shadow pa-5 bg-backing-color': $q.screen.xs,
            },
          ]"
          style="position: sticky; bottom: 0px; left: 0px"
        >
          <ChangeAmount
            height="48px"
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
            height="48px"
            :loading="loading"
            :disabled="isAddToCardDisabled"
            :label="
              $q.screen.lt.lg
                ? 'Добавить'
                : `Добавить за ${beautifyNumber(currentPrice, true)} ₽`
            "
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
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { beautifyNumber } from 'src/models/store'

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

const getBorderRadius = computed(() => {
  return `${uiSettingsRepo.item?.borderRadius}px ${
    q.screen.lt.lg ? uiSettingsRepo.item?.borderRadius : '0'
  }px  0 ${q.screen.gt.md ? uiSettingsRepo.item?.borderRadius : '0'}px`
})

const currentPrice = computed(() => {
  return (
    ((currentSize.value?.price || 0) +
      sum(
        currentSize.value?.modifierGroups?.flatMap((v) =>
          v.items.map((el) => el.quantity * (el.price || 0))
        )
      )) *
    quantity.value
  )
})

watch(
  () => menuItemRepo.item,
  () => {
    if (props.modelValue) {
      quantity.value = 1
      // if (menuItemRepo.item) {
      //   const test = [1, 3, 4, 5, 6, 7, 8]
      //   test.forEach((el) =>
      //     menuItemRepo.item?.sizes.push({
      //       ...menuItemRepo.item.sizes[0],
      //       id: String(el),
      //     })
      //   )
      // }
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
    store.serviceSettingsModal = true
    emit('update:modelValue', false)
  } else if (cartRepo.item && currentSize.value) {
    try {
      cartRepo.loading = true
      loading.value = true
      await cartItemRepo.createCartItem({
        cart: cartRepo.item?.id,
        quantity: quantity.value,
        size: currentSize.value?.id || '',
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
    } finally {
      emit('update:modelValue', false)
    }
  }
  if (q.screen.xs) {
    void router.push({
      name: route.name === 'menuItemPage' ? 'home' : 'qrHome',
    })
  }
}
</script>

<style lang="scss" scoped>
.bottom-block {
  border-top: 1px var(--divider-color) solid;
}
</style>
