<template>
  <div class="pa-10">
    <div
      class="column row items-center full-width border-radius box-shadow bg-background-color py-10 gap-10"
    >
      <CIcon name="fa-thin fa-check-circle" color="primary" size="60px" />
      <div class="header3 text-primary">Заявка на бронирование отправлена</div>
      <div class="row full-width justify-center">
        <div
          class="body text-on-background-color col-10"
          style="text-align: center"
        >
          Менеджер заведения свяжется с вами в ближайшее время для подтверждения
          брони
        </div>
      </div>
    </div>
    <div
      class="column full-width bg-background-color box-shadow border-radius mt-10"
    >
      <div class="row full-width pa-10 body bold">#112312</div>
      <div class="column full-width gap-5 px-5 pb-6">
        <div
          v-for="(el, index) in infoFields"
          :key="index"
          class="row full-width items-center justify-between"
        >
          <div class="row items-center gap-3 no-wrap">
            <div class="row px-4 py-3 border-radius box-shadow">
              <CIcon color="on-background-color" :name="el.icon" />
            </div>
            <div class="secondary-text">{{ el.label }}</div>
          </div>
          <div class="secondary-text">{{ el.value }}</div>
        </div>
      </div>
    </div>
    <div class="row full-width mt-15 justify-center">
      <CButton @click="$emit('close')" width="200px" label="Готово" />
    </div>
    <!-- <div class="column mt-15 items-center gap-13 full-width">
      <div class="header3">Хотите сделать предзаказ блюд?</div>
      <div class="row full-width gap-5 no-wrap">
        <CButton
          class="col"
          color="secondary-button-color"
          text-color="on-secondary-button-color"
          label="Нет"
        />
        <CButton class="col" label="Да" />
      </div>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
import { bookingRequestRepo } from 'src/models/bookingRequest/bookingRequestRepo'
import CButton from '../template/buttons/CButton.vue'
import CIcon from '../template/helpers/CIcon.vue'

defineEmits(['close'])

const infoFields = [
  {
    icon: 'fa-light fa-calendar',
    label: 'Бронь',
    value: '-',
  },
  {
    icon: 'fa-light fa-clock',
    label: 'Дата и время',
    value: bookingRequestRepo.item?.date,
  },
  {
    icon: 'fa-light fa-user',
    label: 'Персоны',
    value: bookingRequestRepo.item?.guestsCount,
  },
  {
    icon: 'fa-light fa-table-picnic',
    label:
      bookingRequestRepo.item && bookingRequestRepo.item?.tables.length > 1
        ? 'Столы'
        : 'Стол',
    value: bookingRequestRepo.item?.tables.map((v) => v.number).join(', '),
  },
]
</script>
