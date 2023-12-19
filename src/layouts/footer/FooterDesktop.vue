<template>
  <div id="footer" class="row full-width">
    <div class="column col-8 justify-between">
      <div class="row gap-14">
        <div
          v-if="$menu.item?.groups?.filter((el) => el.items.length).length"
          class="column text-on-backing-color"
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
                  text-color="on-backing-color"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="showContacts" class="text-on-backing-color">
          <div class="bold header3 mb-10 text-on-backing-color">Контакты</div>
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
            <!-- <div class="row no-wrap gap-7">
              <div
                v-for="(el, index) in $company.item?.guestContacts.socials"
                :key="index"
                @click="openLink(el.link)"
                class="cursor-pointer"
              >
                <q-img width="24px" fit="contain" :src="getImage(el.link_type)">
                  <q-tooltip>{{ el.name }}</q-tooltip>
                </q-img>
              </div>
            </div> -->
          </div>
        </div>
      </div>
      <!-- <div class="column gap-8 text-on-backing-color mt-20">
        © Все права защищены 2023

        <div>
          Если вы тоже хотите стать обладателем системы лояльности, переходите
          <a
            href="https://corex.studio/loyal"
            target="_blank"
            class="text-primary"
            >сюда</a
          >
        </div>
      </div> -->
    </div>
    <div class="col-grow text-on-backing-color">
      <template
        v-if="
          $appSettings.linksData?.android_download_link ||
          $appSettings.linksData?.ios_download_link
        "
      >
        <div class="header mb-15">Скачать мобильное приложение</div>
        <div class="row items-center gap-12 text-black3">
          <div
            v-if="qrCode"
            class="border-radius"
            style="width: 90px; height: 90px; overflow: hidden"
          >
            <img width="90" height="90" :src="qrCode" alt="QR Code" />
          </div>
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
      </template>
      <!-- <div v-if="showContacts" class="column gap-8">
        <div class="bold">Контакты</div>
        <div class="column full-width gap-3">
          <div
            v-for="(el, index) in $company.item?.guestContacts.phones"
            :key="index"
          >
            {{ el.value }}
          </div>
        </div>

        <div class="column full-width gap-3">
          <div
            v-for="(el, index) in $company.item?.guestContacts.emails"
            :key="index"
          >
            {{ el.value }}
          </div>
        </div>
        <div class="row no-wrap gap-7">
          <div
            v-for="(el, index) in $company.item?.guestContacts.socials"
            :key="index"
            @click="openLink(el.link)"
            class="cursor-pointer"
          >
            <q-img width="24px" fit="contain" :src="getImage(el.link_type)">
              <q-tooltip>{{ el.name }}</q-tooltip>
            </q-img>
          </div>
        </div>
      </div> -->
    </div>
    <q-separator color="divider-color" class="full-width my-20" />
    <div class="row full-width body text-on-backing-color justify-between">
      <div class="column gap-10">
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
            text-color="on-backing-color"
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
            text-color="on-backing-color"
            text-button
            style="opacity: 0.8"
            label="Пользовательское соглашение"
          />
          <div class="row no-wrap gap-3">
            <div style="opacity: 0.8">Работает на</div>
            <q-img style="width: 30px" src="~assets/loyalHeart.svg" />
            <a
              style="opacity: 0.8"
              class="text-on-backing-color"
              href="https://corex.studio/loyal"
            >
              Loyalhub</a
            >
          </div>
        </div>
        <!-- <div>
          Если вы тоже хотите стать обладателем системы лояльности, переходите
          <a href="https://corex.studio/loyal" target="_blank">сюда</a>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CButton from 'src/components/template/buttons/CButton.vue'
// import { LinkType } from 'src/models/company/company'
import { store } from 'src/models/store'
// import { appSettingsRepo } from 'src/models/appSettings/appSettingsRepo'
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
