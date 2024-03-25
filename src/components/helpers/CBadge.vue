<template>
  <q-badge
    class="rounded-10"
    ref="badgeRef"
    :class="{ 'px-6 py-3': !noPadding }"
    :style="`height: ${height ? height : '25px'}; width: ${
      width ? width : 'min-content'
    };`"
    v-bind="{ ...$props, ...bgColorData }"
    :text-color="_textColor"
  >
    <slot></slot
  ></q-badge>
</template>
<script lang="ts" setup>
import { QBadge, QBadgeProps } from 'quasar'
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps<{
  color?: string
  textColor?: QBadgeProps['textColor']
  floating?: QBadgeProps['floating']
  transparent?: QBadgeProps['transparent']
  multiLine?: QBadgeProps['multiLine']
  label?: QBadgeProps['label']
  align?: QBadgeProps['align']
  outline?: QBadgeProps['outline']
  rounded?: QBadgeProps['rounded']
  height?: string
  width?: string
  noPadding?: boolean
}>()

const badgeRef = ref<QBadge | null>(null)
const badgeBackground = ref<string>()

const _textColor = computed(() => {
  if (props.textColor) return props.textColor
  if (!badgeBackground.value) return 'black'
  else {
    let rgb = badgeBackground.value
    const symbolsToReplace = ['rgb', 'rgba', '(', ')', ' ']
    symbolsToReplace.forEach((v) => (rgb = rgb.replaceAll(v, '')))
    const rgbValues = rgb.split(',')
    const r = Number(rgbValues[0])
    const g = Number(rgbValues[1])
    const b = Number(rgbValues[2])

    const yiq = 0.299 * r + 0.587 * g + 0.114 * b
    console.log(yiq)
    return yiq >= 160 ? 'black' : 'white'
  }
})

const bgColorData = computed(() => {
  const data: Record<string, any> = {}
  if (!props.color) return data
  if (props.color.startsWith('#')) {
    data.style = { background: props.color }
  } else {
    data.color = props.color
  }
  return data
})

watch(
  bgColorData,
  () => {
    void nextTick(() => {
      if (!badgeRef.value) return
      const el = badgeRef.value.$el as HTMLDivElement
      badgeBackground.value = window.getComputedStyle(el).backgroundColor
    })
  },
  { immediate: true },
)
</script>
