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
                  ? 'Адреса заведений'
                  : 'Адрес заведения'
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
        v-if="$appSettings.hasAppLinks"
        class="row gap-20 col-xs-12 col-lg-shrink"
      >
        <div class="body">
          Скачайте наше
          <br />Удобное приложение
        </div>
        <div class="row gap-10">
          <div
            v-if="$appSettings.linksData?.ios_download_link"
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
            v-if="$appSettings.linksData?.android_download_link"
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
        <CustomIcon
          :color="`#${$uiSettings.item?.bottomMenuColor.on_color}`"
          :svg="loyalHubLogoSvg"
          height="34px"
          width="34px"
        />
        <!-- <q-img src="/assets/loyalHeartWhite.png" style="width: 30px" /> -->
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
import CustomIcon from 'src/components/icons/CustomIcon.vue'

const route = useRoute()
const router = useRouter()

const loyalHubLogoSvg =
  '<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M54.5387 188.218C36.6834 236.674 56.3203 292.156 102.17 318.695L126.942 332.885V212.514L119.193 208.018L60.7443 174.439C60.6619 174.604 60.5794 174.759 60.497 174.914C60.4145 175.068 60.3321 175.223 60.2497 175.388C58.0396 179.591 56.1386 183.877 54.5387 188.218ZM67.801 195.837C54.0042 236.84 70.9139 283.208 109.675 305.662C109.684 305.668 109.694 305.673 109.704 305.679L111.903 306.939V221.175L111.674 221.042L67.801 195.837Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M136.132 198.16L145.282 192.963L239.798 138.264L213.954 123.455C168.024 96.9127 110.113 107.973 77.5146 148.024C74.5974 151.608 71.8829 155.425 69.3979 159.467C69.2494 159.675 69.1224 159.883 68.9859 160.106C68.9329 160.193 68.8785 160.282 68.8208 160.374L126.94 193.747L135.349 198.614L136.132 198.16ZM137.802 179.916L135.412 181.274L134.452 180.718L90.7623 155.631C118.976 122.861 167.606 114.041 206.429 136.476L206.453 136.49L209.662 138.328L137.802 179.916Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M451.256 174.439C451.338 174.604 451.421 174.759 451.503 174.914C451.585 175.068 451.668 175.223 451.75 175.388C453.96 179.591 455.861 183.877 457.461 188.218C475.317 236.674 455.68 292.156 409.83 318.695L385.058 332.885V212.514L392.807 208.018L451.256 174.439ZM444.199 195.837L400.326 221.042L400.097 221.175V306.939L402.296 305.679C402.306 305.673 402.315 305.668 402.325 305.662C441.086 283.208 457.996 236.84 444.199 195.837Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M434.485 148.024C401.886 107.973 343.976 96.9127 298.046 123.455L272.201 138.264L366.717 192.963L375.868 198.16L376.651 198.614L385.059 193.747L430.131 167.866L443.179 160.374C443.121 160.282 443.067 160.193 443.014 160.106C442.877 159.883 442.75 159.675 442.601 159.467C440.116 155.425 437.402 151.608 434.485 148.024ZM421.237 155.631C393.023 122.861 344.394 114.041 305.57 136.476L305.547 136.49L302.337 138.328L374.197 179.916L376.588 181.274L377.548 180.718L421.237 155.631Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M283.454 251.785L283.618 251.703L359.379 207.935L358.802 207.564L255.96 148.08L152.418 208.059L151.016 208.843L255.589 267.873L255.795 267.749L283.454 251.785ZM255.502 250.554L276.324 238.536L276.486 238.454L329.361 207.908L255.966 165.456L181.335 208.688L255.502 250.554Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M264.777 282.515L264.241 282.803V403.999L264.777 403.711L368.856 343.525V221.422L264.777 282.515ZM353.817 247.695L279.28 291.446V377.956L334.241 346.185L353.817 334.853V247.695Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M247.22 282.724L143.141 223.982V342.744L247.22 402.93L247.756 403.26V283.012L247.22 282.724ZM232.716 291.807L158.18 249.739V334.068L232.716 377.17V291.807Z" fill="white"/></svg>'

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
