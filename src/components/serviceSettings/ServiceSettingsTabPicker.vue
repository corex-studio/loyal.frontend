<template>
  <div class="row gap-10">
    <div
      style="height: fit-content; overflow: hidden"
      class="body bg-selector-color border-radius row full-width no-wrap pa-1"
    >
      <div
        v-for="tab in tabs"
        :key="tab.type"
        @click="selectTabHandler(tab)"
        :style="
          selectedTab === tab.type
            ? 'transition: background-color 0.4s ease-out'
            : 'transition: background-color 0.3s ease-out'
        "
        :class="[
          selectedTab === tab.type
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
import { CartType } from 'src/models/carts/cart'

type TabRaw = {
  label: string | null
  type: CartType
  icon: string | null
  color: string | null
  class: string | null
}

const props = withDefaults(
  defineProps<{
    tabs: TabRaw[]
    modelValue?: CartType
    routerMethod?: 'replace' | 'push'
  }>(),
  {
    routerMethod: 'replace',
  }
)

const emit = defineEmits<{
  (evt: 'updateTab', value: CartType): void
}>()

const selectedTab = ref<CartType | null>(null)

const selectTabHandler = (v: TabRaw) => {
  selectedTab.value = v.type
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
