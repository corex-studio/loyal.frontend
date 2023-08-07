<template>
  <CHover v-slot="{ hover }">
    <q-icon
      style="transition: all 0.2s linear"
      :color="hover && hoverColor ? hoverColor : color"
      ref="icon"
      :name="name"
      :style="`font-size: ${_size}; ${styles}`"
    >
      <slot></slot>
    </q-icon>
  </CHover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CHover from './CHover.vue'
const props = defineProps({
  size: {
    type: [String, Number],
    default: '17px',
  },
  color: {
    type: String,
    default: 'black',
  },
  hoverColor: String,
  name: String,
  styles: String,
})

const _size = computed(() => {
  if (Number.isNaN(Number(props.size))) return props.size
  return `${props.size}px`
})
</script>
