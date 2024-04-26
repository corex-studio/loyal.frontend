<template>
  <div>
    <q-drawer
      side="left"
      style="z-index: 999999; height: 100%"
      overlay
      v-model="$store.leftDrawer"
      no-swipe-open
      behavior="mobile"
      :width="$q.screen.gt.xs ? 350 : $q.screen.width"
      class="column full-height no-wrap bg-background-color text-on-background-color px-8 py-10"
    >
      <div class="row full-width justify-between items-center">
        <img
          v-if="
            $company.item?.logo?.thumbnail || $company.item?.image?.thumbnail
          "
          @click="
            $router.push({
              name: 'home',
            })
          "
          :height="48"
          class="border-radius cursor-pointer"
          style="object-fit: contain; max-width: 200px"
          :src="
            $company.item?.logo?.thumbnail || $company.item?.image?.thumbnail
          "
        />
        <CIcon
          @click="$store.leftDrawer = false"
          name="fa-regular fa-xmark"
          color="on-background-color"
          size="24px"
          hover-color="primary"
          class="cursor-pointer"
        />
      </div>
      <div
        @click="openCitySelectorModal()"
        style="width: fit-content"
        class="row cursor-pointer gap-4 mt-9"
      >
        <CIcon
          name="fa-regular fa-location-dot"
          color="on-background-color"
          size="22px"
        />
        <div class="column items-start">
          <div class="header3 bold">
            {{ $companyGroup.item?.cityData.current?.name || 'Калининград' }}
          </div>
          <CButton
            v-if="
              $companyGroup.item &&
              $companyGroup.item?.cityData.results.length > 1
            "
            label="Сменить город"
            text-button
            text-color="secondary"
          />
        </div>
      </div>
      <q-separator color="divider-color" class="my-8" />
      <div class="column full-width gap-12 no-wrap body">
        <CButton
          @click="el.click()"
          v-for="(el, index) in blocks.filter((v) => !v.hidden)"
          :key="index"
          text-button
          text-color="on-background-color"
          style="width: fit-content"
          class="body button"
          :label="el.label"
        />
      </div>
      <q-separator class="my-8" />
      <ContactsHeader style="gap: 10px !important; flex-direction: column !important;" />
      <q-separator class="my-8" />
      <TopHeaderDeliveryInfo />
      <TopHeaderSocials class="mt-2" />
    </q-drawer>
  </div>
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { authentication } from 'src/models/authentication/authentication'
import { store } from 'src/models/store'
import { computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopHeaderSocials from '../header/TopHeaderSocials.vue'
import TopHeaderDeliveryInfo from '../header/TopHeaderDeliveryInfo.vue'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import ContactsHeader from 'layouts/header/ContactsHeader.vue'

const router = useRouter()
const route = useRoute()

const blocks = computed(() => {
  return [
    {
      label: 'Профиль',
      hidden: !authentication.user || authentication.user.isAnonymous,
      click: () => {
        router.push({
          name: 'profilePage',
        })
      },
    },
    {
      label: 'Бонусы',
      hidden: !authentication.user || authentication.user.isAnonymous,
      click: () => {
        store.bonusesDrawer = true
        store.leftDrawer = false
      },
    },
    {
      label: 'О нас',
      hidden: !authentication.user,
      click: () => {
        router.push({
          name: 'aboutUs',
        })
      },
    },
    {
      label: 'Контакты',
      click: () => {
        scrollToBlock('footer')
      },
    },
    {
      label: 'Мобильное приложение',
      click: () => {
        scrollToBlock('footer')
      },
    },
    {
      label: uiSettingsRepo.item?.becomeFranchisee?.title || 'Франшиза',
      hidden: !uiSettingsRepo.item?.becomeFranchisee,
      click: () => {
        window.open(uiSettingsRepo.item?.becomeFranchisee?.link || '', '_blank')
      },
    },
  ]
})

const openCitySelectorModal = () => {
  if (!companyGroupRepo.item) return
  if (companyGroupRepo.item?.cityData.results.length > 1) {
    store.citySelectorModal = true
  }
}

const scrollToBlock = (v: string, tab?: string) => {
  if (route.name !== 'home') {
    void router.push({
      name: 'home',
    })
    setTimeout(() => {
      scrollToBlock(v, tab)
    }, 300)
  } else {
    const groupElement = document.getElementById(v)
    if (groupElement) {
      if (tab) store.offersTab = tab
      const y = groupElement.getBoundingClientRect().top + window.scrollY - 120
      store.leftDrawer = false
      void nextTick(() => {
        window.scrollTo({ top: y, behavior: 'smooth' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
body.screen--xs,
body.screen--sm {
  .button :deep(.button-label) {
    font-size: 16px !important;
  }
}
</style>
