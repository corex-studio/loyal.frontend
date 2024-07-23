<template>
  <div>
    <q-drawer
      :model-value="$store.leftDrawer"
      :width="$q.screen.gt.xs ? 350 : $q.screen.width"
      behavior="mobile"
      class="column full-height no-wrap bg-background-color text-on-background-color px-8 py-10"
      no-swipe-open
      overlay
      side="left"
      style="z-index: 999999; height: 100%"
      @update:model-value="closeDrawer()"
    >
      <div class="row full-width justify-between items-center">
        <img
          v-if="
            $company.item?.logo?.thumbnail || $company.item?.image?.thumbnail
          "
          :height="48"
          :src="
            $company.item?.logo?.thumbnail || $company.item?.image?.thumbnail
          "
          class="border-radius cursor-pointer"
          style="object-fit: contain; max-width: 200px"
          @click="
            $router.push({
              name: 'home',
            })
          "
        />
        <CIcon
          class="cursor-pointer"
          color="on-background-color"
          hover-color="primary"
          name="fa-regular fa-xmark"
          size="24px"
          @click="closeDrawer()"
        />
      </div>
      <div
        class="row cursor-pointer gap-4 mt-9"
        style="width: fit-content"
        @click="openCitySelectorModal()"
      >
        <CIcon
          color="on-background-color"
          name="fa-regular fa-location-dot"
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
      <q-separator class="my-8" color="divider-color" />
      <div class="column full-width gap-12 no-wrap body">
        <CButton
          v-for="(el, index) in blocks.filter((v) => !v.hidden)"
          :key="index"
          :label="el.label"
          class="body button"
          style="width: fit-content"
          text-button
          text-color="on-background-color"
          @click="el.click()"
        />
      </div>
      <q-separator class="my-8" />

      <ContactsHeader
        style="gap: 10px !important; flex-direction: column !important"
      />
      <q-separator class="my-8" />
      <!--      <TopHeaderDeliveryInfo />-->
      <TopHeaderSocials header-mode />
    </q-drawer>
  </div>
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { authentication } from 'src/models/authentication/authentication'
import { store } from 'src/models/store'
import { computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import TopHeaderSocials from '../header/TopHeaderSocials.vue'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import ContactsHeader from 'layouts/header/ContactsHeader.vue'
import { appSettingsRepo } from 'src/models/appSettings/appSettingsRepo'

const router = useRouter()

const blocks = computed(() => {
  return [
    {
      label: 'Профиль',
      hidden: !authentication.user || authentication.user.isAnonymous,
      click: () => {
        router.push({
          name: 'profilePage'
        })
      }
    },
    {
      label: 'Бонусы',
      hidden:
        !authentication.user ||
        authentication.user.isAnonymous ||
        !uiSettingsRepo.item?.useBonuses,
      click: () => {
        store.bonusesDrawer = true
        store.leftDrawer = false
      }
    },
    {
      label: 'О нас',
      click: () => {
        router.push({
          name: 'aboutUs'
        })
      }
    },
    {
      label: 'Контакты',
      click: () => {
        scrollToBlock('footer')
      }
    },
    {
      hidden: !appSettingsRepo.hasAppLinks,
      label: 'Мобильное приложение',
      click: () => {
        scrollToBlock('footer')
      }
    },
    {
      label: uiSettingsRepo.item?.becomeFranchisee?.title || 'Франшиза',
      hidden: !uiSettingsRepo.item?.becomeFranchisee,
      click: () => {
        window.open(uiSettingsRepo.item?.becomeFranchisee?.link || '', '_blank')
      }
    }
  ]
})

const openCitySelectorModal = () => {
  if (!companyGroupRepo.item) return
  if (companyGroupRepo.item?.cityData.results.length > 1) {
    store.citySelectorModal = true
  }
}

const scrollToBlock = (v: string, tab?: string) => {
  if (!router.isIncludesRouteName(['home'])) {
    void router.push({
      name: 'home'
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

const closeDrawer = () => {
  store.leftDrawer = false
  setScroll()
}

const setScroll = () => {
  void nextTick(() => {
    if (store.scrollPositionBeforeOpenProductModal)
      window.scrollTo(0, store.scrollPositionBeforeOpenProductModal)
  })
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
