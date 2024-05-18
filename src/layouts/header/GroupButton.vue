<template>
  <div
    :data-group-id="item.id"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    class="cursor-pointer border-radius row items-center body"
    @click="clickHandler(item)"
    :style="[isHomePage ? 'transition: color 0.25s ease-out' : '']"
    :class="[
      (isSelected && isHomePage && !additional) || hover
        ? 'text-primary'
        : 'text-secondary-text',
    ]"
  >
    <div
      class="ellipsis bold"
      :class="{ 'text-on-background-color': additional }"
    >
      {{ item.name }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { MenuGroup } from 'src/models/menu/menuGroups/menuGroup'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from 'src/models/store'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
import { Fn, useEventListener } from '@vueuse/core'

const groupElement = ref()
const route = useRoute()
const router = useRouter()
const hover = ref(false)
const cleanups: Fn[] = []

const props = defineProps<{
  item: MenuGroup
  additional?: boolean
  isSelected?: boolean
}>()

onMounted(() => {
  cleanups.push(useEventListener(window, 'scrollend', () => {
    store.visibleMenuGroupIdManualSet = false
  }))
})



const clickHandler = (v: MenuGroup) => {
  if (store.groupDragged) {
    store.groupDragged = false
    return
  }
  store.visibleMenuGroupIdManualSet = true
  store.visibleMenuGroupId = v.id
  if (route.name === 'home' || route.name === 'qrHome') {
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
  groupElement.value = document.getElementById(v.id)
  if (groupElement.value) {
    const y =
      groupElement.value.getBoundingClientRect().top + window.scrollY - 100
    menuGroupRepo.scrollingToGroup = true

    window.scrollTo({ top: y, behavior: 'smooth' })
    setTimeout(() => {
      const elementIndex = menuGroupRepo.elementsInViewport.findIndex(
        (el) => el === props.item.id,
      )
      if (elementIndex > -1)
        menuGroupRepo.elementsInViewport = [
          menuGroupRepo.elementsInViewport[elementIndex],
          ...menuGroupRepo.elementsInViewport.filter(
            (_, index) => index !== elementIndex,
          ),
        ]
      menuGroupRepo.scrollingToGroup = false
    }, 600)
  }
}

const isHomePage = computed(() => {
  return route.name === 'home' || route.name === 'qrHome'
})


onBeforeUnmount(() => {
  cleanups.map(v => v())
})
</script>
