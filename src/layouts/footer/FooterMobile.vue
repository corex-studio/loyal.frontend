<template>
  <div id="footer" class="text-on-bottom-menu-color full-width">
    <div class="row full-width justify-between gap-8">
      <div v-if="!$store.tableMode" class="col column gap-8">
        <div class="header3 bold">Информация</div>
        <div class="column full-width gap-6">
          <div v-for="(el, index) in infoBlocks.filter((el) => !el.hidden)" :key="index">
            <CButton
              :label="el.label"
              class="body"
              style="opacity: 0.7"
              text-button
              text-color="on-bottom-menu-color"
              @click="el.click()"
            />
          </div>
        </div>
      </div>
      <div v-if="showContacts" class="col column gap-8">
        <div class="header3 bold">Контакты</div>
        <div class="column full-width gap-6" style="overflow: hidden">
          <template
            v-for="(item, index) in $company.item?.guestContacts.emails"
            :key="index"
          >
            <div
              class="body cursor-pointer"
              style="opacity: 0.7"
              @click="openLink(item.link)"
            >
              {{ item.value }}
            </div>
          </template>
          <template
            v-for="(item, index) in $company.item?.guestContacts.phones"
            :key="index"
          >
            <a :href="item.link" class="body" style="opacity: 0.7">
              {{ item.value }}
            </a>
          </template>
          <template
            v-for="(item, index) in $company.item?.guestContacts.socials"
            :key="index"
          >
            <div
              class="body cursor-pointer"
              style="opacity: 0.7"
              @click="openLink(item.link)"
            >
              {{ item.value }}
            </div>
          </template>
        </div>
      </div>
    </div>
    <div
      v-if="
        $appSettings.linksData &&
        ($appSettings.linksData.app_redirect_link ||
          $appSettings.linksData.android_download_link ||
          $appSettings.linksData.ios_download_link)
      "
      class="column mt-15 full-width gap-10 no-wrap"
    >
      <div class="header3 bold">Скачать мобильное приложение</div>
      <div class="row full-width gap-12 items-center no-wrap">
        <div
          v-if="qrCode && $appSettings.linksData.app_redirect_link"
          class="border-radius"
          style="width: 93px; height: 93px; min-width: 93px; overflow: hidden"
        >
          <img :src="qrCode" alt="QR Code" height="93" width="93" />
        </div>
        <div class="column gap-6">
          <img
            v-if="$appSettings.linksData.ios_download_link"
            class="cursor-pointer"
            src="/assets/Apple.svg"
            style="
              height: 40px;
              background-color: #2e2e2e;
              object-fit: contain;
              border-radius: 7px;
              width: 100%;
            "
            @click="openLink($appSettings.linksData.ios_download_link)"
          />
          <img
            v-if="$appSettings.linksData.android_download_link"
            class="cursor-pointer"
            src="/assets/Google.svg"
            style="
              height: 40px;
              background-color: #2e2e2e;
              object-fit: contain;
              border-radius: 7px;
              width: 100%;
            "
            @click="openLink($appSettings.linksData.android_download_link)"
          />
        </div>
      </div>
    </div>
    <div
      :class="
        $store.tableMode &&
        !(
          $appSettings.linksData &&
          ($appSettings.linksData.app_redirect_link ||
            $appSettings.linksData.android_download_link ||
            $appSettings.linksData.ios_download_link)
        )
          ? ''
          : 'mt-15'
      "
      class="column full-width gap-6 body"
    >
      <div>© 2023 все права защищены</div>
      <CButton
        class="body"
        label="Политика конфиденциальности"
        style="opacity: 0.7; width: fit-content"
        text-button
        text-color="on-bottom-menu-color"
        @click="
          openLink(
            `https://${currentHost}/${String(
              $companyGroup.item?.externalId,
            )}/policy`,
          )
        "
      />
      <CButton
        class="body"
        label="Условия использования"
        style="opacity: 0.7; width: fit-content"
        text-button
        text-color="on-bottom-menu-color"
        @click="
          openLink(
            `https://${currentHost}/${String(
              $companyGroup.item?.externalId,
            )}/terms_of_service`,
          )
        "
      />
      <CButton
        class="body"
        label="Публичная оферта"
        style="opacity: 0.7; width: fit-content"
        text-button
        text-color="on-bottom-menu-color"
        @click="
          openLink(
            `https://${currentHost}/${String(
              $companyGroup.item?.externalId,
            )}/offer`,
          )
        "
      />

      <div
        v-if="!$uiSettings.item?.exclusive"
        class="row no-wrap gap-3">
        <div style="opacity: 0.7">Работает на</div>
        <q-img src="/assets/loyalHeart.svg" style="width: 30px" />
        <a
          class="text-on-bottom-menu-color"
          href="https://loyalhub.ru"
          style="opacity: 0.7"
        >
          Loyalhub</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQRCode } from '@vueuse/integrations/useQRCode'
import CButton from 'src/components/template/buttons/CButton.vue'
import { appSettingsRepo } from 'src/models/appSettings/appSettingsRepo'
import { companyRepo } from 'src/models/company/companyRepo'
import { store } from 'src/models/store'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'

const router = useRouter()
let qrCode: any = null

const infoBlocks = computed(() => {
  return [
    {
      label: 'Акции и новости',
      click: () => {
        scrollToBlock('offers')
      }
    },
    {
      label: 'О разработчике',
      click: () => {
        window.open('https://corex.studio/', '_blank')
      },
      hidden: companyGroupRepo.item?.externalId === 'ThreePizzas'
    },
    {
      label: 'О заведении',
      click: () => {
        router.push({
          name: 'aboutUs'
        })
      }
    }
  ]
})

const currentHost = computed(() => {
  return window.location.host
})

const showContacts = computed(() => {
  return (
    !!companyRepo.item?.guestContacts.emails.length ||
    !!companyRepo.item?.guestContacts.phones.length ||
    !!companyRepo.item?.guestContacts.socials.length
  )
})

const openLink = (link: string) => {
  window.open(link, '_blank')
}

const scrollToBlock = (v: string, tab?: string) => {
  if (router.isIncludesRouteName(['home'])) {
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
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }
}

if (appSettingsRepo.linksData?.app_redirect_link)
  qrCode = useQRCode(appSettingsRepo.linksData?.app_redirect_link, {
    type: 'image/png',
    color: {
      light: '#424242',
      dark: '#fff'
    }
  })
</script>

<style lang="scss" scoped></style>
