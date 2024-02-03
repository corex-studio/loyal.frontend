<template>
  <div v-if="company" class="column full-width text-on-background-color pt-3">
    <div class="c-container">
      <div
        class="border-radius main-image-block row justify-center items-center full-width relative-position"
        :style="`background-image: url(${
          company.images[1].image || $store.images.empty
        })`"
      >
        <CIconButton
          v-if="$companyGroup.item && $companyGroup.item.companies.length > 1"
          @click="$company.companyForProfile = null"
          icon="fa-regular fa-angle-left"
          style="position: absolute; top: 10px; left: 10px"
          outline
          icon-size="24px"
          size="48px"
          icon-color="white"
          class="outlined-button"
        />
        <div
          class="col-8 column items-center text-white gap-10 py-18 glassed-block"
        >
          <div class="huge">О компании {{ company.name }}</div>
          <div class="row gap-4">
            <div
              v-for="(el, index) in company.salesPoints"
              :key="index"
              class="subtitle-text"
            >
              {{ el.customAddress }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="c-container">
      <div
        style="overflow-x: auto"
        class="row full-width gap-17 items-center no-wrap pb-2 no-scrollbar mt-20 mb-29"
      >
        <div
          v-for="(el, index) in features"
          :key="index"
          @click="el.click"
          :class="{ 'cursor-pointer': el.click }"
          class="row justify-between items-center px-15 bg-backing-color text-on-backing-color border-radius relative-position"
          style="height: 120px"
          :style="`min-width: ${features.length < 4 ? '407' : '380'}px`"
        >
          <div class="left-circle"></div>
          <div class="right-circle"></div>
          <div class="column header3">
            <div class="bold">{{ el.title }}</div>
            <div class="bold text-primary">{{ el.text }}</div>
          </div>
          <div class="row justify-center items-center icon-block border-radius">
            <CIcon :name="el.icon" color="on-background-color" size="45px" />
          </div>
        </div>
      </div>
    </div>
    <div class="bg-backing-color py-32">
      <div class="c-container">
        <div class="row no-wrap items-center gap-23 text-on-backing-color">
          <div class="column gap-9 col">
            <div class="huge bold">{{ company.name }}</div>
            <div class="header3">
              {{ company.description }}
            </div>
          </div>
          <div style="height: 500px; width: 45%">
            <q-img
              height="100%"
              fit="cover"
              class="border-radius"
              :src="company.image?.thumbnail"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="company.salesPoints?.some((v) => v.images.length)"
      class="c-container mt-30"
    >
      <div class="column gap-30">
        <SwiperContainer
          v-for="(el, index) in company.salesPoints.filter(
            (v) => v.images.length
          )"
          :key="index"
          class="full-width"
          no-navigation
          :slides-per-view="3"
          :items="el.images"
          :use-bullets="$q.screen.lt.lg"
        >
          <template v-slot:top>
            <div class="row gap-6 no-wrap items-center huge3">
              <div class="circle-point"></div>
              <div class="bold">{{ el.customAddress }}</div>
            </div>
          </template>
          <template v-slot:item="{ item }">
            <div
              :style="`overflow: hidden; height: ${
                $q.screen.lt.lg ? ($q.screen.md ? '300' : '170') : '310'
              }px`"
            >
              <q-img
                :height="
                  $q.screen.lt.lg ? ($q.screen.md ? '300px' : '170px') : '310px'
                "
                class="border-radius"
                :style="`min-height: ${
                  $q.screen.lt.lg ? ($q.screen.md ? '300' : '170') : '310'
                }px`"
                :src="item.image || $store.images.empty"
                fit="cover"
              >
                <template v-slot:error>
                  <span>
                    <q-img
                      class="border-radius"
                      fit="cover"
                      height="530px"
                      :src="$store.images.empty"
                    ></q-img>
                  </span>
                </template>
              </q-img>
            </div> </template
        ></SwiperContainer>
      </div>
    </div>

    <q-img
      v-if="
        $uiSettings.item?.socialButtonImage &&
        company.guestContacts.socials.length
      "
      fit="cover"
      @click="socialsModal = true"
      class="border-radius cursor-pointer c-container mt-62"
      :src="$uiSettings.item?.socialButtonImage?.image"
    >
    </q-img>
    <div v-if="contacts.length" class="c-container">
      <div
        style="overflow-x: auto"
        class="row full-width items-center no-wrap gap-16 mt-35"
      >
        <div
          v-for="(item, index) in contacts"
          :key="index"
          class="contact-block border-radius pl-15 pr-7 pt-7 row relative-position"
          style="max-width: 407px"
        >
          <div class="left-circle-bordered"></div>
          <div class="right-circle-bordered"></div>
          <div class="column gap-4 col pb-6">
            <div class="header3 bold">{{ item.label }}</div>
            <div class="column col gap-3">
              <CButton
                v-for="(el, index) in item.values"
                :key="index"
                @click="openLink(el.link)"
                class="subtitle-text"
                text-button
                :label="el.value"
                text-color="on-background-color"
                style="width: fit-content"
              />
            </div>
          </div>
          <q-img
            style="align-self: flex-end"
            :src="getImage(item.image)"
            width="100px"
            height="100px"
          />
        </div>
      </div>
    </div>

    <ProfileAddressesOnMap class="c-container mt-33" />
  </div>
  <div v-else class="c-container">
    <SelectCompany class="mt-20" />
  </div>
  <SocialsModal
    :model-value="socialsModal"
    @update:model-value="socialsModal = false"
  />
  <ContactsModal
    @update:model-value="concatsModal = false"
    :model-value="concatsModal"
    :contact="currentContactType"
  />
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { computed, ref, onMounted } from 'vue'
import SocialsModal from './SocialsModal.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import ProfileAddressesOnMap from './ProfileAddressesOnMap.vue'
import SelectCompany from './SelectCompany.vue'
import ContactsModal from './ContactsModal.vue'
import { useRouter } from 'vue-router'
import SwiperContainer from 'src/layouts/containers/SwiperContainer.vue'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { store } from 'src/models/store'
import CIconButton from 'src/components/template/buttons/CIconButton.vue'

const socialsModal = ref(false)

const concatsModal = ref(false)

const router = useRouter()

const features = computed(() => {
  const result: [
    {
      title: string
      text: string
      click?: () => void
      icon: string
    }
  ] = [
    {
      title: 'Наше меню',
      text: 'Новинки',
      icon: 'fa-regular fa-badge-percent',
      click: () => {
        void router.push({
          name: 'home',
        })
      },
    },
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
      icon: 'fa-regular fa-person-carry-box',
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
      icon: 'fa-regular fa-table-picnic',
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
      values: company.value?.guestContacts.phones,
    })
  }
  if (company.value?.guestContacts.messages.length) {
    result.push({
      label: 'Написать',
      image: 'contactsMessageImage.png',
      field: 'messages',
      values: company.value?.guestContacts.messages,
    })
  }
  company.value?.guestContacts.emails.forEach((v) => {
    result.push({
      label: v.name || '-',
      image: 'contactsFaceImage.png',
      field: 'emails',
      values: company.value?.guestContacts.emails,
    })
  })

  return result
})

const getImage = (v: string) => {
  try {
    return require('assets/' + v)
  } catch {
    return store.images.empty
  }
}

const company = computed(() => {
  return companyRepo.companyForProfile
})

const openLink = (link: string) => {
  window.open(link || undefined, '_blank')
}

onMounted(() => {
  if (companyGroupRepo.item && companyGroupRepo.item?.companies.length < 2) {
    companyRepo.companyForProfile = companyRepo.item
  }
})
</script>

<style lang="scss" scoped>
.contact-block {
  border: 1px var(--secondary-button-color) solid;
  min-width: 280px;
  width: 100%;
}

.main-image-block {
  height: 388px;
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
}

.glassed-block {
  /* From https://css.glass */
  /* From https://css.glass */
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
  border: 1px solid var(--secondary-button-color);
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
  border: 1px solid var(--secondary-button-color);
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

.circle-point {
  min-width: 9px;
  max-width: 9px;
  min-height: 9px;
  max-width: 9px;
  border-radius: 50%;
  background-color: var(--primary);
}

.outlined-button {
  border-radius: 50% !important;
  overflow: hidden !important;
  background: rgba(53, 53, 53, 0.274);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(7.3px);
  -webkit-backdrop-filter: blur(7.3px);
}

.outlined-button :deep(.q-btn--outline:before) {
  border: unset !important;
  border-radius: 50%;
}
</style>
