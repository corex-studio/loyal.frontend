<template>
  <div
    v-if="company"
    class="column gap-lg-20 gap-md-15 gap-xs-12 full-width text-on-background-color"
  >
    <div class="column full-width gap-md-10 gap-xs-8">
      <div class="row gap-4 no-wrap items-center">
        <CIcon
          v-if="$companyGroup.item && $companyGroup.item?.companies.length > 1"
          @click="companyRepo.companyForProfile = null"
          class="cursor-pointer"
          name="fa-regular fa-angle-left"
          color="on-background-color"
          hover-color="primary"
          size="26px"
        />
        <div class="header3 bold">О нашем заведении</div>
      </div>
      <div class="body">{{ company.description }}</div>
    </div>
    <SwiperContainer
      v-if="company.images.slice(1).length"
      class="full-width"
      :slides-per-view="1"
      :items="company.images.slice(1)"
      :use-bullets="$q.screen.lt.lg"
    >
      <template v-slot:item="{ item }">
        <div
          :style="`overflow: hidden; height: ${
            $q.screen.lt.lg ? ($q.screen.md ? '300' : '170') : '530'
          }px`"
        >
          <q-img
            :height="
              $q.screen.lt.lg ? ($q.screen.md ? '300px' : '170px') : '530px'
            "
            class="border-radius"
            :style="`min-height: ${
              $q.screen.lt.lg ? ($q.screen.md ? '300' : '170') : '530'
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
    <q-img
      v-if="
        $uiSettings.item?.socialButtonImage &&
        company.guestContacts.socials.length
      "
      fit="cover"
      @click="socialsModal = true"
      class="border-radius cursor-pointer"
      :src="$uiSettings.item?.socialButtonImage?.image"
    >
    </q-img>
    <div v-if="contacts.length" class="column full-width">
      <div class="header3 bold mb-10">Наши контакты</div>
      <div
        style="overflow-x: auto"
        class="row full-width items-center no-wrap gap-xs-4 gap-md-6 gap-lg-8"
      >
        <div
          v-for="(item, index) in contacts"
          :key="index"
          class="contact-block border-radius pa-8 column"
          style="max-width: 292px"
        >
          <div class="subtitle-text bold mb-5">{{ item.label }}</div>
          <div class="row full-width no-wrap">
            <div class="column col gap-2">
              <CButton
                v-for="(el, index) in item.values"
                :key="index"
                @click="openLink(el.link)"
                class="body"
                text-button
                :label="el.value"
                text-color="on-background-color"
                style="width: fit-content"
              />
            </div>
            <div
              style="
                height: 44px;
                width: 44px;
                min-width: 44px;
                align-self: flex-end;
              "
              class="bg-secondary-button-color border-radius row items-center justify-center"
            >
              <CIcon
                color="on-secondary-button-color"
                size="20px"
                :name="item.icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <ProfileAddressesOnMap />
  </div>
  <SelectCompany v-else />
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
import SwiperContainer from 'src/layouts/containers/SwiperContainer.vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { computed, ref } from 'vue'
import SocialsModal from './SocialsModal.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import ProfileAddressesOnMap from './ProfileAddressesOnMap.vue'
import SelectCompany from './SelectCompany.vue'
import ContactsModal from './ContactsModal.vue'

const socialsModal = ref(false)

const concatsModal = ref(false)

const currentContactType = ref<{
  label: string
  type: 'phones' | 'emails' | 'messages'
} | null>(null)

type ContactType = {
  label: string
  icon: string
  field: 'phones' | 'emails' | 'messages'
  values?: any[]
}

const contacts = computed(() => {
  const result: ContactType[] = []
  if (company.value?.guestContacts.phones.length) {
    result.push({
      label: 'Позвонить нам',
      icon: 'fa-regular fa-phone',
      field: 'phones',
      values: company.value?.guestContacts.phones,
    })
  }
  if (company.value?.guestContacts.messages.length) {
    result.push({
      label: 'Написать',
      icon: 'fa-regular fa-message',
      field: 'messages',
      values: company.value?.guestContacts.messages,
    })
  }
  company.value?.guestContacts.emails.forEach((v) => {
    result.push({
      label: v.name || '-',
      icon: 'fa-regular fa-envelope',
      field: 'emails',
      values: company.value?.guestContacts.emails,
    })
  })

  return result
})

// const availableOrderMethods = computed(() => {
//   const result = []
//   if (company.value?.salesPoints?.some((v) => v.settings.pickup_enabled)) {
//     result.push({
//       label: 'Заказ с собой',
//       icon: 'fa-light fa-person-walking',
//     })
//     if (company.value.salesPoints.some((v) => v.settings.delivery_enabled)) {
//       result.push({
//         label: 'Доставка',
//         icon: 'fa-light fa-house',
//       })
//     }
//     if (company.value.salesPoints.some((v) => v.settings.booking_enabled)) {
//       result.push({
//         label: 'Бронь стола',
//         icon: 'fa-light fa-calendar-day',
//       })
//     }
//   }
//   return result
// })

const company = computed(() => {
  return companyRepo.companyForProfile
})

const openLink = (link: string) => {
  window.open(link || undefined, '_blank')
}

// const openContactsModal = (
//   type: 'phones' | 'emails' | 'messages',
//   label: string
// ) => {
//   currentContactType.value = {
//     label,
//     type,
//   }
//   concatsModal.value = true
// }
</script>

<style lang="scss" scoped>
.contact-block {
  border: 1px var(--secondary-button-color) solid;
  min-width: 280px;
  width: 100%;
}
</style>
