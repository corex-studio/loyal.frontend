<template>
  <q-breadcrumbs separator="" class="mb-15 mt-10">
    <CHover v-slot="{ hover }">
      <q-breadcrumbs-el
        :label="
          $menu.item?.groups?.find((el) => el.id === $menuItem.item?.group)
            ?.name
        "
        class="caption-text pb-2"
        :class="hover ? 'text-primary' : 'text-on-background-color'"
        :to="{ name: 'home' }"
      />
    </CHover>
    <q-icon
      class="px-3 text-on-background-color"
      name="fal fa-chevron-right"
      style="font-size: 10px !important"
    />
    <q-breadcrumbs-el
      :label="$menuItem.item?.name || ''"
      class="caption-text text-on-background-color"
    />
  </q-breadcrumbs>
  <div v-if="$menuItem.item">
    <div
      style="min-height: 640px"
      class="row full-width justify-between no-wrap text-on-background-color"
    >
      <q-img
        style="width: 40%"
        :src="$menuItem.item.image?.thumbnail || $store.images.empty"
      >
        <template v-slot:error>
          <span>
            <q-img fit="cover" :src="$store.images.empty"></q-img>
          </span>
        </template>
      </q-img>

      <div class="column col-6 gap-15">
        <div class="header row justify-between relative-position">
          {{ $menuItem.item.name }}
          <CIcon
            v-if="currentSize?.nutritions.length"
            size="24px"
            color="text-on-background-color"
            name="fa-light fa-info-circle"
          >
            <q-tooltip
              class="column body text-on-backing-color bg-backing-color border-radius py-10 px-6"
            >
              <div
                v-for="(nutrition, index) in currentSize?.nutritions"
                :key="index"
              >
                <q-separator v-if="index" class="my-2" />
                <div class="row gap-2 bold mb-8">
                  <div>Пищевая ценность на</div>
                  <div>{{ `${nutritionsNames[nutrition.type]}` }}</div>
                </div>
                <div class="column full-width gap-6">
                  <div class="row full-width gap-3">
                    <div class="bold col-7">Калории:</div>
                    <div v-if="nutrition.calories">
                      {{ nutrition.calories }} г
                    </div>
                    <div v-else>Не указано</div>
                  </div>
                  <div class="row full-width gap-3">
                    <div class="bold col-7">Жиры:</div>
                    <div v-if="nutrition.fats">{{ nutrition.fats }} г</div>
                    <div v-else>Не указано</div>
                  </div>
                  <div class="row full-width gap-3">
                    <div class="bold col-7">Углеводы:</div>
                    <div v-if="nutrition.carbohydrates">
                      {{ nutrition.carbohydrates }} г
                    </div>
                    <div v-else>Не указано</div>
                  </div>
                  <div class="row full-width gap-3">
                    <div class="bold col-7">Белки:</div>
                    <div v-if="nutrition.proteins">
                      {{ nutrition.proteins }} г
                    </div>
                    <div v-else>Не указано</div>
                  </div>
                </div>
              </div>
            </q-tooltip>
          </CIcon>
        </div>
        <div v-if="$menuItem.item.description" class="body">
          {{ $menuItem.item.description }}
        </div>
        <div
          style="width: max-content"
          class="px-6 py-3 row border-radius bg-background-color box-shadow gap-5 no-wrap items-center text-primary"
        >
          <div v-if="currentSize?.price" class="header">
            {{ currentSize?.price + ' ₽' }}
          </div>
          <div v-else class="header">Цена не указана</div>
          <!-- <div class="header3 text-black3 text-strike mt-1">
            {{ 'Цена без скидки' }} ₽
          </div> -->
        </div>
        <div class="column gap-10">
          <div
            v-if="currentSize && currentSize.characteristics"
            class="body text-primary"
          >
            {{ currentSize?.characteristics.weight }} г
          </div>
          <div class="relative-position">
            <TabPicker
              v-if="$menuItem.item.sizes.length > 1"
              @update-tab="currentTab = $event"
              :tabs="$menuItem.item.sizes.map((v) => v.name)"
              :model-value="currentSize?.name"
            >
              <!-- <template v-if="$cart.isInCart(currentSize?.id)" v-slot:append>
                <div
                  class="py-3 px-4 bg-on-background-color rounded-100"
                  style="position: absolute; top: -15px; right: -15px"
                >
                  <CIcon
                    name="fa-solid fa-shopping-cart"
                    color="background-color"
                    size="13px"
                  >
                  </CIcon></div
              ></template> -->
            </TabPicker>
          </div>
        </div>
        <div style="max-width: 456px">
          <div v-for="(el, index) in currentSize?.modifierGroups" :key="index">
            <ModifiersSelector :class="{ 'mt-10': index }" :item="el" />
          </div>

          <div
            class="row items-center gap-15"
            :class="{ 'mt-15': currentSize?.modifierGroups?.length }"
          >
            <ChangeAmount background-color="white" v-model="quantity" />
            <CButton
              @click="addToCart()"
              text-color="on-primary"
              class="col-grow"
              height="50px"
              :loading="loading"
              :disabled="isAddToCardDisabled"
              icon="fa-light fa-shopping-cart"
              label="Добавить в корзину"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <ServiceSettingsModal
    :model-value="cartConfigureModal"
    @update:model-value="cartModalCloseHandler()"
  />
  <ItemNotFoundModal
    :model-value="itemNotFoundModal"
    @update:model-value="notFoundModalCloseHandler()"
  />
