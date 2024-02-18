<template>
  <div id="footer" class="full-width">
    <div
      :class="{ 'no-wrap': $q.screen.gt.md }"
      class="row full-width justify-between gap-md-15 gap-lg-5"
    >
      <div class="col-lg-shrink col-xs-12">
        <img
          v-if="
            $company.item?.logo?.thumbnail || $company.item?.image?.thumbnail
          "
          @click="
            $router.push({
              name: 'home',
            })
          "
          height="46"
          class="border-radius cursor-pointer"
          style="object-fit: contain; max-width: 230px"
          :style="$q.screen.gt.md ? 'width: 100%' : ''"
          :src="$company.item.logo?.thumbnail || $company.item.image?.thumbnail"
        />
      </div>
      <template v-if="$q.screen.gt.md">
        <div class="column text-on-bottom-menu-color" style="width: 186px">
          <div class="bold subtitle-text mb-10">Информация</div>
          <div class="column gap-6">
            <div v-for="(item, index) in infoBlocks" :key="index">
              <CButton
                @click="item.click()"
                text-button
                style="opacity: 0.8"
                text-color="on-bottom-menu-color"
              >
                <div class="body">
                  {{ item.label }}
                </div></CButton
              >
            </div>
          </div>
        </div>
        <div class="text-on-bottom-menu-color">
          <div class="bold subtitle-text mb-10 text-on-bottom-menu-color">
            Правовая информация
          </div>
          <div class="column gap-6 items-start">
            <CButton
              text-color="on-bottom-menu-color"
              text-button
              style="opacity: 0.8"
              class="body"
              label="Политика конфиденциальноости"
              @click="
                openLink(
                  `https://loyalhub.ru/${String(
                    $companyGroup.item?.externalId
                  )}/policy`
                )
              "
            />
            <CButton
              @click="
                openLink(
                  `https://loyalhub.ru/${String(
                    $companyGroup.item?.externalId
                  )}/terms_of_service`
                )
              "
              class="body"
              text-color="on-bottom-menu-color"
              text-button
              style="opacity: 0.8"
              label="Условия использования"
            />
          </div>
        </div>

        <!-- <div class="bold header3 mb-10 text-on-bottom-menu-color">Контакты</div> -->
        <div
          style="max-width: 336px"
          class="column gap-10 bold subtitle-text text-on-bottom-menu-color"
        >
          <div
            v-if="$company.item?.guestContacts.phones.length"
            class="column gap-6"
          >
            <div
              v-for="(item, index) in $company.item?.guestContacts.phones"
              :key="index"
              class="cursor-pointer bold"
              @click="openLink(item.link)"
            >
              {{ item.value }}
            </div>
            <div class="body" style="opacity: 0.8">
              {{
                $company.item?.guestContacts.phones.length > 1
                  ? 'Контактные телефоны'
                  : 'Контактный телефон'
              }}
            </div>
          </div>
          <div v-if="$company.item?.salesPoints" class="column gap-6">
            <div
              v-for="(item, index) in $company.item?.salesPoints"
              :key="index"
              class="bold"
            >
              {{ item.customAddress || item.address }}
            </div>
            <div class="body" style="opacity: 0.8">
              {{
                $company.item?.salesPoints?.length > 1
                  ? 'Адреса заведений в Калининграде'
                  : 'Адрес заведения в Калининграде'
              }}
            </div>
          </div>
        </div></template
      >
      <div
        v-else
        class="row col-grow gap-md-15 gap-lg-5 justify-between no-wrap"
      >
        <div class="column text-on-bottom-menu-color" style="width: 186px">
          <div class="bold subtitle-text mb-10">Информация</div>
          <div class="column gap-6">
            <div v-for="(item, index) in infoBlocks" :key="index">
              <CButton
                @click="item.click()"
                text-button
                style="opacity: 0.8"
                text-color="on-bottom-menu-color"
              >
                <div class="body">
                  {{ item.label }}
                </div></CButton
              >
            </div>
          </div>
        </div>
        <div class="text-on-bottom-menu-color">
          <div class="bold subtitle-text mb-10 text-on-bottom-menu-color">
            Правовая информация
          </div>
          <div class="column gap-6 items-start">
            <CButton
              text-color="on-bottom-menu-color"
              text-button
              style="opacity: 0.8"
              class="body"
              label="Политика конфиденциальноости"
              @click="
                openLink(
                  `https://loyalhub.ru/${String(
                    $companyGroup.item?.externalId
                  )}/policy`
                )
              "
            />
            <CButton
              @click="
                openLink(
                  `https://loyalhub.ru/${String(
                    $companyGroup.item?.externalId
                  )}/terms_of_service`
                )
              "
              class="body"
              text-color="on-bottom-menu-color"
              text-button
              style="opacity: 0.8"
              label="Условия использования"
            />
          </div>
        </div>

        <!-- <div class="bold header3 mb-10 text-on-bottom-menu-color">Контакты</div> -->
        <div style="max-width: 336px" class="column gap-10 bold subtitle-text">
          <div
            v-if="$company.item?.guestContacts.phones.length"
            class="column gap-6"
          >
            <div
              v-for="(item, index) in $company.item?.guestContacts.phones"
              :key="index"
              class="cursor-pointer"
              @click="openLink(item.link)"
            >
              {{ item.value }}
            </div>
            <div class="body" style="opacity: 0.8">
              {{
                $company.item?.guestContacts.phones.length > 1
                  ? 'Контактные телефоны'
                  : 'Контактный телефон'
              }}
            </div>
          </div>
          <div v-if="$company.item?.salesPoints" class="column gap-6">
            <div
              v-for="(item, index) in $company.item?.salesPoints"
              :key="index"
            >
              {{ item.customAddress || item.address }}
            </div>
            <div class="body" style="opacity: 0.8">
              {{
                $company.item?.salesPoints?.length > 1
                  ? 'Адреса заведений в Калининграде'
                  : 'Адрес заведения в Калининграде'
              }}
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="col-shrink text-on-bottom-menu-color">
        <template
          v-if="
            $appSettings.linksData &&
            ($appSettings.linksData.app_redirect_link ||
              $appSettings.linksData.android_download_link ||
              $appSettings.linksData.ios_download_link)
          "
        >
          <div class="header3 bold mb-lg-15 mb-xs-10">
            Скачать мобильное приложение
          </div>
          <div
            :class="
              $q.screen.lt.lg ? 'row reverse justify-end' : 'row items-center'
            "
            class="gap-lg-12 gap-xs-8 text-black3"
          >
            <div
              v-if="qrCode && $appSettings.linksData?.app_redirect_link"
              class="border-radius"
              style="width: 82px; height: 82px; overflow: hidden"
            >
              <img
                width="82"
                height="82"
                style="min-width: 82px"
                :src="qrCode"
                alt="QR Code"
              />
            </div>

            <div
              :class="$q.screen.gt.md ? 'row' : 'column'"
              class="gap-lg-12 gap-xs-8"
            >
              <img
                v-if="$appSettings.linksData.ios_download_link"
                @click="openLink($appSettings.linksData.ios_download_link)"
                class="cursor-pointer"
                style="
                  height: 46px;
                  background-color: #2e2e2e;
                  object-fit: contain;
                  border-radius: 7px;
                "
                src="~assets/Apple.svg"
              />

              <img
                v-if="$appSettings.linksData.android_download_link"
                @click="openLink($appSettings.linksData.android_download_link)"
                class="cursor-pointer"
                style="
                  height: 46px;
                  background-color: #2e2e2e;
                  object-fit: contain;
                  border-radius: 7px;
                "
                src="~assets/Google.svg"
              />
            </div>
          </div>
        </template>
      </div> -->
    </div>
    <q-separator
      style="opacity: 0.5"
      color="divider-color"
      class="full-width mt-lg-25 mb-lg-15 my-xs-15"
    />
    <div
      :class="{ 'justify-between': $q.screen.gt.md }"
      class="row full-width body text-on-bottom-menu-color gap-15"
    >
      <div class="column gap-5">
        <div>© Все права защищены 2024</div>
        <div class="row no-wrap gap-3">
          <div style="opacity: 0.8">Работает на</div>
          <q-img style="width: 30px" src="~assets/loyalHeart.svg" />
          <a
            style="opacity: 0.8"
            class="text-on-bottom-menu-color"
            href="https://corex.studio/loyal"
          >
            Loyalhub</a
          >
        </div>
      </div>
      <TopHeaderSocials />

      <div
        v-if="$appSettings.linksData"
        class="row gap-20 col-xs-12 col-lg-shrink"
      >
        <div class="body">
          Скачайте наше
          <br />Удобное приложение
        </div>
        <div class="row gap-10">
          <div
            class="app-link-block items-center justify-center row border-radius2"
          >
            <img
              v-if="$appSettings.linksData.ios_download_link"
              @click="openLink($appSettings.linksData.ios_download_link)"
              class="cursor-pointer"
              style="object-fit: contain; width: 106px"
              src="~assets/Apple.png"
            />
          </div>
          <div
            class="app-link-block row items-center justify-center border-radius2"
          >
            <img
              v-if="$appSettings.linksData.android_download_link"
              @click="openLink($appSettings.linksData.android_download_link)"
              class="cursor-pointer"
              style="object-fit: contain; width: 111px"
              src="~assets/Google.png"
            />
          </div>
        </div>
      </div>

      <!-- <div class="row items-center gap-10">
        <div
          v-for="(el, index) in $company.item?.guestContacts.socials"
          :key="index"
        >
          {{ el }}
        </div>
      </div> -->
      <!-- <div :class="$q.screen.lt.lg ? 'reverse' : ''" class="column gap-10"> -->
      <!-- <div class="row gap-7">
          <div
            v-for="(el, index) in groupLinks"
            :key="index"
            @click="el.click"
            class="border-radius row justify-center items-center cursor-pointer"
            style="background-color: #424242; width: 40px; height: 40px"
          >
            <CIcon color="white" :name="el.icon" />
          </div>
        </div> -->
      <!-- <div class="row gap-8 items-baseline">
          <div>© 2023 все права защищены</div>
          <CButton
            text-color="on-bottom-menu-color"
            text-button
            style="opacity: 0.8"
            class="body"
            label="Политика конфиденциальноости"
            @click="
              openLink(
                `https://loyalhub.ru/${String(
                  $companyGroup.item?.externalId
                )}/policy`
              )
            "
          />
          <CButton
            @click="
              openLink(
                `https://loyalhub.ru/${String(
                  $companyGroup.item?.externalId
                )}/terms_of_service`
              )
            "
            class="body"
            text-color="on-bottom-menu-color"
            text-button
            style="opacity: 0.8"
            label="Условия использования"
          />
          <div class="row no-wrap gap-3">
            <div style="opacity: 0.8">Работает на</div>
            <q-img style="width: 30px" src="~assets/loyalHeart.svg" />
            <a
              style="opacity: 0.8"
              class="text-on-bottom-menu-color"
              href="https://corex.studio/loyal"
            >
              Loyalhub</a
            >
          </div>
        </div> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import CButton from 'src/components/template/buttons/CButton.vue'
