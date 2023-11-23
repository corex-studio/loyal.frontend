<template>
  <div class="row gap-10">
    <div
      :style="`max-width: ${width}`"
      style="height: fit-content"
      class="body box-shadow bg-selector-color border-radius row full-width no-wrap pa-2"
    >
      <div
        v-for="(size, index) in sizes"
        :key="index"
        @click="selectTabHandler(size)"
        :style="
          modelValue?.id === size.id
            ? 'transition: background-color 0.4s ease-out'
            : 'transition: background-color 0.3s ease-out'
        "
        :class="[
          modelValue?.id === size.id
            ? 'bg-selector-active-color text-on-selector-active-color'
            : 'text-on-selector-color',
          'py-7',
        ]"
        class="cursor-pointer border-radius col row justify-center rounded-10 secondary-text relative-position"
      >
        {{ size.name }}
        <slot name="append"></slot>
      </div>
    </div>
    <!-- <CButton
      v-for="tab in localTabs"
      :key="tab.label"
      :label="tab.label"
      :color="tab.label === selectedTab ? 'primary' : 'gray-light'"
      :text-color="tab.label === selectedTab ? 'white' : 'black'"
      @click="selectTabHandler(tab)"
    /> -->
  </div>
</template>
<script lang="ts" setup>
import { ItemSize } from 'src/models/menu/menu'

defineProps<{
  sizes: ItemSize[]
  modelValue?: ItemSize
  width?: string
}>()

const emit = defineEmits<{
  (evt: 'updateTab', value: ItemSize): void
}>()

const selectTabHandler = (v: ItemSize) => {
  emit('updateTab', v)
}

// onMounted(() => {
//   if (props.modelValue) {
//     selectedTab.value = props.modelValue
//   } else {
//     const found = localTabs.value.find((el) => el.to?.name === route.name)
//     if (found) selectedTab.value = found.label
//     else
//       selectedTab.value = localTabs.value.length
//         ? localTabs.value[0].label
//         : null
//   }
// })

// watch(
//   () => props.modelValue,
//   (v) => {
//     if (v) selectedTab.value = v
//   }
// )
</script>

<stype lang="scss" scoped></stype>
