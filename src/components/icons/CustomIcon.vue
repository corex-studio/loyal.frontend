<template>
  <div v-html="svg" class="icon" ref="parent"></div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  svg: string
  height?: string
  width?: string
  color?: string
}>()

const parent = ref<HTMLDivElement>()

const height = ref<string>('30px')
const width = ref<string>('30px')
const color = ref<string>('#000000')

watch(
  () => props.color,
  (v) => {
    if (v) {
      color.value = v
      parent.value?.style.setProperty('--color', color.value)
    }
  },
)

onMounted(() => {
  props.height ? (height.value = props.height) : void 0
  props.width ? (width.value = props.width) : void 0
  props.color ? (color.value = props.color) : void 0

  parent.value?.style.setProperty('--height', height.value)
  parent.value?.style.setProperty('--width', width.value)
  parent.value?.style.setProperty('--color', color.value)
  parent.value?.style.setProperty('height', height.value)
  // parent.value?.style.setProperty('width', width.value)
})
</script>

<style lang="scss" scoped>
.icon :deep(svg) * {
  fill: var(--color);
}

.icon :deep(svg) {
  height: var(--height);
  width: var(--width);
}
</style>
