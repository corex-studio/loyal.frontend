<template>
  <div
    class="cursor-pointer border-radius row items-center"
    @click="clickHandler(item)"
    :style="[
      isHomePage
        ? item.id === $menuGroup.elementsInViewport[0]
          ? 'transition: background-color 0.4s ease-out'
          : 'transition: background-color 0.3s ease-out'
        : '',
    ]"
    style="max-width: 160px; height: 45px"
    :class="[
      additional ? 'px-3' : 'px-6 ',
      item.id === $menuGroup.elementsInViewport[0] && isHomePage && !additional
        ? 'bg-secondary-button-color text-on-secondary-button-color'
        : isSticky
        ? 'text-on-background-color'
        : 'text-on-secondary-button-color',
    ]"
  >
    <div class="ellipsis" :class="{ 'text-on-background-color': additional }">
      {{ item.name }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { MenuGroup } from 'src/models/menu/menuGroups/menuGroup'
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useIntersectionObserver } from '@vueuse/core'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
import { store } from 'src/models/store'

const groupElement = ref()

const route = useRoute()

const router = useRouter()

let timeout: NodeJS.Timeout | null = null

const props = defineProps<{
  item: MenuGroup
  additional?: boolean
  isSticky?: boolean
}>()

watch(
  () => route.name,
  (v) => {
    if (v === 'home' || v === 'qrHome') {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        startScrollMonitoring()
      }, 500)
    }
  }
)

const clickHandler = (v: MenuGroup) => {
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
        (el) => el === props.item.id
      )
      if (elementIndex > -1)
        menuGroupRepo.elementsInViewport = [
          menuGroupRepo.elementsInViewport[elementIndex],
          ...menuGroupRepo.elementsInViewport.filter(
            (_, index) => index !== elementIndex
          ),
        ]
      menuGroupRepo.scrollingToGroup = false
    }, 600)
  }
}

const isHomePage = computed(() => {
  return route.name === 'home' || route.name === 'qrHome'
})

const startScrollMonitoring = () => {
  useIntersectionObserver(
    groupElement,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        if (!menuGroupRepo.elementsInViewport.includes(props.item.id))
          menuGroupRepo.elementsInViewport.push(props.item.id)
      } else {
        const elementIndex = menuGroupRepo.elementsInViewport.findIndex(
          (el) => el === props.item.id
        )
        if (elementIndex > -1)
          menuGroupRepo.elementsInViewport.splice(elementIndex, 1)
      }
    },
    {
      rootMargin: '-100px',
    }
  )
}

onMounted(() => {
  groupElement.value = document.getElementById(props.item.id)

  startScrollMonitoring()

  // visible.value = useElementVisibility(groupElement)

  // const observer = new window.IntersectionObserver(
  //   ([entry]) => {
  //     if (entry.isIntersecting) {
  //       menuGroupRepo.elementInViewport = groupElement.value?.id || null
  //       return
  //     }
  //   },
  //   {
  //     root: null,
  //     threshold: 0.4,
  //     rootMargin: '0px',
  //   }
  // )

  // if (groupElement.value) observer.observe(groupElement.value)
})
</script>
