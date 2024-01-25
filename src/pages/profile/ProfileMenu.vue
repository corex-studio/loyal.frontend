<template>
  <div
    :style="`min-width: ${
      $q.screen.lt.md ? '180px' : $q.screen.md ? '210px' : '300px'
    };
      max-width: ${
        $q.screen.lt.md ? '180px' : $q.screen.md ? '210px' : '300px'
      };
      height: fit-content;
      position: sticky;
      top: 80px;
      `"
    class="column gap-1"
    :class="{ 'full-width': $q.screen.xs }"
  >
    <div v-for="(el, index) in tabs" :key="index">
      <div
        @click="tabClickHandler(el.routeName)"
        :class="
          $route.name === el.routeName
            ? 'bg-secondary-button-color text-on-secondary-button-color'
            : ''
        "
        class="row full-width cursor-pointer items-center no-wrap gap-5 px-10 border-radius py-6"
      >
        <div class="body bold">
          {{ el.label }}
        </div>
      </div>
    </div>
  </div>
  <!-- <AcceptModal
    :model-value="acceptModal"
    @update:model-value="acceptModal = false"
    @accept="logOut()"
  /> -->
</template>
<script lang="ts" setup>
// import AcceptModal from 'src/components/dialogs/AcceptModal.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tabs = ref([
  {
    label: 'Мои данные',
    routeName: 'profileData',
  },
  {
    label: 'Мои адреса',
    routeName: 'profileAddresses',
  },
  // {
  //   label: 'Способы оплаты',
  //   routeName: 'profileCards',
  // },

  {
    label: 'О заведении',
    routeName: 'aboutUs',
  },
  {
    label: 'История заказов',
    routeName: 'ordersHistory',
  },
  // {
  //   label: 'Выйти',
  //   icon: 'fa-light fa-right-from-bracket',
  // },
])

const tabClickHandler = async (routeName?: string) => {
  if (routeName) {
    await router.push({ name: routeName })
  }
}
</script>
