<template>
  <div
    :class="[
      $q.screen.lt.lg ? 'row pt-md-20 pt-xs-12 no-wrap full-width' : 'column',
    ]"
    :style="`min-width: ${$q.screen.gt.md ? '300px' : 'unset'};
      max-width: ${$q.screen.gt.md ? '300px' : 'unset'};
      height: fit-content;
      position: ${$q.screen.lt.lg ? 'relative' : 'sticky'};
      top: ${$q.screen.lt.lg ? '0px' : '80px'};
      z-index:9;
      overflow-x: ${$q.screen.lt.lg ? 'auto' : 'unset'}
      `"
    class="gap-lg-1 gap-md-8 gap-xs-6 bg-background-color"
  >
    <div
      v-for="(el, index) in tabs"
      :key="index"
      :class="
      $router.isIncludesRouteName(el.selectedOn)
          ? 'bg-secondary text-on-secondary'
          : $q.screen.lt.lg
          ? 'bordered text-on-background-color'
          : 'full-width text-on-background-color'
      "
      class="row cursor-pointer items-center no-wrap gap-5 px-10 border-radius2 py-6 mb-xs-2 mb-lg-0"
      @click="tabClickHandler(el.routeName)"
    >
      <div class="body bold ellipsis">
        {{ el.label }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tabs = ref([
  {
    label: 'Мои данные',
    routeName: 'profileData',
    selectedOn: ['profileData']
  },
  {
    label: 'Мои адреса',
    routeName: 'profileAddresses',
    selectedOn: ['profileAddresses']
  },
  {
    label: 'История заказов',
    routeName: 'ordersHistory',
    selectedOn: ['ordersHistory', 'orderDetail']
  }
])

const tabClickHandler = async (routeName?: string) => {
  if (routeName) {
    await router.push({ name: routeName })
  }
}
</script>

<style lang="scss" scoped>
.bordered {
  border: 1px var(--secondary-button-color) solid;
}
</style>
