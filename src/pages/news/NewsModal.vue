<template>
  <CAdaptiveModal
    :initial-mobile-height="'500px'"
    :model-value="modelValue"
    height="600px"
    width="650px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-img
      :src="
        $promotion.item
          ? $promotion.item.image?.image || $store.images.empty
          : $news.item?.image?.image || $store.images.empty
      "
      fit="cover"
      class="no-download"
      :style="`border-radius: ${getBorderRadius}`"
      style="max-height: 400px"
    >
      <template v-slot:error>
        <q-img
          :src="$store.images.empty"
          :style="`border-radius: ${getBorderRadius}`"
          fit="cover"
          height="300px"
        />
      </template>
    </q-img>
    <div
      class="column no-wrap col-grow justify-between gap-6 full-width bg-background-color text-on-background-color pa-lg-15 pa-xs-10 relative-position"
    >
      <div class="column full-width gap-6 pb-15">
        <div class="header3 bold">
          {{ $promotion.item ? $promotion.item.name : $news.item?.title }}
        </div>
        <div v-if="$promotion.item" class="body">
          {{ $promotion.item.description }}
        </div>
        <div v-else v-html="$news.item?.fullDescription"></div>
      </div>
    </div>
  </CAdaptiveModal>
</template>
<script lang="ts" setup>
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { computed, watch } from 'vue'
import { useFictiveUrlStore } from 'stores/fictiveUrlStore'
import { useRoute, useRouter } from 'vue-router'
import CAdaptiveModal from 'components/dialogs/CAdaptiveModal.vue'

const props = defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const fictiveUrlStore = useFictiveUrlStore()
const route = useRoute()
const router = useRouter()

const getBorderRadius = computed(() => {
  return `${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px 0 0`
})

watch(
  () => props.modelValue,
  async () => {
    if (!props.modelValue) {
      if (String(route.name) === 'home__withNews') {
        await router.push({ name: 'home' })
      }
      fictiveUrlStore.setFictiveCategoryUrl()
    }
  },
)
</script>

<style lang="scss" scoped>
.close-button {
  position: sticky;
  margin-bottom: -40px;
  top: 10px;
  width: 40px;
  height: 40px;
  z-index: 10;
  border-radius: 50%;
  background-color: var(--background-color);
  left: 10px;
}
</style>
