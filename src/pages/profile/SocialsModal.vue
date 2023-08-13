<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="456px"
  >
    <template v-slot:header>
      <div class="row items-center justify-between full-width">
        Полезные ссылки

        <div
          class="row box-shadow bg-white-opacity px-4 py-2 border-radius justify-center items-center"
        >
          <CIcon
            color="on-secondary-button-color"
            name="fa-light fa-thumbs-up"
          />
        </div>
      </div>
    </template>
    <div class="column gap-8">
      <div
        v-for="(el, index) in $company.companyForProfile?.guestContacts.socials"
        :key="index"
        @click="openSocial(el.link)"
        class="row items-center gap-4 cursor-pointer"
      >
        <div class="pa-5 bg-backing-color border-radius">
          <q-img width="24px" fit="contain" :src="getImage(el.link_type)" />
        </div>
        {{ el.name }}
      </div>
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { LinkType } from 'src/models/company/company'
import { store } from 'src/models/store'

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const getImage = (link: LinkType | null) => {
  let fileName: string | null = null

  try {
    if (link === LinkType.MAPS) fileName = 'yandexMaps.png'
    if (link === LinkType.OK) fileName = 'okLogo.png'
    if (link === LinkType.TELEGRAM) fileName = 'telegramLogo.png'
    if (link === LinkType.VK) fileName = 'VKLogo.png'
    if (link === LinkType.WEBSITE) fileName = 'websiteIcon.png'

    return require('assets/' + fileName) as string
  } catch {
    return store.images.empty
  }
}

const openSocial = (link: string) => {
  window.open(link, '_blank')
}
</script>
