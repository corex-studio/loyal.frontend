<template>
  <div v-if="$order.item" class="pt-25 text-on-background-color">
    <div class="huge3 bold mb-8">Спасибо за заказ!</div>
    <div class="row full-width">
      <div class="pr-22 col-4 column">
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
        <div class="pa-10 column full-width box-shadow border-radius mt-15">
          <div class="body mb-2" style="opacity: 0.7">
            Заказ № {{ $order.item.number || '-' }}
          </div>
          <div class="header2 bold mb-8">
            Приготовим к {{ $order.item?.deliveryTime || '-' }}
          </div>
          <OrderStepper />
          <div
            class="mt-10 bg-backing-color text-on-backing-color border-radius pa-10 row no-wrap gap-3"
          >
            <CIcon
              name="fa-solid fa-location-dot"
              color="primary"
              size="22px"
            />
            <div class="column gap-2">
              <div class="header2 bold">Адрес заведения</div>
              <div class="body">{{ $order.item.salesPoint.address }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="ml-22 col border-radius box-shadow pa-10 column">
        <div class="row full-width justify-between items-center mb-6">
          <div class="subtitle-text" style="opacity: 0.8">Состав заказа</div>
          <!-- <CButton
            :label="`Отменить заказ`"
            text-button
            text-color="primary"
            class="body"
          /> -->
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
                      class="user-image"
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
            <div>{{ el.price }}₽</div>
          </div>
          <q-separator color="divider-color" />
          <div class="row full-width justify-between items-center gap-6">
            <div class="body">Итого</div>
            <div class="header2 bold">
              {{ $order.item.discountedTotalSum }} ₽
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
      class="body mt-40"
      style="max-width: 305px"
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

const route = useRoute()

onMounted(() => {
  if (!orderRepo.item) {
    void orderRepo.retrieve(String(route.params.orderId))
  }
})
</script>
