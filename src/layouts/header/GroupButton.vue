<template>
  <div
    :class="[
      (isSelected && isHomePage && !additional) || (hover && !$q.platform.has.touch)
        ? 'text-primary'
        : 'text-secondary-text',
    ]"
    :style="[isHomePage ? 'transition: color 0.25s ease-out' : '']"
    class="cursor-pointer border-radius row items-center body"
    @click="clickHandler(item)"
    @mouseleave="hover = false"
    @mouseover="hover = true"
  >
    <div
      :class="{ 'text-on-background-color': additional }"
      class="ellipsis bold"
    >
      {{ item.name }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { MenuGroup } from 'src/models/menu/menuGroups/menuGroup'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from 'src/models/store'
import { Fn, useEventListener } from '@vueuse/core'
import { debounce } from 'quasar'
import { isApple } from 'src/services/isApple'
import { useFictiveUrlStore } from 'stores/fictiveUrlStore'

const router = useRouter()
const hover = ref(false)
const cleanups: Fn[] = []
const fictiveUrlStore = useFictiveUrlStore()

defineProps<{
  item: MenuGroup
  additional?: boolean
  isSelected?: boolean
}>()

onMounted(() => {
  cleanups.push(useEventListener(window.document, 'scrollend', () => {
    setTimeout(() => {
      fictiveUrlStore.visibleMenuGroupIdManualSet = false
    }, 50)

  }))
  if (isApple()) {
    cleanups.push(useEventListener(window.document, 'scroll', debounce(emitScrollEnd, 50)))
  }
})

const emitScrollEnd = () => {
  const e = new Event('scrollend')
  window.document.dispatchEvent(e)
}


const clickHandler = (v: MenuGroup) => {
  if (store.groupDragged) return
  fictiveUrlStore.visibleMenuGroupIdManualSet = true
  fictiveUrlStore.setVisibleMenuGroup(v)
  if (router.isIncludesRouteName(['home', 'qrHome'])) {
    void scrollToGroup(v)
  } else {
    void router.push({ name: store.tableMode ? 'qrHome' : 'home' }).then(() => {
      setTimeout(() => {
        void scrollToGroup(v)
      }, 500)
    })
  }
}

const scrollToGroup = (v: MenuGroup) => {
  fictiveUrlStore.scrollToGroup(v)
}

const isHomePage = computed(() => {
  return router.isIncludesRouteName(['home', 'qrHome'])
})


onBeforeUnmount(() => {
  cleanups.map(v => v())
})
</script>
