<template>
  <div v-if="$order.item" class="pt-25 text-on-background-color">
    <div class="huge3 bold mb-8">Спасибо за заказ!</div>
    <div class="row full-width">
      <div
        :style="`max-width: ${
          $q.screen.lt.lg ? 'unset' : '550px'
        } ; width: 100%`"
        class="column"
      >
        <div class="row gap-6 items-center">
          <img
            v-if="$company.item?.image?.thumbnail"
            height="36"
            class="border-radius"
            style="object-fit: contain"
            :src="$company.item?.image?.thumbnail"
          />
          <div class="subtitle-text">
            Вы оформили заказ из «{{ $order.item.salesPoint.name }}»
          </div>
        </div>
        <div
          :style="`border: 1px ${lightColor(
            $uiSettings.item?.backgroundColor.on_color || '000',
            '10'
          )} solid`"
          class="pa-10 column full-width box-shadow border-radius mt-15"
        >
          <div class="body mb-2" style="opacity: 0.7">
            Заказ № {{ $order.item.number || '-' }}
          </div>
          <div class="header2 bold mb-8">
            Приготовим к {{ $order.item?.deliveryTime || '-' }}
          </div>
          <OrderStepper
            :style="`max-width: ${
              $q.screen.lt.lg ? 'unset' : '432px'
            }; width: 100%`"
          />
        </div>
      </div>
    </div>
    <div
      :style="`border: 1px ${lightColor(
        $uiSettings.item?.backgroundColor.on_color || '000',
        '10'
      )} solid; max-width: ${$q.screen.gt.md ? '550px' : ''} `"
      class="column full-width mt-12 mb-lg-20 mb-xs-12 no-wrap gap-4 pa-10 border-radius box-shadow"
    >
      <div class="body" style="opacity: 0.7">
        {{ $order.item.type === CartType.PICKUP ? 'Самовывоз' : 'Доставка' }} из
        ресторана
      </div>
      <div class="row gap-3 no-wrap">
        <CIcon name="fa-regular fa-location-dot" color="primary" size="22px" />
        <div class="header3 bold">
          {{ $order.item.salesPoint.customAddress }}
        </div>
      </div>
    </div>
    <div class="full-width" :style="$q.screen.lt.lg ? '' : 'max-width: 550px'">
      <div
        :style="`border: 1px ${lightColor(
          $uiSettings.item?.backgroundColor.on_color || '000',
          '10'
        )} solid`"
        class="col border-radius box-shadow pa-10 column"
        style="height: fit-content"
      >
        <div class="row full-width justify-between items-center mb-6">
          <div style="opacity: 0.8" class="subtitle-text bold">
            Состав заказа
          </div>
        </div>
        <div class="column full-width gap-5">
          <div
            v-for="(el, index) in $order.item.items"
            :key="index"
            class="row full-width py-5 justify-between body"
          >
            <div class="row gap-6 items-center">
              <q-img
                :src="el.size.image?.thumbnail || $store.images.empty"
                height="65px"
                width="65px"
                fit="contain"
              >
                <template v-slot:error>
                  <span>
                    <q-img
                      fit="cover"
                      width="65px"
                      height="65px"
                      :src="$store.images.empty"
                    ></q-img>
                  </span> </template
              ></q-img>
              <div class="column gap-2">
                <div>{{ el.size.name }}</div>
                <div style="opacity: 0.5">{{ el.quantity }} шт</div>
              </div>
            </div>
            <div class="column items-end">
              <div
                v-if="el.price !== el.discounted_total_sum"
                style="opacity: 0.5"
                class="text-strike"
              >
                {{ beautifyNumber(el.price, true) }} ₽
              </div>
              <div>
                {{ beautifyNumber(el.discounted_total_sum || 0, true) }} ₽
              </div>
            </div>
          </div>
          <q-separator color="divider-color" />
          <div class="row full-width justify-between items-center gap-6 body">
            <div class="bold">Сумма заказа</div>
            <div class="bold">
              {{ beautifyNumber($order.item.totalSum, true) }} ₽
            </div>
          </div>
          <div
            v-if="$order.item.appliedBonuses"
            class="row full-width justify-between items-center gap-6 body text-primary"
          >
            <div class="bold">Списано баллов</div>
            <div class="bold">-{{ $order.item.appliedBonuses }} ₽</div>
          </div>
          <div class="row full-width justify-between items-center gap-6 body">
            <div class="bold">К оплате</div>
            <div class="bold">
              {{ beautifyNumber($order.item.discountedTotalSum, true) }} ₽
            </div>
          </div>
        </div>
      </div>
    </div>
    <CButton
      @click="
        $router.push({
          name: 'home',
        })
      "
      label="Вернуться в меню"
      height="48px"
      color="secondary-button-color"
      text-color="on-secondary-button-color"
      width="100%"
      class="body mt-lg-40 mt-xs-20"
      :style="$q.screen.lt.lg ? '' : 'max-width: 305px'"
    />
  </div>
</template>
<script lang="ts" setup>
import { orderRepo } from 'src/models/order/orderRepo'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import OrderStepper from './OrderStepper.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import { CartType } from 'src/models/carts/cart'
import { beautifyNumber, lightColor } from 'src/models/store'

const route = useRoute()

onMounted(() => {
  if (!orderRepo.item) {
    void orderRepo.retrieve(String(route.params.orderId))
  }
})
</script>

<style lang="scss" scoped></style>
