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
          :src="$company.item.logo?.thumbnail || $company.item.image?.thumbnail"
          :style="$q.screen.gt.md ? 'width: auto' : ''"
          class="cursor-pointer"
          height="46"
          style="object-fit: contain; max-width: 230px"
          @click="
            $router.push({
              name: 'home',
            })
          "
        />
      </div>
      <template v-if="$q.screen.gt.md">
        <div
          v-if="!$store.tableMode"
          class="column text-on-bottom-menu-color"
          style="width: 186px"
        >
          <div class="bold subtitle-text mb-8">Информация</div>
          <div class="column gap-6">
            <div
              v-for="(item, index) in infoBlocks.filter((el) => !el.hidden)"
              :key="index"
            >
              <CButton
                style="opacity: 0.6"
                text-button
                text-color="on-bottom-menu-color"
                @click="item.click()"
              >
                <div class="body">
                  {{ item.label }}
                </div>
              </CButton>
            </div>
          </div>
        </div>
        <div class="text-on-bottom-menu-color">
          <div class="bold subtitle-text mb-8 text-on-bottom-menu-color">
            Правовая информация
          </div>
          <div class="column gap-6 items-start">
            <CButton
              class="body"
              label="Политика конфиденциальности"
              style="opacity: 0.6"
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
              style="opacity: 0.6"
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
              style="opacity: 0.6"
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
            <CButton
              class="body"
              label="Документы"
              style="opacity: 0.6"
              text-button
              text-color="on-bottom-menu-color"
              @click="openLink(`https://${currentHost}/docs`)"
            />
          </div>
        </div>
        <div
          class="column gap-10 bold subtitle-text text-on-bottom-menu-color"
          style="max-width: 336px"
        >
          <TopHeaderSocials icon-size="24px" />
          <div
            v-if="$company.item?.guestContacts.phones.length"
            class="column gap-6"
          >
            <template
              v-for="(item, index) in $company.item?.guestContacts.phones"
              :key="index"
            >
              <div class="subtitle-text bold">
                {{ item.name }}
              </div>
              <a class="body" style="opacity: 0.6" :href="item.link">
                {{ item.value }}
              </a>
              <!-- <div
                class="cursor-pointer body"
                style="opacity: 0.6"
                @click="openLink(item.link)"
              >
                {{ item.value }}
              </div> -->
            </template>
          </div>
          <div
            v-if="$company.item?.guestContacts.emails.length"
            class="column gap-6"
          >
            <div class="subtitle-text bold">
              {{
                $company.item?.guestContacts.emails.length > 1
                  ? 'Электронные почты'
                  : 'Электронная почта'
              }}
            </div>
            <div
              v-for="(item, index) in $company.item?.guestContacts.emails"
              :key="index"
              class="cursor-pointer body"
              style="opacity: 0.6"
              @click="openLink(item.link)"
            >
              {{ item.value }}
            </div>
          </div>
          <div v-if="$company.item?.salesPoints" class="column gap-6">
            <div class="subtitle-text bold">
              {{
                $company.item?.salesPoints?.length > 1
                  ? 'Адреса заведений в Калининграде'
                  : 'Адрес заведения в Калининграде'
              }}
            </div>
            <div
              class="body"
              v-for="(el, index) in $company.item?.salesPoints"
              :key="index"
              style="opacity: 0.6"
            >
              {{ el.customAddress || el.address }}
            </div>
          </div>
        </div>
      </template>
      <div
        v-else
        class="row col-grow gap-md-15 gap-lg-5 justify-between no-wrap"
      >
        <div class="column text-on-bottom-menu-color" style="width: 186px">
          <div class="bold subtitle-text mb-6">Информация</div>
          <div class="column gap-6">
            <div v-for="(item, index) in infoBlocks" :key="index">
              <CButton
                style="opacity: 0.6"
                text-button
                text-color="on-bottom-menu-color"
                @click="item.click()"
              >
                <div class="body">
                  {{ item.label }}
                </div>
              </CButton>
            </div>
          </div>
        </div>
        <div class="text-on-bottom-menu-color">
          <div class="bold subtitle-text mb-6 text-on-bottom-menu-color">
            Правовая информация
          </div>
          <div class="column gap-6 items-start">
            <CButton
              class="body"
              label="Политика конфиденциальности"
              style="opacity: 0.6"
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
              style="opacity: 0.6"
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
              style="opacity: 0.6"
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
            <CButton
              class="body"
              label="Документы"
              style="opacity: 0.6"
              text-button
              text-color="on-bottom-menu-color"
              @click="openLink(`https://${currentHost}/docs`)"
            />
          </div>
        </div>
        <div class="column gap-10 bold subtitle-text" style="max-width: 336px">
          <div
            v-if="$company.item?.guestContacts.phones.length"
            class="column gap-6"
          >
            <div class="subtitle-text bold">
              {{
                $company.item?.guestContacts.phones.length > 1
                  ? 'Контактные телефоны'
                  : 'Контактный телефон'
              }}
            </div>
            <a
              v-for="(item, index) in $company.item?.guestContacts.phones"
              :key="index"
              class="body"
              style="opacity: 0.6"
              :href="item.link"
            >
              {{ item.value }}
            </a>
            <!-- <div
              v-for="(item, index) in $company.item?.guestContacts.phones"
              :key="index"
              class="cursor-pointer body"
              style="opacity: 0.6"
              @click="openLink(item.link)"
            >
              {{ item.value }}
            </div> -->
          </div>
          <div
            v-if="$company.item?.guestContacts.emails.length"
            class="column gap-6"
          >
            <div class="subtitle-text bold">
              {{
                $company.item?.guestContacts.emails.length > 1
                  ? 'Электронные почты'
                  : 'Электронная почта'
              }}
            </div>
            <div
              v-for="(item, index) in $company.item?.guestContacts.emails"
              :key="index"
              class="cursor-pointer body"
              style="opacity: 0.6"
              @click="openLink(item.link)"
            >
              {{ item.value }}
            </div>
          </div>
          <div v-if="$company.item?.salesPoints" class="column gap-6">
            <div class="subtitle-text bold">
              {{
                $company.item?.salesPoints?.length > 1
                  ? 'Адреса заведений в Калининграде'
                  : 'Адрес заведения в Калининграде'
              }}
            </div>
            <div
              v-for="(item, index) in $company.item?.salesPoints"
              :key="index"
              class="body"
              style="opacity: 0.6"
            >
              {{ item.customAddress || item.address }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-separator
      class="full-width mt-lg-25 mb-lg-15 my-xs-15"
      color="divider-color"
      style="opacity: 0.5"
    />
    <div
      :class="{ 'justify-between': $q.screen.gt.md }"
      class="row full-width body text-on-bottom-menu-color gap-xs-8"
    >
      <div>© Все права защищены 2024</div>
      <div
        v-if="
          $appSettings.linksData &&
          ($appSettings.linksData.ios_download_link ||
            $appSettings.linksData.android_download_link)
        "
        class="row gap-20 col-xs-12 col-lg-shrink"
      >
        <div class="body">
          Скачайте наше
          <br />Удобное приложение
        </div>
        <div class="row gap-10">
          <div
            v-if="$appSettings.linksData.ios_download_link"
            class="app-link-block items-center justify-center row border-radius2"
          >
            <img
              alt="Apple download link"
              class="cursor-pointer"
              src="/assets/Apple.png"
              style="object-fit: contain; width: 106px"
              @click="openLink($appSettings.linksData.ios_download_link)"
            />
          </div>
          <div
            v-if="$appSettings.linksData.android_download_link"
            class="app-link-block row items-center justify-center border-radius2"
          >
            <img
              class="cursor-pointer"
              src="/assets/Google.png"
              alt="Google download link"
              style="object-fit: contain; width: 111px"
              @click="openLink($appSettings.linksData.android_download_link)"
            />
          </div>
        </div>
      </div>
      <div class="row no-wrap items-center gap-3">
        <div>Работает на</div>
        <q-img src="/assets/loyalHeartWhite.png" style="width: 30px" />
        <a class="text-on-bottom-menu-color" href="https://loyalhub.ru">
          Loyalhub</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import { store } from 'src/models/store'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopHeaderSocials from 'layouts/header/TopHeaderSocials.vue'

const route = useRoute()
const router = useRouter()

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
    {
      label: uiSettingsRepo.item?.becomeFranchisee?.title || 'Франшиза',
      hidden: !uiSettingsRepo.item?.becomeFranchisee,
      click: () => {
        window.open(uiSettingsRepo.item?.becomeFranchisee?.link || '', '_blank')
      },
    },
  ]
})

const currentHost = computed(() => {
  return window.location.host
})

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

const openLink = (link: string) => {
  window.open(link, '_blank')
}
</script>

<style lang="scss" scoped>
.app-link-block {
  height: 44px;
  width: 134px;
  background-color: #3b3b3b65;
}
</style>
