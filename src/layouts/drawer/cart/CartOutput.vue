<template>
  <div v-if="$cart.item" class="px-10 column">
    <div
      v-if="authentication.user && authentication.user.wallets[0]"
      class="bg-bonus-color border-radius text-on-bonus-color px-6 py-5 mb-15"
    >
      <div class="row no-wrap items-center justify-between">
        <div class="row gap-5 no-wrap items-center">
          <div class="py-5 px-6 bg-white-opacity border-radius box-shadow">
            <CIcon color="on-bonus-color" name="fa-light fa-piggy-bank" />
          </div>
          <div class="column gap-1">
            <div class="caption-text">Баллы</div>
            <div class="header3">
              {{ authentication.user.wallets[0].balance }}
            </div>
          </div>
        </div>
        <CButton
          @click="usePointsMode = true"
          text-button
          text-color="on-bonus-color"
        >
          <div class="secondary-text" style="text-decoration: underline">
            Применить
          </div>
        </CButton>
      </div>
      <div
        v-if="usePointsMode"
        class="column gap-10 bg-background-color border-radius px-6 py-8 mt-7"
      >
        <div class="row no-wrap justify-between body bold">
          <div>Доступно</div>
          <div>
            <span class="text-positive">{{ $cart.item.appliedBonuses }}</span>
            {{ '/' + authentication.user.wallets[0].balance }}
          </div>
        </div>
        <q-slider
          color="accent5"
          thumb-color="primary"
          :min="0"
          :max="authentication.user.wallets[0].balance"
          v-model="$cart.item.appliedBonuses"
        />
      </div>
    </div>
    <div class="column">
      <div class="header2 mb-10">Итого</div>
      <div class="box-shadow border-radius py-6 px-5 column gap-5">
        <div
          v-for="(el, index) in resultRows"
          :key="index"
          class="row items-center no-wrap justify-between"
        >
          <div class="row gap-5 no-wrap items-center">
            <div class="bg-white-opacity box-shadow border-radius px-6 py-5">
              <CIcon
                :color="index === 3 ? 'primary' : 'on-background-color'"
                :name="el.icon"
              />
            </div>
            <div
              :class="index === 3 ? 'text-primary' : 'text-on-background-color'"
              class="secondary-text"
            >
              {{ el.label }}
            </div>
          </div>
          <div
            :class="index === 3 ? 'text-primary' : 'text-on-background-color'"
            class="secondary-text"
          >
            {{ el.value || '0' }} ₽
          </div>
        </div>
      </div>
      <div class="row items-end gap-5 mt-10">
        <CInput
          v-model="$cart.item.promoCode"
          default
          class="body col-grow"
          height="50px"
          external-label="Промокод"
        />
        <CButton height="50px" class="body" label="Применить" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue';
import CIcon from 'src/components/template/helpers/CIcon.vue';
import CInput from 'src/components/template/inputs/CInput.vue';
import { authentication } from 'src/models/authentication/authentication';
import { cartRepo } from 'src/models/carts/cartRepo';
import { computed, ref } from 'vue';

const usePointsMode = ref(false);

const resultRows = computed(() => {
  return [
    {
      label: 'Сумма заказа',
      icon: 'fa-light fa-user',
      value: cartRepo.item?.discountedSum,
    },
    {
      label: 'Списать баллов',
      icon: 'fa-light fa-piggy-bank',
      value: '—' + cartRepo.item?.appliedBonuses,
    },
    {
      label: 'Доставка',
      icon: 'fa-light fa-truck',
      value: cartRepo.item?.deliveryPrice,
    },
    {
      label: 'К оплате',
      icon: 'fa-light fa-credit-card-blank',
      value: cartRepo.item?.discountedTotalSum,
    },
  ];
});
</script>

<style lang="scss" scoped></style>
