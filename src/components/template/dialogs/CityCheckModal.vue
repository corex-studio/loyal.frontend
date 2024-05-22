<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="400px"
    no-close
    persistent
  >
    <div class="text-on-background-color">
      <div class="header3 bold">
        Ваш город {{ $companyGroup.item?.cityData.current?.name }}?
      </div>
      <div class="body text-secondary mt-2">
        Блюда и акции зависят от города
      </div>
      <div class="row full-width gap-6 mt-8">
        <CButton
          @click="confirmSuggestedCity()"
          label="Да, верно"
          class="col body"
          :height="$q.screen.lt.md ? '40px' : '48px'"
        />
        <CButton
          @click="rejectSuggestedCity()"
          label="Нет, другой"
          class="col body"
          color="secondary-button-color"
          text-color="on-secondary-button-color"
          :height="$q.screen.lt.md ? '40px' : '48px'"
        />
      </div>
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import CButton from '../buttons/CButton.vue'
import CDialog from './CDialog.vue'
import { AppManager } from 'src/models/utils/appManager'
import { useRoute } from 'vue-router'
import { store } from 'src/models/store'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const route = useRoute()

const confirmSuggestedCity = async () => {
  if (!companyGroupRepo.item) return
  localStorage.setItem(
    'city',
    companyGroupRepo.item.cityData.current?.uuid || '',
  )
  emit('update:modelValue', false)
  await reRequest()
  // void router.push({
  //   path: `/${companyGroupRepo.item.cityData.current?.uuid}`,
  // })
}

const rejectSuggestedCity = () => {
  emit('update:modelValue', false)
  store.citySelectorModal = true
}

const reRequest = async () => {
  const manager = new AppManager({
    companyGroupId: route.query.group ? String(route.query.group) : undefined,
    initMenuPage: true,
  })
  await companyGroupRepo.current()
  manager.setDefaultCompany()
  await manager.loadMenuPage()
}
</script>
