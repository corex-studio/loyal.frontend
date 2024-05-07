<template>
  <div class="row full-width bg-background-color" ref="bottomHeader">
    <div class="row no-wrap items-center full-width">
      <div
        :style="
          $cart.item || categories?.length
            ? `height: ${$q.screen.gt.sm ? '48' : '42'}px`
            : ''
        "
        class="row full-width border-radius no-wrap body items-center gap-10 content-row relative-position"
      >
        <div
          class="row gap-sm-14 gap-xs-8 no-wrap items-center no-scrollbar"
          style="overflow-x: scroll"
          ref="scrollArea"
          v-dragscroll
          @dragscrollstart="onDragStart"
          @dragscrollend="onDragEnd"
        >
          <div
            v-if="categories && (!$salesPoint.menuLoading || $menu.item)"
            class="gap-lg-7 gap-xs-6 gap-md-8 no-wrap items-center no-scrollbar row"
            style="transition: 0.25s all ease"
          >
            <div
              v-for="(el, index) in categories"
              :key="index"
              ref="groupButtons"
            >
              <GroupButton :key="key" :item="el" />
            </div>
          </div>
          <template v-if="$salesPoint.menuLoading && !$menu.item">
            <q-skeleton
              v-for="(el, index) in [1, 2, 3, 4, 5, 6, 7]"
              :key="index"
              class="mt-5"
              style="margin-bottom: 13px; width: 180px"
            >
            </q-skeleton>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import GroupButton from './GroupButton.vue'
import { useRoute } from 'vue-router'
import { menuRepo } from 'src/models/menu/menuRepo'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
import { dragscroll } from 'vue-dragscroll'
import { store } from 'src/models/store'

const vDragscroll = dragscroll

const bottomHeader = ref<Element | null>(null)
const key = ref(0)
const route = useRoute()
const groupButtons = ref<HTMLDivElement[]>([])
const initWatcher = ref(false)
const scrollArea = ref<HTMLDivElement>()

const categories = computed(() => {
  return menuRepo.item?.groups?.filter((v) => v.items.length)
})

watch(
  () => menuGroupRepo.elementsInViewport[0],
  (v) => {
    if (!initWatcher.value) {
      initWatcher.value = true
      return
    }
    const foundElementIndex = categories.value?.findIndex((el) => el.id === v)
    if (
      foundElementIndex !== undefined &&
      foundElementIndex > -1 &&
      scrollArea.value
    ) {
      scrollArea.value.scrollTo({
        left: groupButtons.value[foundElementIndex].offsetLeft,
        behavior: 'smooth',
      })
      // scrollArea.value.scrollLeft =
      //   groupButtons.value[foundElementIndex].offsetLeft
    }
  },
)

watch(
  () => route.name,
  (v) => {
    if (v === 'home' || v === 'qrHome') {
      key.value++
    }
  },
)
let dragTimeout: NodeJS.Timeout | null = null

const onDragStart = () => {
  if (dragTimeout) clearTimeout(dragTimeout)
  store.groupDragged = false
  dragTimeout = setTimeout(() => {
    store.groupDragged = true
  }, 100)
}

const onDragEnd = () => {
  if (dragTimeout) clearTimeout(dragTimeout)
  setTimeout(() => (store.groupDragged = false))
}
</script>
