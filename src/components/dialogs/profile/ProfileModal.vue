<template>
  <CDialog
    :model-value="$store.profileModal"
    @update:model-value="$store.profileModal = $event"
    width="320px"
    height="359px"
    no-padding
  >
    <template v-slot:header>
      <div class="row gap-5 no-wrap items-center">
        <CIconButton
          v-if="selectedItem !== 'start'"
          @click="selectedItem = 'start'"
          icon="fa-light fa-angle-left"
          hover-icon-color="primary"
          color="secondary-button-color box-shadow"
          icon-color="on-secondary-button-color"
          size="30px"
        />
        {{ currentHeader }}
      </div>
    </template>
    <q-tab-panels
      animated
      v-model="selectedItem"
      style="height: 100% !important"
      class="bg-transparent full-height"
    >
      <q-tab-panel name="start" class="pa-10 column no-wrap">
        <div class="column full-width gap-5 text-on-background-color">
          <template v-for="(el, index) in profileItems" :key="index">
            <q-separator v-if="index" color="divider-color" />
            <div
              @click="selectItem(el.val)"
              class="row cursor-pointer full-width gap-8 items-center no-wrap"
            >
              <div class="bg-background-color border-radius pa-5 box-shadow">
                <CIcon :name="el.icon" color="on-background-color" />
              </div>
              <div>{{ el.label }}</div>
            </div>
          </template>
        </div>
      </q-tab-panel>
      <q-tab-panel name="data" class="pa-10 column no-wrap"
        ><MyProfileData
      /></q-tab-panel>
    </q-tab-panels>
  </CDialog>
</template>
<script lang="ts" setup>
import CDialog from 'src/components/template/dialogs/CDialog.vue';
import { authentication } from 'src/models/authentication/authentication';
import { computed, ref } from 'vue';
import MyProfileData from './MyProfileData.vue';
import CIcon from 'src/components/template/helpers/CIcon.vue';
import CIconButton from 'src/components/template/buttons/CIconButton.vue';

const selectedItem = ref<string>('start');

const profileItems = ref([
  {
    label: 'Мои данные',
    icon: 'fa-light fa-pencil',
    val: 'data',
  },
  // {
  //   label: 'История заказов',
  //   icon: 'fa-light fa-arrow-rotate-left',
  //   val: 'orders',
  // },
  // {
  //   label: 'Мои карты',
  //   icon: 'fa-light fa-credit-card',
  //   val: 'cards',
  // },
  // {
  //   label: 'О нас',
  //   icon: 'fa-light fa-building',
  //   val: 'about',
  // },
  {
    label: 'Выйти',
    icon: 'fa-light fa-right-from-bracket',
    val: 'exit',
  },
]);

const currentHeader = computed(() => {
  return selectedItem.value !== 'start' ? 'Мои данные' : 'Профиль';
});

const selectItem = (value: string) => {
  if (value == 'exit') {
    void authentication.logout();
    window.location.reload();
  } else {
    selectedItem.value = value;
  }
};
</script>
