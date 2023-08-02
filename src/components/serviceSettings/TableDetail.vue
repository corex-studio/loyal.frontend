<template>
  <div class="pa-10">
    <div class="header2">Стол: {{ table.number }}</div>
    <SwiperContainer
      v-if="table.images.length"
      class="mt-15"
      :slides-per-view="1.2"
      :items="table.images"
    >
      <template v-slot:item="{ item }">
        <div
          style="overflow: overlay; height: 202px"
          class="offer-block border-radius column no-wrap"
        >
          <q-img
            :src="item.image || $store.images.empty"
            style="border-radius: 10px 10px 0 0"
            fit="cover"
          />
        </div> </template
    ></SwiperContainer>
    <div class="body mt-15" v-if="table.description">
      {{ table.description }}
    </div>
    <div
      class="mt-15 px-5 py-6 column gap-5 full-width border-radius box-shadow bg-backing-color"
    >
      <div
        v-for="(field, index) in infoFields"
        :key="index"
        class="row full-width items-center no-wrap justify-between"
      >
        <div class="row gap-3 no-wrap items-center">
          <div class="bg-white-opacity border-radius box-shadow px-5 py-4">
            <CIcon
              :name="field.icon"
              :color="field.color || 'on-backing-color'"
            />
          </div>
          <div
            :class="
              field.color ? `text-${field.color}` : 'text-on-backing-color'
            "
          >
            {{ field.label }}
          </div>
        </div>
        <div
          :class="field.color ? `text-${field.color}` : 'text-on-backing-color'"
        >
          {{ field.value }}
        </div>
      </div>
    </div>
    <div class="row mt-15 full-width justify-center">
      <CButton
        @click="$emit('confirmSelection')"
        label="Выбрать"
        width="280px"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import SwiperContainer from 'src/layouts/containers/SwiperContainer.vue';
import { TableRaw } from 'src/models/sections/tables/table';
import CIcon from '../template/helpers/CIcon.vue';
import CButton from '../template/buttons/CButton.vue';

const props = defineProps<{
  table: TableRaw;
}>();

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void;
  (evt: 'confirmSelection'): void;
}>();

const infoFields = [
  {
    icon: 'fa-light fa-user',
    label: 'Минимальная вместимость',
    value: props.table.min_capacity + ' чел.',
    color: undefined,
  },
  {
    icon: 'fa-light fa-users',
    label: 'Максимальная вместимость',
    value: props.table.capacity + ' чел.',
    color: undefined,
  },
  // {
  //   icon: 'fa-light fa-wallet',
  //   label: 'Стоимость стола',
  //   value: '-',
  // },
  // {
  //   icon: 'fa-light fa-clock',
  //   label: 'Период бронирования',
  //   value: '-',
  // },
  // {
  //   icon: 'fa-light fa-lock',
  //   label: 'Стол забронирован',
  //   value: '-',
  //   color: 'red',
  // },
];
</script>
