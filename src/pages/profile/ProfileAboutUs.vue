<template>
  <div v-if="company" class="column full-width text-on-background-color pt-3">
    <div class="c-container">
      <div
        :style="`background-image: url(${
          company.headerImage
            ? company.headerImage.image
            : company.images.length
              ? company.images[1].image
              : $store.images.empty
        }); height: ${$q.screen.gt.md ? '388' : '320'}px`"
        class="border-radius main-image-block row justify-center items-center full-width relative-position"
      >
        <CIconButton
          v-if="$companyGroup.item && $companyGroup.item.companies.length > 1"
          class="outlined-button"
          icon="fa-regular fa-angle-left"
          icon-color="white"
          icon-size="24px"
          outline
          size="48px"
          style="position: absolute; top: 10px; left: 10px; z-index: 2"
          @click="$company.companyForProfile = null"
        />
        <div
          class="col-xs-8 col-lg-9 col-xs-11 column items-center text-white py-18 glassed-block"
        >
          <div class="huge" style="text-align: center">
            О заведении {{ company.name }}
          </div>
          <div
            v-if="company.salesPoints"
            class="row justify-center gap-4 mt-10"
            style="text-align: center"
          >
            <template v-if="$companyGroup.item?.externalId !== 'HooDoo'">
              <div
                v-for="(el, index) in company.salesPoints?.slice(0, 2)"
                :key="index"
                class="subtitle-text row justify-center gap-4 items-center"
              >
                <div v-if="index">•</div>
                <div class="ellipsis">
                  {{ el.customAddress || el.address }}
                </div>
              </div>
              <CIcon
                v-if="company.salesPoints.length > 2"
                class="cursor-pointer"
                color="white"
                hover-color="primary"
                name="fa-regular fa-angle-down"
                size="24px"
              >
                <q-menu auto-close class="pa-5 column gap-4" max-width="400px">
                  <div
                    v-for="(el, index) in company.salesPoints.slice(2)"
                    :key="index"
                    class="secondary-text text-on-background-color"
                    style="white-space: nowrap"
                  >
                    {{ el.customAddress || el.address }}
                  </div>
                </q-menu>
              </CIcon>
            </template>
            <div v-else class="row items-center gap-3">
              <div class="subtitle-text">Адреса:</div>
              <CIcon
                v-if="company.salesPoints.length"
                class="cursor-pointer"
                color="white"
                hover-color="primary"
                name="fa-regular fa-angle-down"
                size="24px"
              >
                <q-menu auto-close class="pa-5 column gap-4" max-width="400px">
                  <div
                    v-for="(el, index) in company.salesPoints"
                    :key="index"
                    class="secondary-text text-on-background-color"
                    style="white-space: nowrap"
                  >
                    {{ el.customAddress || el.address }}
                  </div>
                </q-menu>
              </CIcon>
            </div>
          </div>
          <div class="row full-width justify-center">
            <div class="mt-6 col-9 subtitle-text">
              <div
                class="row full-width justify-center items-center gap-3 no-wrap"
              >
                <div>Открыто:</div>
                <div v-if="currentSchedule?.times.length" class="ellipsis">
                  {{
                    currentSchedule?.times
                      .map((v) => `c ${v.start} до ${v.end}`)
                      .join(', ')
                  }}
                </div>
                <div v-else>Не указано</div>
                <CIcon
                  class="cursor-pointer"
                  color="white"
                  hover-color="primary"
                  name="fa-regular fa-angle-down"
                  size="24px"
                >
                  <q-menu
                    auto-close
                    class="pa-5 column gap-4"
                    max-width="400px"
                  >
                    <div
                      v-for="(el, index) in $salesPoint.item?.schedule?.days"
                      :key="index"
                      class="row secondary-text gap-3 no-wrap text-on-background-color"
                    >
                      <div
                        :class="{ 'text-primary': moment().day() === el.day }"
                        class="bold"
                        style="min-width: 110px"
                      >
                        {{ days.find((v) => v.val === el.day)?.label }}:
                      </div>
                      <div style="white-space: nowrap">
                        {{
                          el.times
                            .map((v) => `${v.start}-${v.end}`)
                            .join('; ') || 'Не указано'
                        }}
                      </div>
                    </div>
                  </q-menu>
                </CIcon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="$companyGroup.item?.externalId !== 'tochka_vkusa' && $companyGroup.item?.externalId !== 'ThreePizzas'"
      class="c-container"
    >
      <div
        :class="{ 'no-wrap': $q.screen.gt.sm }"
        :style="$q.screen.lt.md ? '' : 'overflow-x: auto'"
        class="row full-width gap-lg-16 gap-md-10 gap-xs-6 items-center pb-2 no-scrollbar mt-lg-20 mt-md-15 mt-xs-10 mb-lg-29 mb-md-25 mb-xs-10"
      >

        <div
          v-for="(el, index) in features"
          :key="index"
          :class="{ 'cursor-pointer': el.click }"
          :style="`min-width: ${
            $q.screen.lt.md ? '100%' : features.length < 4 ? '407px' : '350px'
          }; height: ${$q.screen.lt.md ? '100' : '120'}px`"
          class="row justify-between items-center px-lg-15 px-xs-13 bg-backing-color text-on-backing-color border-radius relative-position"
          @click="el.click"
        >
          <div class="left-circle"></div>
          <div class="right-circle"></div>
          <div class="column header3">
            <div class="bold">{{ el.title }}</div>
            <div class="bold text-primary">{{ el.text }}</div>
          </div>
          <div
            class="row justify-center items-center icon-block border-radius2"
          >
            <CIcon
              :name="el.icon"
              :size="$q.screen.gt.md ? '45px' : $q.screen.lt.md ? '33' : '38'"
              color="on-background-color"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      :class="{
        'mt-lg-29 mt-md-25 mt-xs-10':
          $companyGroup.item?.externalId === 'tochka_vkusa' || $companyGroup.item?.externalId === 'ThreePizzas',
      }"
      class="bg-backing-color full-width py-lg-30 pt-xs-15 pb-md-11"
    >
      <div class="c-container">
        <div
          :class="$q.screen.gt.md ? 'no-wrap' : 'justify-center'"
          class="row items-center gap-lg-23 gap-md-10 text-on-backing-color"
        >
          <div
            :class="$q.screen.lt.lg ? 'full-width' : 'col'"
            class="column gap-md-9 gap-xs-6"
          >
            <div class="huge bold">{{ company.name }}</div>
            <div class="header3" style="white-space: pre-line" v-html="company.description" />
          </div>
          <div
            v-if="$q.screen.gt.sm"
            :style="`height: ${$q.screen.lt.lg ? '220px' : '500px'};width: ${
              $q.screen.lt.lg ? '100%' : '45%'
            }; max-width: ${$q.screen.lt.lg ? '520px' : 'unset'}`"
          >
            <q-img
              :src="
                company.descriptionImage?.image ||
                $company.item?.image?.image ||
                $store.images.empty
              "
              class="border-radius"
              fit="contain"
              height="100%"
            />
          </div>
          <div v-else class="row full-width justify-end">
            <q-img
              fit="contain"
              height="87px"
              src="/assets/pinkHearts.png"
              width="97px"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="company.salesPoints?.some((v) => v.images.length)"
      class="c-container mt-lg-30 mt-md-25 mt-xs-15"
    >
      <div class="column gap-lg-30 gap-xs-15">
        <SwiperContainer
          v-for="(el, index) in company.salesPoints.filter(
            (v) => v.images.length,
          )"
          :key="index"
          :items="el.images"
          :slides-per-view="$q.screen.gt.md ? 3 : $q.screen.lt.md ? 1 : 2"
          :use-bullets="$q.screen.lt.lg"
          class="full-width"
          no-navigation
        >
          <template v-slot:top>
            <div class="row gap-6 no-wrap items-center huge3">
              <div class="circle-point"></div>
              <div class="bold">{{ el.customAddress }}</div>
            </div>
          </template>
          <template v-slot:item="{ item }">
            <div :style="`overflow: hidden; height: 314px`">
              <q-img
                :src="item.image || $store.images.empty"
                :style="`min-height: 314px`"
                class="border-radius"
                fit="cover"
                height="314px"
              >
                <template v-slot:error>
                  <span>
                    <q-img
                      :src="$store.images.empty"
                      class="border-radius"
                      fit="cover"
                      height="314px"
                    ></q-img>
                  </span>
                </template>
              </q-img>
            </div>
          </template
          >
        </SwiperContainer>
      </div>
    </div>
    <div class="c-container">
      <q-img
        v-if="
          $uiSettings.item?.socialButtonImage &&
          company.guestContacts.socials.length
        "
        :src="$uiSettings.item?.socialButtonImage?.image"
        class="border-radius cursor-pointer mt-lg-60 mt-md-25 mt-xs-15"
        fit="cover"
        width="100%"
        @click="socialsModal = true"
      >
      </q-img>
    </div>
    <div v-if="contacts.length" class="c-container">
      <div
        class="row full-width no-wrap gap-lg-16 gap-md-10 gap-xs-8 mt-lg-35 mt-md-25 mt-xs-15 no-scrollbar"
        style="overflow-x: auto"
      >
        <div
          v-for="(item, index) in contacts"
          :key="index"
          class="contact-block border-radius pl-lg-15 pl-xs-12 pr-7 pt-7 row relative-position"
          style="max-width: 407px"
        >
          <div class="left-circle-bordered"></div>
          <div class="right-circle-bordered"></div>
          <div class="column gap-4 col pb-6">
            <div class="header3 bold">{{ item.label }}</div>
            <div class="column col gap-3">
              <template v-if="item.field === 'phones'">
                <a
                  v-for="(el, index) in item.values"
                  :key="index"
                  :href="el.link"
                  class="subtitle-text text-on-background-color"
                >{{ el.value }}</a
                >
              </template>
              <template v-else>
                <CButton
                  v-for="(el, index) in item.values"
                  :key="index"
                  :label="el.value"
                  class="subtitle-text"
                  style="width: fit-content"
                  text-button
                  text-color="on-background-color"
                  @click="openLink(el.link)"
                />
              </template>
            </div>
          </div>
          <q-img
            :height="$q.screen.gt.md ? '100px' : $q.screen.md ? '80px' : '60px'"
            :src="getImage(item.image)"
            :width="$q.screen.gt.md ? '100px' : $q.screen.md ? '80px' : '60px'"
            style="align-self: flex-end"
          />
        </div>
      </div>
    </div>
    <div v-if="company.conditions !== undefined && !!company.conditions?.length"
         id="conditions"
         class="c-container column gap-10  mt-lg-30 mt-md-25 mt-xs-15">
      <div class="huge3 bold">Условия</div>
      <div style="white-space: pre-line" v-html="company.conditions"></div>
    </div>
    <ProfileAddressesOnMap
      :key="$company.companyForProfile?.id"
      class="c-container mt-lg-30 mt-md-25 mt-xs-15"
    />
  </div>
  <div v-else>
    <SelectCompanyModal
      :model-value="!$company.companyForProfile"
      no-close
      @select="companySelected($event)"
    />
  </div>
  <SocialsModal
    :model-value="socialsModal"
    @update:model-value="socialsModal = false"
  />
  <ContactsModal
    :contact="currentContactType"
    :model-value="concatsModal"
    @update:model-value="concatsModal = false"
  />
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { computed, ref, onMounted } from 'vue'
import SocialsModal from './SocialsModal.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import ProfileAddressesOnMap from './ProfileAddressesOnMap.vue'
import ContactsModal from './ContactsModal.vue'
import { useRouter } from 'vue-router'
import SwiperContainer from 'src/layouts/containers/SwiperContainer.vue'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import CIconButton from 'src/components/template/buttons/CIconButton.vue'
import moment from 'moment'
import SelectCompanyModal from 'src/components/dialogs/SelectCompanyModal.vue'
import { Company } from 'src/models/company/company'
import { useEventBus } from '@vueuse/core'
import { selectCompanyKey } from 'src/services/eventBusKeys'
import { daysNames } from 'src/services/daysEnum'

const socialsModal = ref(false)
const concatsModal = ref(false)
const router = useRouter()

const days = Object.keys(daysNames).map((key) => {
  return {
    label: daysNames[Number(key) as keyof typeof daysNames],
    val: Number(key)
  }
})

const currentSchedule = computed(() => {
  if (!company.value?.salesPoints) return
  return company.value?.salesPoints[0].schedule?.days.find(
    (el) => el.day === moment().day()
  )
})

const features = computed(() => {
  const result: [
    {
      title: string
      text: string
      click?: () => void
      icon: string
    },
  ] = [
    {
      title: 'Наше меню',
      text: 'Новинки',
      icon: 'fa-regular fa-badge-percent',
      click: () => {
        void router.push({
          name: 'home'
        })
      }
    }
  ]
  if (
    companyRepo.companyForProfile?.salesPoints?.some(
      (v) => v.settings.delivery_enabled
    )
  ) {
    result.push({
      title: 'Доставка',
      text: 'Заказа',
      icon: 'fa-regular fa-truck',
      click: () => {
        companyRepo.companyForProfile?.conditions?.length ? scrollToBlock('conditions') : void 0
      }
    })
  }
  if (
    companyRepo.companyForProfile?.salesPoints?.some(
      (v) => v.settings.pickup_enabled
    )
  ) {
    result.push({
      title: 'Самовывоз',
      text: 'Заказа',
      icon: 'fa-regular fa-person-carry-box'
    })
  }
  if (
    companyRepo.companyForProfile?.salesPoints?.some(
      (v) => v.settings.booking_enabled
    )
  ) {
    result.push({
      title: 'Бронирование',
      text: 'Стола',
      icon: 'fa-regular fa-table-picnic'
    })
  }
  return result
})

const currentContactType = ref<{
  label: string
  type: 'phones' | 'emails' | 'messages'
} | null>(null)

type ContactType = {
  label: string
  image: string
  field: 'phones' | 'emails' | 'messages'
  values?: any[]
}

const contacts = computed(() => {
  const result: ContactType[] = []
  if (company.value?.guestContacts.phones.length) {
    result.push({
      label: 'Позвонить нам',
      image: 'contactsPhoneImage.png',
      field: 'phones',
      values: company.value?.guestContacts.phones
    })
  }
  if (company.value?.guestContacts.messages.length) {
    result.push({
      label: 'Написать',
      image: 'contactsMessageImage.png',
      field: 'messages',
      values: company.value?.guestContacts.messages
    })
  }
  company.value?.guestContacts.emails.forEach((v) => {
    result.push({
      label: v.name || '-',
      image: 'contactsFaceImage.png',
      field: 'emails',
      values: [v]
    })
  })
  return result
})

const companySelected = (v: Company | null) => {
  companyRepo.companyForProfile = v
}

const getImage = (v: string) => {
  return 'assets/' + v
}

const company = computed(() => {
  return companyRepo.companyForProfile
})

const openLink = (link: string) => {
  window.open(link || undefined, '_blank')
}

onMounted(() => {
  if (companyGroupRepo.item && companyGroupRepo.item?.companies.length < 2) {
    companyRepo.companyForProfile = companyGroupRepo.item.companies[0]
  }
  useEventBus(selectCompanyKey).on(
    (e) => (companyRepo.companyForProfile = e.company)
  )
})

const scrollToBlock = (v: string) => {
  const element = document.getElementById(v)
  if (element) {
    const y = element.getBoundingClientRect().top + window.scrollY - 120
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}
</script>

<style lang="scss" scoped>
.contact-block {
  border: 1px var(--divider-color) solid;
  min-width: 340px;
  width: 100%;
}

.main-image-block {
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
}

.glassed-block {
  background: rgba(53, 53, 53, 0.274);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(7.3px);
  -webkit-backdrop-filter: blur(7.3px);
}

.left-circle {
  min-height: 20px;
  max-height: 20px;
  min-width: 20px;
  max-width: 20px;
  border-radius: 50%;
  background-color: var(--background-color);
  position: absolute;
  left: -10px;
}

.right-circle {
  min-height: 20px;
  max-height: 20px;
  min-width: 20px;
  max-width: 20px;
  border-radius: 50%;
  background-color: var(--background-color);
  position: absolute;
  right: -10px;
}

.right-circle-bordered {
  width: 10px;
  height: 20px;
  background-color: var(--background-color);
  border-bottom-left-radius: 110px;
  border-top-left-radius: 110px;
  border: 1px solid var(--divider-color);
  border-right: 0;
  position: absolute;
  top: 44%;
  right: -1px;
}

.left-circle-bordered {
  width: 10px;
  height: 20px;
  background-color: var(--background-color);
  border-bottom-right-radius: 110px;
  border-top-right-radius: 110px;
  border: 1px solid var(--divider-color);
  border-left: 0;
  position: absolute;
  top: 44%;
  left: -1px;
}

.icon-block {
  width: 80px;
  height: 80px;
  min-width: 80px;
  min-height: 80px;
  background-color: var(--background-color);
}

body.screen--md {
  .icon-block {
    width: 64px;
    height: 64px;
    min-width: 64px;
    min-height: 64px;
    background-color: var(--background-color);
  }
}

body.screen--xs,
body.screen--sm {
  .icon-block {
    width: 56px;
    height: 56px;
    min-width: 56px;
    min-height: 56px;
    background-color: var(--background-color);
  }
}

.circle-point {
  min-width: 9px;
  max-width: 9px;
  min-height: 9px;
  border-radius: 50%;
  background-color: var(--primary);
}

.outlined-button {
  border-radius: 50% !important;
  overflow: hidden !important;
  background: rgba(53, 53, 53, 0.274);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(7.3px);
  -webkit-backdrop-filter: blur(7.3px);
}

.outlined-button :deep(.q-btn--outline:before) {
  border: unset !important;
  border-radius: 50%;
}
</style>
