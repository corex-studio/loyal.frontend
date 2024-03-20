<template>
  <div
    :class="{
      'cursor-pointer': !item.items?.length,
      'qr-order-item pa-10': asCard,
    }"
    class="relative-position overflow-hidden"
  >
    <Transition name="fade">
      <div
        class="absolute-center full-height full-width flex flex-center"
        style="z-index: 1; backdrop-filter: blur(2px)"
        v-if="loading"
      >
        <q-spinner size="2em" color="primary" />
      </div>
    </Transition>
    <div class="row justify-between items-center">
      <div class="row items-center">
        <div class="body bold text-on-backing-color">
          № {{ item.number || 'Б/Н' }}
        </div>
        <CBadge
          :color="item.orderStatus.color"
          class="body cursor-pointer px-4 ml-5"
          height="20px"
          no-padding
          style="line-height: 100%"
        >
          {{ item.orderStatus?.name }}
        </CBadge>
      </div>
      <div class="body bold">{{ item.discountedTotalSum }} ₽</div>
    </div>
    <q-separator class="my-7" color="divider-color" />
    <div class="text-on-backing-color">
      <div class="row body">
        <span class="bold" style="max-width: 40%; width: 100%">Оплата:</span>
        <div class="row items-center pl-3">
          {{ item.getPaymentType?.label }}
        </div>
      </div>
      <div class="row body mt-4">
        <span class="bold" style="max-width: 40%; width: 100%">Создан:</span>
        <div class="row items-center pl-3">
          {{ item.createdAt }}
        </div>
      </div>
      <div class="row body mt-4 no-wrap">
        <span class="bold" style="max-width: 40%; width: 100%"
          >Комментарий:</span
        >
        <div class="row items-center pl-3">
          {{ item.comment || 'Отсутствует' }}
        </div>
      </div>
    </div>
    <template v-if="item.items?.length">
      <q-separator class="my-7" color="divider-color" />
      <div class="column gap-5 full-width body">
        <template v-for="(el, index) in item.items" :key="index">
          <q-separator v-if="index" />
          <div class="row no-wrap gap-5 items-center">
            <q-img
              :src="el.size.image?.thumbnail || $store.images.empty"
              class="rounded-5"
              fit="cover"
              height="45px"
              style="min-width: 45px"
              width="45px"
            >
              <template v-slot:error>
                <span>
                  <q-img
                    :src="$store.images.empty"
                    class="user-image"
                    fit="cover"
                    height="45px"
                    style="min-width: 45px"
                    width="45px"
                  ></q-img>
                </span>
              </template>
            </q-img>
            <div class="column gap-2 col">
              <div class="ellipsis-2-lines">
                {{ el.size.name }}
              </div>
              <div class="row full-width justify-between">
                <div>
                  {{ el.quantity }} x {{ beautifyNumber(el.price, true) }}
                </div>
                <div class="column items-end">
                  <div v-if="el.total_sum < el.sum">
                    {{ beautifyNumber(el.total_sum, true) }} ₽
                  </div>
                  <div :class="{ 'text-strike': el.total_sum < el.sum }">
                    {{ beautifyNumber(el.sum, true) }} ₽
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { Order } from 'src/models/order/order'
import CBadge from 'components/helpers/CBadge.vue'
import { beautifyNumber } from 'src/models/store'

withDefaults(
  defineProps<{
    item: Order
    asCard?: boolean
    loading?: boolean
  }>(),
  { asCard: true },
)
</script>
<style lang="scss" scoped>
.qr-order-item {
  border: 1px solid var(--divider-color);
  border-radius: var(--border-radius);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
