<template>
  <div class="mt-20">
    <div class="row no-wrap full-width gap-lg-40 gap-xs-15 gap-md-25">
      <ProfileMenu v-if="showMenu" />
      <div class="col" v-if="!menuView">
        <router-view />
      </div>
    </div>

    <q-spinner-puff
      v-if="
        $order.loadings.list ||
        $deliveryAddress.loadings.list ||
        $paymentCard.loadings.list
      "
      style="position: fixed; top: 44%; left: 43%; z-index: 9999"
      color="primary"
      size="12%"
    />
  </div>
</template>
<script lang="ts" setup>
import { authentication } from 'src/models/authentication/authentication'
import ProfileMenu from './ProfileMenu.vue'
import { onMounted, computed } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { useRoute, useRouter } from 'vue-router'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { useQuasar } from 'quasar'

const router = useRouter()

const route = useRoute()

const q = useQuasar()

// const cashedRoute = ref<string | null>(null)

const menuView = computed(() => {
  return q.screen.xs && route.name === 'profilePage'
})

const showMenu = computed(() => {
  return !q.screen.xs || route.name === 'profilePage'
})

onMounted(() => {
  if (q.screen.gt.xs && route.name === 'profilePage') {
    router.replace({
      name: 'profileData',
    })
  }
  if (!authentication.user) void router.push({ name: 'home' })
  if (companyGroupRepo.item && companyGroupRepo.item?.companies.length < 2) {
    companyRepo.companyForProfile = companyRepo.item
  }
})

// watch(
//   () => q.screen.name,
//   (v) => {
//     if (v === 'xs') {
//       cashedRoute.value = String(route.name)
//       router.replace({
//         name: 'profilePage',
//       })
//     } else {
//       if (route.name === 'profilePage') {
//         router.replace({
//           name: cashedRoute.value || 'profileData',
//         })
//       }
//     }
//   }
// )
</script>

<style lang="scss" scoped>
.bell-icon {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
