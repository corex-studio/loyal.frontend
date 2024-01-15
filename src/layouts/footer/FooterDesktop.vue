<template>
  <div id="footer" class="full-width">
    <div class="row full-width no-wrap justify-between">
      <div class="column col justify-between">
        <div class="row gap-14">
          <div
            v-if="$menu.item?.groups?.filter((el) => el.items.length).length"
            class="column text-on-bottom-menu-color"
            style="width: 186px"
          >
            <div class="bold header3 mb-10">Информация</div>
            <div class="row gap-25">
              <div class="column gap-8">
                <div v-for="(item, index) in infoBlocks" :key="index">
                  <CButton
                    @click="item.click()"
                    text-button
                    class="body"
                    style="opacity: 0.8"
                    :label="item.label"
                    text-color="on-bottom-menu-color"
                  />
                </div>
              </div>
            </div>
          </div>

          <div v-if="showContacts" class="text-on-bottom-menu-color">
            <div class="bold header3 mb-10 text-on-bottom-menu-color">
              Контакты
            </div>
            <div class="column gap-8">
              <template
                v-for="(item, index) in $company.item?.guestContacts.emails"
                :key="index"
              >
                <div style="opacity: 0.8" class="body">
                  {{ item.value }}
                </div>
              </template>
              <template
                v-for="(item, index) in $company.item?.guestContacts.phones"
                :key="index"
              >
                <div style="opacity: 0.8" class="body">
                  {{ item.value }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="col-grow text-on-bottom-menu-color">
        <template v-if="$appSettings.linksData?.app_redirect_link">
          <div class="header2 bold mb-lg-15 mb-xs-10">
            Скачать мобильное приложение
          </div>
          <div
            :class="
              $q.screen.lt.lg ? 'row reverse justify-end' : 'row items-center'
            "
            class="gap-lg-12 gap-xs-8 text-black3"
          >
            <div
              v-if="qrCode"
              class="border-radius"
              style="width: 82px; height: 82px; overflow: hidden"
            >
              <img width="82" height="82" :src="qrCode" alt="QR Code" />
            </div>
            <div
              :class="$q.screen.gt.md ? 'row' : 'column'"
              class="gap-lg-12 gap-xs-8"
            >
              <img
                style="
                  height: 46px;
                  background-color: #2e2e2e;
                  object-fit: contain;
                  border-radius: 7px;
                "
                src="~assets/Apple.svg"
              />
              <img
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
      </div>
    </div>
    <q-separator color="divider-color" class="full-width my-lg-20 my-xs-13" />
    <div class="row full-width body text-on-bottom-menu-color justify-between">
      <div :class="$q.screen.lt.lg ? 'reverse' : ''" class="column gap-10">
        <div class="row gap-7">
          <div
            v-for="(el, index) in developersLinks"
            :key="index"
            @click="el.click"
            class="border-radius row justify-center items-center cursor-pointer"
            style="background-color: #424242; width: 40px; height: 40px"
          >
            <CIcon color="white" :name="el.icon" />
          </div>
        </div>
        <div class="row gap-8 items-baseline">
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
                  route.params.companyGroup
                )}/policy`
              )
            "
          />
          <CButton
            @click="
              openLink(
                `https://loyalhub.ru/${String(
                  route.params.companyGroup
                )}/terms_of_service`
              )
            "
            class="body"
            text-color="on-bottom-menu-color"
            text-button
            style="opacity: 0.8"
            label="Пользовательское соглашение"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CButton from 'src/components/template/buttons/CButton.vue'
import { store } from 'src/models/store'
import { computed, onMounted } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { useRoute, useRouter } from 'vue-router'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { appSettingsRepo } from 'src/models/appSettings/appSettingsRepo'
import CIcon from 'src/components/template/helpers/CIcon.vue'

const route = useRoute()
const router = useRouter()

let qrCode: any = null

const developersLinks = [
  {
    icon: 'fa-solid fa-paper-plane',
    click: () => {
      void 0
    },
  },
  {
    icon: 'fa-solid fa-envelope',
    click: () => {
      void 0
    },
  },
  {
    icon: 'fa-brands fa-youtube',
    click: () => {
      void 0
    },
  },
]

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

const showContacts = computed(() => {
  return (
    !!companyRepo.item?.guestContacts.emails.length ||
    !!companyRepo.item?.guestContacts.phones.length ||
    !!companyRepo.item?.guestContacts.socials.length
  )
})

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

onMounted(() => {
  if (appSettingsRepo.linksData?.app_redirect_link) {
    qrCode = useQRCode(appSettingsRepo.linksData?.app_redirect_link, {
      type: 'image/png',
      color: {
        light: '#424242',
        dark: '#fff',
      },
    })
  }
})
</script>

<style lang="scss" scoped></style>
