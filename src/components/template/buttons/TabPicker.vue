<template>
  <div class="row">
    <div v-if="externalLabel" class="helper-text bold mb-2">
      {{ externalLabel }}
    </div>
    <div
      :style="`max-width: ${width}; height: ${height}`"
      class="body bg-selector-color border-radius2 row full-width no-wrap pa-1"
    >
      <div
        v-for="tab in localTabs"
        :key="tab.label"
        @click="selectTabHandler(tab)"
        :style="[
          selectedTab === tab.label
            ? 'transition: background-color 0.4s ease-out'
            : 'transition: background-color 0.3s ease-out',
        ]"
        :class="[
          selectedTab === tab.label
            ? 'bg-selector-active-color text-on-selector-active-color box-shadow'
            : 'text-on-selector-color',
        ]"
        class="cursor-pointer border-radius2 col row no-wrap gap-4 items-center justify-center rounded-10 body relative-position bold"
      >
        <CIcon
          v-if="tab.icon"
          :color="
            selectedTab === tab.label
              ? 'on-selector-active-color'
              : 'on-selector-color'
          "
          :name="tab.icon"
          :size="tab.iconSize || '18px'"
        />
        {{ tab.label }}
        <slot name="append"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrayElement } from 'src/services/types'
import CIcon from '../helpers/CIcon.vue'

const router = useRouter()

const props = withDefaults(
  defineProps<{
    tabs:
      | string[]
      | {
          label: string
          to?: { name: string; [x: string]: any }
          [x: string]: any
          icon?: string
          iconSize?: string
        }[]
    modelValue?: string
    routerMethod?: 'replace' | 'push'
    width?: string
    externalLabel?: string | null
    height?: string
  }>(),
  {
    routerMethod: 'replace',
    width: '300px',
    height: '40px',
  },
)

const localTabs = computed(() => {
  return props.tabs.map((el) =>
    typeof el === 'string' ? { label: el, to: undefined } : el,
  )
})

const emit = defineEmits<{
  (evt: 'updateTab', value: string): void
}>()

const selectedTab = ref<string | null>(null)

const selectTabHandler = (v: ArrayElement<typeof localTabs.value>) => {
  selectedTab.value = v.label
  emit('updateTab', selectedTab.value)
  if (v.to) router[props.routerMethod](v.to)
}

onMounted(() => {
  if (props.modelValue) {
    selectedTab.value = props.modelValue
  } else {
    // todo проверить, что правильно
    const found = localTabs.value.find((el) => el.to && router.isIncludesRouteName([el.to.name]))
    if (found) selectedTab.value = found.label
    else
      selectedTab.value = localTabs.value.length
        ? localTabs.value[0].label
        : null
  }
})

watch(
  () => props.modelValue,
  (v) => {
    if (v) selectedTab.value = v
  },
)
</script>

<stype lang="scss" scoped></stype>
