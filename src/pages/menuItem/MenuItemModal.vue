<template>
  <CDialog
    :height="$q.screen.gt.md ? '600px' : undefined"
    :hide-close="$q.screen.lt.md"
    :maximize="$q.screen.lt.xl"
    :model-value="modelValue"
    :no-overflow="$q.screen.gt.md"
    :position="$q.screen.lt.md ? 'bottom' : undefined"
    :width="$q.screen.gt.md ? '1150px' : '500px'"
    dialog-class="no-scrollbar"
    height-percent="100%"
    no-padding
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div
      :class="$q.screen.lt.lg ? 'column' : 'row full-height '"
      class="no-wrap full-width relative-position text-on-background-color"
      itemscope
      itemtype="https://schema.org/Product"
    >
      <div
        v-if="$q.screen.lt.md"
        class="close-button row box-shadow items-center justify-center cursor-pointer"
        @click="$emit('update:modelValue', false)"
      >
        <CIcon
          class="mt-1"
          color="on-background-color"
          hover-color="primary"
          name="fa-regular fa-angle-down"
          size="24px"
        />
      </div>
      <img
        :ratio="1"
        :src="currentImage"
        :style="`border-radius: ${getImageBorderRadius}; max-width: ${
          $q.screen.gt.md ? '600px' : $q.screen.md ? '500px' : undefined
        }; min-width: ${
          $q.screen.gt.md ? '600px' : $q.screen.md ? '500px' : undefined
        }; margin-bottom: ${$q.screen.lt.md ? '-20px' : 'unset'}; height: ${$q.screen.lt.lg ? '450px' : '100%'}`"
        class="col"
        fit="cover"
        itemprop="image"
        style="width: 100%"
      />

      <div
        v-if="!$menuItem.loadings.retrieve"
        :style="`border-radius: ${
          $q.screen.lt.md ? getImageBorderRadius : 'unset'
        }`"
        class="column no-wrap col justify-between full-height px-md-15 px-xs-8 pt-md-15 pt-xs-8 pb-xs-50 pb-lg-0 relative-position bg-background-color"
        style="overflow-x: auto"
      >
        <div class="column full-width">
          <div class="huge3 bold mb-2" itemprop="name">
            {{ $menuItem.item?.name }}
          </div>
          <div
            v-if="currentSize?.characteristics.weight"
            class="body"
            itemprop="weight"
            style="opacity: 0.5"
          >
            {{
              currentWeight
            }}{{
              currentSize.characteristics.unit
                ? unitTypeNamesShort[currentSize.characteristics.unit]
                : 'г'
            }}
          </div>
          <div
            v-if="$menuItem.item?.description?.length"
            class="body mb-8 mt-2"
            itemprop="description"
            style="white-space: pre-line"
          >
            {{ $menuItem.item?.description }}
          </div>

          <MenuItemCharacteristics v-if="currentSize && $companyGroup.item?.externalId !== 'tochka_vkusa'"
                                   :size="currentSize" />
          <MenuItemRelatedItems
            v-if="
              $cart.item &&
              currentMenuRulesForAdding?.length &&
              !$menuRulesForAdding.loadings.list
            "
            :items="currentMenuRulesForAdding"
          />
          <div
            v-if="$menuItem.item && $menuItem.item.sizes.length > 1"
            class="relative-position mt-8"
          >
            <ItemSizeSelector
              :model-value="currentSize || undefined"
              :sizes="$menuItem.item?.sizes"
              @update-tab="currentSize = $event"
            />
          </div>
          <div class="mt-10">
            <div v-for="(el, index) in currentModifierGroups" :key="index">
              <q-separator v-if="index" class="my-8" color="divider-color" />
              <ModifiersSelector :group="el" />
            </div>
          </div>
        </div>
        <teleport :disabled="!touchSpot || !$q.screen.lt.lg" :to="touchSpot">
          <div
            :class="[
              { 'mt-lg-15': currentSize?.modifierGroups?.length },
              {
                'px-md-15 px-xs-8 full-width': $q.screen.lt.lg,
              },
            ]"
            :style="`position: ${
              $q.screen.lt.lg ? 'absolute' : 'sticky'
            }; bottom: 0px; left: 0px; border-radius:${
              $q.screen.lt.md ? 'unset' : getBottomBlockBorderRadius
            }`"
            class="row items-center gap-sm-15 gap-xs-5 bg-background-color py-lg-12 py-xs-10 bottom-block"
          >
            <ChangeAmount
              v-if="!$store.freeItem"
              v-model="quantity"
              :height="$q.screen.lt.lg ? '40px' : '48px'"
              background-color="white"
              text-color="on-secondary-button-color"
            />
            <div
              v-if="$store.tableMode && !$pad.item?.settings.orders_enabled"
              class="full-width text-danger"
            >
              Оформление заказов временно недоступно
            </div>
            <div class="col-grow">
              <CButton
                :disabled="isAddToCardDisabled"
                :height="$q.screen.lt.lg ? '40px' : '48px'"
                :loading="loading"
                class="full-width subtitle-text"
                @click="addToCart()"
              >
                <div class="row gap-2 no-wrap">
                  <div>{{ currentPrice ? 'Добавить за' : 'Добавить' }}</div>
                  <div
                    v-if="currentPrice"
                    class="row gap-2 no-wrap"
                    itemprop="offers"
                    itemscope
                    itemtype="https://schema.org/Offer"
                  >
                    <div itemprop="price">
                      {{ beautifyNumber(currentPrice, true) }}
                    </div>
                    <div itemprop="priceCurrency">₽</div>
                  </div>
                </div>
                <template v-if="$q.screen.lt.md">
                  <q-menu v-if="$menuItem.item?.isDead" v-model="isDeadErr" class="pa-3 secondary-text">
                    {{ $uiSettings.item?.outOfStockText || 'Товар недоступен' }}
                  </q-menu>
                  <q-menu v-else-if="!menuItemRepo.item?.isItemInMenu && !store.freeItem" v-model="isNotInMenuErr"
                          class="pa-3 secondary-text">
                    Недоступно к заказу
                  </q-menu>
                </template>


              </CButton>
              <template v-if="$q.screen.gt.sm">
                <CTooltip v-if="$menuItem.item?.isDead"
                >Товар недоступен
                </CTooltip>
                <CTooltip
                  v-else-if="!menuItemRepo.item?.isItemInMenu && !store.freeItem"
                >Недоступно к заказу
                </CTooltip>
              </template>
            </div>
          </div>
        </teleport>
      </div>
      <div
        v-else
        class="column justify-between full-width px-md-15 px-xs-8 pt-md-15 mt-xs-18 mt-md-0 pb-xs-50 pb-lg-0"
      >
        <div>
          <q-skeleton class="mb-5" height="30px" width="80%" />
          <q-skeleton class="mb-5" height="30px" width="40%" />
          <q-skeleton class="mb-5" height="20px" width="20%" />
          <q-skeleton class="mb-3" height="20px" width="100%" />
          <q-skeleton class="mb-3" height="20px" width="100%" />
          <q-skeleton height="20px" width="40%" />
        </div>
        <div class="row full-width py-lg-12 py-xs-10 gap-sm-15 gap-xs-5">
          <q-skeleton :height="$q.screen.lt.lg ? '40px' : '48px'" width="30%" />
          <q-skeleton :height="$q.screen.lt.lg ? '40px' : '48px'" class="col" />
        </div>
      </div>
    </div>
    <div v-if="$q.screen.lt.lg" ref="touchSpot"></div>
  </CDialog>
</template>
<script lang="ts" setup>
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import MenuItemCharacteristics from './MenuItemCharacteristics.vue'
import { ItemSize, unitTypeNamesShort } from 'src/models/menu/menu'
import { computed, ref, watch } from 'vue'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import ItemSizeSelector from './ItemSizeSelector.vue'
import ModifiersSelector from './ModifiersSelector.vue'
import ChangeAmount from 'src/components/inputs/ChangeAmount.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import { beautifyNumber, store } from 'src/models/store'
import { padRepo } from 'src/models/pads/padRepo'
import { sum } from 'lodash'
import { authentication } from 'src/models/authentication/authentication'
import { cartRepo } from 'src/models/carts/cartRepo'
import { companyRepo } from 'src/models/company/companyRepo'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { cartItemRepo } from 'src/models/carts/cartItem/cartItemRepo'
import { CartItemModifier } from 'src/models/carts/cartItem/cartItem'
import { useMeta, useQuasar } from 'quasar'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import CTooltip from 'src/components/helpers/CTooltip.vue'
import MenuItemRelatedItems from './MenuItemRelatedItems.vue'
import { menuRulesForAddingRepo } from 'src/models/menu/menuItem/menuRulesForAdding/menuRulesForAddingRepo'
import {
  ecommerceAdd,
  ecommerceDetail
} from 'src/models/ecommerceEvents/ecommerceEvents'
import { CalculationStatus } from 'src/models/carts/cart'
import { notifier } from 'src/services/notifier'
import { useFictiveUrlStore } from 'stores/fictiveUrlStore'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const fictiveUrlStore = useFictiveUrlStore()
const isDeadErr = ref(false)
const isNotInMenuErr = ref(false)
const touchSpot = ref<HTMLDivElement>()
const currentSize = ref<ItemSize | null>(null)
const quantity = ref(1)
const loading = ref(false)
const q = useQuasar()

const currentWeight = computed(() => {
  const roundedWeight = currentSize.value?.characteristics.weight.toFixed(3)
  return currentSize.value?.characteristics.unit
    ? Number(roundedWeight)
    : (Number(roundedWeight) || 0) * 1000
})

const currentImage = computed(() => {
  return menuItemRepo.loadings.retrieve
    ? store.menuItemImage?.thumbnail || store.images.empty
    : menuItemRepo.item?.image?.image ||
    store.menuItemImage?.thumbnail ||
    store.images.empty
})

const currentMenuRulesForAdding = computed(() => {
  if (!cartRepo.item) return
  return menuRulesForAddingRepo.items.filter((el) => {
    const availableTypes = el.availableDeliveryTypes as string[]
    const currentCartType = cartRepo.item?.type as string
    return availableTypes.includes(currentCartType)
  })
})

const getImageBorderRadius = computed(() => {
  return `${uiSettingsRepo.item?.borderRadius}px ${
    q.screen.lt.lg ? uiSettingsRepo.item?.borderRadius : '0'
  }px  0 ${q.screen.gt.md ? uiSettingsRepo.item?.borderRadius : '0'}px`
})

const getBottomBlockBorderRadius = computed(() => {
  return q.screen.lt.lg
    ? `0 0 ${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px`
    : 'unset'
})

const currentModifierGroups = computed(() => {
  return currentSize.value?.modifierGroups?.filter(
    (v) =>
      !v.isHidden && !!v.items.length && v.items.some((el) => !el.is_hidden)
  )
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
      if (menuItemRepo.item) {
        void ecommerceDetail(menuItemRepo.item)
      }
      quantity.value = 1
      currentSize.value = menuItemRepo.item?.sizes[0]
        ? menuItemRepo.item?.sizes[0]
        : null
      if (menuItemRepo.item) {
        fictiveUrlStore.setFictiveProductUrl(menuItemRepo.item)
        const metaData = {
          title: menuItemRepo.item.name || '',
          titleTemplate: (title: any) => `${title}`,
          meta: {
            description: {
              name: 'description',
              content: menuItemRepo.item.description || ''
            },
            keywords: {
              name: 'keywords',
              content: ''
            }
          }
        }
        useMeta(metaData)
      }
    }
  }
)

const isAddToCardDisabled = computed(() => {
  if (
    menuItemRepo.item?.isDead ||
    (!menuItemRepo.item?.isItemInMenu && !store.freeItem)
  )
    return true
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
  if (q.screen.lt.md) {
    if (menuItemRepo.item?.isDead) {
      isDeadErr.value = true
      return
    }
    if (!menuItemRepo.item?.isItemInMenu && !store.freeItem) {
      isNotInMenuErr.value = true
      return
    }
  }
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
    store.storedMenuItem = menuItemRepo.item?.id || null
    emit('update:modelValue', false)
  } else if (cartRepo.item && currentSize.value) {
    try {
      cartRepo.loading = true
      loading.value = true
      cartRepo.item = await cartItemRepo.createCartItem({
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
                  sum: String(Number(el.price) * el.quantity)
                } as CartItemModifier
              })
              .filter((e) => e.quantity)
          ) || [],
        free_item: store.freeItem || undefined
      })
      quantity.value = 1
    } catch (e) {
      notifier.error('Ошибка при добавлении в корзину')
    } finally {
      loading.value = false
      if (cartRepo.item?.calculationStatus !== CalculationStatus.IN_PROGRESS) {
        cartRepo.loading = false
      }

      emit('update:modelValue', false)
      if (menuItemRepo.item) {
        void ecommerceAdd(menuItemRepo.item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom-block {
  border-top: 1px var(--divider-color) solid;
}

.close-button {
  position: sticky;
  margin-bottom: -40px;
  top: 10px;
  width: 40px;
  height: 40px;
  z-index: 10;
  border-radius: 50%;
  background-color: var(--background-color);
  left: 10px;
}

.dimmed {
  filter: grayscale(90%);
}
</style>
