<template>
  <div
    v-if="!$route.matched.find((el) => el.name === 'arrangementPage' || el.name === 'arrangementPage__withCompany')"
    class="c-container"
  >
    <div class="row justify-between items-center bg-background-color py-6">
      <div class="row items-center gap-10 col">
        <div
          v-for="(el, index) in blocks.filter((el) => el.visible)"
          :key="index"
          class="row items-center gap-14"
        >
          <div
            v-if="index"
            class="bg-secondary"
            style="
              min-width: 7px;
              min-height: 7px;
              max-width: 7px;
              max-height: 7px;
              border-radius: 50%;
            "
          ></div>
          <CButton text-button text-color="secondary-text" @click="el.click()">
            <div class="body bold">{{ el.label }}</div>
          </CButton>
        </div>
        <ContactsHeader class="col ml-10" />
      </div>
      <!--      <TopHeaderDeliveryInfo />-->
      <TopHeaderSocials header-mode />
    </div>
    <q-separator color="divider-color" />
  </div>
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import { store } from 'src/models/store'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import TopHeaderSocials from './TopHeaderSocials.vue'
import { appSettingsRepo } from 'src/models/appSettings/appSettingsRepo'
import { companyRepo } from 'src/models/company/companyRepo'
import ContactsHeader from 'layouts/header/ContactsHeader.vue'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'

const router = useRouter()

const blocks = computed(() => {
  return [
    {
      label: 'О нас',
      visible: true,
      click: () => {
        router.push({
          name: 'aboutUs'
        })
      }
    },
    {
      label: 'Контакты',
      visible:
        !!companyRepo.item?.guestContacts.emails.length ||
        !!companyRepo.item?.guestContacts.phones.length,
      click: () => {
        scrollToBlock('footer')
      }
    },
    {
      label:
        companyGroupRepo.item?.externalId === 'ThreePizzas'
          ? 'Скачать мобильное приложение'
          : 'Мобильное приложение',
      visible:
        appSettingsRepo.linksData &&
        (appSettingsRepo.linksData.app_redirect_link ||
          appSettingsRepo.linksData.android_download_link ||
          appSettingsRepo.linksData.ios_download_link),
      click: () => {
        scrollToBlock('footer')
      }
    }
  ]
})

const scrollToBlock = (v: string, tab?: string) => {
  if (!router.isIncludesRouteName(['home'])) {
    void router
      .push({
        name: 'home'
      })
      .then(() => {
        setTimeout(() => {
          scrollToBlock(v, tab)
        })
      })
  } else {
    const groupElement = document.getElementById(v)
    if (groupElement) {
      if (tab) store.offersTab = tab
      const y = groupElement.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }
}
</script>
