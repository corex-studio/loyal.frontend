<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="400px"
    :position="$q.screen.lt.md ? 'bottom' : undefined"
    :maximize="$q.screen.lt.md"
    no-close
    persistent
  >
    <div class="text-on-background-color">
      <div class="header3 bold mb-2">Выберите город</div>
      <div class="body text-secondary">Блюда и акции зависят от города</div>
      <div class="column no-wrap full-width gap-xs-6 mt-8">
        <template
          v-for="(item, index) in $companyGroup.item?.cityData.results"
          :key="index"
        >
          <q-separator v-if="index && $q.screen.lt.md" color="divider-color" />
          <div
            @click="currentCity = item"
            class="row full-width items-center no-wrap justify-between border-radius cursor-pointer py-md-6 px-md-6 gap-6"
            :style="
              $q.screen.gt.sm
                ? currentCity?.uuid === item.uuid
                  ? `outline: 2px #${$uiSettings.item?.primaryColor.color} solid`
                  : `outline: 1px #${$uiSettings.item?.secondaryColor.color} solid`
                : ''
            "
          >
            <div class="header3 bold">
              {{ item.name }}
            </div>
            <RoundedSelector
              :model-value="currentCity?.uuid === item.uuid"
              check
              height="22px"
              width="22px"
              icon-size="13px"
            />
          </div>
        </template>
      </div>
      <CButton
        @click="confirmSelectedCity()"
        :disabled="!currentCity"
        label="Далее"
        :height="$q.screen.lt.md ? '40px' : '48px'"
        width="100%"
        class="body mt-10"
      />
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import { CityType } from 'src/models/companyGroup/companyGroup'
import CButton from '../buttons/CButton.vue'
import RoundedSelector from '../buttons/RoundedSelector.vue'
import CDialog from './CDialog.vue'
import { ref, watch } from 'vue'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { AppManager } from 'src/models/utils/appManager'
import { useRoute } from 'vue-router'
import { store } from 'src/models/store'
import { RouterResolver } from 'src/models/utils/routerResolver'
import { LocalStorage } from 'quasar'

const props = defineProps<{
  modelValue: boolean
}>()

const route = useRoute()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const currentCity = ref<CityType | null>(null)

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      if (companyGroupRepo.item)
        currentCity.value = companyGroupRepo.item?.cityData.current
    }
  },
)

const routerResolver = new RouterResolver()

const confirmSelectedCity = async () => {
  if (!currentCity.value) return
  LocalStorage.set('city', currentCity.value.uuid)
  LocalStorage.set(
    'cityAlias',
    currentCity.value.alias || currentCity.value.uuid,
  )
  emit('update:modelValue', false)
  await reRequest()
  void routerResolver.detect().resolve()

}

const reRequest = async () => {
  const manager = new AppManager({
    companyGroupId: route.query.group ? String(route.query.group) : undefined,
    initMenuPage: true,
  })
  await companyGroupRepo.current()
  manager.setDefaultCompany()
  await manager.loadMenuPage()
  if (store.leftDrawer) store.leftDrawer = false
}
</script>
