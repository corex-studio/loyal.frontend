<template>
  <div
    style="
      min-width: 218px;
      max-width: 218px;
      height: fit-content;
      position: sticky;
      top: 50px;
    "
    class="column"
  >
    <div v-for="(el, index) in tabs" :key="index">
      <q-separator v-if="index" />
      <div
        @click="tabClickHandler(el.routeName)"
        :class="
          $route.name === el.routeName
            ? 'text-primary'
            : 'text-on-background-color'
        "
        class="row full-width cursor-pointer items-center no-wrap gap-5 py-7"
      >
        <div
          style="width: 40px; height: 40px"
          class="bg-white-opacity row justify-center box-shadow items-center border-radius"
        >
          <CIcon
            :color="
              $route.name === el.routeName ? 'primary' : 'on-background-color'
            "
            :name="el.icon"
          />
        </div>
        <div class="body">
          {{ el.label }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { authentication } from 'src/models/authentication/authentication'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tabs = ref([
  {
    label: 'Данные',
    icon: 'fa-light fa-pencil',
    routeName: 'profileData',
  },
  {
    label: 'История заказов',
    icon: 'fa-light fa-arrow-rotate-left',
    routeName: 'ordersHistory',
  },
  {
    label: 'Мои карты',
    icon: 'fa-light fa-credit-card',
    routeName: 'profileCards',
  },
  {
    label: 'Мои адреса доставки',
    icon: 'fa-light fa-location-dot',
    routeName: 'profileAddresses',
  },
  // {
  //   label: 'Обратная связь',
  //   icon: 'fa-light fa-messages-question',
  //   routeName: 'profileData',
  // },
  {
    label: 'О приложении',
    icon: 'fa-light fa-mobile',
    routeName: 'aboutUs',
  },
  {
    label: 'Выйти',
    icon: 'fa-light fa-right-from-bracket',
  },
])

const tabClickHandler = async (routeName?: string) => {
  if (routeName) {
    await router.push({ name: routeName })
  } else {
    void authentication.logout()
  }
}
</script>