import { store } from 'src/models/store'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopHeaderSocials from '../header/TopHeaderSocials.vue'

const route = useRoute()
const router = useRouter()

// let qrCode: any = null

// const groupLinks = [
//   {
//     icon: 'fa-solid fa-paper-plane',
//     click: () => {
//       void 0
//     },
//   },
//   {
//     icon: 'fa-solid fa-envelope',
//     click: () => {
//       void 0
//     },
//   },
//   {
//     icon: 'fa-brands fa-youtube',
//     click: () => {
//       void 0
//     },
//   },
// ]

const infoBlocks = computed(() => {
  return [
    {
      label: 'Акции и новости',
      click: () => {
        scrollToBlock('offers')
      },
    },
    {
      label: 'О разработчике',
      click: () => {
        window.open('https://corex.studio/', '_blank')
      },
    },
    {
      label: 'О заведении',
      click: () => {
        router.push({
          name: 'aboutUs',
        })
      },
    },
  ]
})

// const navigation = computed(() => {
//   return [
//     {
//       label: 'Новости',
//       hidden: !!!newsRepo.items.length,
//       click: () => {
//         scrollToBlock('offers', 'Новости')
//       },
//     },
//     {
//       label: 'Акции',
//       hidden: !promotionsRepo.items.length,
//       click: () => {
//         scrollToBlock('offers', 'Акции')
//       },
//     },
//     {
//       label: 'О разработчике',
//       click: () => {
//         openLink('https://corex.studio/')
//       },
//     },
//     {
//       label: 'Политика конфиденциальности',
//       click: () => {
// openLink(
//   `https://loyalhub.ru/${String(route.params.companyGroup)}/policy`
// )
//       },
//     },
//     {
//       label: 'Пользовательское соглашение',
//       click: () => {
// openLink(
//   `https://loyalhub.ru/${String(
//     route.params.companyGroup
//   )}/terms_of_service`
// )
//       },
//     },
//     // {
//     //   label: 'cookie',
//     //   click: void 0,
//     // },
//   ]
// })

