<template>
  <q-drawer
    side="right"
    style="z-index: 999999; height: 100%"
    overlay
    v-model="$store.bonusesDrawer"
    no-swipe-open
    behavior="mobile"
    :width="$q.screen.width < 465 ? $q.screen.width : 465"
    class="column full-height no-wrap bg-background-color text-on-background-color px-15 py-sm-20 py-xs-15"
  >
    <CIcon
      v-if="$q.screen.gt.sm"
      @click="$store.bonusesDrawer = false"
      :size="$q.screen.lt.md ? '28px' : '37px'"
      :style="`position: absolute; ${$q.screen.lt.md ? 'top: 27px' : 'top: 40px'}; ${$q.screen.lt.md ? 'right: 10px' : 'left: -50px'}`"
      name="fa-light fa-xmark"
      hover-color="primary"
      class="cursor-pointer"
      color="white"
    />

    <div class="row full-width justify-between">
      <div class="header bold">Бонусы</div>
      <CIcon
        v-if="$q.screen.lt.md"
        @click="$store.bonusesDrawer = false"
        size="28px"
        name="fa-light fa-xmark"
        hover-color="primary"
        class="cursor-pointer"
        color="on-background-color"
      />
    </div>
    <div
      class="column full-width bg-backing-color pt-12 pb-12 mt-sm-15 mt-xs-10 border-radius items-center text-on-backing-color"
    >
      <div class="row items-center header bold text-center">
        У вас {{ authentication.user?.wallets[0]?.balance || 0 }}
        <q-img width="50px" src="/assets/bonusesCoins.png" />
      </div>
      <div class="body">Тратьте на любимые блюда</div>
    </div>
    <div
      class="mt-sm-15 mt-xs-10 border-radius row no-wrap relative-position px-8 py-8 gap-5"
      :class="{
        'bg-loyalty-card-background-color': !$uiSettings.item?.loyaltyCardImage,
      }"
    >
      <q-img
        :src="$uiSettings.item?.loyaltyCardImage?.thumbnail"
        class="absolute border-radius"
        fit="cover"
        position="left"
        style="z-index: 0; width: 100%; height: 100%; top: 0; left: 0"
      />
      <q-img
        fit="contain"
        :src="$uiSettings.item?.loyaltyCardLogo?.thumbnail"
        style="max-height: 130px"
      />

      <div
        v-if="qrCode && authentication.user?.loyaltyCard?.card_number"
        style="
          width: 130px;
          height: 130px;
          min-width: 130px;
          overflow: hidden;
          z-index: 1;
        "
        class="border-radius"
      >
        <img
          width="130"
          height="130"
          style="min-width: 130px"
          :src="qrCode"
          alt="QR Code"
        />
      </div>
    </div>
    <!-- <TabPicker
      :tabs="['Итория бонусов', 'О программе']"
      width="100%"
      @update-tab="currentTab = $event"
      class="mt-sm-20 mt-xs-15"
    />
    <BalanceOperationsList v-if="currentTab === 'Итория бонусов'" /> -->
    <AboutLoyaltyProgram />
  </q-drawer>
</template>
<script lang="ts" setup>
import { useQRCode } from '@vueuse/integrations/useQRCode'
// import TabPicker from 'src/components/template/buttons/TabPicker.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { authentication } from 'src/models/authentication/authentication'
import { balanceOperationRepo } from 'src/models/balanceOperation/balanceOperationRepo'
import { store } from 'src/models/store'
import { watch } from 'vue'
// import BalanceOperationsList from './BalanceOperationsList.vue'
import AboutLoyaltyProgram from './AboutLoyaltyProgram.vue'

let qrCode: any = null

// const currentTab = ref('Итория бонусов')

watch(
  () => store.bonusesDrawer,
  (v) => {
    if (v) {
      void loadOperations()
      if (authentication.user?.loyaltyCard?.card_number) {
        qrCode = useQRCode(
          String(authentication.user?.loyaltyCard?.card_number),
          {
            type: 'image/png',
          },
        )
      }
    }
  },
)

const loadOperations = async (page = 1, appendItems = false) => {
  await balanceOperationRepo.list(
    {
      customer: authentication.user?.id,
    },
    {
      page,
      appendItems,
      pageSize: 100,
    },
  )
}
</script>