</template>
<script lang="ts" setup>
import TabPicker from 'src/components/template/buttons/TabPicker.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChangeAmount from 'src/components/inputs/ChangeAmount.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import CHover from 'src/components/template/helpers/CHover.vue'
import { Notify } from 'quasar'
import { cartItemRepo } from 'src/models/carts/cartItem/cartItemRepo'
import { cartRepo } from 'src/models/carts/cartRepo'
import { Cart } from 'src/models/carts/cart'
import ModifiersSelector from './ModifiersSelector.vue'
import { CartItemModifier } from 'src/models/carts/cartItem/cartItem'
import { nutritionsNames } from 'src/models/menu/menu'
import { sum } from 'lodash'
import ServiceSettingsModal from 'src/components/serviceSettings/ServiceSettingsModal.vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import ItemNotFoundModal from './ItemNotFoundModal.vue'
import { menuRepo } from 'src/models/menu/menuRepo'

const route = useRoute()

const router = useRouter()

const cartConfigureModal = ref(false)

const quantity = ref(1)

const currentTab = ref<string | null>(null)

const itemNotFoundModal = ref(false)

const loading = ref(false)

onMounted(() => {
  void menuItemRepo.retrieve(String(route.params.menuItemId)).then(() => {
    currentTab.value = menuItemRepo.item?.sizes[0]
      ? menuItemRepo.item?.sizes[0].name
      : null
  })
})

const notFoundModalCloseHandler = () => {
  itemNotFoundModal.value = false
  void router.replace({
    name: 'home',
  })
}

const cartModalCloseHandler = () => {
  cartConfigureModal.value = false
  const menuItemsIds = menuRepo.item?.groups?.flatMap((v) =>
    v.items.map((el) => el.id)
  )
  if (
    menuItemRepo.item &&
    menuItemsIds &&
    !menuItemsIds.includes(menuItemRepo.item?.id)
  ) {
    itemNotFoundModal.value = true
  }
}

const isAddToCardDisabled = computed(() => {
  return (
    currentSize.value?.modifierGroups?.some(
      (v) =>
        v.restrictions?.min_quantity &&
        sum(v.items.map((el) => el.quantity)) < v.restrictions.min_quantity
    ) || !quantity.value
  )
  // _.sum(item.items.map((el) => el.quantity))
  // ? item.items.find((v) => v.quantity)?.name
  // : 'Обязательно к выбору'
})

const currentSize = computed(() => {
  return menuItemRepo.item?.sizes.find((v) => v.name == currentTab.value)
})

// const changeQuantity = async (v: number) => {
//   const foundInCart = cartRepo.item?.cartItems.find(
//     (el) => el.size.uuid === currentSize.value?.id
//   )
//   if (foundInCart) {
//     try {
//       foundInCart.quantity = v
//       await cartItemRepo.update(foundInCart)
//       await cartRepo.current()
//       quantity.value = v
//     } catch {
//       Notify.create({
//         message: 'Ошибка изменения кол-ва',
//         color: 'danger',
//       })
//     }
//   } else {
//   quantity.value = v
//   }
// }

const addToCart = async () => {
  if (!cartRepo.item && salesPointRepo.item) {
    // companyRepo.item = salesPointRepo.item.company
    await companyRepo.retrieve(String(salesPointRepo.item.company.id))
    cartConfigureModal.value = true
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
      Notify.create({
        message: 'Успешно добавлено в корзину',
      })
    } catch (e) {
      loading.value = false

      console.log(e)
      Notify.create({
        message: 'Ошибка при добавлении в корзину',
        color: 'danger',
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