// const showContacts = computed(() => {
//   return (
//     !!companyRepo.item?.guestContacts.emails.length ||
//     !!companyRepo.item?.guestContacts.phones.length ||
//     !!companyRepo.item?.guestContacts.socials.length
//   )
// })

// const scrollToGroup = (v: MenuGroup) => {
//   const groupElement = document.getElementById(v.id)
//   if (groupElement) {
//     const y = groupElement.getBoundingClientRect().top + window.scrollY - 100

//     window.scrollTo({ top: y, behavior: 'smooth' })
//   }
// }

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
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }
}

// const getImage = (link: LinkType | null) => {
//   let fileName: string | null = null

//   try {
//     if (link === LinkType.MAPS) fileName = 'yandexMaps.png'
//     if (link === LinkType.OK) fileName = 'okLogo.png'
//     if (link === LinkType.TELEGRAM) fileName = 'telegramLogo.png'
//     if (link === LinkType.VK) fileName = 'VKLogo.png'
//     if (link === LinkType.WEBSITE) fileName = 'websiteIcon.png'

//     return require('assets/' + fileName) as string
//   } catch {
//     return store.images.empty
//   }
// }

const openLink = (link: string) => {
  window.open(link, '_blank')
}

// if (appSettingsRepo.linksData?.app_redirect_link) {
//   qrCode = useQRCode(appSettingsRepo.linksData?.app_redirect_link, {
//     type: 'image/png',
//     color: {
//       light: '#424242',
//       dark: '#fff',
//     },
//   })
// }
</script>

<style lang="scss" scoped>
.app-link-block {
  height: 44px;
  width: 134px;
  background-color: #3b3b3b65;
}
</style>
