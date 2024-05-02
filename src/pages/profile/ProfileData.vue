<template>
  <div
    :style="`max-width: ${$q.screen.lt.lg ? '' : '520px'}; width: 100%`"
    class="text-on-background-color column mb-xs-40 mb-lg-0"
  >
    <div
      v-if="$q.screen.lt.lg"
      class="row full-width items-center justify-between mb-md-15 mb-xs-8"
    >
      <div class="huge3 bold">Мои данные</div>
      <CButton
        @click="acceptModal = true"
        icon-right="fa-regular fa-arrow-right-from-bracket"
        text-button
        text-color="primary"
        ><div class="body bold">Выйти</div></CButton
      >
    </div>
    <ProfileUserCard @edit-profile="editProfileModal = true" />
    <div class="row full-width gap-md-10 gap-xs-6 mt-md-12 mt-xs-10">
      <div
        style="max-width: 50%"
        class="border-radius pa-10 col column gap-6 bordered-element"
      >
        <div class="body">Всего заказов</div>
        <div class="subtitle-text bold">{{ $order.pagination.total }}</div>
      </div>
      <div
        v-if="authentication.user?.wallets.length"
        class="border-radius pa-10 col column gap-6 bordered-element"
      >
        <div class="body">Бонусы</div>
        <div class="subtitle-text bold">
          {{ authentication.user?.wallets[0]?.balance || 0 }}
        </div>
      </div>
    </div>
    <CButton
      v-if="$q.screen.gt.md"
      style="width: 100%; max-width: 200px"
      @click="acceptModal = true"
      label="Выйти"
      height="48px"
      class="mt-20 body"
    />
  </div>
  <EditProfileModal v-model="editProfileModal" />
  <AcceptModal
    text="Вы точно хотите выйти из аккаунта?"
    v-model="acceptModal"
    @accept="logOut()"
  />
</template>
<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import CButton from 'src/components/template/buttons/CButton.vue'
import { authentication } from 'src/models/authentication/authentication'
import { Customer } from 'src/models/customer/customer'
import { ref, computed, onMounted } from 'vue'
import ProfileUserCard from './ProfileUserCard.vue'
import EditProfileModal from './EditProfileModal.vue'
import AcceptModal from 'src/components/dialogs/AcceptModal.vue'
import { cartRepo } from 'src/models/carts/cartRepo'
import { useRouter } from 'vue-router'
import { orderRepo } from 'src/models/order/orderRepo'

const router = useRouter()
const editProfileModal = ref(false)
const acceptModal = ref(false)
const _item = ref<Customer | null>(null)

const item = computed(() => {
  return authentication.user
})

const logOut = () => {
  cartRepo.item = null
  void authentication.logout()

  void router.push({
    name: 'home',
  })
  acceptModal.value = false
}

onMounted(() => {
  _item.value = cloneDeep(item.value)
  void orderRepo.list()
})
</script>

<style lang="scss" scoped>
.bordered-element {
  border: 1px var(--secondary) solid;
}
</style>
