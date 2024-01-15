<template>
  <div class="row gap-10 full-width">
    <div
      style="height: fit-content; overflow: hidden"
      class="body bg-selector-color border-radius row full-width no-wrap pa-1"
    >
      <div
        v-for="tab in tabs"
        :key="tab.type"
        @click="selectTabHandler(tab)"
        :style="
          selectedTab?.type === tab.type
            ? 'transition: background-color 0.4s ease-out'
            : 'transition: background-color 0.3s ease-out'
        "
        :class="[
          selectedTab?.type === tab.type
            ? 'bg-selector-active-color text-on-selector-active-color box-shadow'
            : 'text-on-selector-color',
        ]"
        class="cursor-pointer border-radius col row justify-center rounded-10 body relative-position py-4"
      >
        {{ tab.label }}
        <slot name="append"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { TabRaw } from './ServiceSettingsModal.vue'

const props = withDefaults(
  defineProps<{
    tabs: TabRaw[]
    modelValue?: TabRaw
    routerMethod?: 'replace' | 'push'
  }>(),
  {
    routerMethod: 'replace',
  }
)

const emit = defineEmits<{
  (evt: 'updateTab', value: TabRaw): void
}>()

const selectedTab = ref<TabRaw | null>(null)

const selectTabHandler = (v: TabRaw) => {
  selectedTab.value = v
  emit('updateTab', selectedTab.value)
}

onMounted(() => {
  if (props.modelValue) {
    selectedTab.value = props.modelValue
  }
})

watch(
  () => props.modelValue,
  (v) => {
    if (v) selectedTab.value = v
  }
)
</script>

<stype lang="scss" scoped></stype>
