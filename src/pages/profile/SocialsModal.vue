<template>
  <CDialog
    :model-value="modelValue"
    class="text-on-background-color"
    width="456px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="header3 bold mb-10">Ссылки на соц. сети</div>
    <div class="column gap-8">
      <div
        v-for="(el, index) in $company.companyForProfile?.guestContacts.socials"
        :key="index"
        class="row items-center gap-6 cursor-pointer"
        @click="openSocial(el.link)"
      >
        <div>
          <q-img :src="getImage(el.link_type)" fit="contain" width="30px" />
        </div>
        <div class="body">
          {{ el.name }}
        </div>
      </div>
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import CDialog from 'src/components/template/dialogs/CDialog.vue'
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
    if (link === LinkType.INSTAGRAM) fileName = 'instagramLogo.png'
    if (link === LinkType.WHATSAPP) fileName = 'whatsAppLogo.png'

    return `assets/${fileName}`
  } catch {
    return store.images.empty
  }
}

const openSocial = (link: string) => {
  window.open(link, '_blank')
}
</script>
